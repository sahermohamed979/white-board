import { Button } from "../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { ThemeToggle } from "@/src/shared/components/ui/ThemeToggle";
import LanguageToggle from "@/src/shared/components/ui/language-toggle";
import BackgroundSelection from "./background-selection";
import { Menu } from "lucide-react";
import { ExportButton } from "./export-butons";
import { useTranslations } from "next-intl";
import GridBackground from "./grid-background";
import { cn } from "@/src/shared/lib/utils";

export default function SideDropDown({
  containerRef,
  backgroundColor,
  readonly,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor?: string;
  readonly?: boolean;
}) {
  const t = useTranslations();
  return (
    <div className="absolute top-5 left-5 z-50 bg-card">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-35.7 mt-3">
          <DropdownMenuGroup>
            <DropdownMenuItem
              closeOnClick={false}
              className={cn(readonly && "hidden")}
            >
              {" "}
              {/* ← بدل Label */}
              <ThemeToggle />
            </DropdownMenuItem>

            <DropdownMenuItem closeOnClick={false}>
              <LanguageToggle />
            </DropdownMenuItem>

            <DropdownMenuLabel
              className={cn(
                "text-[11px] font-medium text-foreground uppercase tracking-wider",
                readonly && "hidden",
              )}
            >
              {t("main.sideDropDown.background")}
            </DropdownMenuLabel>

            <DropdownMenuItem
              closeOnClick={false}
              className={cn(readonly && "hidden")}
            >
              {" "}
              <BackgroundSelection />
            </DropdownMenuItem>
            <DropdownMenuLabel
              className={cn(
                "text-[11px] font-medium text-foreground uppercase tracking-wider",
                readonly && "hidden",
              )}
            >
              {t("main.sideDropDown.grid")}
            </DropdownMenuLabel>

            <DropdownMenuItem
              closeOnClick={false}
              className={cn(readonly && "hidden")}
            >
              {" "}
              <GridBackground />
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <ExportButton
              containerRef={containerRef}
              backgroundColor={backgroundColor}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
