"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  incidentCreateSchema,
  INCIDENT_TYPES,
  IncidentCategory,
} from "@/schemas/incidents";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "@/context/location-context";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Type
type IncidentFormValues = z.infer<typeof incidentCreateSchema>;

export default function IncidentForm() {
  const { lat, lng } = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const router = useRouter();

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentCreateSchema),
    defaultValues: {
      category: "other",
      type: "other",
      description: "",
      notes: "",
      urgency: "medium",
      lat,
      lng,
      media: [],
    },
  });

  const { isSubmitting } = form.formState;

  // Sync with context location
  useEffect(() => {
    form.setValue("lat", lat);
    form.setValue("lng", lng);
  }, [lat, lng, form]);

  // Dynamically compute types
  const selectedCategory = form.watch("category") as IncidentCategory;
  const typeOptions = useMemo(() => {
    return INCIDENT_TYPES[selectedCategory] ?? [];
  }, [selectedCategory]);

  // Handle media change
  function handleMediaChange(newFiles: File[]) {
    const existingFiles = form.getValues("media") ?? [];
    const updatedFiles = [...existingFiles, ...newFiles].slice(0, 5);
    form.setValue("media", updatedFiles);
    setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  }

  // Remove media
  function handleRemoveMedia(index: number) {
    const files = form.getValues("media") ?? [];
    const updatedFiles = files.filter((_, i) => i !== index);
    form.setValue("media", updatedFiles);
    setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  }

  async function onSubmit(values: IncidentFormValues) {
    try {
      // ✅ File validation
      if (values.media && Array.isArray(values.media)) {
        if (values.media.length > 5) {
          toast.error("You can upload a maximum of 5 files");
          return;
        }
        for (const file of values.media) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Each file must be under 5MB");
            return;
          }
        }
      }

      values.description = `${location} - ${values.description}`;

      const fd = new FormData();

      (Object.keys(values) as (keyof IncidentFormValues)[]).forEach((key) => {
        const val = values[key];
        if (key === "media" && Array.isArray(val)) {
          val.forEach((file) => fd.append("media", file));
        } else if (val !== undefined && val !== null) {
          fd.append(key, String(val));
        }
      });

      const res = await fetch("/api/incidents", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to submit incident");

      toast.success("✅ Incident submitted successfully!");
      form.reset({
        category: "other",
        type: "other",
        urgency: "medium",
        lat,
        lng,
        media: [],
      });
      setPreviews([]);
      router.push("/user/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "❌ Error submitting incident";
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Row: Location, Category, Type, Urgency */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Location */}
          <FormField
            name="location"
            render={() => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input onChange={(e) => setLocation(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    const newTypes = INCIDENT_TYPES[val as IncidentCategory];
                    form.setValue("type", newTypes?.[0] ?? "other");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(INCIDENT_TYPES).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Urgency */}
          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormDescription>
                Describe the incident in detail—what happened, when, where, and
                who was involved.
              </FormDescription>
              <FormControl>
                <Textarea {...field} />
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
              <FormLabel>Upload Media (max 5 files)</FormLabel>
              <FormControl>
                <div>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      handleMediaChange(files);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // reset input
                      }
                    }}
                  />
                  {/* Trigger button */}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon icon="basil:add-outline" width="24" height="24" /> Add
                    Media
                  </Button>

                  {/* Preview grid */}
                  {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {previews.map((src, idx) => {
                        const file = form.getValues("media")?.[idx];
                        const isVideo =
                          file?.type.startsWith("video/") ?? false;
                        return (
                          <div key={idx} className="relative group">
                            {isVideo ? (
                              <video
                                src={src}
                                controls
                                className="w-full h-32 object-cover rounded"
                              />
                            ) : (
                              <img
                                src={src}
                                alt={`preview-${idx}`}
                                className="w-full h-32 object-cover rounded"
                              />
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(idx)}
                              className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              ❌
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormDescription>
                Add optional extra context or follow-up
                information—observations, requests, or suggestions.
              </FormDescription>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Icon icon="eos-icons:loading" className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Incident"
          )}
        </Button>
      </form>
    </Form>
  );
}
