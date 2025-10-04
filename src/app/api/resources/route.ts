import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { resourcePrefsSchema } from "@/schemas/resources";
import { DB_ID, COLLECTIONS } from "@/config/appwrite";
import { Query } from "node-appwrite";

// GET - Fetch all volunteers, NGOs, and government agencies
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // volunteer, ngo, gov, or all
    const available = searchParams.get("available"); // true/false
    const skills = searchParams.get("skills"); // comma-separated

    const { databases } = await createAdminClient();
    
    // Build queries
    const queries: string[] = [
      Query.limit(100), // Adjust limit as needed
      Query.orderDesc('$createdAt')
    ];

    // Filter by resource type
    if (type && type !== 'all') {
      queries.push(Query.equal('prefs.role', type));
    } else {
      // Default to showing only resource types
      queries.push(Query.or(
        Query.equal('prefs.role', 'volunteer'),
        Query.equal('prefs.role', 'ngo'),
        Query.equal('prefs.role', 'gov')
      ));
    }

    // Filter by availability
    if (available) {
      queries.push(Query.equal('prefs.availability', available === 'true'));
    }

    // Filter by skills if provided
    if (skills) {
      const skillsList = skills.split(',').map(skill => skill.trim());
      skillsList.forEach(skill => {
        queries.push(Query.search('prefs.skills', skill));
      });
    }

    // Execute query
    const { documents: users } = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.RESOURCES,
      queries
    );

    // Transform and validate the response
    const resources = users.map(user => ({
      id: user.$id,
      ...user,
      prefs: resourcePrefsSchema.parse(user.prefs || {})
    }));

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// PATCH - Update resource availability
export async function PATCH(req: NextRequest) {
  try {
    const { userId, available } = await req.json();

    if (typeof available !== 'boolean') {
      return NextResponse.json(
        { error: 'Availability must be a boolean' },
        { status: 400 }
      );
    }

    const { users } = await createAdminClient();
    
    // Get current prefs to preserve other fields
    const user = await users.get(userId);
    const currentPrefs = resourcePrefsSchema.parse(user.prefs || {});
    
    // Update only the availability
    await users.updatePrefs(userId, {
      ...currentPrefs,
      availability: available
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating resource availability:', error);
    return NextResponse.json(
      { error: 'Failed to update resource availability' },
      { status: 500 }
    );
  }
}
