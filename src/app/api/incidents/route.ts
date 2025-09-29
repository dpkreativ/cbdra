import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { requiredEnv } from "@/lib/utils";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { cookies } from "next/headers";
import { incidentCreateSchema, incidentDocsSchema } from "@/schemas/incidents";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Pull out values from formData
    const values = {
      category: String(formData.get("category") || ""),
      type: String(formData.get("type") || ""),
      description: String(formData.get("description") || ""),
      notes: String(formData.get("notes") || ""),
      urgency: String(formData.get("urgency") || "medium"),
      lat: Number(formData.get("lat") || 0),
      lng: Number(formData.get("lng") || 0),
    };

    // Validate against schema
    const parsed = incidentCreateSchema.safeParse(values);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // Extract up to 5 media files
    const files = formData.getAll("media").filter(Boolean) as File[];
    const limitedFiles = files.slice(0, 5);

    // Server-side size check (max 10MB/file)
    if (limitedFiles.find((f) => f.size > 10 * 1024 * 1024)) {
      return NextResponse.json(
        { error: "File too large. Max 10MB per file." },
        { status: 400 }
      );
    }

    const { databases, storage } = await createAdminClient();
    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );
    const MEDIA_BUCKET_ID = requiredEnv("APPWRITE_MEDIA_BUCKET_ID");

    // Check user session
    const session = (await cookies()).get("session")?.value;
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    const { account } = await createSessionClient(session);
    let user;
    try {
      user = await account.get();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }
    const userId = user.$id;

    // Create incident doc
    const incidentId = ID.unique();
    await databases.createDocument(
      DB_ID,
      INCIDENTS_COLLECTION_ID,
      incidentId,
      {
        category: parsed.data.category,
        type: parsed.data.type,
        description: parsed.data.description,
        notes: parsed.data.notes || "",
        urgency: parsed.data.urgency,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        userId,
        status: "pending",
        mediaIds: [],
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.read(Role.team("admins")),
        Permission.update(Role.team("admins")),
        Permission.delete(Role.team("admins")),
      ]
    );

    // Upload media if provided
    if (limitedFiles.length) {
      const uploadedIds: string[] = [];
      for (const f of limitedFiles) {
        const buffer = Buffer.from(await f.arrayBuffer());
        const inputFile = InputFile.fromBuffer(buffer, f.name);
        const upload = await storage.createFile(
          MEDIA_BUCKET_ID,
          ID.unique(),
          inputFile,
          [
            Permission.read(Role.user(userId)),
            Permission.read(Role.team("admins")),
            Permission.update(Role.team("admins")),
            Permission.delete(Role.team("admins")),
          ]
        );
        uploadedIds.push(upload.$id);
      }

      // Update document with media IDs
      await databases.updateDocument(
        DB_ID,
        INCIDENTS_COLLECTION_ID,
        incidentId,
        { mediaIds: uploadedIds }
      );
    }

    return NextResponse.json({ id: incidentId });
  } catch (e: unknown) {
    console.error("POST /api/incidents error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { databases } = await createAdminClient();
    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );

    const docs = await databases.listDocuments(DB_ID, INCIDENTS_COLLECTION_ID);
    const safe = incidentDocsSchema.parse(docs.documents);
    return NextResponse.json(safe);
  } catch (e: unknown) {
    console.error("GET /api/incidents error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
