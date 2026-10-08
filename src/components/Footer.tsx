import React from "react";
import Link from "next/link";
import { QrCode, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/90 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-wider text-white">
              QR SCAN <span className="text-blue-500">PRO</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Create your verifiable digital identity and share professional credentials instantly through a secure, cloud-synced QR code.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero mock data. End-to-end user-controlled visibility and Firestore security rules.</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Google Sign In
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">
            Security & Privacy
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/settings" className="hover:text-white transition-colors">
                Visibility Controls
              </Link>
            </li>
            <li>
              <span className="text-zinc-400">Firebase Auth & Firestore</span>
            </li>
            <li>
              <span className="text-zinc-400">Secure Image Storage</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <p>© {new Date().getFullYear()} QR SCAN PRO. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for modern identity management
        </p>
      </div>
    </footer>
  );
}
