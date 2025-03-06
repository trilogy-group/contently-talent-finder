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
