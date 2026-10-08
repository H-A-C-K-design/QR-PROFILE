"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePhoto from "@/components/ProfilePhoto";
import { updateUserProfile } from "@/lib/firestore";
import { uploadProfilePhoto, validateImageFile, deleteProfilePhoto } from "@/lib/storage";
import {
  Save,
  X,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Layers,
  Phone,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

function ProfileEditContent() {
  const { user, userProfile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstLogin = searchParams.get("firstLogin") === "true";

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  // Photo Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Populate from active profile
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPhone(userProfile.phone || "");
      setBio(userProfile.bio || "");
      setOrganization(userProfile.organization || "");
      setDesignation(userProfile.designation || "");
      setDepartment(userProfile.department || "");
      setLocation(userProfile.location || "");
      setWebsite(userProfile.website || "");
      setPublicProfileEnabled(userProfile.publicProfileEnabled ?? true);
      setProfilePhoto(userProfile.profilePhoto || "");
    } else if (user) {
      setName(user.displayName || "");
      setProfilePhoto(user.photoURL || "");
    }
  }, [userProfile, user]);

  // Handle Photo selection & preview
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || "Invalid image file");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    setProfilePhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("You must be signed in to save your profile.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    setSaving(true);

    try {
      let finalPhotoUrl = profilePhoto;

      // Upload new photo to Firebase Storage if a new file was chosen
      if (selectedFile) {
        setUploadProgress(10);
        finalPhotoUrl = await uploadProfilePhoto(
          user.uid,
          selectedFile,
          (progress) => setUploadProgress(progress)
        );
        setUploadProgress(null);
      }

      // Update Firestore document
      await updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        organization: organization.trim(),
        designation: designation.trim(),
        department: department.trim(),
        location: location.trim(),
        website: website.trim(),
        profilePhoto: finalPhotoUrl,
        publicProfileEnabled,
      });

      await refreshProfile();
      setSuccessMsg("Profile saved successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      console.error("Save profile error:", err);
      setErrorMsg(
        err?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-black/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFirstLogin ? "Complete Your Profile" : "Edit Profile"}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Update your digital identity and control what is publicly visible.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </Link>
        </div>

        {/* First Login Welcome Banner */}
        {isFirstLogin && (
          <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs sm:text-sm">
            Welcome to <b>QR SCAN PRO</b>! We&apos;ve initialized your account. Customize your profile details below to generate your unique QR badge.
          </div>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {/* Photo Upload Section */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-4">
            <label className="block text-sm font-semibold text-zinc-200">
              Profile Photo
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProfilePhoto
                photoUrl={photoPreview || profilePhoto}
                name={name || "User"}
                size="lg"
              />

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoSelect}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs cursor-pointer transition-colors border border-white/10"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </label>

                  {(photoPreview || profilePhoto) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-zinc-500">
                  Recommended: Square JPG, PNG, or WebP. Max file size: 5MB.
                </p>

                {uploadProgress !== null && (
                  <div className="w-full max-w-xs space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Short Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Share a brief statement about yourself or your mission..."
                className="w-full p-3 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <div className="text-right text-[11px] text-zinc-500">
                {bio.length}/300 characters
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
              Professional Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Designation / Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Solutions Architect"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Organization / Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. TechCorp Global"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Layers className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Cloud Engineering"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Website or Portfolio URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {publicProfileEnabled ? (
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Eye className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <EyeOff className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Public Profile Access
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Allow people scanning your QR code to view this information.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicProfileEnabled}
                  onChange={(e) => setPublicProfileEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Save / Cancel buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <ProfileEditContent />
      </Suspense>
    </ProtectedRoute>
  );
}
