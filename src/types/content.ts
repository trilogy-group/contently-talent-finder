export type ContentFormat = {
  id: string;
  content_pillar_id: string;
  story_format: string;
  subformat: string;
  story_count: number;
  frequency: string;
  estimated_pay_per_story: number;
};

export type ContentPlan = {
  id: string;
  name: string;
  planned_stories: ContentFormat[];
};

export type ContentPillar = {
  id: string;
  name: string;
  description: string;
  examples: string;
  seo_keywords_names: string[];
};

export type SeoKeyword = {
  id: string;
  keyword: string;
  searchResults: number;
  searchVolume: number;
  costPerClick: string;
};
