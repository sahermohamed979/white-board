import type { Metadata, Viewport } from "next";
import { cn } from "@/src/shared/lib/utils";
import Providers from "@/src/shared/context/providers";
import { routing } from "@/src/i18n/routing";
import { Analytics } from "@vercel/analytics/next"
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
    ? "ارسم وخطط لأفكارك بحرية على لوحة بيضاء تفاعلية تدعم الرسم اليدوي، الأشكال الهندسية، الشبكات المخصصة، وتصدير الرسومات بدقة عالية مع تشفير تام."
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
          "وايت بورد تفاعلي",
          "رسم تخطيطي",
          "تطبيق رسم يدوي",
          "بديل excalidraw",
          "مخططات هندسية",
          "سبورة بيضاء اون لاين",
          "تصميم تفاعلي",
          "رسم بياني حر",
          "تعاون مباشر على الرسم",
          "لوحة بيضاء مشفرة",
          "Sketchly",
        ]
      : [
          "virtual whiteboard",
          "online whiteboard",
          "sketching app",
          "excalidraw alternative",
          "collaborative whiteboard",
          "real-time whiteboard",
          "rough.js whiteboard",
          "diagram maker",
          "wireframe sketching",
          "hand-drawn shapes",
          "freehand vector drawing",
          "end-to-end encrypted whiteboard",
          "free online canvas",
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
          alt: isAr
            ? "لوحة رسم سكتشلي التفاعلية"
            : "Sketchly Whiteboard Canvas",
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
          alt: isAr
            ? "لوحة رسم سكتشلي التفاعلية"
            : "Sketchly Whiteboard Canvas",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
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
      shortcut: "/logo.webp",
      apple: "/logo.webp",
    },
    other: {
      "geo.region": isAr ? "EG" : "US",
      "geo.placename": isAr ? "Cairo" : "Global",
      "geo.position": isAr ? "30.0444;31.2357" : "37.0902;-95.7129",
      "ICBM": isAr ? "30.0444, 31.2357" : "37.0902, -95.7129",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "Sketchly",
      "application-name": "Sketchly",
      "format-detection": "telephone=no",
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
  const siteUrl = "https://sketchly-gamma.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#webapp`,
        name: "Sketchly",
        alternateName: isAr ? "سكتشلي" : "Sketchly Virtual Whiteboard",
        url: `${siteUrl}/${locale}`,
        applicationCategory: "DesignApplication",
        applicationSubCategory: "Interactive Virtual Whiteboard",
        operatingSystem:
          "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
        browserRequirements:
          "Requires JavaScript. Requires HTML5 Canvas & IndexedDB.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        description: isAr
          ? "ارسم وخطط لأفكارك بحرية على لوحة بيضاء تفاعلية تدعم الرسم اليدوي، الأشكال الهندسية، والتعاون المباشر مع تشفير تام."
          : "Create diagrams, sketch wireframes, and unleash your creativity with hand-drawn rough aesthetics, real-time persistence, custom grids, and high-res vector export.",
        featureList: isAr
          ? [
              "لوحة بيضاء تفاعلية مجانية في الوقت الفعلي",
              "تشفير طرف إلى طرف لجلسات العمل المشتركة",
              "رسم يدوي بأسلوب Rough.js و Perfect-Freehand",
              "أشكال هندسية (مستطيل، دائرة، معين، أسهم، خطوط)",
              "أداة كتابة نصوص وممحاة ذكية",
              "إمكانية رفع الصور ودمجها على اللوحة",
              "شبكات مخصصة وخلفيات قابلة للتعديل",
              "تصدير عالي الدقة بصيغ PNG و SVG و JSON",
              "حفظ محلي فوري على الجهاز عبر IndexedDB",
              "دعم كامل للغتين العربية (RTL) والإنجليزية (LTR)",
            ]
          : [
              "Real-time multiplayer collaborative whiteboard",
              "End-to-end encrypted collaboration sessions",
              "Hand-drawn organic rough aesthetic with vector precision",
              "Geometric shapes (rectangles, ellipses, diamonds, arrows, lines)",
              "Rich text tooling and element eraser",
              "Image upload and canvas integration",
              "Custom canvas grids and background themes",
              "High-resolution vector and image export (PNG, SVG, JSON)",
              "Local persistence via IndexedDB for offline privacy",
              "Full bilingual support (English LTR and Arabic RTL)",
            ],
        screenshot: `${siteUrl}/og-image.png`,
        softwareVersion: "1.0.0",
        inLanguage: locale,
        author: {
          "@type": "Person",
          name: "Saher Mohamed",
        },
        publisher: {
          "@type": "Organization",
          name: "Sketchly",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.webp`,
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Sketchly",
        url: siteUrl,
        inLanguage: ["en", "ar"],
        description:
          "Free interactive virtual whiteboard for sketching, diagramming, and real-time collaboration.",
        publisher: {
          "@type": "Person",
          name: "Saher Mohamed",
        },
      },
    ],
  };

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-serif")}
    >
      <body
        className="relative flex min-h-full flex-row"
        suppressHydrationWarning
      >
        <script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
          <Analytics />

      </body>
    </html>
  );
}
