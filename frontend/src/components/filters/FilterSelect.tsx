
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  readonly value: string | number;
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

  const handleValueChange = (checked: boolean | "indeterminate", optionValue: string) => {
    if (checked) {
      if (maxItems === 1) {
        // For single select, replace the current value
        onChange([optionValue]);
      } else {
        // For multi select, add to existing values
        onChange([...value, optionValue]);
      }
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove));
  };

  const selectedLabels = value.map(v => 
    options.find(opt => opt.value === v)?.label || v
  );

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
                    className="flex items-center gap-1 my-0.5"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const optionToRemove = options.find(opt => opt.label === label);
                        if (optionToRemove) {
                          handleRemoveValue(optionToRemove.value);
                        }
                      }}
                      className="focus:outline-none"
                    >
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 mt-1.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white max-h-[200px]"
          align="start"
          sideOffset={4}
        >
          <div className="h-full overflow-auto">
            <div className="p-4 space-y-1">
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
        </PopoverContent>
      </Popover>
    </div>
  );
};
