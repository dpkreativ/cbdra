import { createAdminClient } from "@/lib/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { resourceTypes } from "@/schemas/resources";

// GET - Get aggregated stats for resources
export async function GET() {
  try {
    const { users } = await createAdminClient();

    // Get all resources (volunteers, NGOs, gov)
    const { documents: resources } = await users.list([
      Query.limit(1000), // Adjust based on expected volume
      Query.offset(0),
      Query.select(['$id', 'prefs'])
    ]);

    // Initialize stats
    const stats = {
      total: 0,
      byType: {} as Record<string, number>,
      available: 0,
      averageRating: 0,
      topPerformers: [] as Array<{id: string, name: string, rating: number, resolved: number}>,
      skills: new Map<string, number>()
    };

    // Initialize type counts
    resourceTypes.options.forEach(type => {
      stats.byType[type] = 0;
    });

    // Process resources
    let totalRating = 0;
    const performers: Array<{id: string, name: string, rating: number, resolved: number}> = [];

    for (const user of resources) {
      const prefs = user.prefs || {};
      const role = prefs.role;
      
      // Only process resource types
      if (!resourceTypes.safeParse(role).success) continue;

      stats.total++;
      stats.byType[role] = (stats.byType[role] || 0) + 1;
      
      if (prefs.availability) stats.available++;
      
      const rating = Number(prefs.rating) || 0;
      totalRating += rating;

      // Track skills
      if (Array.isArray(prefs.skills)) {
        prefs.skills.forEach(skill => {
          stats.skills.set(skill, (stats.skills.get(skill) || 0) + 1);
        });
      }

      // Track top performers (those with at least 1 resolved incident)
      const resolved = Number(prefs.resolvedIncidents) || 0;
      if (resolved > 0) {
        performers.push({
          id: user.$id,
          name: user.name || 'Unknown',
          rating,
          resolved
        });
      }
    }

    // Calculate averages and sort top performers
    stats.averageRating = stats.total > 0 ? parseFloat((totalRating / stats.total).toFixed(2)) : 0;
    
    // Get top 5 performers by rating (minimum 3 resolved incidents)
    stats.topPerformers = performers
      .filter(p => p.resolved >= 3)
      .sort((a, b) => b.rating - a.rating || b.resolved - a.resolved)
      .slice(0, 5);

    // Convert skills map to sorted array
    const skills = Array.from(stats.skills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 most common skills

    return NextResponse.json({
      ...stats,
      topSkills: skills.map(([name, count]) => ({ name, count }))
    });
  } catch (error) {
    console.error('Error fetching resource stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource statistics' },
      { status: 500 }
    );
  }
}
