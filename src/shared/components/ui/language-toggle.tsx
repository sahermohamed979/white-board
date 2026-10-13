'use client';
import { useLocale, } from 'next-intl';
import { Button } from './button';
import { usePathname, useRouter } from '@/src/i18n/navigation';

export default function LangToggle({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const nextLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <Button
      variant="link"
      className={`p-0 hover:text-decoration-none text-text-default hover:text-text-primary text-base ${className}`}
      onClick={() => {
        router.push(pathname, { locale: nextLocale });
      }}
    >
      {locale === 'ar' ? 'EN' : 'AR'}
    </Button>
  );
}
