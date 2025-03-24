export interface TalentProfile {
  id: number;
  name: string;
  role: string;
  specialties: string[];
  experience: number;
  yearsOfExperience: number;
  rating: number;
  score?: number;
  completedProjects: number;
  industries: string[];
  skills: string[];
  bio: string;
  expandedBio?: string;
  sampleWritings?: {title: string, excerpt: string}[];
  imageUrl?: string;
  projects?: {title: string, description: string}[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface TalentData {
  id: number;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  location: string;
  languages: string[];
  skills: string[];
  topics: string[];
  clips: {
    id: number;
    title: string;
    url: string;
    publication: string;
  }[];
  portfolio: string;
  status: string;
  programmatic_position: number;
}
