import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Copy } from "lucide-react";

export function ClipboardButton() {
  const link = "https://excalidraw.com/#json=BOJu4Uwk...";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
  };

  return (
    <div className="w-full max-w-122.5 space-y-2">
      <Label htmlFor="link" className="text-sm font-medium">
        Link
      </Label>

      <div className="flex gap-3">
        <Input id="link" value={link} readOnly className="h-12 flex-1" />

        <Button onClick={handleCopy} className="h-12 px-6 text-white">
          <Copy className="size-4" />
          Copy link
        </Button>
      </div>
    </div>
  );
}
