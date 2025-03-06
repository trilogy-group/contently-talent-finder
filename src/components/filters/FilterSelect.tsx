import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface FilterSelectProps {
  value?: string[];
  placeholder: string;
  options: readonly FilterOption[];
  onChange: (value: string[]) => void;
  maxItems?: number;
}

export const FilterSelect = ({ 
  value = [], 
  placeholder, 
  options, 
  onChange,
  maxItems 
}: FilterSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Use a ref to track mounting state
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleValueChange = React.useCallback((checked: boolean | "indeterminate", optionValue: string) => {
    if (!mounted.current) return;
    
    if (checked) {
      if (maxItems === 1) {
        onChange([optionValue]);
        setOpen(false);
      } else {
        onChange([...value, optionValue]);
      }
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  }, [value, onChange, maxItems]);

  const handleRemoveValue = React.useCallback((valueToRemove: string) => {
    if (!mounted.current) return;
    onChange(value.filter(v => v !== valueToRemove));
  }, [value, onChange]);

  const selectedLabels = value.map(v => 
    options.find(opt => opt.value === v)?.label || v
  );

  // Show/hide overlay when dropdown opens/closes
  React.useEffect(() => {
    const overlay = document.getElementById('dropdown-overlay');
    if (overlay) {
      if (open) {
        overlay.classList.remove('hidden');
      } else {
        overlay.classList.add('hidden');
      }
    }
    
    return () => {
      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
      }
    };
  }, [open]);

  // Check if scroll is needed
  React.useEffect(() => {
    if (!open || !dropdownRef.current) return;
    
    const checkForScrollability = () => {
      if (dropdownRef.current) {
        const { scrollHeight, clientHeight } = dropdownRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    // Initial check
    checkForScrollability();
    
    // Set up a resize observer to check when dimensions change
    const resizeObserver = new ResizeObserver(checkForScrollability);
    resizeObserver.observe(dropdownRef.current);
    
    return () => {
      if (dropdownRef.current) {
        resizeObserver.unobserve(dropdownRef.current);
      }
    };
  }, [open, options.length]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex min-h-[2.5rem] w-full items-start justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              open && "ring-2 ring-ring ring-offset-2"
            )}
          >
            <div className="flex flex-wrap gap-1 items-start flex-1 py-0.5">
              {selectedLabels.length === 0 ? (
                <span className="text-muted-foreground py-0.5">{placeholder}</span>
              ) : (
                selectedLabels.map((label) => (
                  <Badge 
                    key={label} 
                    variant="secondary"
                    className="flex items-center gap-1 my-0.5 bg-[#FEC6A1] text-orange-800 hover:bg-[#F97316] hover:text-white"
                  >
                    {label}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const optionToRemove = options.find(opt => opt.label === label);
                        if (optionToRemove) {
                          handleRemoveValue(optionToRemove.value);
                        }
                      }}
                      className="focus:outline-none cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          const optionToRemove = options.find(opt => opt.label === label);
                          if (optionToRemove) {
                            handleRemoveValue(optionToRemove.value);
                          }
                        }
                      }}
                    >
                      <X className="h-3 w-3 cursor-pointer hover:text-white" />
                    </span>
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 mt-1.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-[9999]" 
          align="center"
          side="bottom"
          sideOffset={4}
        >
          <div className="relative">
            <div 
              ref={dropdownRef}
              className="max-h-[200px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              onScroll={(e) => {
                const target = e.currentTarget;
                setShowScrollIndicator(
                  target.scrollHeight > target.clientHeight && 
                  target.scrollHeight - target.scrollTop > target.clientHeight + 10
                );
              }}
            >
              <div className="p-2 space-y-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-sm"
                  >
                    <Checkbox
                      id={option.value}
                      checked={value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        handleValueChange(checked, option.value);
                      }}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll indicator - now right-justified */}
            {showScrollIndicator && (
              <div className="absolute bottom-0 right-2 bg-white border border-gray-100 rounded-full shadow-sm p-1 animate-pulse z-10">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
