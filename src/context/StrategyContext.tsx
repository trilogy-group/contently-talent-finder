import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for our strategy data
interface Strategy {
  id: string;
  title: string;
  description: string;
}

interface StrategyContextType {
  strategies: Strategy[];
  selectedStrategy: string;
  setSelectedStrategy: (id: string) => void;
}

// Create the context
const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

// Create a provider component
export const StrategyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("all");

  // Load strategies from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('brandCompassData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Create strategy objects from the saved data
        const loadedStrategies: Strategy[] = [
          {
            id: 'goals',
            title: 'Strategic Goals',
            description: 'Define clear objectives and KPIs for your content strategy.'
          },
          {
            id: 'audiences',
            title: 'Target Audiences',
            description: 'Define audience demographics for targeted, effective content creation.'
          },
          {
            id: 'voice',
            title: 'Voice and Style',
            description: 'Define your brand\'s tone, voice, and writing style guidelines.'
          },
          {
            id: 'pillars',
            title: 'Content Pillars',
            description: 'Establish the main themes and topics that support your strategy.'
          },
          {
            id: 'plan',
            title: 'Content Plan',
            description: 'Create a comprehensive content calendar and production schedule.'
          },
          {
            id: 'distribution',
            title: 'Distribution',
            description: 'Plan your content distribution across different channels.'
          },
          {
            id: 'seo',
            title: 'SEO Keywords',
            description: 'Research and target strategic keywords for your content.'
          }
        ];
        
        setStrategies(loadedStrategies);
      }
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  }, []);

  return (
    <StrategyContext.Provider value={{ strategies, selectedStrategy, setSelectedStrategy }}>
      {children}
    </StrategyContext.Provider>
  );
};

// Create a hook to use the strategy context
export const useStrategy = () => {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error('useStrategy must be used within a StrategyProvider');
  }
  return context;
};
