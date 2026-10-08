"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebase";
import { getUserProfile, createUserProfile } from "./firestore";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ isNewUser: boolean } | null>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isConfigured: false,
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [configured, setConfigured] = useState<boolean>(false);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user profile from Firestore:", error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.uid) {
      await fetchProfile(user.uid);
    }
  }, [user?.uid, fetchProfile]);

  useEffect(() => {
    const isConfig = isFirebaseConfigured();
    setConfigured(isConfig);

    if (!isConfig || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async (): Promise<{ isNewUser: boolean } | null> => {
    if (!auth || !isFirebaseConfigured()) {
      throw new Error(
        "Firebase is not configured. Please add your credentials in .env.local"
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;

      // Check if user profile already exists in Firestore
      let existingProfile = await getUserProfile(loggedUser.uid);
      let isNew = false;

      if (!existingProfile) {
        isNew = true;
        const initialProfile: UserProfile = {
          uid: loggedUser.uid,
          name: loggedUser.displayName || "User",
          email: loggedUser.email || "",
          phone: loggedUser.phoneNumber || "",
          profilePhoto: loggedUser.photoURL || "",
          bio: "",
          organization: "",
          designation: "",
          department: "",
          location: "",
          website: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publicProfileEnabled: true,
        };

        await createUserProfile(initialProfile);
        setUserProfile(initialProfile);
      } else {
        setUserProfile(existingProfile);
      }

      setUser(loggedUser);
      return { isNewUser: isNew };
    } catch (error: any) {
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        return null;
      }
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isConfigured: configured,
        signInWithGoogle,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
