export type ContentFormat = {
  id: string;
  format: string;
  subFormat: string;
  quantity: number;
  frequency: string;
  price: number;
};

export type ContentPlan = {
  id: string;
  name: string;
  contentFormats: ContentFormat[];
};

export type ContentPillar = {
  id: string;
  name: string;
  description: string;
  headlines: string;
  keywords: string[];
};

export type SeoKeyword = {
  id: string;
  keyword: string;
  searchResults: number;
  searchVolume: number;
  costPerClick: string;
};
