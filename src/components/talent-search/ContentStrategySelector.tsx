import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContentStrategySelectorProps {
  className?: string;
  showLabel?: boolean;
}

export const ContentStrategySelector: React.FC<ContentStrategySelectorProps> = ({ 
  className,
  showLabel = false
}) => {
  const [strategies, setStrategies] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [newStrategyName, setNewStrategyName] = useState<string>("");
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

  // Save to localStorage whenever strategies or selectedStrategy changes
  useEffect(() => {
    if (strategies.length > 0) {
      localStorage.setItem('contentStrategies', JSON.stringify(strategies));
    }
  }, [strategies]);

  useEffect(() => {
    if (selectedStrategy) {
      localStorage.setItem('selectedContentStrategy', selectedStrategy);
    }
  }, [selectedStrategy]);

  const handleAddStrategy = () => {
    if (newStrategyName.trim()) {
      const updatedStrategies = [...strategies, newStrategyName.trim()];
      setStrategies(updatedStrategies);
      setSelectedStrategy(newStrategyName.trim());
      setNewStrategyName("");
    }
  };

  const handleDeleteStrategy = (strategy: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (strategies.length <= 1) {
      return; // Don't allow deleting the last strategy
    }
    
    const updatedStrategies = strategies.filter(s => s !== strategy);
    setStrategies(updatedStrategies);
    
    // If the deleted strategy was selected, select the first available strategy
    if (selectedStrategy === strategy) {
      setSelectedStrategy(updatedStrategies[0]);
    }
  };

  return (
    <div className={`${showLabel ? 'space-y-2' : ''} ${className}`}>
      {showLabel && <label className="text-sm font-medium">Strategy</label>}
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
            <>
              {strategies.map((strategy) => (
                <DropdownMenuItem 
                  key={strategy} 
                  onClick={() => setSelectedStrategy(strategy)}
                  className={`${selectedStrategy === strategy ? "bg-slate-100" : ""} flex justify-between items-center`}
                >
                  <span>{strategy}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStrategy(strategy, e);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <div className="p-2">
                <Input
                  placeholder="Add new strategy..."
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddStrategy();
                    }
                  }}
                  className="text-sm"
                />
              </div>
            </>
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
