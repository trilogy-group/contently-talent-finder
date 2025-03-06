
import { FilterSelect } from "./filters/FilterSelect";
import { TagInput } from "./filters/TagInput";
import { filterOptions } from "./filters/filterOptions";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";

export interface Filters {
  status?: string[];
  format?: string[];
  assignee?: string[];
  dateRange?: { from: Date | undefined; to: Date | undefined };
  tags: string[];
  publication?: string[];
  campaign?: string[];
  pillars?: string[];
  audience?: string[];
  wordCount?: string[];
}

interface DocumentFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const DocumentFilters = ({ filters, onFilterChange }: DocumentFiltersProps) => {
  const handleFilterChange = (name: keyof Filters) => (value: string[]) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handlePublicationChange = (value: string[]) => {
    // Only take the last selected value for single select
    const singleValue = value.length > 0 ? [value[value.length - 1]] : [];
    onFilterChange({ ...filters, publication: singleValue });
  };

  const handleAddTag = (tag: string) => {
    onFilterChange({
      ...filters,
      tags: [...filters.tags, tag],
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFilterChange({
      ...filters,
      tags: filters.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    onFilterChange({
      ...filters,
      dateRange: range,
    });
  };

  const isBasicFiltersSelected = filters.dateRange?.from && 
                                filters.dateRange?.to && 
                                filters.publication && 
                                filters.publication.length > 0;

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <div className="mb-4">
          <DateRangePicker
            value={filters.dateRange}
            onChange={handleDateRangeChange}
          />
        </div>

        <FilterSelect
          value={filters.publication}
          placeholder="Publication"
          options={filterOptions.publication}
          onChange={handlePublicationChange}
          maxItems={1}
        />
      </div>

      <Separator className="my-4" />

      <div className={`space-y-4 ${!isBasicFiltersSelected ? 'opacity-50 pointer-events-none' : ''}`}>
        <FilterSelect
          value={filters.status}
          placeholder="Status"
          options={filterOptions.status}
          onChange={handleFilterChange("status")}
        />

        <FilterSelect
          value={filters.format}
          placeholder="Format"
          options={filterOptions.format}
          onChange={handleFilterChange("format")}
        />

        <FilterSelect
          value={filters.assignee}
          placeholder="Assigned To"
          options={filterOptions.assignee}
          onChange={handleFilterChange("assignee")}
        />

        <FilterSelect
          value={filters.pillars}
          placeholder="Content Pillars"
          options={filterOptions.pillars}
          onChange={handleFilterChange("pillars")}
        />

        <FilterSelect
          value={filters.audience}
          placeholder="Target Audience"
          options={filterOptions.audience}
          onChange={handleFilterChange("audience")}
        />

        <FilterSelect
          value={filters.wordCount}
          placeholder="Word Count"
          options={filterOptions.wordCount}
          onChange={handleFilterChange("wordCount")}
        />

        <FilterSelect
          value={filters.campaign}
          placeholder="Campaign"
          options={filterOptions.campaign}
          onChange={handleFilterChange("campaign")}
        />

        <TagInput
          tags={filters.tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
    </div>
  );
};
