"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCoachSession } from "@/context/CoachSessionContext";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface AthleteProfileContextValue {
  profilePhotoUrl: string | null;
  setProfilePhoto: (file: File) => Promise<void>;
  removeProfilePhoto: () => void;
  isUpdatingPhoto: boolean;
  photoError: string | null;
  clearPhotoError: () => void;
}

const AthleteProfileContext = createContext<AthleteProfileContextValue | null>(null);

function getStorageKey(athleteId: string) {
  return `pkp-athlete-photo-${athleteId}`;
}

export function AthleteProfileProvider({ children }: { children: ReactNode }) {
  const { athlete } = useCoachSession();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (!athlete) {
      setProfilePhotoUrl(null);
      return;
    }

    try {
      setProfilePhotoUrl(
        localStorage.getItem(getStorageKey(athlete.id)) ?? athlete.profilePhotoUrl ?? null
      );
    } catch {
      setProfilePhotoUrl(athlete.profilePhotoUrl ?? null);
    }
  }, [athlete]);

  const persistPhoto = useCallback(
    (dataUrl: string | null) => {
      if (!athlete) return;
      try {
        if (dataUrl) {
          localStorage.setItem(getStorageKey(athlete.id), dataUrl);
        } else {
          localStorage.removeItem(getStorageKey(athlete.id));
        }
      } catch {
        setPhotoError("Unable to save photo in this browser. Try a smaller image.");
      }
    },
    [athlete]
  );

  const setProfilePhoto = useCallback(
    async (file: File) => {
      setPhotoError(null);

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setPhotoError("Please upload a JPG, PNG, WEBP, or GIF image.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setPhotoError("Image must be 5 MB or smaller.");
        return;
      }

      setIsUpdatingPhoto(true);

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
              return;
            }
            reject(new Error("Could not read image file."));
          };
          reader.onerror = () => reject(new Error("Could not read image file."));
          reader.readAsDataURL(file);
        });

        setProfilePhotoUrl(dataUrl);
        persistPhoto(dataUrl);
      } catch {
        setPhotoError("Something went wrong while uploading. Please try again.");
      } finally {
        setIsUpdatingPhoto(false);
      }
    },
    [persistPhoto]
  );

  const removeProfilePhoto = useCallback(() => {
    setProfilePhotoUrl(null);
    setPhotoError(null);
    persistPhoto(null);
  }, [persistPhoto]);

  const clearPhotoError = useCallback(() => setPhotoError(null), []);

  const value = useMemo(
    () => ({
      profilePhotoUrl,
      setProfilePhoto,
      removeProfilePhoto,
      isUpdatingPhoto,
      photoError,
      clearPhotoError,
    }),
    [
      profilePhotoUrl,
      setProfilePhoto,
      removeProfilePhoto,
      isUpdatingPhoto,
      photoError,
      clearPhotoError,
    ]
  );

  return (
    <AthleteProfileContext.Provider value={value}>{children}</AthleteProfileContext.Provider>
  );
}

export function useAthleteProfile() {
  const context = useContext(AthleteProfileContext);
  if (!context) {
    throw new Error("useAthleteProfile must be used within AthleteProfileProvider");
  }
  return context;
}
