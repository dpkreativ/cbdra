import { createAdminClient } from "@/lib/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { resourceTypes, resourcePrefsSchema } from "@/schemas/resources";
import { DB_ID, COLLECTIONS } from "@/config/appwrite";

type ResourceDoc = {
  $id: string;
  name?: string;
  prefs?: unknown;
  // Add other fields you expect here if needed
};

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    // Fetch resource documents from databases (safe, returns { documents })
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.RESOURCES,
      [
        Query.limit(1000), // Adjust to a sensible max for your app
        Query.offset(0),
        Query.select(["$id", "name", "prefs"]),
      ]
    );

    const documents =
      (response && (response as { documents?: ResourceDoc[] }).documents) ?? [];

    // Stats shape
    const stats = {
      total: 0,
      byType: {} as Record<string, number>,
      available: 0,
      averageRating: 0,
      topPerformers: [] as Array<{
        id: string;
        name: string;
        rating: number;
        resolved: number;
      }>,
      skills: new Map<string, number>(),
    };

    // initialize counts
    resourceTypes.options.forEach((t) => {
      stats.byType[t] = 0;
    });

    let totalRating = 0;
    const performers: Array<{
      id: string;
      name: string;
      rating: number;
      resolved: number;
    }> = [];

    for (const doc of documents) {
      const prefsParsed = (() => {
        try {
          return resourcePrefsSchema.parse(doc.prefs ?? {});
        } catch {
          // if validation fails, fallback to an empty safe shape
          return {
            role: undefined,
            availability: false,
            rating: 0,
            resolvedIncidents: 0,
            skills: [] as string[],
          } as const;
        }
      })();

      const role = prefsParsed.role as unknown as string | undefined;

      // only count valid resource types
      if (!role || !resourceTypes.safeParse(role).success) continue;

      stats.total++;
      stats.byType[role] = (stats.byType[role] || 0) + 1;

      if (prefsParsed.availability) stats.available++;

      const rating = Number(prefsParsed.rating) || 0;
      totalRating += rating;

      if (Array.isArray(prefsParsed.skills)) {
        for (const skill of prefsParsed.skills) {
          stats.skills.set(skill, (stats.skills.get(skill) || 0) + 1);
        }
      }

      const resolved = Number(prefsParsed.resolvedIncidents) || 0;
      if (resolved > 0) {
        performers.push({
          id: doc.$id,
          name: doc.name ?? "Unknown",
          rating,
          resolved,
        });
      }
    }

    stats.averageRating =
      stats.total > 0 ? parseFloat((totalRating / stats.total).toFixed(2)) : 0;

    // Top performers: min resolved threshold (adjust as needed)
    stats.topPerformers = performers
      .filter((p) => p.resolved >= 3)
      .sort((a, b) => b.rating - a.rating || b.resolved - a.resolved)
      .slice(0, 5);

    const topSkills = Array.from(stats.skills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      total: stats.total,
      byType: stats.byType,
      available: stats.available,
      averageRating: stats.averageRating,
      topPerformers: stats.topPerformers,
      topSkills,
    });
  } catch (error) {
    console.error("Error fetching resource stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource statistics" },
      { status: 500 }
    );
  }
}
