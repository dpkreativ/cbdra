import { z } from "zod";
import { withSystemFields } from "@/schemas/common";

export const resourceTypes = z.enum(["volunteer", "ngo", "gov"]);
export type ResourceType = z.infer<typeof resourceTypes>;

export const resourcePrefsSchema = z.object({
  role: z.enum(["volunteer", "ngo", "gov", "community", "admin"]),
  availability: z.boolean().default(true),
  skills: z.array(z.string()).default([]),
  location: z.string().optional(),
  phone: z.string().optional(),
  organization: z.string().optional(),
  assignedIncidents: z.number().default(0),
  resolvedIncidents: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
});

export const assignmentSchema = z.object({
  incidentId: z.string(),
  resourceId: z.string(),
  resourceType: resourceTypes,
  assignedAt: z.string(),
  acceptedAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.enum(["pending", "accepted", "declined", "completed"]),
  notes: z.string().optional(),
});

export const assignmentDocSchema = withSystemFields(assignmentSchema.shape);
export type AssignmentDoc = z.infer<typeof assignmentDocSchema>;
