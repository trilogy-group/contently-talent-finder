
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2 } from "lucide-react";

interface ContentHeaderProps {
  selectedGuideline: string;
  onGuidelineChange: (value: string) => void;
  onAnalyze: () => void;
  hasContent: boolean;
  isAnalyzing: boolean;
  guidelines: Array<{
    value: string;
    label: string;
  }>;
}

export function ContentHeader({
  selectedGuideline,
  onGuidelineChange,
  onAnalyze,
  hasContent,
  isAnalyzing,
  guidelines,
}: ContentHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Content Analysis</h1>
        <p className="text-slate-600 mt-2">
          Transform your content to match brand guidelines
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[280px]">
          <Select
            value={selectedGuideline}
            onValueChange={onGuidelineChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select guideline" />
            </SelectTrigger>
            <SelectContent>
              {guidelines.map(guide => (
                <SelectItem key={guide.value} value={guide.value}>
                  {guide.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          size="lg"
          onClick={onAnalyze}
          disabled={!hasContent || !selectedGuideline || isAnalyzing}
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isAnalyzing ? "Analyzing..." : "Improve Content"}
        </Button>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );
}
