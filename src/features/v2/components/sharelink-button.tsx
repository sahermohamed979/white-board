import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";
import { ClipboardButton } from "./clipboard";
import { CreateShareLinkApiResponse } from "@/src/features/v1/types/share.types";
import { useTranslations } from "next-intl";

export default function ShareLinkButton({
  ShareData,
}: {
  ShareData: CreateShareLinkApiResponse;
}) {
  const t = useTranslations("main.session");
  if (!ShareData.status) {
    return <div>Something went wrong</div>;
  }

  return (
    <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-3">
        <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
          {t("shareableLink")}
        </DialogTitle>
      </DialogHeader>
      <ClipboardButton link={ShareData?.payload.url} />
      <DialogDescription className="text-sm leading-6 text-foreground/80 md:text-base flex flex-col gap-4">
        {t("endToEndEncrypted")} 
        <span className="text-destructive">
          ⚠️ {t("thisLinkWillExpireIn")} :{" "}
          {new Date(Number(ShareData?.payload.expiresAt)).toLocaleString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
            
          )}
        </span>
      </DialogDescription>
    </DialogContent>
  );
}
