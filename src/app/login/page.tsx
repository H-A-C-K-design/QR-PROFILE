"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase";
import FirebaseConfigAlert from "@/components/FirebaseConfigAlert";
import {
  QrCode,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSigningIn(true);

    try {
      if (!isFirebaseConfigured()) {
        setErrorMsg(
          "Firebase credentials are not yet configured in .env.local. Please provide your Firebase project keys to enable real Google Sign-In."
        );
        setSigningIn(false);
        return;
      }

      const res = await signInWithGoogle();
      if (res) {
        if (res.isNewUser) {
          router.push("/profile/edit?firstLogin=true");
        } else {
          router.push(redirectPath);
        }
      } else {
        // User closed the popup, cancel gracefully
        setSigningIn(false);
      }
    } catch (error: any) {
      console.error("Sign in failed:", error);
      setSigningIn(false);
      if (error?.code === "auth/popup-closed-by-user") {
        return;
      } else if (error?.code === "auth/cancelled-popup-request") {
        return;
      } else if (
        error?.code === "auth/configuration-not-found" ||
        error?.code === "auth/operation-not-allowed"
      ) {
        setErrorMsg(
          "Google Sign-In is not enabled yet in your Firebase Project (agriassist-dw627). In Firebase Console, go to Authentication > Sign-in method > Add new provider > Select 'Google' > Click 'Enable' and Save."
        );
      } else if (error?.code === "auth/network-request-failed") {
        setErrorMsg("Network error. Please check your internet connection.");
      } else if (error?.code === "auth/unauthorized-domain") {
        setErrorMsg(
          "Domain not authorized. In Firebase Console, go to Authentication > Settings > Authorized domains and ensure 'localhost' is listed."
        );
      } else if (error?.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Authentication failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto space-y-6 relative">
        <FirebaseConfigAlert />

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-black/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Card Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
              <QrCode className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sign In to QR SCAN PRO
            </h1>
            <p className="text-sm text-zinc-400">
              Access your digital profile and manage your personal QR code.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-rose-200">Authentication Error</p>
                <p className="text-rose-300/90 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn || loading}
              className="w-full relative flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm transition-all shadow-xl shadow-white/5 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {signingIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{signingIn ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            <div className="pt-2 text-center text-xs text-zinc-500 space-y-2">
              <p className="flex items-center justify-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Firebase Authentication</span>
              </p>
              <p className="text-zinc-500 text-[11px]">
                No passwords stored manually. Direct OAuth with Google.
              </p>
            </div>
          </div>
        </div>

        {/* Feature summary */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
