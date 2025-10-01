import { createAdminClient } from "@/lib/appwrite";
import { requiredEnv } from "@/lib/utils";
import {
  incidentCategories,
  incidentDocsSchema,
  incidentStatus,
} from "@/schemas/incidents";
import { NextResponse } from "next/server";

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

    // Transform the data to match the expected schema
    const transformedData = documents.map((doc) => ({
      ...doc,
      // Ensure category is one of the expected values, default to "other" if invalid
      category: incidentCategories.safeParse(doc.category).success
        ? doc.category
        : "other",
      // Ensure status is one of the expected values, default to "pending" if invalid
      status: incidentStatus.safeParse(doc.status).success
        ? doc.status
        : "pending",
      // Ensure notes is a string, default to empty string if null/undefined
      notes: doc.notes || "",
    }));

    // Validate against schema
    const safe = incidentDocsSchema.parse(transformedData);
    return NextResponse.json(safe);
  } catch (e: unknown) {
    console.error("GET /api/incidents error:", e);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}
