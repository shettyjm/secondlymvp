import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadPlaceholder() {
  return (
    <div className="space-y-4 rounded-3xl border border-dashed border-line bg-mist p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ocean">
          <Upload className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-ink">Private medical uploads</p>
          <p className="text-sm text-slate-600">
            Store files in private Supabase Storage and serve only through signed URLs.
          </p>
        </div>
      </div>
      <Button variant="secondary">Upload records</Button>
    </div>
  );
}
