import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "QR SCAN PRO | Your Identity. One Profile. One QR.",
  description:
    "Create your digital identity and share your professional information instantly through a secure, cloud-synced QR code.",
  keywords: ["QR code profile", "digital business card", "digital identity", "contact sharing"],
  openGraph: {
    title: "QR SCAN PRO | Digital User Profile",
    description: "Create and share your verified digital profile with a single scan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600/30 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
