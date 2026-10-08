"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import QRCodeCard from "@/components/QRCodeCard";
import { ProfileCardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, ShieldCheck, ShieldAlert, Settings } from "lucide-react";

function QRContent() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <ProfileCardSkeleton />
      </div>
    );
  }

  const activeProfile = userProfile || {
    uid: user?.uid || "",
    name: user?.displayName || "Profile Owner",
    email: user?.email || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publicProfileEnabled: true,
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>QR Visibility</span>
        </Link>
      </div>

      {/* Visibility Alert if disabled */}
      {!activeProfile.publicProfileEnabled && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Public Profile Is Currently Disabled</p>
            <p className="text-rose-300/90 mt-0.5">
              People scanning this QR code will see a &quot;Profile Unavailable&quot; screen. You can enable it anytime in{" "}
              <Link href="/settings" className="underline font-semibold">
                Settings
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {/* QR Code Card */}
      <QRCodeCard user={activeProfile} />

      {/* Security note */}
      <div className="text-center max-w-sm mx-auto text-xs text-zinc-500 space-y-1">
        <p className="flex items-center justify-center gap-1 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cloud-verified secure profile URL</span>
        </p>
        <p>
          This QR code contains only your secure web profile URL. Personal contact info is loaded dynamically from Firestore.
        </p>
      </div>
    </div>
  );
}

export default function QRPage() {
  return (
    <ProtectedRoute>
      <QRContent />
    </ProtectedRoute>
  );
}
