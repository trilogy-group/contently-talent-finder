import { useState } from "react";
import { industryOptions, specialtyOptions } from "@/data/mock-talent-profiles";

interface UseTalentChatProps {
  setSelectedRoles: (roles: string[]) => void;
  setSelectedIndustries: (industries: string[]) => void;
  setSelectedSpecialties: (specialties: string[]) => void;
  setMinExperience: (experience: number | null) => void;
  setMinScore: (score: number | null) => void;
  setMinProjects: (projects: number | null) => void;
  setSortOrder: (order: "relevance" | "experience" | "name") => void;
  setResultCount: (count: number) => void;
  
  // Current filter states for feedback
  selectedRoles: string[];
  selectedIndustries: string[];
  selectedSpecialties: string[];
}

// Helper function to convert word numbers to digits
const wordToNumber = (word: string): number | null => {
  const wordMap: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 
    'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
  };
  
  return wordMap[word.toLowerCase()] ?? null;
};

// Helper to extract numeric values from text, including word forms
const extractNumber = (text: string): number | null => {
  // Try to match a numeric value
  const numericMatch = text.match(/(\d+)/);
  if (numericMatch && numericMatch[1]) {
    return parseInt(numericMatch[1]);
  }
  
  // Try to match word numbers
  const wordNumberPattern = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i;
  const wordMatch = text.match(wordNumberPattern);
  if (wordMatch && wordMatch[1]) {
    return wordToNumber(wordMatch[1]);
  }
  
  return null;
};

const INDUSTRIES = industryOptions.map(option => option.value);
const SKILLS = specialtyOptions.map(option => option.value);

export const useTalentChat = ({
  setSelectedRoles,
  setSelectedIndustries,
  setSelectedSpecialties,
  setMinExperience,
  setMinScore,
  setMinProjects,
  setSortOrder,
  setResultCount,
  
  // Current filter states
  selectedRoles = [],
  selectedIndustries = [],
  selectedSpecialties = []
}: UseTalentChatProps) => {
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "assistant", content: string, id: string, timestamp: string}[]>([]);
  
  // Track which filters were updated for feedback
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  
  // Add state for the filter values
  const [sortOrder, setSortOrderState] = useState<"relevance" | "experience" | "name">("relevance");
  const [minScore, setMinScoreState] = useState<number | null>(null);
  const [minProjects, setMinProjectsState] = useState<number | null>(null);
  
  // Wrapper functions to update both local state and parent state
  const updateSortOrder = (order: "relevance" | "experience" | "name") => {
    setSortOrderState(order);
    setSortOrder(order);
  };
  
  const updateMinScore = (score: number | null) => {
    setMinScoreState(score);
    setMinScore(score);
  };
  
  const updateMinProjects = (projects: number | null) => {
    setMinProjectsState(projects);
    setMinProjects(projects);
  };

  const updateSelectedIndustries = (industries: string[]) => {
    setSelectedIndustries(industries);
  };

  const updateSelectedSkills = (skills: string[]) => {
    setSelectedSpecialties(skills);
  };

  // Process a chat message and extract filter information
  const processChat = (messageText: string) => {
    // Add message to chat history
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setChatQuery("");
    
    // Log the message for debugging
    console.log("Processing chat message:", messageText);
    
    // Process the message to extract filter information
    // This is a simplified implementation - in a real app, you would use NLP or AI
    const messageTextLower = messageText.toLowerCase();
    
    // Extract industries
    const industries: string[] = [];
    INDUSTRIES.forEach(industry => {
      if (messageTextLower.includes(industry.toLowerCase())) {
        industries.push(industry);
      }
    });
    
    // Extract skills/specialties
    const skills: string[] = [];
    SKILLS.forEach(skill => {
      if (messageTextLower.includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    // Look for experience indicators
    let newMinScore = minScore;
    if (messageTextLower.includes("expert") || messageTextLower.includes("senior")) {
      newMinScore = 8;
    } else if (messageTextLower.includes("experienced") || messageTextLower.includes("mid-level")) {
      newMinScore = 6;
    } else if (messageTextLower.includes("junior") || messageTextLower.includes("beginner")) {
      newMinScore = 4;
    }
    
    // Update filters if we found any matches
    const filtersUpdated = industries.length > 0 || skills.length > 0 || newMinScore !== minScore;
    
    if (industries.length > 0) {
      updateSelectedIndustries(industries);
    }
    
    if (skills.length > 0) {
      updateSelectedSkills(skills);
    }
    
    if (newMinScore !== minScore) {
      updateMinScore(newMinScore);
    }
    
    // Simulate a response after a short delay
    setTimeout(() => {
      let responseContent = "";
      
      if (filtersUpdated) {
        responseContent = `I've updated the following filters based on your request:\n`;
        
        if (industries.length > 0) {
          responseContent += `\n• Industries: ${industries.join(", ")}`;
        }
        
        if (skills.length > 0) {
          responseContent += `\n• Skills: ${skills.join(", ")}`;
        }
        
        if (newMinScore !== minScore) {
          responseContent += `\n• Minimum score: ${newMinScore}`;
        }
        
        responseContent += `\n\nIs there anything else you'd like to specify?`;
      } else {
        responseContent = "I couldn't identify specific filters from your message. Could you be more specific about the industries, skills, or experience level you're looking for?";
      }
      
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, responseMessage]);
    }, 500);
  };

  return {
    chatQuery,
    setChatQuery,
    chatHistory,
    setChatHistory,
    processChat,
    appliedFilters,
    sortOrder,
    setSortOrder: updateSortOrder,
    minScore,
    setMinScore: updateMinScore,
    minProjects,
    setMinProjects: updateMinProjects
  };
};
