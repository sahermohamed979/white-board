import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./provider/ThemeProvider";
import ReactQueryProvider from "./provider/react-query-providers";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/sonner";

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
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
}
