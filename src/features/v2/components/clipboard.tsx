import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";

export function ClipboardButton({
  link,
}: {
  link: string;
}) {
   const t = useTranslations("main.session");
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);

  };

  return (
    <div className="w-full max-w-122.5 space-y-2">
      <Label htmlFor="link" className="text-sm font-medium">
           {t("Link")}
      </Label>

      <div className="flex gap-3">
        <Input id="link" value={link} readOnly className="h-12 flex-1" />

        <Button onClick={handleCopy} className="h-12 px-6 text-white" >

          <Copy className="size-4" />

          {t("Copylink")}
        </Button>
      </div>
    </div>
  );
}
