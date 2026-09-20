import { notFound } from "next/navigation";
import SessionScreen from "@/src/features/v3/realtime/screens/session-screen";

interface SessionPageProps {
  params: Promise<{
    locale: string;
    token: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { token } = await params;

  if (!token) {
    return notFound();
  }

  return <SessionScreen token={token} />;
}
