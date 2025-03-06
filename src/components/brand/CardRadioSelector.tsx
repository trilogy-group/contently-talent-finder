
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReactNode } from "react";

type CardRadioOption = {
  value: string;
  label: string;
  icon: ReactNode;
};

interface CardRadioSelectorProps {
  name: string;
  value: string;
  options: CardRadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  variant?: "primary" | "orange";
  className?: string;
}

export const CardRadioSelector = ({
  name,
  value,
  options,
  onChange,
  disabled = false,
  variant = "primary",
  className = "",
}: CardRadioSelectorProps) => {
  const getVariantClasses = (isSelected: boolean) => {
    if (variant === "orange") {
      return isSelected 
        ? "border-orange-500 bg-orange-100" 
        : "border-gray-200 hover:border-orange-300";
    }
    return isSelected 
      ? "border-brand-primary bg-brand-accent" 
      : "border-gray-200 hover:border-gray-300";
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={`grid grid-cols-2 gap-4 ${className}`}
      disabled={disabled}
    >
      {options.map((option) => (
        <Label
          key={option.value}
          htmlFor={`${name}-${option.value}`}
          className="cursor-pointer text-center m-0 p-0"
        >
          <div
            className={`relative flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
              getVariantClasses(value === option.value)
            }`}
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="sr-only"
            />
            {option.icon}
            <span className="block font-medium ml-2">{option.label}</span>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
};
