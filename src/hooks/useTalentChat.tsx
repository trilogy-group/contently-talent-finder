import { useState, useEffect } from "react";

interface FilterOption {
  id: string | number;
  label: string;
  value?: string;
}

interface UseTalentChatProps {
  setSelectedRoles: (roles: string[]) => void;
  setSelectedIndustries: (industries: string[]) => void;
  setSelectedSpecialties: (specialties: string[]) => void;
  setMinExperience: (experience: number | null) => void;
  setMinScore: (score: number | null) => void;
  setMinProjects: (projects: number | null) => void;
  setSortOrder: (order: string) => void;
  setResultCount: (count: number) => void;
  setContentExamples?: (urls: string[]) => void;
  setSelectedLanguage?: (language: string | null) => void;
  setSelectedPublication?: (publication: string | null) => void;
  
  // Current filter states for feedback
  selectedRoles: string[];
  selectedIndustries: string[];
  selectedSpecialties: string[];
  selectedLanguage?: string | null;
  selectedPublication?: string | null;
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

const TALENT_API_URL = 'https://9w2hge8i7d.execute-api.us-east-1.amazonaws.com/prod';

export const useTalentChat = ({
  setSelectedRoles,
  setSelectedIndustries,
  setSelectedSpecialties,
  setMinExperience,
  setMinScore,
  setMinProjects,
  setSortOrder,
  setResultCount,
  setContentExamples = () => {},
  setSelectedLanguage = () => {},
  setSelectedPublication = () => {},
  
  // Current filter states
  selectedRoles = [],
  selectedIndustries = [],
  selectedSpecialties = [],
  selectedLanguage = null,
  selectedPublication = null
}: UseTalentChatProps) => {
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "assistant", content: string, id: string, timestamp: string}[]>([]);
  
  // Track which filters were updated for feedback
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  
  // Add state for the filter values
  const [sortOrder, setSortOrderState] = useState<string>("relevance");
  const [minScore, setMinScoreState] = useState<number | null>(null);
  const [minProjects, setMinProjectsState] = useState<number | null>(null);
  
  // Add state for filter options
  const [formatOptions, setFormatOptions] = useState<FilterOption[]>([]);
  const [topicOptions, setTopicOptions] = useState<FilterOption[]>([]);
  const [skillOptions, setSkillOptions] = useState<FilterOption[]>([]);

  // Add state for language options
  const [languageOptions, setLanguageOptions] = useState<FilterOption[]>([]);

  // Add state for publication options
  const [publicationOptions, setPublicationOptions] = useState<FilterOption[]>([]);

  // Fetch options when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${TALENT_API_URL}/options`);
        const data = await response.json();
        
        setFormatOptions(data.storyFormats);
        setTopicOptions(data.topics);
        setSkillOptions(data.skills);
        setLanguageOptions(data.languages);
        setPublicationOptions(data.brandProfiles);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  // Wrapper functions to update both local state and parent state
  const updateSortOrder = (order: string) => {
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
    setSelectedRoles(skills);
  };

  // Add this function alongside the other update functions
  const updateSelectedSpecialties = (specialties: string[]) => {
    setSelectedSpecialties(specialties);
  };

  // Process a chat message and extract filter information
  const processChat = (messageText: string) => {
    // Add message to chat history
    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setChatQuery("");
    
    // Log the message for debugging
    console.log("Processing chat message:", messageText);
    
    const messageTextLower = messageText.toLowerCase();

    // Extract URLs from the message
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const contentUrls = messageText.match(urlPattern) || [];

    // Extract industries/formats
    const formats = formatOptions.filter(format => 
      messageTextLower.includes(format.label.toLowerCase())
    );

    // Extract topics
    const topics = topicOptions.filter(topic => 
      messageTextLower.includes(topic.label.toLowerCase())
    );

    // Extract skills
    const skills = skillOptions.filter(skill => 
      messageTextLower.includes(skill.label.toLowerCase())
    );
    
    // Look for experience indicators
    let newMinScore = minScore;
    if (messageTextLower.includes("expert") || messageTextLower.includes("senior")) {
      newMinScore = 8;
    } else if (messageTextLower.includes("experienced") || messageTextLower.includes("mid-level")) {
      newMinScore = 6;
    } else if (messageTextLower.includes("junior") || messageTextLower.includes("beginner")) {
      newMinScore = 4;
    }
    
    // Extract language from the message
    const languages = languageOptions.filter(language => 
      messageTextLower.includes(language.label.toLowerCase())
    );
    
    // Extract publication from the message
    const publications = publicationOptions.filter(publication => 
      messageTextLower.includes(publication.label.toLowerCase())
    );
    
    // Update filters if we found any matches
    const filtersUpdated = formats.length > 0 || topics.length > 0 || skills.length > 0 || 
                          newMinScore !== minScore || contentUrls.length > 0 ||
                          languages.length > 0 || publications.length > 0;
    
    if (formats.length > 0) {
      updateSelectedIndustries(formats.map(f => f.value));
    }
    
    if (topics.length > 0) {
      updateSelectedSpecialties(topics.map(t => t.value));
    }
    
    if (skills.length > 0) {
      updateSelectedSkills(skills.map(s => s.value));
    }
    
    if (contentUrls.length > 0) {
      setContentExamples(contentUrls);
    }
    
    if (newMinScore !== minScore) {
      updateMinScore(newMinScore);
    }
    
    if (languages.length > 0) {
      setSelectedLanguage(languages[0].value);
    }
    
    if (publications.length > 0) {
      setSelectedPublication(publications[0].value);
    }
    
    // Simulate a response after a short delay
    setTimeout(() => {
      let responseContent = "";
      
      if (filtersUpdated) {
        responseContent = `I've updated the following filters based on your request:\n`;
        
        if (formats.length > 0) {
          responseContent += `\n• Format: ${formats.map(f => f.label).join(", ")}`;
        }
        
        if (topics.length > 0) {
          responseContent += `\n• Topics: ${topics.map(t => t.label).join(", ")}`;
        }
        
        if (skills.length > 0) {
          responseContent += `\n• Skills: ${skills.map(s => s.label).join(", ")}`;
        }

        if (contentUrls.length > 0) {
          responseContent += `\n• Content Examples: ${contentUrls.length} URL${contentUrls.length > 1 ? 's' : ''} added`;
        }
        
        if (newMinScore !== minScore) {
          responseContent += `\n• Minimum score: ${newMinScore}`;
        }
        
        if (languages.length > 0) {
          responseContent += `\n• Language: ${languages[0].label}`;
        }
        
        if (publications.length > 0) {
          responseContent += `\n• Publication: ${publications[0].label}`;
        }
        
        responseContent += `\n\nIs there anything else you'd like to specify?`;
      } else {
        responseContent = "I couldn't identify specific filters from your message. Could you be more specific about the format, topics, skills, publication, language, or experience level you're looking for? You can also share example content URLs.";
      }
      
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
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
