"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Share2,
  ExternalLink,
} from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";
import { PublicUserProfile, UserProfile } from "@/types/user";

interface ProfileCardProps {
  profile: UserProfile | PublicUserProfile;
  mode?: "dashboard" | "public";
  onShare?: () => void;
}

export default function ProfileCard({
  profile,
  mode = "dashboard",
  onShare,
}: ProfileCardProps) {
  const isDashboard = mode === "dashboard";
  const userAsFull = profile as UserProfile;

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-black/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-blue-500/5">
      {/* Subtle background ambient gradients */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Photo */}
      <div className="relative flex flex-col items-center text-center">
        <ProfilePhoto
          photoUrl={profile.profilePhoto}
          name={profile.name}
          size="lg"
          priority
          className="mb-4"
        />

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {profile.name || "Digital Profile"}
        </h1>

        {/* Designation & Organization */}
        {(profile.designation || profile.organization) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-zinc-300 text-sm font-medium">
            {profile.designation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                {profile.designation}
              </span>
            )}
            {profile.organization && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                {profile.organization}
              </span>
            )}
            {profile.department && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-xs">
                {profile.department}
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-sm sm:text-base text-zinc-300/90 leading-relaxed max-w-md text-center bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
            {profile.bio}
          </p>
        )}

        {/* Status indicator on dashboard */}
        {isDashboard && (
          <div className="mt-4 flex items-center gap-2">
            {profile.publicProfileEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Public Profile Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                Public Profile Disabled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contact & Professional Details */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
        {/* Email */}
        {userAsFull.email && (
          <a
            href={`mailto:${userAsFull.email}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/15 hover:bg-zinc-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-medium text-zinc-400">Email</span>
                <span className="text-sm font-semibold text-zinc-200">{userAsFull.email}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
          </a>
        )}

        {/* Phone */}
        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/15 hover:bg-zinc-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-medium text-zinc-400">Phone</span>
                <span className="text-sm font-semibold text-zinc-200">{profile.phone}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
          </a>
        )}

        {/* Location */}
        {profile.location && (
          <div className="flex items-center p-3.5 rounded-2xl bg-zinc-950/50 border border-white/5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mr-3">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-medium text-zinc-400">Location</span>
              <span className="text-sm font-semibold text-zinc-200">{profile.location}</span>
            </div>
          </div>
        )}

        {/* Website */}
        {profile.website && (
          <a
            href={
              profile.website.startsWith("http")
                ? profile.website
                : `https://${profile.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/15 hover:bg-zinc-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-medium text-zinc-400">Website</span>
                <span className="text-sm font-semibold text-zinc-200 truncate max-w-[200px] sm:max-w-xs block">
                  {profile.website.replace(/^https?:\/\//, "")}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
          </a>
        )}
      </div>

      {/* Public profile footer actions */}
      {mode === "public" && onShare && (
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all shadow-md active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>
        </div>
      )}
    </div>
  );
}
