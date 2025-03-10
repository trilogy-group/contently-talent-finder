import { useState } from "react";
import { SlidersHorizontal, RotateCw, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { FilterOption } from "@/types/talent-search";

interface SimplifiedFilterSidebarProps {
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

export const SimplifiedFilterSidebar = ({
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
}: SimplifiedFilterSidebarProps) => {
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
                    } else {
                      // Reset filters
                      resetFilters();
                    }
                  }}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset filters</p>
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
                    variant={!showSettings ? "default" : "outline"}
                    className="flex items-center gap-1"
                    onClick={() => {
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
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Content area */}
      <div className="flex-grow overflow-auto p-4 custom-scrollbar">
        {showSettings ? (
          /* Settings Panel */
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">SORT RESULTS BY</h3>
              <RadioGroup 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relevance" id="sort-relevance" />
                  <Label htmlFor="sort-relevance">Relevance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experience" id="sort-experience" />
                  <Label htmlFor="sort-experience">Most Experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="sort-name" />
                  <Label htmlFor="sort-name">Name (A-Z)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-semibold mb-2">MINIMUM CRITERIA</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="min-experience">Experience (years)</Label>
                    <span className="text-sm text-gray-500">{experienceValue}+</span>
                  </div>
                  <Input
                    id="min-experience"
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={experienceValue}
                    onChange={handleExperienceChange}
                    className="w-full slider-progress"
                    style={{
                      '--progress-value': `${(experienceValue / 20) * 100}%`
                    } as React.CSSProperties}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="min-score">Talent Score</Label>
                    <span className="text-sm text-gray-500">{scoreValue}+</span>
                  </div>
                  <Input
                    id="min-score"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={scoreValue}
                    onChange={handleScoreChange}
                    className="w-full slider-progress"
                    style={{
                      '--progress-value': `${scoreValue}%`
                    } as React.CSSProperties}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label htmlFor="min-projects">Completed Projects</Label>
                    <span className="text-sm text-gray-500">{projectsValue}+</span>
                  </div>
                  <Input
                    id="min-projects"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={projectsValue}
                    onChange={handleProjectsChange}
                    className="w-full slider-progress"
                    style={{
                      '--progress-value': `${(projectsValue / 50) * 100}%`
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="result-count">Results to Show</Label>
                <span className="text-sm text-gray-500">{resultCount}</span>
              </div>
              <Input
                id="result-count"
                type="range"
                min="5"
                max="100"
                step="5"
                value={resultCount}
                onChange={handleResultCountChange}
                className="w-full slider-progress"
                style={{
                  '--progress-value': `${(resultCount / 100) * 100}%`
                } as React.CSSProperties}
              />
            </div>
          </div>
        ) : (
          /* Filters Panel */
          <div className="space-y-6">
            <div>
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={showStarredOnly ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1 w-full justify-center"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
              >
                <Star className="h-4 w-4" />
                <span>{showStarredOnly ? "Showing Favorites" : "Show Favorites"}</span>
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-semibold mb-2">INDUSTRIES</h3>
              <FilterSelect
                options={industryOptions}
                value={selectedIndustries}
                onChange={setSelectedIndustries}
                placeholder="Select industries..."
              />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">SPECIALTIES</h3>
              <FilterSelect
                options={specialtyOptions}
                value={selectedSpecialties}
                onChange={setSelectedSpecialties}
                placeholder="Select specialties..."
              />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">SKILLS</h3>
              <FilterSelect
                options={skillOptions}
                value={selectedSkills}
                onChange={setSelectedSkills}
                placeholder="Select skills..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
