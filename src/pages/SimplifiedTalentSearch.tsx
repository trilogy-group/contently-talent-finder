import { useState } from "react";
import { SimplifiedTitleBar } from "@/components/SimplifiedTitleBar";
import { TalentCard } from "@/components/talent-search/TalentCard";
import { SimplifiedFilterSidebar } from "@/components/talent-search/SimplifiedFilterSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTalentProfiles, industryOptions, specialtyOptions } from "@/data/mock-talent-profiles";
import { filterTalentProfiles } from "@/utils/talentFilterUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Create skill options from the talent profiles
const skillOptions = Array.from(
  new Set(
    mockTalentProfiles.flatMap(profile => profile.skills)
  )
).map(skill => ({ value: skill, label: skill }));

const SimplifiedTalentSearch = () => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [minProjects, setMinProjects] = useState<number | null>(null);
  const [starredProfiles, setStarredProfiles] = useState<number[]>([]);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"relevance" | "experience" | "name">("relevance");
  
  // Custom handler for sort order to handle type conversion
  const handleSortOrderChange = (newSortOrder: string) => {
    if (newSortOrder === "relevance" || newSortOrder === "experience" || newSortOrder === "name") {
      setSortOrder(newSortOrder as "relevance" | "experience" | "name");
    }
  };
  
  // UI state
  const [showFilters, setShowFilters] = useState(true);
  const [resultCount, setResultCount] = useState(10);

  // Toggle starred status for a profile
  const toggleStarred = (profileId: number) => {
    setStarredProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };

  // Reset all filters
  const resetAll = () => {
    // Reset filters
    setSearchTerm("");
    setSelectedIndustries([]);
    setSelectedSpecialties([]);
    setSelectedSkills([]);
    setMinExperience(null);
    setMinScore(null);
    setMinProjects(null);
    setShowStarredOnly(false);
    setResultCount(10);
  };

  // Filter profiles based on current filters
  const filteredProfiles = filterTalentProfiles(mockTalentProfiles, {
    searchTerm,
    selectedIndustries,
    selectedSpecialties,
    selectedSkills,
    minExperience,
    minScore,
    minProjects,
    starredProfiles,
    showStarredOnly
  });

  // Sort the filtered profiles based on the selected sort order
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortOrder) {
      case "experience":
        return b.yearsOfExperience - a.yearsOfExperience;
      case "name":
        return a.name.localeCompare(b.name);
      case "relevance":
      default:
        // Relevance is the default order from filterTalentProfiles
        return 0;
    }
  });

  // Limit the results to the user-selected count
  const displayedProfiles = sortedProfiles.slice(0, resultCount);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SimplifiedTitleBar />
      
      <div className="flex-grow w-full py-8 px-4 flex flex-col">
        {/* Page header */}
        <div className="w-full px-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Talent Search</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-lg">
              Find writers with verified expertise based on their content.
            </p>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {/* Toggle Sidebar Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showFilters ? "Hide sidebar" : "Show sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div className="w-full px-4 grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
          {/* Left sidebar - filters */}
          {showFilters && (
            <div className="md:col-span-1">
              <SimplifiedFilterSidebar 
                searchTerm={searchTerm}
                showStarredOnly={showStarredOnly}
                selectedIndustries={selectedIndustries}
                selectedSpecialties={selectedSpecialties}
                selectedSkills={selectedSkills}
                minExperience={minExperience}
                minScore={minScore}
                minProjects={minProjects}
                industryOptions={industryOptions}
                specialtyOptions={specialtyOptions}
                skillOptions={skillOptions}
                setSearchTerm={setSearchTerm}
                setShowStarredOnly={setShowStarredOnly}
                setSelectedIndustries={setSelectedIndustries}
                setSelectedSpecialties={setSelectedSpecialties}
                setSelectedSkills={setSelectedSkills}
                setMinExperience={setMinExperience}
                setMinScore={setMinScore}
                setMinProjects={setMinProjects}
                resetFilters={resetAll}
                resultCount={resultCount}
                setResultCount={setResultCount}
                sortOrder={sortOrder}
                setSortOrder={handleSortOrderChange}
              />
            </div>
          )}
          
          {/* Results area */}
          <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}>
            <div className="space-y-4 overflow-auto h-[calc(100vh-200px)] pr-2">
              {filteredProfiles.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">No talent matches your criteria. Try adjusting your filters.</p>
                </div>
              ) : (
                displayedProfiles.map((profile) => (
                  <TalentCard
                    key={profile.id}
                    profile={profile}
                    isStarred={starredProfiles.includes(profile.id)}
                    onToggleStar={toggleStarred}
                  />
                ))
              )}
              {filteredProfiles.length > resultCount && (
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">
                    Showing {resultCount} of {filteredProfiles.length} results. 
                    {resultCount < 100 && " Adjust the slider to see more."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen overlay for dropdowns */}
      <div id="dropdown-overlay" className="fixed inset-0 bg-black/30 z-40 hidden" />
    </div>
  );
};

export default SimplifiedTalentSearch;
