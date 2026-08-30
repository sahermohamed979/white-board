import React, { useState } from "react";
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
import { SidebarIcon } from "lucide-react";
import { ExportButton } from "./export-butons";

export default function SideDropDown({
  containerRef,
  backgroundColor,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor?: string;
}) {
 
  return (
    <div className=" absolute top-5 left-5 z-50 ">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <SidebarIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-35.7 mt-3">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <ThemeToggle />
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <LanguageToggle />
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-[11px] font-medium text-foreground uppercase tracking-wider ">
              Background:
            </DropdownMenuLabel>

            <BackgroundSelection />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <ExportButton
              containerRef={containerRef}
              
            />{" "}
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
