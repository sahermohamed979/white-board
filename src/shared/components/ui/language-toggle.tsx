"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    router.replace(pathname, {
      locale: newLocale,
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-md border px-4 py-2 font-semibold"
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
