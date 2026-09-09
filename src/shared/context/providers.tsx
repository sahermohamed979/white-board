import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./provider/ThemeProvider";
import ReactQueryProvider from "./provider/react-query-providers";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <NextIntlClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
}
