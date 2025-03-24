import { useState, useEffect, useRef } from "react";
import { TitleBar } from "@/components/TitleBar";
import { TalentCardV5 } from "@/components/talent-search/TalentCardV5";
import { FilterSidebar } from "@/components/talent-search/FilterSidebar";
import { ChatSidebar } from "@/components/talent-search/ChatSidebar";
import { mockTalentProfiles, roleOptions, industryOptions, specialtyOptions } from "@/data/mock-talent-profiles";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTalentChat } from "@/hooks/useTalentChat";
import { filterTalentProfiles } from "@/utils/talentFilterUtils";
import { useStrategy } from "@/context/StrategyContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TalentData } from "@/types/talent-search";

const TalentSearchV5 = () => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);
  const [starredProfiles, setStarredProfiles] = useState<number[]>([]);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  
  // UI state
  const [searchMode, setSearchMode] = useState<"filters" | "chat">("filters");
  const [showFilters, setShowFilters] = useState(true);
  const [resultCount, setResultCount] = useState(10);

  // Create a ref for the microphone button
  const micButtonRef = useRef<HTMLButtonElement>(null);

  // Get strategy context
  const { selectedStrategy, setSelectedStrategy } = useStrategy();

  // Add state for talents and search status
  const [talents, setTalents] = useState<TalentData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Update filters based on selected strategy
  useEffect(() => {
    if (selectedStrategy) {
      // In a real application, we would fetch the appropriate filters based on the strategy
      // For now, we'll just set some example filters based on the strategy ID
      switch (selectedStrategy) {
        case 'goals':
          setSelectedRoles(['content_strategist', 'project_manager']);
          break;
        case 'audiences':
          setSelectedIndustries(['technology', 'healthcare']);
          break;
        case 'voice':
          setSelectedSpecialties(['copywriting', 'brand_voice']);
          break;
        case 'pillars':
          setSelectedSpecialties(['seo', 'thought_leadership']);
          break;
        case 'plan':
          setSelectedRoles(['content_creator', 'editor']);
          break;
        case 'distribution':
          setSelectedSpecialties(['social_media', 'email_marketing']);
          break;
        case 'seo':
          setSelectedSpecialties(['seo', 'keyword_research']);
          break;
        default:
          // Reset filters if "All Strategies" is selected
          setSelectedRoles([]);
          setSelectedIndustries([]);
          setSelectedSpecialties([]);
          break;
      }
    }
  }, [selectedStrategy]);

  // Wrapper functions for state updates
  const updateSelectedRoles = (roles: string[]) => {
    console.log("updateSelectedRoles called with:", roles);
    // Check if role already exists
    const updatedRoles = [...selectedRoles];
    roles.forEach(role => {
      if (!updatedRoles.includes(role)) {
        updatedRoles.push(role);
      }
    });
    console.log("Setting selectedRoles to:", updatedRoles);
    setSelectedRoles(updatedRoles);
  };

  const updateSelectedIndustries = (industries: string[]) => {
    console.log("updateSelectedIndustries called with:", industries);
    // Check if industry already exists
    const updatedIndustries = [...selectedIndustries];
    industries.forEach(industry => {
      if (!updatedIndustries.includes(industry)) {
        updatedIndustries.push(industry);
      }
    });
    console.log("Setting selectedIndustries to:", updatedIndustries);
    setSelectedIndustries(updatedIndustries);
  };

  const updateSelectedSpecialties = (specialties: string[]) => {
    console.log("updateSelectedSpecialties called with:", specialties);
    // Check if specialty already exists
    const updatedSpecialties = [...selectedSpecialties];
    specialties.forEach(specialty => {
      if (!updatedSpecialties.includes(specialty)) {
        updatedSpecialties.push(specialty);
      }
    });
    console.log("Setting selectedSpecialties to:", updatedSpecialties);
    setSelectedSpecialties(updatedSpecialties);
  };

  // Initialize chat hook
  const {
    chatQuery,
    setChatQuery,
    chatHistory,
    setChatHistory,
    processChat,
    appliedFilters,
    sortOrder,
    setSortOrder,
    minScore,
    setMinScore,
    minProjects,
    setMinProjects
  } = useTalentChat({
    setSelectedRoles: updateSelectedRoles,
    setSelectedIndustries: updateSelectedIndustries,
    setSelectedSpecialties: updateSelectedSpecialties,
    setMinExperience,
    setMinScore,
    setMinProjects,
    setSortOrder,
    setResultCount,
    
    // Current filter states for feedback
    selectedRoles,
    selectedIndustries,
    selectedSpecialties
  });

  // Initialize speech recognition
  const handleFinalTranscript = (transcript: string) => {
    setChatQuery(prev => prev + transcript + ' ');
  };

  const {
    isRecording,
    interimTranscript,
    startRecording,
    stopRecording
  } = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript
  });

  // Toggle starred status for a profile
  const toggleStarred = (profileId: number) => {
    setStarredProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };

  // Handle chat submissions
  const handleSendChat = () => {
    // Use either the final transcript or the interim transcript if chat query is empty
    const messageText = chatQuery.trim() || interimTranscript.trim();
    
    if (!messageText) return;
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    
    processChat(messageText);
    
    // Focus back on the microphone button after a short delay
    setTimeout(() => {
      if (micButtonRef.current) {
        micButtonRef.current.focus();
      }
    }, 600);
  };

  // Toggle voice recording with actual speech recognition
  const toggleVoiceRecording = () => {
    console.log("Toggle voice recording called, current state:", isRecording);
    
    if (isRecording) {
      stopRecording();
      // Force update UI immediately
      setChatQuery(prev => {
        const newQuery = prev + (interimTranscript ? interimTranscript + ' ' : '');
        console.log("Updated chat query:", newQuery);
        return newQuery;
      });
    } else {
      // Clear existing chat query when starting new recording
      setChatQuery("");
      startRecording();
    }
    
    // Force focus on the mic button
    setTimeout(() => {
      if (micButtonRef.current) {
        console.log("Focusing mic button after toggle");
        micButtonRef.current.focus();
      }
    }, 200);
  };

  // Reset all filters and chat
  const resetAll = () => {
    // Reset filters
    setSearchTerm("");
    setSelectedRoles([]);
    setSelectedIndustries([]);
    setSelectedSpecialties([]);
    setMinExperience(null);
    setShowStarredOnly(false);
    setResultCount(10);
    
    // Reset strategy
    setSelectedStrategy(null);
    
    // Reset chat
    setChatHistory([]);
    setChatQuery("");
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
  };

  // Filter talent profiles based on search and filter criteria
  const filteredProfiles = filterTalentProfiles(mockTalentProfiles, {
    searchTerm,
    selectedRoles,
    selectedIndustries,
    selectedSpecialties,
    minExperience,
    starredProfiles,
    showStarredOnly
  });

  // Limit the results to the user-selected count
  const limitedProfiles = filteredProfiles.slice(0, resultCount);

  // Pass this to FilterSidebar
  const handleSearchResults = (searchResults: TalentData[]) => {
    setTalents(searchResults);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TitleBar 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Talent Search", href: "/talent-search-v5" }
        ]}
      />
      
      <div className="flex-grow w-full py-8 px-4 flex flex-col">
        {/* Page header */}
        <div className="w-full px-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Talent Search</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-lg">
              Find the perfect content creators, specialists, and project managers for your brand.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? (
                <>
                  Hide Filters
                  <ChevronLeft className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show Filters
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="w-full px-4 grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
          {/* Left sidebar - conditionally show filters or chat */}
          {showFilters && (
            <div className="md:col-span-1">
              {searchMode === "filters" ? (
                <FilterSidebar 
                  searchMode={searchMode}
                  searchTerm={searchTerm}
                  showStarredOnly={showStarredOnly}
                  selectedRoles={selectedRoles}
                  selectedIndustries={selectedIndustries}
                  selectedSpecialties={selectedSpecialties}
                  minExperience={minExperience}
                  roleOptions={roleOptions}
                  industryOptions={industryOptions}
                  specialtyOptions={specialtyOptions}
                  setSearchMode={setSearchMode}
                  setSearchTerm={setSearchTerm}
                  setShowStarredOnly={setShowStarredOnly}
                  setSelectedRoles={setSelectedRoles}
                  setSelectedIndustries={setSelectedIndustries}
                  setSelectedSpecialties={setSelectedSpecialties}
                  setMinExperience={setMinExperience}
                  resetFilters={resetAll}
                  resultCount={resultCount}
                  setResultCount={setResultCount}
                  setTalents={handleSearchResults}
                  setHasSearched={setHasSearched}
                />
              ) : (
                <ChatSidebar
                  searchMode={searchMode}
                  chatQuery={chatQuery}
                  chatHistory={chatHistory}
                  isRecording={isRecording}
                  interimTranscript={interimTranscript}
                  setSearchMode={setSearchMode}
                  setChatQuery={setChatQuery}
                  handleSendChat={handleSendChat}
                  toggleVoiceRecording={toggleVoiceRecording}
                  resetAll={resetAll}
                  resultCount={resultCount}
                  setResultCount={setResultCount}
                  minExperience={minExperience}
                  setMinExperience={setMinExperience}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  showStarredOnly={showStarredOnly}
                  setShowStarredOnly={setShowStarredOnly}
                  minScore={minScore}
                  setMinScore={setMinScore}
                  minProjects={minProjects}
                  setMinProjects={setMinProjects}
                  appliedFilters={appliedFilters}
                  micButtonRef={micButtonRef}
                />
              )}
            </div>
          )}
          
          {/* Results area */}
          <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}>
            <div className="space-y-4 overflow-auto h-[calc(100vh-200px)] pr-2">
              {!hasSearched ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">Use the filters on the left and click SEARCH to find talents.</p>
                </div>
              ) : talents.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">No talent matches your criteria. Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  {talents.slice(0, resultCount).map((talent) => (
                    <TalentCardV5
                      key={talent.id}
                      talent={talent}
                    />
                  ))}
                  {talents.length > resultCount && (
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <p className="text-gray-600">
                        Showing {resultCount} of {talents.length} results. 
                        {resultCount < 100 && " Adjust the slider to see more."}
                      </p>
                    </div>
                  )}
                </>
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

export default TalentSearchV5;
