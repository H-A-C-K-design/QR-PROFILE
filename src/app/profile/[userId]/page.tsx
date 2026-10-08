import type { Metadata } from "next";
import PublicProfileView from "@/components/PublicProfileView";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;

  return {
    title: `Digital Profile | QR SCAN PRO`,
    description: "View verified digital profile, organization, and professional contact links.",
    openGraph: {
      title: `Digital Profile | QR SCAN PRO`,
      description: "View verified digital profile and contact links.",
      url: `/profile/${userId}`,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { userId } = await params;

  return <PublicProfileView userId={userId} />;
}
