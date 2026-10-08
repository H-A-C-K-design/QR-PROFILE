"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePhotoProps {
  photoUrl?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10 text-xs",
  md: "w-16 h-16 text-lg",
  lg: "w-28 h-28 text-2xl",
  xl: "w-36 h-36 text-3xl",
};

export default function ProfilePhoto({
  photoUrl,
  name,
  size = "md",
  className,
  priority = false,
}: ProfilePhotoProps) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);
  const dimensionClass = sizeClasses[size];

  if (photoUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden border-2 border-white/20 bg-zinc-800 shadow-xl shrink-0 ring-4 ring-white/5",
          dimensionClass,
          className
        )}
      >
        <Image
          src={photoUrl}
          alt={name ? `${name}'s profile photo` : "User profile photo"}
          fill
          sizes="(max-width: 768px) 150px, 200px"
          className="object-cover"
          onError={() => setImgError(true)}
          priority={priority}
          unoptimized={photoUrl.startsWith("data:")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-bold font-sans tracking-wide text-white shadow-xl shrink-0 border-2 border-white/20 ring-4 ring-white/5 select-none bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600",
        dimensionClass,
        className
      )}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <UserIcon className="w-1/2 h-1/2 text-white/80" />
      )}
    </div>
  );
}
