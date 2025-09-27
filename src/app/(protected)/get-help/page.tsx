"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Validation schema
const incidentSchema = z.object({
  type: z
    .string({ error: "Incident type is required" })
    .min(1, "Incident type is required"),
  description: z
    .string({ error: "Description is required" })
    .min(10, "Please provide at least 10 characters"),
  address: z
    .string({ error: "Address is required" })
    .min(3, "Please provide a valid address"),
  urgency: z.enum(["low", "medium", "high"], {
    error: "Urgency is required",
  }),
  lat: z.number({ error: "Latitude is required" }),
  lng: z.number({ error: "Longitude is required" }),
  media: z
    .array(z.instanceof(File))
    .max(5, "You can upload up to 5 photos")
    .optional(),
});

// Simple in-browser image compression via canvas (strips EXIF)
async function compressImage(
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

// Local storage draft key
const DRAFT_KEY = "incident:draft";

export default function GetHelpPage() {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [successRefId, setSuccessRefId] = useState<string | null>(null);

  // Leaflet refs
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Accessible ids
  const idType = useMemo(() => "incident-type", []);
  const idDesc = useMemo(() => "incident-description", []);
  const idAddr = useMemo(() => "incident-address", []);
  const idUrg = useMemo(() => "incident-urgency", []);

  const form = useForm<z.infer<typeof incidentSchema>>({
    resolver: zodResolver(incidentSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      type: "",
      description: "",
      address: "",
      urgency: "medium",
      lat: 0,
      lng: 0,
      media: [],
    },
  });

  // Load draft from localStorage (exclude files)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        form.reset({ ...form.getValues(), ...draft });
      }
    } catch {
      // no-op
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft to localStorage (exclude files)
  useEffect(() => {
    const sub = form.watch((values) => {
      const { type, description, address, urgency, lat, lng } = values;
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ type, description, address, urgency, lat, lng })
        );
      } catch {
        // no-op
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Initialize Leaflet dynamically on client
  useEffect(() => {
    let L: any;
    let mapInst: any;
    async function initMap() {
      try {
        const leaflet = await import("leaflet");
        L = leaflet;
        if (!mapContainerRef.current) return;
        mapInst = L.map(mapContainerRef.current).setView([5.6037, -0.187], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapInst);
        mapRef.current = mapInst;

        // Place existing marker if coords present
        const { lat, lng } = form.getValues();
        if (lat && lng) {
          markerRef.current = L.marker([lat, lng]).addTo(mapInst);
          mapInst.setView([lat, lng], 14);
        }

        mapInst.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          form.setValue("lat", lat, { shouldValidate: true });
          form.setValue("lng", lng, { shouldValidate: true });
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapInst);
          }
        });
      } catch {
        setMapError("Map failed to load. You can still enter an address.");
      }
    }

    initMap();
    return () => {
      try {
        mapRef.current?.remove?.();
      } catch {
        // no-op
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Geolocation button
  async function useCurrentLocation() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        form.setValue("lat", latitude, { shouldValidate: true });
        form.setValue("lng", longitude, { shouldValidate: true });
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 14);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            // Add a basic marker if leaflet is available
            const L = (window as any).L;
            if (L) {
              markerRef.current = L.marker([latitude, longitude]).addTo(
                mapRef.current
              );
            }
          }
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location permission denied. Please enable it in your browser settings."
          );
        } else {
          setGeoError("Unable to fetch your location. Please try again.");
        }
      }
    );
  }

  // Media selection and compression
  async function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const limited = files.slice(0, 5);
    // Guard size 10MB before compression
    const oversized = limited.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      alert("Please select images smaller than 10MB.");
      return;
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
    form.setValue("media", compressed, { shouldValidate: true });
  }

  // Submit with multipart + progress
  async function onSubmit(values: z.infer<typeof incidentSchema>) {
    setIsUploading(true);
    setProgress(0);
    setSuccessRefId(null);
    try {
      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("urgency", values.urgency);
      formData.append(
        "coords",
        JSON.stringify({ lat: values.lat, lng: values.lng })
      );
      (values.media || []).forEach((file) => formData.append("media", file));

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/incidents");
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgress(pct);
          }
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const res = JSON.parse(xhr.responseText);
                setSuccessRefId(res.id || res.reference || "");
              } catch {
                // no-op
              }
              resolve();
            } else {
              reject(new Error(xhr.responseText || "Upload failed"));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      // Clear draft on success
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // no-op
      }

      form.reset({
        type: "",
        description: "",
        address: "",
        urgency: "medium",
        lat: 0,
        lng: 0,
        media: [],
      });
    } catch (e: any) {
      alert(
        e?.message || "Something went wrong while submitting your incident."
      );
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <main className="px-5 py-8 w-full max-w-2xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Report an Incident</h1>

      {successRefId ? (
        <div className="rounded-md border p-4 bg-secondary/30">
          <p className="font-medium">Your report was submitted successfully.</p>
          <p className="text-sm text-muted-foreground">
            Reference ID: <span className="font-mono">{successRefId}</span>
          </p>
          <div className="mt-3">
            <Button onClick={() => setSuccessRefId(null)}>
              Report another
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
            aria-describedby={geoError ? "geo-error" : undefined}
          >
            {/* Incident Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={idType}>Incident type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        id={idType}
                        aria-invalid={!!form.formState.errors.type}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="crime">Crime</SelectItem>
                        <SelectItem value="disaster">Disaster</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={idDesc}>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id={idDesc}
                      rows={5}
                      placeholder="Describe what happened..."
                      aria-invalid={!!form.formState.errors.description}
                      aria-describedby={
                        form.formState.errors.description
                          ? "desc-error"
                          : undefined
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="desc-error" />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={idAddr}>Address</FormLabel>
                  <FormControl>
                    <Input
                      id={idAddr}
                      placeholder="Street, City"
                      aria-invalid={!!form.formState.errors.address}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Map + Current Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Location on map</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useCurrentLocation}
                >
                  Use current location
                </Button>
              </div>
              <div
                ref={mapContainerRef}
                role="application"
                aria-label="Map picker"
                className="h-64 w-full rounded-md border"
              />
              {mapError ? (
                <p className="mt-2 text-sm text-muted-foreground">{mapError}</p>
              ) : null}
              {geoError ? (
                <p id="geo-error" className="mt-2 text-sm text-destructive">
                  {geoError}
                </p>
              ) : null}
            </div>

            {/* Lat/Lng (visible for transparency; could be hidden) */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Urgency */}
            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={idUrg}>Urgency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        id={idUrg}
                        aria-invalid={!!form.formState.errors.urgency}
                      >
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media */}
            <FormField
              control={form.control}
              name="media"
              render={() => (
                <FormItem>
                  <FormLabel>Optional photo(s)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMediaChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload progress */}
            {isUploading ? (
              <div>
                <Progress value={progress} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Uploading… {progress}%
                </p>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!form.formState.isValid || isUploading}
            >
              Submit report
            </Button>
          </form>
        </Form>
      )}
    </main>
  );
}
