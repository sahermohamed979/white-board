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
import { SharedBoardData } from "@/src/features/v1/types/share.types";
import { useBoardStore } from "../../v1/store/board-store";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SaveButton({
  savedData,
}: {
  savedData: SharedBoardData | null | undefined;
}) {
  const t = useTranslations("main.session");

  const clearBoard = useBoardStore((s) => s.clearBoard);
  const setBackgroundColor = useBoardStore((s) => s.setBackgroundColor);
  const setBackgroundGrid = useBoardStore((s) => s.setBackgroundGrid);
  const setElements = useBoardStore((s) => s.setElements);
  const router = useRouter();
  const SetDatahandler = () => {
    if (!savedData) return;
    clearBoard();
    setBackgroundColor(savedData.backgroundColor);
    setBackgroundGrid(savedData.backgroundGrid);
    setElements(savedData.elements);
    router.push("/");
  };

  return (
    <div className=" fixed top-6 right-6 bg-green-700  rounded-md">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center gap-1 p-1 text-white hover:text-white"
            >
              <span className=" "> {t("save")}</span>
              <Save />
            </Button>
          }
        />

        <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center ">
          <DialogHeader className="items-center gap-3">
            <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
              {" "}
              {t("saveLocally")}
            </DialogTitle>
            <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
              {t("saveTheBoardSoUCanEditOnItLocally")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center gap-2">
            <Button
              onClick={SetDatahandler}
              className="h-12 gap-3 px-6 text-sm sm:text-base text-white"
            >
              {t("saveBoard")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
