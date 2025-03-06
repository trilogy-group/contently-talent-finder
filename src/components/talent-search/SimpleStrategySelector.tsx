import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface SimpleStrategySelectorProps {
  className?: string;
}

export const SimpleStrategySelector: React.FC<SimpleStrategySelectorProps> = ({ className }) => {
  const [strategies, setStrategies] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load strategies from localStorage on component mount
  useEffect(() => {
    // Initialize with default strategies if none exist
    const defaultStrategies = ["Default Strategy", "Q1 2023 Strategy", "Q2 2023 Strategy"];
    const savedStrategies = localStorage.getItem('contentStrategies');
    const savedSelectedStrategy = localStorage.getItem('selectedContentStrategy');
    
    if (savedStrategies) {
      setStrategies(JSON.parse(savedStrategies));
    } else {
      setStrategies(defaultStrategies);
      localStorage.setItem('contentStrategies', JSON.stringify(defaultStrategies));
    }
    
    if (savedSelectedStrategy && savedSelectedStrategy !== "all") {
      setSelectedStrategy(savedSelectedStrategy);
    } else if (strategies.length > 0) {
      // Default to first strategy if no valid strategy is selected
      setSelectedStrategy(strategies[0]);
      localStorage.setItem('selectedContentStrategy', strategies[0]);
    }
  }, []);

  // Save to localStorage when selectedStrategy changes
  useEffect(() => {
    if (selectedStrategy) {
      localStorage.setItem('selectedContentStrategy', selectedStrategy);
    }
  }, [selectedStrategy]);

  return (
    <div className={className}>
      <DropdownMenu onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center justify-between gap-1 text-sm w-full h-9 ${dropdownOpen ? 'border-orange-500' : ''}`}
          >
            {selectedStrategy || "Select Strategy"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full z-50">
          {strategies.length > 0 ? (
            strategies.map((strategy) => (
              <DropdownMenuItem 
                key={strategy} 
                onClick={() => setSelectedStrategy(strategy)}
                className={`${selectedStrategy === strategy ? "bg-slate-100" : ""} flex justify-between items-center`}
              >
                <span>{strategy}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              <span className="text-gray-400">No strategies available</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
