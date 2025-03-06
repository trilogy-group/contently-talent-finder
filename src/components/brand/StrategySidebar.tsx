import { Button } from "@/components/ui/button";
import { ReactNode, useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type StrategyTab = {
  id: string;
  title: string;
  icon: ReactNode;
};

interface StrategySidebarProps {
  activeTab: string;
  sidebarOpen: boolean;
  tabs: StrategyTab[];
  onTabChange: (tabId: string) => void;
  onToggleSidebar: () => void;
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

export const StrategySidebar = ({
  activeTab,
  sidebarOpen,
  tabs,
  onTabChange,
  onToggleSidebar,
  selectedStrategy,
  onStrategyChange,
}: StrategySidebarProps) => {
  const [strategies, setStrategies] = useState<string[]>([]);
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
    
    if (savedSelectedStrategy) {
      onStrategyChange(savedSelectedStrategy);
    } else {
      // Default to "all" if no strategy is selected
      onStrategyChange("all");
      localStorage.setItem('selectedContentStrategy', "all");
    }
  }, [onStrategyChange]);

  // Save to localStorage whenever strategies or selectedStrategy changes
  useEffect(() => {
    if (strategies.length > 0) {
      localStorage.setItem('contentStrategies', JSON.stringify(strategies));
    }
  }, [strategies]);

  const handleAddStrategy = () => {
    if (newStrategyName.trim()) {
      const updatedStrategies = [...strategies, newStrategyName.trim()];
      setStrategies(updatedStrategies);
      onStrategyChange(newStrategyName.trim());
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
      onStrategyChange(updatedStrategies[0]);
    }
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
        sidebarOpen ? "w-1/5" : "w-16"
      }`}
    >
      {dropdownOpen && (
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none">
          {/* This is the overlay that grays out the sidebar */}
        </div>
      )}
      <div className="flex justify-between items-center p-2 border-b border-gray-200 relative z-20 bg-orange-100">
        {sidebarOpen && (
          <DropdownMenu onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center gap-1 text-sm hover:bg-orange-200 ${dropdownOpen ? 'bg-orange-200' : ''}`}
              >
                {selectedStrategy === "all" ? "All Strategies" : selectedStrategy}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 z-50">
              <DropdownMenuItem 
                onClick={() => onStrategyChange("all")}
                className={`${selectedStrategy === "all" ? "bg-slate-100" : ""} flex justify-between items-center`}
              >
                <span>All Strategies</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {strategies.map((strategy) => (
                <DropdownMenuItem 
                  key={strategy} 
                  onClick={() => onStrategyChange(strategy)}
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
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="relative z-20"
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>
      <div className="py-4 relative z-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center w-full p-3 mb-1 hover:bg-slate-100 transition-colors ${
              activeTab === tab.id ? "bg-slate-100 text-brand-primary font-medium" : ""
            }`}
          >
            <span className="flex-shrink-0">{tab.icon}</span>
            {sidebarOpen && <span className="ml-3">{tab.title}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
