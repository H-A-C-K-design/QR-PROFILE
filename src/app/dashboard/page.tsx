"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCard from "@/components/ProfileCard";
import { ProfileCardSkeleton } from "@/components/LoadingSkeleton";
import {
  Edit3,
  QrCode,
  ExternalLink,
  Settings,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";

function DashboardContent() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <ProfileCardSkeleton />
      </div>
    );
  }

  // Graceful fallback for new user before Firestore document has synced
  const activeProfile = userProfile || {
    uid: user?.uid || "",
    name: user?.displayName || "Profile Owner",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    profilePhoto: user?.photoURL || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publicProfileEnabled: true,
  };

  const isProfileEmpty =
    !activeProfile.designation &&
    !activeProfile.organization &&
    !activeProfile.bio &&
    !activeProfile.phone &&
    !activeProfile.website &&
    !activeProfile.location;

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Account Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome, {activeProfile.name || "User"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your digital profile and share your personal QR code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>

          <Link
            href="/qr"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/5 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>My QR Code</span>
          </Link>

          <Link
            href="/settings"
            title="Settings"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* New user profile completion banner */}
      {isProfileEmpty && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-blue-200 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                Complete Your Digital Profile
              </h4>
              <p className="text-xs text-blue-300/90 mt-0.5">
                Add your title, organization, bio, and contact links to make your public digital card stand out.
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            <span>Complete Profile</span>
          </Link>
        </div>
      )}

      {/* Visibility Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
        <div className="flex items-center gap-3">
          {activeProfile.publicProfileEnabled ? (
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-white">
              Public Profile Visibility:{" "}
              <span
                className={
                  activeProfile.publicProfileEnabled
                    ? "text-emerald-400 font-bold"
                    : "text-rose-400 font-bold"
                }
              >
                {activeProfile.publicProfileEnabled ? "ACTIVE (Public)" : "DISABLED (Private)"}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {activeProfile.publicProfileEnabled
                ? "Anyone scanning your QR code can view your public digital card."
                : "QR scans will display 'Profile Unavailable'. Only you can access your profile."}
            </p>
          </div>
        </div>

        <Link
          href="/settings"
          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors underline"
        >
          Change
        </Link>
      </div>

      {/* Profile Card Render */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Digital Identity Card
          </h2>
          {activeProfile.uid && (
            <Link
              href={`/profile/${activeProfile.uid}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <span>View Public URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <ProfileCard profile={activeProfile} mode="dashboard" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
