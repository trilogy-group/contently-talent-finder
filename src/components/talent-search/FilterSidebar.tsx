import { useState, useEffect } from "react";
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
import { FilterOption, TalentData } from "@/types/talent-search";
import { contentStrategyApi } from '@/utils/api';

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
  setTalents: (talents: TalentData[]) => void;
  setHasSearched: (hasSearched: boolean) => void;
  contentExamples: string;
  setContentExamples: (examples: string) => void;
  selectedPillar: string | null;
  setSelectedPillar: (pillar: string | null) => void;
}

interface SearchResponse {
  talent_request: {
    id: number;
    name: string;
    // ... other fields
  };
  relevant_skills_and_topics: {
    [key: string]: {
      relevant_skills: string;
      relevant_topics: string;
    };
  };
  contributors: TalentData[];
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
  setSortOrder,
  setTalents,
  setHasSearched,
  contentExamples,
  setContentExamples,
  selectedPillar,
  setSelectedPillar,
}: FilterSidebarProps) => {
  // Add state for storing fetched options
  const [formatOptions, setFormatOptions] = useState<FilterOption[]>([]);
  const [topicOptions, setTopicOptions] = useState<FilterOption[]>([]);
  const [skillOptions, setSkillOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pillarOptions, setPillarOptions] = useState<FilterOption[]>([]);

  // Fetch options when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('https://a0wtldhbib.execute-api.us-east-1.amazonaws.com/prod/options');
        const data = await response.json();
        
        setFormatOptions(data.storyFormats);
        setTopicOptions(data.topics);
        setSkillOptions(data.skills);

        const pillars = await contentStrategyApi.getPillars();
        setPillarOptions(pillars.map(pillar => ({
          value: pillar.id.toString(),
          label: pillar.name
        })));
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Rest of your existing state
  const [experienceValue, setExperienceValue] = useState<number>(minExperience || 0);
  const [scoreValue, setScoreValue] = useState<number>(minScore || 0);
  const [projectsValue, setProjectsValue] = useState<number>(minProjects || 0);
  const [showSettings, setShowSettings] = useState(false);

  // Add state for search loading
  const [isSearching, setIsSearching] = useState(false);

  // Your existing handlers remain the same
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

  // Update handleSearch function to include content examples and pillar_id
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const exampleUrls = contentExamples
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const searchParams = {
        storyFormat: selectedIndustries[0]?.toLowerCase(),
        topicIds: selectedSpecialties.map(Number),
        skillIds: selectedSkills.map(Number),
        contentExamples: exampleUrls,
        ...(selectedPillar && { pillarId: parseInt(selectedPillar) })
      };

      const response = await fetch('https://a0wtldhbib.execute-api.us-east-1.amazonaws.com/prod/talent/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data: SearchResponse = await response.json();
      setTalents(data.contributors || []);
      setHasSearched(true);
      
    } catch (error) {
      console.error('Search error:', error);
      setTalents([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Update the JSX to use the fetched options
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
                      setContentExamples("");
                    } else if (searchMode === "filters") {
                      // Reset filters
                      resetFilters();
                      setContentExamples("");
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
            {/* Format dropdown */}
            <div>
              <Label className="text-sm font-medium">Format</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedIndustries}
                  placeholder={isLoading ? "Loading formats..." : "Select a format"}
                  options={formatOptions}
                  onChange={(values) => {
                    // Only take the last selected value for single select
                    const singleValue = values.length > 0 ? [values[values.length - 1]] : [];
                    setSelectedIndustries(singleValue);
                  }}
                  maxItems={1}
                />
              </div>
            </div>

            {/* Pillar dropdown */}
            <div>
              <Label className="text-sm font-medium">Pillar</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedPillar ? [selectedPillar] : []}
                  placeholder={isLoading ? "Loading pillars..." : "Select a pillar"}
                  options={pillarOptions}
                  onChange={(values) => {
                    const pillar = values.length > 0 ? values[values.length - 1] : null;
                    setSelectedPillar(pillar);
                  }}
                  maxItems={1}
                />
              </div>
            </div>

            {/* Topics dropdown */}
            <div>
              <Label className="text-sm font-medium">Topics</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedSpecialties}
                  placeholder={isLoading ? "Loading topics..." : "Select topics"}
                  options={topicOptions}
                  onChange={setSelectedSpecialties}
                />
              </div>
            </div>

            {/* Skills dropdown */}
            <div>
              <Label className="text-sm font-medium">Skills</Label>
              <div className="mt-1">
                <FilterSelect
                  value={selectedSkills}
                  placeholder={isLoading ? "Loading skills..." : "Select skills"}
                  options={skillOptions}
                  onChange={setSelectedSkills}
                />
              </div>
            </div>

            {/* Content Examples field */}
            <div>
              <Label className="text-sm font-medium">Content Examples</Label>
              <div className="mt-1">
                <Input
                  type="text"
                  placeholder="Enter 3-10 URLs separated by commas"
                  value={contentExamples}
                  onChange={(e) => setContentExamples(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 3, maximum 10 URLs, separated by commas
                </p>
              </div>
            </div>

            {/* Add Search button at the bottom */}
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "SEARCH"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
