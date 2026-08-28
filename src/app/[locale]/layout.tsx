import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import { cn } from "@/src/shared/lib//utils";
import SideDropDown from "@/src/features/main/components/side-drop-down";
import { StylePanel } from "@/src/features/main/components/style-panel";
import Tools from "@/src/features/main/components/tools";
import Providers from "@/src/shared/context/providers";
import { routing } from "@/src/i18n/routing";

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
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const paramsResult = await params;
  const locale = paramsResult.locale;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
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
        <Providers>
          <Tools />
          <SideDropDown />

          {/* Floating Style Panel for Selection */}
          <StylePanel />

          {children}
        </Providers>
      </body>
    </html>
  );
}
