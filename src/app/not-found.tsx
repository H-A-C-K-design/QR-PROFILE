import React from "react";
import Link from "next/link";
import { QrCode, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto relative">
      <div className="p-8 rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 text-blue-400 flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The page or profile you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium border border-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
