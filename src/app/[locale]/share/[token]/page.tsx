import ShareScreen from "@/src/features/v2/screens/share-screen";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { token } = await params;
  if (!token) {
    return notFound();
  }
  return <ShareScreen token={token} />;
}
