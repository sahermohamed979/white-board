import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import { cn } from "@/src/shared/lib//utils";
import SideDropDown from "@/src/features/main/components/side-drop-down";
import Tools from "@/src/features/main/components/tools";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-serif" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-serif",
        notoSerif.variable,
        geistHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-row relative">
        <SideDropDown />
        <Tools />
        {children}
      </body>
    </html>
  );
}
