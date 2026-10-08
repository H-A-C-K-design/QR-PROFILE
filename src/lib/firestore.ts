import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { UserProfile, PublicUserProfile } from "@/types/user";

const USERS_COLLECTION = "users";

/**
 * Fetch full private user profile (for the authenticated owner)
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db || !isFirebaseConfigured()) {
    return null;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export type PublicProfileResult =
  | { success: true; profile: PublicUserProfile }
  | { success: false; reason: "NOT_FOUND" | "DISABLED" | "UNCONFIGURED" | "ERROR" };

/**
 * Fetch publicly sanitized profile for public viewing (QR scans).
 * Enforces privacy: returns only safe public fields, or indicates DISABLED/NOT_FOUND.
 */
export async function getPublicUserProfile(uid: string): Promise<PublicProfileResult> {
  if (!db || !isFirebaseConfigured()) {
    return { success: false, reason: "UNCONFIGURED" };
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return { success: false, reason: "NOT_FOUND" };
    }

    const data = snap.data() as UserProfile;

    // Strict visibility check
    if (!data.publicProfileEnabled) {
      return { success: false, reason: "DISABLED" };
    }

    // Expose only authorized public fields
    const publicProfile: PublicUserProfile = {
      uid: data.uid,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      profilePhoto: data.profilePhoto || "",
      bio: data.bio || "",
      organization: data.organization || "",
      designation: data.designation || "",
      department: data.department || "",
      location: data.location || "",
      website: data.website || "",
      publicProfileEnabled: true,
    };

    return { success: true, profile: publicProfile };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return { success: false, reason: "ERROR" };
  }
}

/**
 * Create a new user profile upon first login
 */
export async function createUserProfile(profile: UserProfile): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  const userRef = doc(db, USERS_COLLECTION, profile.uid);
  await setDoc(userRef, {
    ...profile,
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Update user profile details
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }

  const userRef = doc(db, USERS_COLLECTION, uid);
  const savePromise = setDoc(
    userRef,
    {
      ...updates,
      uid,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "Firestore request timed out. Please check your internet connection or verify Firestore security rules in Firebase Console."
          )
        ),
      10000
    )
  );

  await Promise.race([savePromise, timeoutPromise]);
}

/**
 * Toggle public profile visibility (ON/OFF)
 */
export async function setPublicProfileStatus(
  uid: string,
  enabled: boolean
): Promise<void> {
  return updateUserProfile(uid, { publicProfileEnabled: enabled });
}
