"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import { setPublicProfileStatus } from "@/lib/firestore";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  KeyRound,
  Calendar,
} from "lucide-react";

function SettingsContent() {
  const { user, userProfile, refreshProfile, signOutUser } = useAuth();
  const router = useRouter();

  const [publicProfileEnabled, setPublicProfileEnabled] = useState<boolean>(
    userProfile?.publicProfileEnabled ?? true
  );
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleToggleVisibility = async (newValue: boolean) => {
    if (!user) return;
    setUpdating(true);
    setFeedback(null);

    try {
      await setPublicProfileStatus(user.uid, newValue);
      setPublicProfileEnabled(newValue);
      await refreshProfile();
      setFeedback(
        newValue
          ? "Public profile is now ACTIVE. Anyone scanning your QR code can view your details."
          : "Public profile is now DISABLED. QR scans will show 'Profile Unavailable'."
      );
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error("Failed to update visibility:", err);
      setFeedback("Failed to update visibility. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your account security, privacy settings, and session.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs sm:text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
          <p className="leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Public Profile Visibility Setting */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white">
            Privacy & QR Visibility
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Control whether people who scan your QR code can view your profile information.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-2xl ${
                publicProfileEnabled
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {publicProfileEnabled ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  Public Profile Status:
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    publicProfileEnabled
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {publicProfileEnabled ? "ACTIVE (Public)" : "DISABLED (Private)"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                {publicProfileEnabled
                  ? "Anyone with your QR code or profile link can view your digital card."
                  : "Your profile is hidden. Anyone visiting your link will see a 'Profile Unavailable' message."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {updating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            <button
              onClick={() => handleToggleVisibility(!publicProfileEnabled)}
              disabled={updating}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                publicProfileEnabled
                  ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
              }`}
            >
              {publicProfileEnabled ? "Disable Public Access" : "Enable Public Access"}
            </button>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white">
            Authentication Details
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Information registered via your Firebase Google authentication provider.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-400">
              <User className="w-4 h-4 text-blue-400" />
              <span>Full Name</span>
            </span>
            <span className="font-semibold text-zinc-200">
              {userProfile?.name || user?.displayName || "Not provided"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-400">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Account Email</span>
            </span>
            <span className="font-semibold text-zinc-200">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-400">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Firebase UID</span>
            </span>
            <span className="font-mono text-zinc-300 text-[11px] max-w-[200px] truncate">
              {user?.uid}
            </span>
          </div>

          {userProfile?.createdAt && (
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Member Since</span>
              </span>
              <span className="font-semibold text-zinc-300">
                {new Date(userProfile.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Session Controls */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Sign Out</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            End your current session on this device.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
