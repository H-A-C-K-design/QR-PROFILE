import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export interface UploadProgressHandler {
  (progress: number): void;
}

/**
 * Validate image file size and MIME type
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image size must not exceed 5MB.",
    };
  }

  return { valid: true };
}

/**
 * Upload a profile photo for a user to Firebase Storage
 */
export async function uploadProfilePhoto(
  uid: string,
  file: File,
  onProgress?: UploadProgressHandler
): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `avatar_${Date.now()}.${extension}`;
  const storageRef = ref(storage, `profile_photos/${uid}/${filename}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        ownerUid: uid,
      },
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error("Storage upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlError) {
          reject(urlError);
        }
      }
    );
  });
}

/**
 * Delete an old profile photo from Firebase Storage if it belongs to Firebase
 */
export async function deleteProfilePhoto(photoUrl: string): Promise<void> {
  if (!storage || !photoUrl || !photoUrl.includes("firebasestorage.googleapis.com")) {
    return;
  }

  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    console.warn("Could not delete previous photo from storage:", error);
  }
}
