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

export default function SideDropDown({
  containerRef,
  backgroundColor,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor?: string;
}) {
  const t = useTranslations();
  return (
    <div className="absolute top-5 left-5 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-35.7 mt-3">
          <DropdownMenuGroup>
            <DropdownMenuItem closeOnClick={false}>
              {" "}
              {/* ← بدل Label */}
              <ThemeToggle />
            </DropdownMenuItem>

            <DropdownMenuItem closeOnClick={false}>
              <LanguageToggle />
            </DropdownMenuItem>

            <DropdownMenuLabel className="text-[11px] font-medium text-foreground uppercase tracking-wider">
              {t("main.sideDropDown.background")}
            </DropdownMenuLabel>

            <DropdownMenuItem closeOnClick={false}>
              {" "}
              {/* ← لفيت BackgroundSelection */}
              <BackgroundSelection />
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem closeOnClick={false}>
              <ExportButton
                containerRef={containerRef}
                backgroundColor={backgroundColor}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
