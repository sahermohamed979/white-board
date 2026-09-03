import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import { cn } from "@/src/shared/lib/utils";
import { StylePanel } from "@/src/features/main/components/style-panel";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "Sketchly — لوحة بيضاء تفاعلية ذكية للرسم والتخطيط"
    : "Sketchly — Interactive Virtual Whiteboard & Sketching App";

  const description = isAr
    ? "ارسم وخطط لأفكارك بحرية على لوحة بيضاء تفاعلية تدعم الرسم اليدوي، الأشكال الهندسية، الشبكات المخصصة، وتصدير الرسومات بدقة عالية."
    : "Create diagrams, sketch wireframes, and unleash your creativity with hand-drawn rough aesthetics, real-time persistence, custom grids, and high-res vector export.";

  const siteUrl = "https://sketchly-gamma.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Sketchly",
    },
    description,
    applicationName: "Sketchly",
    authors: [{ name: "Saher Mohamed" }],
    generator: "Next.js",
    category: "design",
    classification: "Design Software / Whiteboard Application",
    keywords: isAr
      ? [
          "لوحة بيضاء",
          "وايت بورد",
          "رسم تخطيطي",
          "تطبيق رسم",
          "مخططات هندسية",
          "تصميم تفاعلي",
          "Sketchly",
        ]
      : [
          "virtual whiteboard",
          "sketching app",
          "excalidraw alternative",
          "rough.js whiteboard",
          "diagram maker",
          "hand-drawn shapes",
          "freehand vector drawing",
          "collaborative whiteboard",
          "Sketchly",
        ],
    creator: "Saher Mohamed",
    publisher: "Sketchly",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      url: `/${locale}`,
      title,
      description,
      siteName: "Sketchly",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isAr ? "لوحة رسم سكتشلي التفاعلية" : "Sketchly Whiteboard Canvas",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@sketchly",
      images: [
        {
          url: "/og-image.png",
          alt: isAr ? "لوحة رسم سكتشلي التفاعلية" : "Sketchly Whiteboard Canvas",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/logo.webp",
    },
  };
}

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
  const isAr = locale === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sketchly",
    url: "https://sketchly-gamma.vercel.app",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: isAr
      ? "ارسم وخطط لأفكارك بحرية على لوحة بيضاء تفاعلية تدعم الرسم اليدوي، الأشكال الهندسية، وتصدير الرسومات بدقة عالية."
      : "Create diagrams, sketch wireframes, and unleash your creativity with hand-drawn rough aesthetics, real-time persistence, custom grids, and high-res vector export.",
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: "Saher Mohamed",
    },
  };

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-row relative">
        <Providers>
          {/* Floating Style Panel for Selection */}
          <StylePanel />

          {children}
        </Providers>
      </body>
    </html>
  );
}
