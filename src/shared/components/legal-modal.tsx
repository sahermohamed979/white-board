"use client";

import { useState } from "react";
import { Scale, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import { cn } from "@/src/shared/lib/utils";
import {
  LEGAL_CONTENT,
  type LegalDocument,
} from "../constants/legal-content.constant";

interface LegalModalProps {
  className?: string;
}

export function LegalModal({ className }: LegalModalProps = {}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  const locale = useLocale();
  const t = useTranslations("main.legal");

  const isAr = locale === "ar";
  const localizedContent = isAr ? LEGAL_CONTENT.ar : LEGAL_CONTENT.en;
  const currentDoc: LegalDocument = localizedContent[activeTab];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5",
          className,
        )}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border-popover-foreground bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-md transition-all hover:bg-accent sm:px-3 sm:py-1.5"
                    aria-label={t("buttonTooltip")}
                  />
                }
              />
            }
          >
            <Scale className="size-3.5 text-primary sm:size-4" />
            <span className="hidden text-xs font-medium sm:inline">
              {t("buttonLabel")}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>{t("buttonTooltip")}</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <DialogContent
        className={cn(
          "flex max-h-[88vh] w-full flex-col gap-4 overflow-hidden p-4 sm:max-w-2xl sm:p-6",
        )}
      >
        <DialogHeader className="shrink-0 space-y-1.5 text-start">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {activeTab === "terms" ? (
                <Scale className="size-4" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold sm:text-lg">
                {t("dialogTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("dialogDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex shrink-0 items-center rounded-lg border border-border/70 bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "terms"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Scale className="size-3.5" />
            <span>{t("termsTab")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer",
              activeTab === "privacy"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShieldCheck className="size-3.5" />
            <span>{t("privacyTab")}</span>
          </button>
        </div>

        {/* Highlight Banner */}
        {currentDoc.disclaimerBanner && (
          <div className="shrink-0 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {currentDoc.disclaimerBanner}
            </p>
          </div>
        )}

        {/* Scrollable Document Sections */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs/relaxed">
          {currentDoc.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg border border-border/60 bg-card/60 p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="font-semibold text-foreground text-xs sm:text-sm">
                  {section.title}
                </h2>
                {section.badge && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {section.badge}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground">{section.description}</p>

              {section.points && section.points.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {section.points.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground/90"
                    >
                      <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.importantNotice && (
                <div className="rounded-md border border-border bg-muted/60 p-2.5 text-[11px] font-medium text-foreground">
                  <span className="font-semibold text-primary">
                    {isAr ? "ملاحظة قانونية: " : "Legal Note: "}
                  </span>
                  {section.importantNotice}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span>
              {t("lastUpdated")}: {currentDoc.lastUpdated}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-7 cursor-pointer text-xs"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LegalModal;
