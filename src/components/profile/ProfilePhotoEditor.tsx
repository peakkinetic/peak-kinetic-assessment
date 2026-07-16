"use client";

import { useRef } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { AthleteAvatar } from "@/components/ui/AthleteAvatar";
import { Card, CardHeader } from "@/components/ui/Card";
import { useAthleteProfile } from "@/context/AthleteProfileContext";
import { cn } from "@/lib/utils";

export function ProfilePhotoEditor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    profilePhotoUrl,
    setProfilePhoto,
    removeProfilePhoto,
    isUpdatingPhoto,
    photoError,
    clearPhotoError,
  } = useAthleteProfile();

  const openFilePicker = () => {
    clearPhotoError();
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await setProfilePhoto(file);
  };

  return (
    <Card>
      <CardHeader
        title="Profile Photo"
        subtitle="Upload a headshot for this athlete profile"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUpdatingPhoto}
          className="group relative mx-auto sm:mx-0"
          aria-label="Upload profile photo"
        >
          <AthleteAvatar size="lg" />
          <span className="absolute inset-0 flex items-center justify-center rounded-3xl bg-pkp-black/55 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </span>
        </button>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-pkp-gray-600">
            {profilePhotoUrl
              ? "Photo saved for this athlete. It will appear across the dashboard."
              : "No photo yet. Upload a JPG, PNG, WEBP, or GIF up to 5 MB."}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUpdatingPhoto}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-pkp-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pkp-gray-800",
                isUpdatingPhoto && "cursor-not-allowed opacity-60"
              )}
            >
              <Upload className="h-4 w-4" />
              {isUpdatingPhoto ? "Uploading..." : profilePhotoUrl ? "Replace Photo" : "Upload Photo"}
            </button>

            {profilePhotoUrl && (
              <button
                type="button"
                onClick={removeProfilePhoto}
                disabled={isUpdatingPhoto}
                className="inline-flex items-center gap-2 rounded-xl border border-pkp-gray-200 px-4 py-2 text-sm font-semibold text-pkp-gray-700 transition-colors hover:bg-pkp-gray-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          {photoError && (
            <p className="text-sm font-medium text-pkp-red">{photoError}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </Card>
  );
}
