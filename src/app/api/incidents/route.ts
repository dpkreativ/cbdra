import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { requiredEnv } from "@/lib/utils";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { cookies } from "next/headers";

// Server-side validation schema mirrors the client form.
const incidentSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(10),
  address: z.string().min(3),
  urgency: z.enum(["low", "medium", "high"]),
  coords: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .or(
      z
        .string()
        .transform((s) => {
          try {
            return JSON.parse(s);
          } catch {
            return null;
          }
        })
        .pipe(
          z
            .object({
              lat: z.number(),
              lng: z.number(),
            })
            .nullable()
        )
    ),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const values = {
      type: String(formData.get("type") || ""),
      description: String(formData.get("description") || ""),
      address: String(formData.get("address") || ""),
      urgency: String(formData.get("urgency") || "medium"),
      coords: formData.get("coords"),
    };

    const parsed = incidentSchema.safeParse(values);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const coords =
      typeof parsed.data.coords === "object" && parsed.data.coords
        ? parsed.data.coords
        : { lat: 0, lng: 0 };

    // Extract files (max 5)
    const files = formData.getAll("media").filter(Boolean) as File[];
    const limitedFiles = files.slice(0, 5);

    // Optional: enforce server-side max file size (10MB)
    const tooLarge = limitedFiles.find((f) => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      return NextResponse.json(
        { error: "File too large. Max 10MB per file." },
        { status: 400 }
      );
    }

    const {
      databases,
      storage,
      // account, users, client
    } = await createAdminClient();

    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );
    const MEDIA_BUCKET_ID = requiredEnv("APPWRITE_MEDIA_BUCKET_ID");

    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
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

    // Create the document first, to get a canonical reference ID
    const incidentId = ID.unique();
    const doc = await databases.createDocument(
      DB_ID,
      INCIDENTS_COLLECTION_ID,
      incidentId,
      {
        type: parsed.data.type,
        description: parsed.data.description,
        address: parsed.data.address,
        urgency: parsed.data.urgency,
        lat: coords.lat,
        lng: coords.lng,
        userId,
        status: "open",
        // mediaIds: [] as string[],
      },
      [
        // Permissions: allow the owner to read/update; admins have full access.
        // Adjust per your needs (e.g., Role.any() to allow public read).
        ...(userId
          ? [
              Permission.read(Role.user(userId)),
              Permission.update(Role.user(userId)),
            ]
          : []),
        Permission.read(Role.team("admins")), // Example: admins team
        Permission.update(Role.team("admins")),
        Permission.delete(Role.team("admins")),
      ]
    );

    // Upload each file to Storage and collect IDs
    const uploadedIds: string[] = [];
    for (const f of limitedFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      const inputFile = InputFile.fromBuffer(buffer, f.name);
      const upload = await storage.createFile(
        MEDIA_BUCKET_ID,
        ID.unique(),
        inputFile,
        [
          // Make files readable by owner and admins; tweak as needed
          ...(userId ? [Permission.read(Role.user(userId))] : []),
          Permission.read(Role.team("admins")),
          Permission.update(Role.team("admins")),
          Permission.delete(Role.team("admins")),
        ]
      );
      uploadedIds.push(upload.$id);
    }

    // Update the incident with uploaded file IDs
    if (uploadedIds.length) {
      await databases.updateDocument(
        DB_ID,
        INCIDENTS_COLLECTION_ID,
        incidentId,
        {
          type: parsed.data.type,
          description: parsed.data.description,
          address: parsed.data.address,
          urgency: parsed.data.urgency,
          lat: coords.lat,
          lng: coords.lng,
          userId,
          status: "open",
          mediaIds: uploadedIds,
        },
        [
          ...(userId
            ? [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
              ]
            : []),
          Permission.read(Role.team("admins")),
          Permission.update(Role.team("admins")),
          Permission.delete(Role.team("admins")),
        ]
      );
    }

    console.log("See db document:", doc);
    return NextResponse.json({ id: incidentId });
  } catch (e: unknown) {
    console.error("POST /api/incidents error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/incidents
export async function GET() {
  try {
    const { databases } = await createAdminClient();
    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );
    const docs = await databases.listDocuments(DB_ID, INCIDENTS_COLLECTION_ID);
    return NextResponse.json(docs.documents);
  } catch (e: unknown) {
    console.error("GET /api/incidents error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
