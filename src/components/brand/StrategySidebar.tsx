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
import { Select } from '@/components/ui/select';
import { contentStrategyApi } from "@/utils/api";
import { FilterSelect } from "@/components/filters/FilterSelect";

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
  selectedPublication: string;
  onPublicationChange: (publicationId: string) => void;
}

export const StrategySidebar = ({
  activeTab,
  sidebarOpen,
  tabs,
  onTabChange,
  onToggleSidebar,
  selectedStrategy,
  onStrategyChange,
  selectedPublication,
  onPublicationChange,
}: StrategySidebarProps) => {
  const [strategies, setStrategies] = useState<string[]>([]);
  const [newStrategyName, setNewStrategyName] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [publications, setPublications] = useState<Array<{ value: string, label: string }>>([]);

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

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await contentStrategyApi.getPublications();
        setPublications(data.brandProfiles || []);
        
        // Only set default if no publication is selected and we haven't set one before
        if (!selectedPublication && data.brandProfiles?.length && !localStorage.getItem('selectedPublication')) {
          const defaultPub = data.brandProfiles.find((p: any) => p.value === '1230') || data.brandProfiles[0];
          onPublicationChange(defaultPub.value);
          localStorage.setItem('selectedPublication', defaultPub.value);
        }
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    };

    fetchPublications();
  }, []);

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
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
      sidebarOpen ? "w-1/5" : "w-16"
    }`}>
      <div className="p-4 border-b border-gray-200 bg-white">
        <FilterSelect
          value={selectedPublication ? [selectedPublication] : []}
          onChange={(value) => onPublicationChange(value[0])}
          options={publications}
          placeholder="Select Publication"
          maxItems={1}
        />
      </div>

      <div className="absolute right-0 top-4 transform translate-x-1/2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="relative bg-white"
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>

      <div className="py-4">
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
