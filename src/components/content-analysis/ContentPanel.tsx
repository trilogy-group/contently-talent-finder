
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ArrowRight } from "lucide-react";

interface ContentPanelProps {
  type: "original" | "improved";
  content: string;
  onChange?: (value: string) => void;
  isAnalyzing?: boolean;
}

export function ContentPanel({
  type,
  content,
  onChange,
  isAnalyzing
}: ContentPanelProps) {
  const isOriginal = type === "original";
  const icon = isOriginal ? FileText : ArrowRight;
  const IconComponent = icon;

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <IconComponent className={`w-5 h-5 ${isOriginal ? "text-slate-600" : "text-emerald-600"}`} />
        <h2 className="text-lg font-semibold">
          {isOriginal ? "Original Content" : "Improved Version"}
        </h2>
        {content && (
          <span className="ml-auto text-sm text-slate-500">
            {content.split(/\s+/).length} words
          </span>
        )}
      </div>
      <div className={`relative flex-1 ${!isOriginal ? "bg-slate-50" : ""}`}>
        <Textarea
          value={content}
          onChange={e => onChange?.(e.target.value)}
          readOnly={!isOriginal}
          placeholder={`${isOriginal ? "Paste your content here..." : "Improved content will appear here..."}`}
          className="flex-1 min-h-0 resize-none p-4 text-base h-full"
        />
        {isAnalyzing && !isOriginal && (
          <div className="absolute inset-0 bg-slate-50/80 flex items-center justify-center">
            <div className="text-slate-600">Analyzing content...</div>
          </div>
        )}
      </div>
    </Card>
  );
}
