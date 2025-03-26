export interface ContentStrategy {
  mission?: string;
  goal?: string;
  goals_additional_materials?: string;
  organization_type?: string;
  kpis?: string[];
  voice_description?: string;
  allows_first_person?: boolean;
  additional_materials?: string;
  notes?: string;
  blacklist?: string;
  tone?: {
    emotion?: number;
    authority?: number;
    inflection?: number;
    formality?: number;
    expressivity?: number;
  };
  channels?: string[];
  channel_priorities?: string[];
  websites?: string[];
}

export interface Audience {
  id?: number;
  name: string;
  description?: string;
  education_level?: string;
  min_age?: number;
  max_age?: number;
  gender?: string[];
  additional_materials?: string;
}

export interface Pillar {
  id?: number;
  name: string;
  description?: string;
  examples?: string;
  seo_keywords?: string;
  seo_keywords_names?: string[];
}

export interface SeoKeyword {
  id?: number;
  name: string;
} 