import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  SlidersHorizontal, 
  MessageSquare, 
  Settings,
  Star,
  RotateCw
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterHeaderBarProps {
  searchMode: "filters" | "chat";
  setSearchMode: (mode: "filters" | "chat") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  resultCount: number;
  setResultCount: (count: number) => void;
  minExperience: number | null;
  setMinExperience: (experience: number | null) => void;
  showStarredOnly: boolean;
  setShowStarredOnly: (show: boolean) => void;
  resetFilters: () => void;
  sortOrder: "relevance" | "score" | "experience" | "projects";
  setSortOrder: (order: "relevance" | "score" | "experience" | "projects") => void;
}

export const FilterHeaderBar = ({
  searchMode,
  setSearchMode,
  showFilters,
  setShowFilters,
  resultCount,
  setResultCount,
  minExperience,
  setMinExperience,
  showStarredOnly,
  setShowStarredOnly,
  resetFilters,
  sortOrder,
  setSortOrder
}: FilterHeaderBarProps) => {
  const [experienceValue, setExperienceValue] = useState<number>(
    minExperience || 0
  );

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setExperienceValue(value);
    setMinExperience(value > 0 ? value : null);
  };

  const handleResultCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setResultCount(value);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-2">
        {/* Criteria Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search criteria and sorting</p>
              </TooltipContent>
            </Tooltip>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px]">
            <SheetHeader>
              <SheetTitle>Search Criteria</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              {/* Results count slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Results to display: {resultCount}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={resultCount}
                    onChange={handleResultCountChange}
                    className="w-full accent-orange-500"
                    style={{ colorScheme: 'orange' }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Experience filter - with orange slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Minimum Experience: {minExperience ?? 0}+ years
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={experienceValue}
                    onChange={handleExperienceChange}
                    className="w-full accent-orange-500"
                    style={{ colorScheme: 'orange' }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>10+</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sort order radio buttons */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Sort Results By</label>
                <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                  <div className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value="relevance" id="relevance" />
                    <Label htmlFor="relevance">Relevance</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value="score" id="score" />
                    <Label htmlFor="score">Score</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value="experience" id="experience" />
                    <Label htmlFor="experience">Experience</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value="projects" id="projects" />
                    <Label htmlFor="projects">Projects</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Starred only toggle */}
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Show Favorites Only</label>
                <Button
                  size="icon"
                  variant={showStarredOnly ? "default" : "outline"}
                  onClick={() => setShowStarredOnly(!showStarredOnly)}
                  className="h-8 w-8"
                  aria-label={showStarredOnly ? "Show all profiles" : "Show starred profiles only"}
                >
                  <Star className={`h-4 w-4 ${showStarredOnly ? "fill-white" : ""}`} />
                </Button>
              </div>

              {/* Reset button */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full mt-4 flex items-center justify-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Reset All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Filters Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={searchMode === "filters" ? "default" : "outline"}
              className="flex items-center gap-1"
              onClick={() => {
                setSearchMode("filters");
                setShowFilters(true);
              }}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter by industry, specialty, and skills</p>
          </TooltipContent>
        </Tooltip>

        {/* Chat Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={searchMode === "chat" ? "default" : "outline"}
              className="flex items-center gap-1"
              onClick={() => {
                setSearchMode("chat");
                setShowFilters(true);
              }}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search with chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
