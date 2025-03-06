
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { CategoryType } from "@/types/guidelines";
import { Card } from "@/components/ui/card";

interface GuidelineRulesProps {
  activeCategory: CategoryType;
  rules: string[];
  onAddRule: () => void;
  onRemoveRule: (index: number) => void;
  onUpdateRule: (index: number, value: string) => void;
  onMoveRule: (fromIndex: number, direction: 'up' | 'down') => void;
}

export function GuidelineRules({
  activeCategory,
  rules,
  onAddRule,
  onRemoveRule,
  onUpdateRule,
  onMoveRule
}: GuidelineRulesProps) {
  // Ensure at least 3 rows by padding with empty strings
  const displayRules = rules.length < 3 ? [...rules, ...Array(3 - rules.length).fill("")] : rules;

  return (
    <div className="space-y-2 pt-4 border-t">
      {displayRules.map((rule, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Card className="flex-1 p-0 overflow-hidden">
            <Input
              value={rule}
              onChange={(e) => onUpdateRule(index, e.target.value)}
              placeholder={`Enter ${activeCategory} guideline`}
              className="border-0 rounded-none focus-visible:ring-0 px-3 text-left"
            />
          </Card>
          <div className="flex-shrink-0 space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveRule(index, 'up')}
              disabled={index === 0 || !rule.trim()}
              className="h-8 w-8 hover:bg-slate-100"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveRule(index, 'down')}
              disabled={index === displayRules.length - 1 || !rule.trim()}
              className="h-8 w-8 hover:bg-slate-100"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveRule(index)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button
        variant="ghost"
        className="w-full justify-center text-muted-foreground"
        onClick={onAddRule}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add rule
      </Button>
    </div>
  );
}
