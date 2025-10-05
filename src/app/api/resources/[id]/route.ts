import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { resourcePrefsSchema } from "@/schemas/resources";
import { DB_ID, COLLECTIONS } from "@/config/appwrite";

// --------------------
// GET - Fetch detailed resource info
// --------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { users, databases } = await createAdminClient();

    const [user, assignmentsResponse] = await Promise.all([
      users.get(id),
      databases.listDocuments(DB_ID, COLLECTIONS.ASSIGNMENTS, [
        Query.equal("resourceId", id),
        Query.orderDesc("assignedAt"),
        Query.limit(50),
      ]),
    ]);

    const prefs = resourcePrefsSchema.parse(user.prefs || {});

    return NextResponse.json({
      id: user.$id,
      ...user,
      prefs,
      assignments: assignmentsResponse.documents,
    });
  } catch (error) {
    console.error(`Error fetching resource:`, error);
    const status =
      error instanceof Error && error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch resource details",
      },
      { status }
    );
  }
}

// --------------------
// PATCH - Update resource details
// --------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const { users } = await createAdminClient();

    // Fetch current user
    const user = await users.get(id);

    // Validate and merge preferences
    const currentPrefs = resourcePrefsSchema.parse(user.prefs || {});
    const updatedPrefs = resourcePrefsSchema.partial().parse(updates);
    const mergedPrefs = { ...currentPrefs, ...updatedPrefs };

    // Update preferences
    await users.updatePrefs(id, mergedPrefs);

    // Conditionally update user name or phone
    if (updates.name && updates.name !== user.name) {
      await users.updateName(id, updates.name);
    }

    if (updates.phone && updates.phone !== user.phone) {
      await users.updatePhone(id, updates.phone);
    }

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: {
        id,
        name: updates.name ?? user.name,
        phone: updates.phone ?? user.phone,
        prefs: mergedPrefs,
      },
    });
  } catch (error) {
    console.error("Error updating resource:", error);
    const status =
      error instanceof Error && error.message.includes("not found") ? 404 : 400;
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update resource",
      },
      { status }
    );
  }
}
