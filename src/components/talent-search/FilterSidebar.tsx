import { useState } from "react";
import { SlidersHorizontal, MessageSquare, RotateCw, Settings, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { FilterOption } from "@/types/talent-search";

interface FilterSidebarProps {
  searchMode: "filters" | "chat";
  searchTerm: string;
  showStarredOnly: boolean;
  selectedIndustries: string[];
  selectedSpecialties: string[];
  selectedSkills: string[];
  minExperience: number | null;
  minScore: number | null;
  minProjects: number | null;
  industryOptions: FilterOption[];
  specialtyOptions: FilterOption[];
  skillOptions: FilterOption[];
  setSearchMode: (mode: "filters" | "chat") => void;
  setSearchTerm: (term: string) => void;
  setShowStarredOnly: (show: boolean) => void;
  setSelectedIndustries: (industries: string[]) => void;
  setSelectedSpecialties: (specialties: string[]) => void;
  setSelectedSkills: (skills: string[]) => void;
  setMinExperience: (experience: number | null) => void;
  setMinScore: (score: number | null) => void;
  setMinProjects: (projects: number | null) => void;
  resetFilters: () => void;
  resultCount?: number;
  setResultCount?: (count: number) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
}

export const FilterSidebar = ({
  searchMode,
  searchTerm,
  showStarredOnly,
  selectedIndustries,
  selectedSpecialties,
  selectedSkills,
  minExperience,
  minScore,
  minProjects,
  industryOptions,
  specialtyOptions,
  skillOptions,
  setSearchMode,
  setSearchTerm,
  setShowStarredOnly,
  setSelectedIndustries,
  setSelectedSpecialties,
  setSelectedSkills,
  setMinExperience,
  setMinScore,
  setMinProjects,
  resetFilters,
  resultCount = 10,
  setResultCount = () => {},
  sortOrder,
  setSortOrder
}: FilterSidebarProps) => {
  const [experienceValue, setExperienceValue] = useState<number>(
    minExperience || 0
  );
  const [scoreValue, setScoreValue] = useState<number>(
    minScore || 0
  );
  const [projectsValue, setProjectsValue] = useState<number>(
    minProjects || 0
  );
  const [showSettings, setShowSettings] = useState(false);

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setExperienceValue(value);
    setMinExperience(value > 0 ? value : null);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setScoreValue(value);
    setMinScore(value > 0 ? value : null);
  };

  const handleProjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setProjectsValue(value);
    setMinProjects(value > 0 ? value : null);
  };

  const handleResultCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setResultCount(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)] flex flex-col">
      {/* Header with buttons */}
      <div className="p-4 border-b flex justify-between items-center">
        <TooltipProvider>
          <div className="flex items-center justify-between w-full">
            {/* Reset Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    if (showSettings) {
                      // Reset criteria settings
                      setResultCount(10);
                      setMinExperience(null);
                      setMinScore(null);
                      setMinProjects(null);
                      setSortOrder("relevance");
                      setExperienceValue(0);
                      setScoreValue(0);
                      setProjectsValue(0);
                    } else if (searchMode === "filters") {
                      // Reset filters
                      resetFilters();
                    }
                  }}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset current view</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2">
              {/* Criteria Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={showSettings ? "default" : "outline"}
                      className="flex items-center gap-1"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search criteria and sorting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Filters Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={searchMode === "filters" && !showSettings ? "default" : "outline"}
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSearchMode("filters");
                      setShowSettings(false);
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
                    onClick={() => setSearchMode("chat")}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search with chat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Filter content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        {showSettings ? (
          <div className="space-y-6">
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

            {/* Score filter - with orange slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Score: {minScore ?? 0}+
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreValue}
                  onChange={handleScoreChange}
                  className="w-full accent-orange-500"
                  style={{ colorScheme: 'orange' }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Projects filter - with orange slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Projects: {minProjects ?? 0}+
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={projectsValue}
                  onChange={handleProjectsChange}
                  className="w-full accent-orange-500"
                  style={{ colorScheme: 'orange' }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>20+</span>
                </div>
              </div>
            </div>

            {/* Sort order radio buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <RadioGroup defaultValue={sortOrder} onValueChange={setSortOrder}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relevance" id="relevance" />
                  <Label htmlFor="relevance">Relevance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="score" id="score" />
                  <Label htmlFor="score">Score</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experience" id="experience" />
                  <Label htmlFor="experience">Experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="projects" id="projects" />
                  <Label htmlFor="projects">Projects</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) : (
          <>
            {/* Search term */}
            <div>
              <Label className="text-sm font-medium">Search Term</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  placeholder="Search by keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Industries */}
            <div>
              <Label className="text-sm font-medium">Industries</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedIndustries}
                  placeholder="Select industries"
                  options={industryOptions}
                  onChange={setSelectedIndustries}
                />
              </div>
            </div>

            {/* Specialties */}
            <div>
              <Label className="text-sm font-medium">Specialties</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedSpecialties}
                  placeholder="Select specialties"
                  options={specialtyOptions}
                  onChange={setSelectedSpecialties}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <Label className="text-sm font-medium">Skills</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedSkills}
                  placeholder="Select skills"
                  options={skillOptions}
                  onChange={setSelectedSkills}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
