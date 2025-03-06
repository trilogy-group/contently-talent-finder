import { SlidersHorizontal, MessageSquare, Mic, Send, RotateCw, Settings, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState, RefObject } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChatSidebarProps {
  searchMode: "filters" | "chat";
  chatQuery: string;
  chatHistory: { role: "user" | "assistant"; content: string }[];
  isRecording: boolean;
  interimTranscript?: string;
  setSearchMode: (mode: "filters" | "chat") => void;
  setChatQuery: (query: string) => void;
  handleSendChat: () => void;
  toggleVoiceRecording: () => void;
  resetAll: () => void;
  resultCount?: number;
  setResultCount?: (count: number) => void;
  minExperience: number | null;
  setMinExperience: (experience: number | null) => void;
  sortOrder?: string;
  setSortOrder?: (order: string) => void;
  showStarredOnly?: boolean;
  setShowStarredOnly?: (show: boolean) => void;
  minScore?: number;
  setMinScore?: (score: number | null) => void;
  minProjects?: number;
  setMinProjects?: (projects: number | null) => void;
  appliedFilters?: string[];
  micButtonRef?: RefObject<HTMLButtonElement>;
}

export const ChatSidebar = ({
  searchMode,
  chatQuery,
  chatHistory,
  isRecording,
  interimTranscript = "",
  setSearchMode,
  setChatQuery,
  handleSendChat,
  toggleVoiceRecording,
  resetAll,
  resultCount = 10,
  setResultCount = () => {},
  minExperience,
  setMinExperience,
  sortOrder,
  setSortOrder = () => {},
  showStarredOnly = false,
  setShowStarredOnly = () => {},
  minScore,
  setMinScore = () => {},
  minProjects,
  setMinProjects = () => {},
  appliedFilters = [],
  micButtonRef,
}: ChatSidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [experienceValue, setExperienceValue] = useState<number>(
    minExperience || 0
  );
  const [scoreValue, setScoreValue] = useState<number>(minScore || 0);
  const [projectsValue, setProjectsValue] = useState<number>(minProjects || 0);
  const [showSettings, setShowSettings] = useState(false);
  const micButtonRefLocal = useRef<HTMLButtonElement>(null);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

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
                    } else if (searchMode === "chat") {
                      // Reset chat
                      setChatQuery("");
                      // Clear chat history by calling resetAll
                      resetAll();
                    } else {
                      // Reset filters is handled by the parent component
                      resetAll();
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
                    variant={searchMode === "chat" && !showSettings ? "default" : "outline"}
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSearchMode("chat");
                      setShowSettings(false);
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
          </div>
        </TooltipProvider>
      </div>

      <div className="flex-grow flex flex-col h-full">
        {showSettings ? (
          <div className="flex-grow p-6 overflow-y-auto">
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
                    <RadioGroupItem value="relevance" id="chat-relevance" />
                    <Label htmlFor="chat-relevance">Relevance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="score" id="chat-score" />
                    <Label htmlFor="chat-score">Score</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experience" id="chat-experience" />
                    <Label htmlFor="chat-experience">Experience</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="projects" id="chat-projects" />
                    <Label htmlFor="chat-projects">Projects</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat history */}
            <div className="flex-1 overflow-auto p-4 relative">
              {/* Coming Soon Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-4xl font-bold text-gray-200 opacity-50 transform -rotate-12">
                  Coming Soon
                </div>
              </div>
              
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 p-4">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {chatHistory.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        message.role === "user" 
                          ? "bg-brand-primary text-white ml-8" 
                          : "bg-gray-100 text-gray-800 mr-8"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Show applied filters badge if this is an assistant message with filters */}
                      {message.role === "assistant" && message.content.includes("I've updated the following filters") && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-semibold">Filters applied</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Empty div for scrolling to bottom */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 flex-shrink-0 opacity-50 cursor-not-allowed"
                        aria-label="Start voice recording"
                        ref={micButtonRefLocal}
                        tabIndex={-1}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start voice recording</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="Ask about talent needs..."
                  className="border-gray-200"
                  disabled={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendChat} 
                  className="h-10 w-10 flex-shrink-0"
                  disabled={true}
                  aria-label="Send message"
                  title="Chat functionality is temporarily disabled"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              {isRecording && interimTranscript && (
                <p className="mt-2 text-sm text-gray-500 italic">
                  {interimTranscript}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
