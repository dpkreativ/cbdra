import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Simple in-browser image compression via canvas (strips EXIF)
export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.8
): Promise<Blob> {
  const img = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(e);
      img.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxWidth / img.width);
    canvas.width = Math.floor(img.width * scale);
    canvas.height = Math.floor(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(
        (b) => resolve(b),
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality
      )
    );
    if (!blob) throw new Error("Failed to compress image");
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Media selection and compression
export async function handleMediaChange(
  e: React.ChangeEvent<HTMLInputElement>
): Promise<File[]> {
  const files = e.target.files ? Array.from(e.target.files) : [];
  const limited = files.slice(0, 5);
  // Guard size 10MB before compression
  const oversized = limited.find((f) => f.size > 10 * 1024 * 1024);
  if (oversized) {
    alert("Please select images smaller than 10MB.");
    return [];
  }
  const compressed: File[] = [];
  for (const f of limited) {
    const blob = await compressImage(f);
    compressed.push(
      new File([blob], f.name.replace(/\.(heic|heif)$/i, ".jpg"), {
        type: blob.type || "image/jpeg",
      })
    );
  }
  return compressed;
}

export function buildIncidentFormData(values: Record<string, unknown>) {
  const fd = new FormData();
  for (const [key, val] of Object.entries(values)) {
    if (key === "media" && Array.isArray(val)) {
      val.forEach((file) => fd.append("media", file));
    } else {
      fd.append(key, String(val));
    }
  }
  return fd;
}
