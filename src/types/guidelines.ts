
export interface Category {
  name: string;
  rules: string[];
}

export interface GuidelineFormData {
  title: string;
  description: string;
  contentType: string;
  publication: string;
  audience: string;
  status: "active" | "draft";
  categories: {
    tone: Category;
    style: Category;
    terminology: Category;
  };
}

export interface GuidelineProps {
  mode: "create" | "edit";
  initialData?: GuidelineFormData;
  onSave?: (data: GuidelineFormData) => void;
}

export type CategoryType = "tone" | "style" | "terminology" | "contentType" | "publication" | "audience";

