"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Loader2,
} from "lucide-react";
import { generateQRCodeDataUrl, downloadQRCodePNG } from "@/utils/qr";
import { UserProfile } from "@/types/user";

interface QRCodeCardProps {
  user: UserProfile;
}

export default function QRCodeCard({ user }: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && user?.uid) {
      const url = `${window.location.origin}/profile/${user.uid}`;
      setProfileUrl(url);

      generateQRCodeDataUrl(url)
        .then((data) => setQrDataUrl(data))
        .catch((err) => console.error("Failed to generate QR Code:", err));
    }
  }, [user?.uid]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadQRCodePNG({
        profileUrl,
        name: user.name,
        designation: user.designation,
        organization: user.organization,
      });
    } catch (error) {
      console.error("Error downloading QR:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} - Digital Profile`,
          text: `Scan my QR code or visit my digital profile:`,
          url: profileUrl,
        });
        setShareFeedback("Shared successfully!");
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          // Fallback to copy link
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
      setShareFeedback("Link copied to clipboard!");
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-black/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
      {/* Background ambient light */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 mb-6">
        <QrCode className="w-3.5 h-3.5 text-blue-400" />
        MY QR CODE
      </div>

      {/* QR Code Container */}
      <div className="relative mx-auto w-64 h-64 p-3 rounded-3xl bg-white shadow-2xl shadow-blue-500/10 flex items-center justify-center border border-zinc-200">
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt={`${user.name}'s Profile QR Code`}
            width={240}
            height={240}
            className="rounded-2xl"
            priority
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-medium">Generating QR...</span>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {user.name || "Your Profile"}
        </h2>
        {(user.designation || user.organization) && (
          <p className="text-sm text-zinc-400">
            {[user.designation, user.organization].filter(Boolean).join(" • ")}
          </p>
        )}
        <p className="text-xs text-zinc-500 mt-2">
          Scan to view my verified digital profile
        </p>
      </div>

      {/* Feedback Toast */}
      {shareFeedback && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium animate-fade-in inline-block">
          {shareFeedback}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-2.5">
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl || downloading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-98 disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download QR Card (PNG)
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors border border-white/5 active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share QR
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors border border-white/5 active:scale-98"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <Link
          href={`/profile/${user.uid}`}
          target="_blank"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <span>Preview public profile</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
