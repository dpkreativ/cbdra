// src/schemas/incidents.ts
import { z } from "zod";
import { withSystemFields } from "@/schemas/common";

/**
 * Available incident categories and their specific types.
 */
export const INCIDENT_TYPES: Record<string, string[]> = {
  water: ["Flood", "Tsunami", "Storm Surge"],
  fire: ["Wildfire", "Building Fire", "Electrical Fire"],
  geological: ["Earthquake", "Landslide", "Volcanic Eruption"],
  biological: ["Disease Outbreak", "Food Poisoning", "Pandemic"],
  crime: ["Theft", "Assault", "Kidnapping"],
  "man-made": ["Traffic Accident", "Building Collapse", "Explosion"],
  industrial: ["Factory Accident", "Chemical Spill", "Gas Leak"],
  other: ["Other"],
};

/** Category enum (keys of INCIDENT_TYPES) */
export const incidentCategories = z.enum([
  "water",
  "fire",
  "geological",
  "biological",
  "crime",
  "man-made",
  "industrial",
  "other",
]);
export type IncidentCategory = z.infer<typeof incidentCategories>;

/** Urgency and status enums */
export const incidentUrgency = z.enum(["low", "medium", "high"]);
export type IncidentUrgency = z.infer<typeof incidentUrgency>;

export const incidentStatus = z.enum(["pending", "reviewed", "resolved"]);
export type IncidentStatus = z.infer<typeof incidentStatus>;

/**
 * Base field schemas
 */
const baseType = z.string().min(1, "Incident type is required");
const baseDescription = z.string().optional();

/**
 * Schema for incident data stored in Appwrite (includes server fields like userId/status).
 * Handles nullable enums from Appwrite by providing defaults.
 */
export const incidentDataSchema = z
  .object({
    category: incidentCategories
      .nullable()
      .default("other")
      .transform((val) => val ?? "other"),
    type: baseType,
    description: baseDescription,
    urgency: incidentUrgency
      .nullable()
      .default("medium")
      .transform((val) => val ?? "medium"),
    lat: z.number(),
    lng: z.number(),
    userId: z.string(),
    status: incidentStatus
      .nullable()
      .default("pending")
      .transform((val) => val ?? "pending"),
    mediaIds: z.array(z.string()).optional(),
    notes: z
      .string()
      .max(500)
      .optional()
      .transform((val) => val ?? ""),
  })
  .superRefine((obj, ctx) => {
    const { category, type } = obj as {
      category?: IncidentCategory;
      type?: string;
    };

    if (!category || !type) return;

    if (category === "other") {
      if (type.toLowerCase() !== "other") {
        ctx.addIssue({
          path: ["type"],
          code: z.ZodIssueCode.custom,
          message:
            'When category is "other", the incident type must be "other".',
        });
      }
      return;
    }

    const allowed = INCIDENT_TYPES[category] ?? [];
    if (!allowed.includes(type)) {
      ctx.addIssue({
        path: ["type"],
        code: z.ZodIssueCode.custom,
        message: "Invalid incident type for selected category.",
      });
    }
  });

/**
 * Schema for creating new incidents from the client
 */
export const incidentCreateSchema = z
  .object({
    category: incidentCategories,
    type: baseType,
    description: baseDescription,
    urgency: incidentUrgency,
    lat: z.number(),
    lng: z.number(),
    media: z
      .array(z.instanceof(File))
      .max(5, "You can upload up to 5 files")
      .optional(),
    notes: z
      .string()
      .max(500)
      .optional()
      .transform((val) => val ?? ""),
  })
  .superRefine((obj, ctx) => {
    const { category, type } = obj as {
      category?: IncidentCategory;
      type?: string;
    };

    if (!category || !type) return;

    if (category === "other") {
      if (type.toLowerCase() !== "other") {
        ctx.addIssue({
          path: ["type"],
          code: z.ZodIssueCode.custom,
          message:
            'When category is "other", the incident type must be "other".',
        });
      }
      return;
    }

    const allowed = INCIDENT_TYPES[category] ?? [];
    if (!allowed.includes(type)) {
      ctx.addIssue({
        path: ["type"],
        code: z.ZodIssueCode.custom,
        message: "Invalid incident type for selected category.",
      });
    }
  });

export type IncidentData = z.infer<typeof incidentDataSchema>;
export type IncidentCreateData = z.infer<typeof incidentCreateSchema>;

/**
 * Document schemas (with system fields)
 */
export const incidentDocSchema = withSystemFields(incidentDataSchema.shape);
export type IncidentDoc = z.infer<typeof incidentDocSchema>;

export const incidentDocsSchema = z.array(incidentDocSchema);
export type IncidentDocs = z.infer<typeof incidentDocsSchema>;
