"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  QrCode,
  Menu,
  X,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";

export default function Navbar() {
  const { user, userProfile, loading, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOutUser();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                QR SCAN <span className="text-blue-500">PRO</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {!user ? (
              <>
                <Link
                  href="/"
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/") ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/#about"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  About
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/profile/edit"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/profile/edit")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Link>
                <Link
                  href="/qr"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/qr")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  My QR
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/settings")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-white/10 rounded-xl animate-pulse" />
            ) : !user ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  <ProfilePhoto
                    photoUrl={userProfile?.profilePhoto || user.photoURL}
                    name={userProfile?.name || user.displayName || "User"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-zinc-200 max-w-[120px] truncate">
                    {userProfile?.name || user.displayName || "Account"}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-4 pt-4 pb-6 space-y-3 backdrop-blur-2xl">
          {!user ? (
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                Home
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                How It Works
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                About
              </Link>
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-zinc-300 bg-white/5 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10 pb-3 mb-2">
                <ProfilePhoto
                  photoUrl={userProfile?.profilePhoto || user.photoURL}
                  name={userProfile?.name || user.displayName || "User"}
                  size="sm"
                />
                <div className="truncate">
                  <div className="text-sm font-semibold text-white truncate">
                    {userProfile?.name || user.displayName || "User"}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                </div>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <LayoutDashboard className="w-5 h-5 text-blue-400" />
                Dashboard
              </Link>
              <Link
                href="/profile/edit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <User className="w-5 h-5 text-purple-400" />
                Edit Profile
              </Link>
              <Link
                href="/qr"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                My QR Code
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-5 h-5 text-zinc-400" />
                Settings
              </Link>

              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
