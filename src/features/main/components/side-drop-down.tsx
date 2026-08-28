import React from "react";
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

export default function SideDropDown() {
  return (
    <div className=" absolute top-5 left-5 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <ThemeToggle />
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <LanguageToggle />
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
