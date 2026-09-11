import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";

export default function SaveButton() {
  return (
    <div className=" fixed top-6 right-6 bg-green-700  rounded-md">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              size="icon-sm"
              variant="outline"
              className="w-full flex items-center justify-center gap-1 p-1"
            >
              <span className=" ">Save</span>
              <Save />
            </Button>
          }
        />

        <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center ">
          <DialogHeader className="items-center gap-3">
            <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
              {" "}
              save
            </DialogTitle>
            <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
              This board will be saved as PDF and shared with the users
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <Button className="h-12 gap-3 px-6 text-sm sm:text-base text-white"></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
