"use client";

import { useMemo, useState } from "react";
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
import { incidentCreateSchema } from "@/schemas/incident";
import { Icon } from "@/components/ui/icon";
import { handleMediaChange } from "@/lib/utils";
import dynamic from "next/dynamic";

export default function GetHelpPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [successRefId, setSuccessRefId] = useState<string | null>(null);

  // Accessible ids
  const idType = useMemo(() => "incident-type", []);
  const idDesc = useMemo(() => "incident-description", []);
  const idAddr = useMemo(() => "incident-address", []);
  const idUrg = useMemo(() => "incident-urgency", []);

  const form = useForm<z.infer<typeof incidentCreateSchema>>({
    resolver: zodResolver(incidentCreateSchema),
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

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/dashboard/map"), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );

  // Submit with multipart + progress
  async function onSubmit(values: z.infer<typeof incidentCreateSchema>) {
    setIsUploading(true);
    setProgress(0);
    setSuccessRefId(null);
    try {
      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("urgency", values.urgency);
      formData.append("lat", values.lat.toString());
      formData.append("lng", values.lng.toString());
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

      form.reset({
        type: "",
        description: "",
        address: "",
        urgency: "medium",
        lat: 0,
        lng: 0,
        media: [],
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Something went wrong while submitting your incident.";
      // alert(message);
      console.error(message);
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
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
                        className="w-full"
                        id={idType}
                        aria-invalid={!!form.formState.errors.type}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="water"
                          className="flex items-center gap-5"
                        >
                          <Icon icon="carbon:flood" width="24" height="24" />
                          <span>Water</span>
                        </SelectItem>
                        <SelectItem
                          value="biological"
                          className="flex items-center gap-5"
                        >
                          <Icon
                            icon="solar:virus-outline"
                            width="24"
                            height="24"
                          />
                          <span>Biological</span>
                        </SelectItem>
                        <SelectItem
                          value="fire"
                          className="flex items-center gap-5"
                        >
                          <Icon icon="carbon:fire" width="24" height="24" />
                          <span>Fire</span>
                        </SelectItem>
                        <SelectItem
                          value="geological"
                          className="flex items-center gap-5"
                        >
                          <Icon
                            icon="carbon:earthquake"
                            width="24"
                            height="24"
                          />
                          <span>Geological</span>
                        </SelectItem>

                        <SelectItem
                          value="crime"
                          className="flex items-center gap-5"
                        >
                          <Icon icon="carbon:police" width="24" height="24" />
                          <span>Crime</span>
                        </SelectItem>
                        <SelectItem
                          value="man-made"
                          className="flex items-center gap-5"
                        >
                          <Icon
                            icon="hugeicons:accident"
                            width="24"
                            height="24"
                          />
                          <span>Man-Made</span>
                        </SelectItem>
                        <SelectItem
                          value="industrial"
                          className="flex items-center gap-5"
                        >
                          <Icon icon="carbon:industry" width="24" height="24" />
                          <span>Industrial</span>
                        </SelectItem>
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

            {/* Map */}
            <div className="w-full max-w-xl mx-auto h-[480px]">
              <Map posix={[38.7946, 106.5348]} />
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
