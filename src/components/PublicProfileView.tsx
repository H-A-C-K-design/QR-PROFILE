"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserX,
  EyeOff,
  QrCode,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import ProfileCard from "./ProfileCard";
import { ProfileCardSkeleton } from "./LoadingSkeleton";
import { getPublicUserProfile, PublicProfileResult } from "@/lib/firestore";
import { PublicUserProfile } from "@/types/user";

interface PublicProfileViewProps {
  userId: string;
}

export default function PublicProfileView({ userId }: PublicProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [status, setStatus] = useState<"SUCCESS" | "NOT_FOUND" | "DISABLED" | "UNCONFIGURED" | "ERROR">("SUCCESS");
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const result: PublicProfileResult = await getPublicUserProfile(userId);

        if (!isMounted) return;

        if (result.success) {
          setProfile(result.profile);
          setStatus("SUCCESS");
        } else {
          setStatus(result.reason);
        }
      } catch (err) {
        console.error("Failed to load public profile:", err);
        if (isMounted) setStatus("ERROR");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${profile.name} | Digital Profile`,
          text: `Check out ${profile.name}'s verified digital profile:`,
          url,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setToastMsg("Profile link copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
        setToastMsg(null);
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto space-y-4">
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 animate-pulse">
          Loading Digital Profile...
        </div>
        <ProfileCardSkeleton />
      </div>
    );
  }

  // State: Profile Not Found
  if (status === "NOT_FOUND") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="p-4 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <UserX className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The profile you are trying to access does not exist or is no longer available.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  // State: Profile Disabled (Visibility OFF)
  if (status === "DISABLED") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <EyeOff className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Profile Unavailable</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This user has disabled their public profile.
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            The profile owner can re-enable public visibility at any time from their account settings.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to QR SCAN PRO</span>
          </Link>
        </div>
      </div>
    );
  }

  // State: Firebase Unconfigured
  if (status === "UNCONFIGURED") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-amber-500/30 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Database Unconfigured</h2>
          <p className="text-sm text-zinc-400">
            Firebase credentials are not yet configured in the environment.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // State: Error
  if (status === "ERROR" || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
          <p className="text-sm text-zinc-400">
            Unable to connect to the profile service. Please verify your internet connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // State: Success
  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 py-2.5 px-4 rounded-2xl bg-zinc-900 border border-white/20 text-white text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Badge */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Verified Digital Profile</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
          <span>{copied ? "Copied" : "Share"}</span>
        </button>
      </div>

      {/* Public Profile Card */}
      <ProfileCard profile={profile} mode="public" onShare={handleShare} />

      {/* Footer Branding */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <QrCode className="w-4 h-4 text-blue-500" />
          <span>Create your own profile on QR SCAN PRO</span>
        </Link>
      </div>
    </div>
  );
}
