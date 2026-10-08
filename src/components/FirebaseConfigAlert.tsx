"use client";

import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function FirebaseConfigAlert() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isFirebaseConfigured()) {
    return null;
  }

  const sampleEnv = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl my-6 px-4">
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-200 backdrop-blur-md shadow-lg shadow-amber-950/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-100 text-base">
                Firebase Setup Required for Live Authentication & Database
              </h3>
              <p className="text-sm text-amber-300/90 mt-1">
                Your application is configured for real Firebase Authentication, Firestore, and Storage. To sign in and sync live profiles, add your Firebase keys to{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-amber-200">
                  .env.local
                </code>
                .
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-medium text-amber-200 transition-colors shrink-0"
          >
            {expanded ? "Hide Details" : "Setup Guide"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-amber-500/20 text-xs text-amber-200/90 space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="font-semibold text-amber-300 block mb-1">1. Firebase Console</span>
                Go to <span className="underline">console.firebase.google.com</span> and create a project.
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="font-semibold text-amber-300 block mb-1">2. Enable Services</span>
                Enable <b>Google Sign-In</b> under Authentication, create a <b>Firestore Database</b>, and enable <b>Storage</b>.
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="font-semibold text-amber-300 block mb-1">3. Web App Config</span>
                Add a Web App in Project Settings, copy the config variables to <code className="font-mono">.env.local</code> and restart the server.
              </div>
            </div>

            <div className="relative mt-2">
              <pre className="p-3 rounded-xl bg-black/70 border border-amber-500/20 font-mono text-[11px] overflow-x-auto text-amber-100">
                {sampleEnv}
              </pre>
              <button
                onClick={copyEnv}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-xs flex items-center gap-1 transition-colors"
                title="Copy template"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
