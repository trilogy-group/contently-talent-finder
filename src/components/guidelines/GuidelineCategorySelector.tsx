
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { CategoryType } from "@/types/guidelines";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface GuidelineCategorySelectorProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  onSuggest: (mode: "history" | "market") => void;
  isSuggesting: boolean;
}

export function GuidelineCategorySelector({
  activeCategory,
  onCategoryChange,
  onSuggest,
  isSuggesting
}: GuidelineCategorySelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="grid grid-cols-3 gap-1 flex-1 bg-muted p-1 rounded-lg">
        {(["tone", "style", "terminology"] as CategoryType[]).map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "ghost"}
            onClick={() => onCategoryChange(category)}
            className={`w-full ${
              activeCategory === category
                ? "bg-white shadow-sm font-semibold text-[#F97316]"
                : "hover:bg-white/50"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex space-x-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              onClick={() => onSuggest("history")}
              disabled={isSuggesting}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              History
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">Historical Guidelines</h4>
              <p className="text-sm text-muted-foreground">
                Generates guidelines based on your previous successful content and writing patterns,
                helping maintain consistency with your existing style.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              onClick={() => onSuggest("market")}
              disabled={isSuggesting}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Market
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">Market Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Suggests guidelines based on industry best practices and successful content patterns
                in your market segment.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
