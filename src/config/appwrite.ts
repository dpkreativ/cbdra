// Appwrite Database and Collection IDs
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'cbdra_db';

export const COLLECTIONS = {
  ASSIGNMENTS: 'assignments',
  INCIDENTS: 'incidents',
  RESOURCES: 'users', // Using users collection for resources
} as const;

export const BUCKETS = {
  RESOURCES: 'resources',
  INCIDENTS: 'incidents',
} as const;
