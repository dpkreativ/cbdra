import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";
import { createAdminClient, withSession } from "@/lib/appwrite";
import { requiredEnv } from "@/lib/utils";
import {
  incidentCreateSchema,
  incidentDocsSchema,
  IncidentDoc,
} from "@/schemas/incidents";

export async function GET() {
  try {
    const { databases } = await createAdminClient();
    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );

    const { documents } = await databases.listDocuments(
      DB_ID,
      INCIDENTS_COLLECTION_ID
    );

    // 🔧 Normalize raw docs before schema validation
    const normalized = documents.map((doc: any) => ({
      ...doc,
      category: [
        "water",
        "fire",
        "geological",
        "biological",
        "crime",
        "man-made",
        "industrial",
        "other",
      ].includes(doc.category)
        ? doc.category
        : "other",
      status: ["pending", "reviewed", "resolved"].includes(doc.status)
        ? doc.status
        : "pending",
      notes: doc.notes ?? "", // replace null with empty string
    }));

    const safe = incidentDocsSchema.parse(normalized);
    return NextResponse.json(safe, { status: 200 });
  } catch (e) {
    console.error("GET /api/incidents error:", e);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 Ensure user is logged in
    const sessionClient = await withSession();
    if (!sessionClient) {
      return NextResponse.json(
        { error: "Unauthorized: no session found" },
        { status: 401 }
      );
    }

    const user = await sessionClient.account.get();

    // Parse form data
    const formData = await req.formData();
    const values = {
      category: formData.get("category"),
      type: formData.get("type"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      urgency: formData.get("urgency") || "medium",
      lat: Number(formData.get("lat") || 0),
      lng: Number(formData.get("lng") || 0),
      media: formData.getAll("media") as File[],
    };

    // ✅ Validate input
    const parsed = incidentCreateSchema.parse(values);

    const { storage, databases } = await createAdminClient();
    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );
    const STORAGE_BUCKET_ID = requiredEnv("APPWRITE_INCIDENTS_BUCKET_ID");

    // Upload files if any
    let mediaIds: string[] = [];
    if (parsed.media && parsed.media.length > 0) {
      const uploads = await Promise.all(
        parsed.media.map(async (file) => {
          const upload = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
          );
          return upload.$id;
        })
      );
      mediaIds = uploads;
    }

    // ✅ Create incident document
    const incident: Omit<IncidentDoc, "$id" | "$createdAt" | "$updatedAt"> = {
      category: parsed.category,
      type: parsed.type,
      description: parsed.description,
      urgency: parsed.urgency,
      lat: parsed.lat,
      lng: parsed.lng,
      notes: parsed.notes,
      userId: user.$id,
      status: "pending",
      mediaIds,
    };

    const doc = await databases.createDocument(
      DB_ID,
      INCIDENTS_COLLECTION_ID,
      ID.unique(),
      incident,
      [
        Permission.read(Role.any()), // public read
        Permission.update(Role.user(user.$id)), // user can update
        Permission.delete(Role.user(user.$id)), // user can delete
        Permission.update(Role.team("admins")), // admins manage
        Permission.delete(Role.team("admins")),
      ]
    );

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("POST /api/incidents error:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
