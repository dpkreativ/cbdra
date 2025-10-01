import { createAdminClient, withSession } from "@/lib/appwrite";
import { requiredEnv } from "@/lib/utils";
import {
  incidentCategories,
  incidentDocsSchema,
  incidentStatus,
  incidentCreateSchema,
} from "@/schemas/incidents";
import { NextResponse, NextRequest } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract values
    const values = {
      category: formData.get("category"),
      type: formData.get("type"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      urgency: formData.get("urgency") || "medium",
      lat: Number(formData.get("lat") || 0),
      lng: Number(formData.get("lng") || 0),
      media: formData.getAll("media"), // array of File
    };

    // Validate form payload
    const parsed = incidentCreateSchema.safeParse(values);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // 🔐 Get current user
    const sessionClient = await withSession();
    if (!sessionClient) {
      return NextResponse.json(
        { error: "Unauthorized: No valid session" },
        { status: 401 }
      );
    }
    const user = await sessionClient.account.get();

    const DB_ID = requiredEnv("APPWRITE_DB_ID");
    const INCIDENTS_COLLECTION_ID = requiredEnv(
      "APPWRITE_INCIDENTS_COLLECTION_ID"
    );
    const STORAGE_BUCKET_ID = requiredEnv("APPWRITE_INCIDENTS_BUCKET_ID");

    // ✅ Upload media files and collect file IDs
    const { storage, databases } = sessionClient;
    let mediaIds: string[] = [];
    if (parsed.data.media && parsed.data.media.length > 0) {
      const uploadResults = await Promise.all(
        parsed.data.media.map(async (file) => {
          const upload = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
          );
          return upload.$id;
        })
      );
      mediaIds = uploadResults;
    }

    // ✅ Create document in DB
    const doc = await databases.createDocument(
      DB_ID,
      INCIDENTS_COLLECTION_ID,
      ID.unique(),
      {
        category: parsed.data.category,
        type: parsed.data.type,
        description: parsed.data.description,
        urgency: parsed.data.urgency,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        notes: parsed.data.notes,
        userId: user.$id,
        status: "pending",
        mediaIds, // ✅ store file IDs, not File objects
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
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
