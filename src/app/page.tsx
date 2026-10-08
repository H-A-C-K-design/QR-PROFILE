"use client";

import React from "react";
import Link from "next/link";
import {
  QrCode,
  ShieldCheck,
  Smartphone,
  Share2,
  Sparkles,
  ArrowRight,
  EyeOff,
  Database,
  CloudUpload,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import FirebaseConfigAlert from "@/components/FirebaseConfigAlert";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Firebase configuration banner if environment variables are not yet populated */}
      <FirebaseConfigAlert />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs sm:text-sm font-medium text-zinc-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-200">Production-Ready Digital Identity</span>
            <span className="text-zinc-500">•</span>
            <span className="text-blue-400 font-semibold">Firebase Connected</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your Identity. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              One Profile. One QR.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed">
            Create your digital identity and share your information instantly
            through a secure QR code.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-95 group"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-200 font-semibold text-base border border-white/10 backdrop-blur-md transition-all active:scale-95"
                >
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all active:scale-95"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/qr"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-200 font-semibold text-base border border-white/10 backdrop-blur-md transition-all active:scale-95"
                >
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span>My QR Code</span>
                </Link>
              </>
            )}
          </div>

          {/* Real-time Architecture / Preview Mockup */}
          <div className="pt-12 max-w-3xl mx-auto">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-black/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-center">
                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-white font-semibold text-sm">You Generate</h2>
                  <p className="text-xs text-zinc-400">
                    A personalized, cloud-verified QR code is dynamically bound to your unique account UID.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-white font-semibold text-sm">Anyone Scans</h2>
                  <p className="text-xs text-zinc-400">
                    Smartphone camera scans the QR code and opens your secure public profile page instantly.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-white font-semibold text-sm">You Control</h2>
                  <p className="text-xs text-zinc-400">
                    Only allowed public fields are exposed. Disable visibility with one toggle at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-blue-400 font-semibold text-xs tracking-wider uppercase">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Simple 4-step process to create, manage, and share your digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-4 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Google Sign-In</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Log in securely using Google OAuth via Firebase Authentication. No manual passwords to remember.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-4 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CloudUpload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Profile Setup</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Upload your avatar to Firebase Storage. Add your designation, organization, website, and contact information.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-4 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Unique QR Code</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A permanent, unique QR code is generated pointing to your public profile URL.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-4 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Share & Download</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Download a high-resolution branded PNG badge or share via native Web Share API with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Core Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-purple-400 font-semibold text-xs tracking-wider uppercase">
              Security & Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed For Privacy and Performance
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Built from the ground up on modern cloud standards with zero fake mockups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Public Profile Toggle</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You have full control. Disable your public profile anytime from settings, and scanning your QR code will immediately return a friendly &quot;Profile Unavailable&quot; screen.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Mobile Camera Optimized</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Public profile pages are designed specifically as digital identity cards. Anyone scanning with iOS or Android gets instant access with no app installation required.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Real Cloud Database</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Backed by real Firebase Firestore and Firebase Storage. No hardcoded sample users or artificial placeholder metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-blue-900/30 via-zinc-900 to-purple-900/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready To Create Your Digital Profile?
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto text-base">
            Sign in with Google, fill in your details, and download your personalized QR code in under two minutes.
          </p>
          <div className="pt-2">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>{user ? "View Dashboard" : "Get Started Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
