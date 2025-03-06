
import { Card } from "@/components/ui/card";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { CollapsibleContent } from "@/components/ui/collapsible";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  contentTypes: FilterOption[];
  publications: FilterOption[];
  audiences: FilterOption[];
  selectedType: string[];
  selectedPublication: string[];
  selectedAudience: string[];
  onTypeChange: (value: string[]) => void;
  onPublicationChange: (value: string[]) => void;
  onAudienceChange: (value: string[]) => void;
}

export function FilterBar({
  contentTypes,
  publications,
  audiences,
  selectedType,
  selectedPublication,
  selectedAudience,
  onTypeChange,
  onPublicationChange,
  onAudienceChange,
}: FilterBarProps) {
  return (
    <CollapsibleContent className="mb-8">
      <Card className="p-4 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 min-w-0">
            <FilterSelect
              placeholder="Content type"
              options={contentTypes}
              value={selectedType}
              onChange={onTypeChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <FilterSelect
              placeholder="Publication"
              options={publications}
              value={selectedPublication}
              onChange={onPublicationChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <FilterSelect
              placeholder="Audience"
              options={audiences}
              value={selectedAudience}
              onChange={onAudienceChange}
            />
          </div>
        </div>
      </Card>
    </CollapsibleContent>
  );
}
