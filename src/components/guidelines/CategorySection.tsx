
import { Label } from "@/components/ui/label";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { CategoryType } from "@/types/guidelines";

interface CategorySectionProps {
  contentTypes: string[];
  publications: string[];
  audiences: string[];
  formData: {
    contentType: string;
    publication: string;
    audience: string;
  };
  dropdownStates: {
    contentType: boolean;
    publication: boolean;
    audience: boolean;
  };
  setDropdownStates: (states: any) => void;
  setFormData: (data: any) => void;
  newCategory: {
    contentType: string;
    publication: string;
    audience: string;
  };
  setNewCategory: (category: any) => void;
  handleAddNewCategory: (type: CategoryType, value: string) => void;
  handleDeleteCategory: (type: CategoryType, value: string) => void;
}

export function CategorySection({
  contentTypes,
  publications,
  audiences,
  formData,
  setFormData,
}: CategorySectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="contentType">Content Type</Label>
        <FilterSelect
          value={formData.contentType ? [formData.contentType] : []}
          placeholder="Select type"
          options={contentTypes.map(type => ({ value: type, label: type }))}
          onChange={(values) => {
            setFormData(prev => ({ ...prev, contentType: values[0] || "" }));
          }}
          maxItems={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="publication">Publication</Label>
        <FilterSelect
          value={formData.publication ? [formData.publication] : []}
          placeholder="Select publication"
          options={publications.map(pub => ({ value: pub, label: pub }))}
          onChange={(values) => {
            setFormData(prev => ({ ...prev, publication: values[0] || "" }));
          }}
          maxItems={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Audience</Label>
        <FilterSelect
          value={formData.audience ? [formData.audience] : []}
          placeholder="Select audience"
          options={audiences.map(audience => ({ value: audience, label: audience }))}
          onChange={(values) => {
            setFormData(prev => ({ ...prev, audience: values[0] || "" }));
          }}
          maxItems={1}
        />
      </div>
    </div>
  );
}
