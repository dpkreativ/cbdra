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
  media: z.array(z.instanceof(File)).max(5).optional(),
});

export type IncidentData = z.infer<typeof incidentDataSchema>;
export type IncidentCreateData = z.infer<typeof incidentCreateSchema>;

export const incidentDocSchema = withSystemFields(incidentDataSchema.shape);

export const incidentDocsSchema = z.array(incidentDocSchema);
export type IncidentDocs = z.infer<typeof incidentDocsSchema>;

// Server-side validation schema mirrors the client form.
// const incidentSchema = z.object({
//   type: z.string().min(1),
//   description: z.string().min(10),
//   address: z.string().min(3),
//   urgency: z.enum(["low", "medium", "high"]),
//   coords: z
//     .object({
//       lat: z.number(),
//       lng: z.number(),
//     })
//     .or(
//       z
//         .string()
//         .transform((s) => {
//           try {
//             return JSON.parse(s);
//           } catch {
//             return null;
//           }
//         })
//         .pipe(
//           z
//             .object({
//               lat: z.number(),
//               lng: z.number(),
//             })
//             .nullable()
//         )
//     ),
// });

// Validation schema
// const incidentSchema = z.object({
//   type: z
//     .string({ error: "Incident type is required" })
//     .min(1, "Incident type is required"),
//   description: z
//     .string({ error: "Description is required" })
//     .min(10, "Please provide at least 10 characters"),
//   address: z
//     .string({ error: "Address is required" })
//     .min(3, "Please provide a valid address"),
//   urgency: z.enum(["low", "medium", "high"], {
//     error: "Urgency is required",
//   }),
//   lat: z.number({ error: "Latitude is required" }),
//   lng: z.number({ error: "Longitude is required" }),
//   media: z
//     .array(z.instanceof(File))
//     .max(5, "You can upload up to 5 photos")
//     .optional(),
// });
