import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

// POST - Assign resource(s) to an incident
export async function POST(req: NextRequest) {
  const { incidentId, resourceIds } = await req.json();

  const { databases } = await createAdminClient();

  // Create assignment records
  const assignments = await Promise.all(
    resourceIds.map(async (resourceId: string) => {
      return databases.createDocument(
        DB_ID,
        ASSIGNMENTS_COLLECTION_ID,
        ID.unique(),
        {
          incidentId,
          resourceId,
          assignedAt: new Date().toISOString(),
          status: "pending",
        }
      );
    })
  );

  // Update incident with assigned resources
  await databases.updateDocument(DB_ID, INCIDENTS_COLLECTION_ID, incidentId, {
    assignedResources: resourceIds,
    status: "reviewed", // Move from pending to reviewed
  });

  // TODO: Send notifications to assigned resources

  return NextResponse.json({ success: true, assignments });
}
