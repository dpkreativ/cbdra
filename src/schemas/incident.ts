import { z } from "zod";
import { withSystemFields } from "@/schemas/common";

// Appwrite data
export const incidentDataSchema = z.object({
  type: z.string(),
  description: z.string(),
  address: z.string(),
  urgency: z.string(),
  lat: z.number(),
  lng: z.number(),
  userId: z.string(),
  status: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

export const incidentCreateSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(10),
  address: z.string().min(3),
  urgency: z.enum(["low", "medium", "high"]),
  lat: z.number(),
  lng: z.number(),
  media: z.array(z.instanceof(File)).max(5),
});

export type IncidentData = z.infer<typeof incidentDataSchema>;
export type IncidentCreateData = z.infer<typeof incidentCreateSchema>;

export const incidentDocSchema = withSystemFields(incidentDataSchema.shape);

export const incidentDocsSchema = z.array(incidentDocSchema);
export type IncidentDocs = z.infer<typeof incidentDocsSchema>;
