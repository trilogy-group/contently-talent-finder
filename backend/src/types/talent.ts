export interface SearchCriteria {
  brandProfileId: number;
  name: string;
  description: string;
  storyFormat: string;
  contentExamples: string[];
  languageId: number;
  pillarId: number;
  neededBy: string;
  onSite: boolean;
  location: string;
  otherInfo: string;
  budgetRangeMin: number;
  budgetRangeMax: number;
  topicIds: number[];
  skillIds: number[];
}

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
}
