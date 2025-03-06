
export interface BrandStats {
  contentSources: number;
  workers: number;
  generations: number;
  lastAnalysis: string;
}

export interface GuidelineDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "active" | "draft" | "archived";
  lastUpdated: string;
  attributes: {
    technicalKnowledge: number;
    authoritative: number;
    accessibility: number;
  };
}
