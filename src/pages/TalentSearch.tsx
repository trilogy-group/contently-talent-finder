import { useState } from "react";
import { TitleBar } from "@/components/TitleBar";
import { TalentCardV5 } from "@/components/talent-search/TalentCardV5";
import { FilterSidebar } from "@/components/talent-search/FilterSidebar";
import { ChatSidebar } from "@/components/talent-search/ChatSidebar";
import { FilterHeaderBar } from "@/components/talent-search/FilterHeaderBar";
import { mockTalentProfiles, industryOptions, specialtyOptions } from "@/data/mock-talent-profiles";
import { SlidersHorizontal, ChevronLeft, ChevronRight, MessageSquare, Settings, Star, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTalentChat } from "@/hooks/useTalentChat";
import { filterTalentProfiles } from "@/utils/talentFilterUtils";
import { SimpleStrategySelector } from "@/components/talent-search/SimpleStrategySelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SpeechRecognitionAlert } from "@/components/ui/speech-recognition-alert";
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

// Create skill options from the talent profiles
const skillOptions = Array.from(
  new Set(
    mockTalentProfiles.flatMap(profile => profile.skills)
  )
).map(skill => ({ value: skill, label: skill }));

const TalentSearch = () => {
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
  const [sortOrder, setSortOrder] = useState<"relevance" | "score" | "experience" | "projects">("relevance");
  
  // UI state
  const [searchMode, setSearchMode] = useState<"filters" | "chat">("filters");
  const [showFilters, setShowFilters] = useState(true);
  const [resultCount, setResultCount] = useState(10);
  const [showSpeechAlert, setShowSpeechAlert] = useState(false);

  // Wrapper functions for state updates
  const updateSelectedIndustries = (industries: string[]) => {
    // Check if industry already exists
    const updatedIndustries = [...selectedIndustries];
    industries.forEach(industry => {
      if (!updatedIndustries.includes(industry)) {
        updatedIndustries.push(industry);
      }
    });
    setSelectedIndustries(updatedIndustries);
  };

  const updateSelectedSpecialties = (specialties: string[]) => {
    // Check if specialty already exists
    const updatedSpecialties = [...selectedSpecialties];
    specialties.forEach(specialty => {
      if (!updatedSpecialties.includes(specialty)) {
        updatedSpecialties.push(specialty);
      }
    });
    setSelectedSpecialties(updatedSpecialties);
  };

  const updateSelectedSkills = (skills: string[]) => {
    // Check if skill already exists
    const updatedSkills = [...selectedSkills];
    skills.forEach(skill => {
      if (!updatedSkills.includes(skill)) {
        updatedSkills.push(skill);
      }
    });
    setSelectedSkills(updatedSkills);
  };

  // Initialize chat hook
  const {
    chatQuery,
    setChatQuery,
    chatHistory,
    setChatHistory,
    processChat,
    appliedFilters,
    sortOrder: chatSortOrder,
    setSortOrder: setChatSortOrder,
    minScore: chatMinScore,
    setMinScore: setChatMinScore,
    minProjects: chatMinProjects,
    setMinProjects: setChatMinProjects
  } = useTalentChat({
    setSelectedRoles: (roles: string[]) => {
      console.log("Roles received in TalentSearch:", roles);
      // No direct roles in V4, but could map to skills or specialties if needed
    },
    setSelectedIndustries: updateSelectedIndustries,
    setSelectedSpecialties: updateSelectedSpecialties,
    setMinExperience,
    setMinScore,
    setMinProjects,
    setSortOrder,
    setResultCount,
    
    // Current filter states for feedback
    selectedRoles: [],
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
    stopRecording,
    isSupported
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
  };

  // Toggle voice recording with actual speech recognition
  const toggleVoiceRecording = () => {
    if (!isSupported) {
      setShowSpeechAlert(true);
      return;
    }
    
    console.log("Toggle voice recording, current state:", isRecording);
    if (isRecording) {
      console.log("Stopping recording");
      stopRecording();
    } else {
      console.log("Starting recording");
      startRecording();
    }
  };

  // Reset all filters and chat
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
    
    // Reset chat
    setChatHistory([]);
    setChatQuery("");
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
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
      case "score":
        return (b.score || 0) - (a.score || 0);
      case "experience":
        return b.yearsOfExperience - a.yearsOfExperience;
      case "projects":
        return (b.projects?.length || 0) - (a.projects?.length || 0);
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
      <TitleBar 
        breadcrumbs={[
          { label: "Talent Search", href: "/index" }
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
            <div className="flex items-center gap-3">
              <SimpleStrategySelector className="w-48" />
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
          {/* Left sidebar - conditionally show filters or chat */}
          {showFilters && (
            <div className="md:col-span-1">
              {searchMode === "filters" ? (
                <FilterSidebar 
                  searchMode={searchMode}
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
                  setSearchMode={setSearchMode}
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
                  setSortOrder={setSortOrder}
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
                  minScore={minScore}
                  setMinScore={setMinScore}
                  minProjects={minProjects}
                  setMinProjects={setMinProjects}
                  showStarredOnly={showStarredOnly}
                  setShowStarredOnly={setShowStarredOnly}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              )}
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
                  <TalentCardV5
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
      
      {/* Speech recognition alert */}
      <SpeechRecognitionAlert 
        open={showSpeechAlert} 
        onClose={() => setShowSpeechAlert(false)} 
        isSupported={isSupported}
      />
    </div>
  );
};

export default TalentSearch;
