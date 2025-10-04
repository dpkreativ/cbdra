import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { resourcePrefsSchema } from "@/schemas/resources";
import { DB_ID, COLLECTIONS } from "@/config/appwrite";

// GET - Fetch detailed resource info
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { users, databases } = await createAdminClient();
    
    // Get user details
    const user = await users.get(params.id);
    
    // Fetch their assignment history
    const { documents: assignments } = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.ASSIGNMENTS,
      [
        Query.equal("resourceId", params.id),
        Query.orderDesc("assignedAt"),
        Query.limit(50) // Limit to most recent 50 assignments
      ]
    );

    // Validate and parse user prefs
    const prefs = resourcePrefsSchema.parse(user.prefs || {});

    return NextResponse.json({
      id: user.$id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      ...user,
      prefs,
      assignments
    });
  } catch (error) {
    console.error(`Error fetching resource ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch resource details' },
      { status: 404 }
    );
  }
}

// PATCH - Update resource details
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await req.json();
    const { users } = await createAdminClient();
    
    // Get current user to validate and merge updates
    const user = await users.get(params.id);
    const currentPrefs = resourcePrefsSchema.parse(user.prefs || {});
    
    // Validate updates against schema (only allow updating specific fields)
    const updatedPrefs = resourcePrefsSchema.partial().parse(updates);
    
    // Merge updates with existing prefs
    const mergedPrefs = { ...currentPrefs, ...updatedPrefs };
    
    // Update user prefs with merged data
    await users.updatePrefs(params.id, mergedPrefs);
    
    // If name or phone is being updated, update those fields as well
    const userUpdates: Record<string, any> = {};
    if (updates.name) userUpdates.name = updates.name;
    if (updates.phone) userUpdates.phone = updates.phone;
    
    if (Object.keys(userUpdates).length > 0) {
      await users.update(params.id, userUpdates);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Resource updated successfully' 
    });
  } catch (error) {
    console.error(`Error updating resource ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 400 }
    );
  }
}
