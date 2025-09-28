import { z } from "zod";

export const appwriteSystemFields = {
  $id: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
};

export function withSystemFields<T extends z.ZodRawShape>(shape: T) {
  return z.object({ ...shape, ...appwriteSystemFields });
}
