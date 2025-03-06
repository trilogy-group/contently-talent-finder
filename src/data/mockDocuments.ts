
export interface Document {
  id: number;
  title: string;
  date: string;
  type: string;
  assignee: string;
  tags: string[];
  content: string;
  score: number;
}

export const mockDocuments: Document[] = [
  { id: 1, title: "Q1 Marketing Strategy", date: "2024-01-15", type: "Strategy", assignee: "John", tags: ["marketing", "strategy"], content: "Detailed Q1 marketing strategy...", score: 92 },
  { id: 2, title: "Product Launch Blog Post", date: "2024-02-01", type: "Blog", assignee: "Sarah", tags: ["product", "launch"], content: "New product launch announcement...", score: 88 },
  { id: 3, title: "Customer Success Story", date: "2024-02-15", type: "Case Study", assignee: "Mike", tags: ["customer", "success"], content: "How our customer achieved success...", score: 95 },
  { id: 4, title: "Technical Documentation", date: "2024-03-01", type: "Documentation", assignee: "Lisa", tags: ["technical", "docs"], content: "Technical specifications...", score: 87 },
  { id: 5, title: "Social Media Campaign", date: "2024-03-15", type: "Campaign", assignee: "Tom", tags: ["social", "campaign"], content: "Social media campaign details...", score: 91 },
  { id: 6, title: "Email Newsletter Draft", date: "2024-01-20", type: "Email", assignee: "John", tags: ["email", "newsletter"], content: "Monthly newsletter content...", score: 89 },
  { id: 7, title: "SEO Guidelines Update", date: "2024-02-05", type: "Documentation", assignee: "Sarah", tags: ["seo", "guidelines"], content: "Updated SEO best practices...", score: 94 },
  { id: 8, title: "Product Feature Overview", date: "2024-02-20", type: "Blog", assignee: "Mike", tags: ["product", "features"], content: "New feature highlights...", score: 90 },
  { id: 9, title: "User Interview Results", date: "2024-03-05", type: "Research", assignee: "Lisa", tags: ["research", "user-feedback"], content: "User interview findings...", score: 93 },
  { id: 10, title: "Brand Guidelines", date: "2024-03-20", type: "Documentation", assignee: "Tom", tags: ["brand", "guidelines"], content: "Official brand guidelines...", score: 96 },
  { id: 11, title: "Website Redesign Plan", date: "2024-01-25", type: "Strategy", assignee: "John", tags: ["website", "design"], content: "Website redesign strategy...", score: 88 },
  { id: 12, title: "API Documentation", date: "2024-02-10", type: "Documentation", assignee: "Sarah", tags: ["api", "technical"], content: "API reference guide...", score: 92 },
  { id: 13, title: "Community Update Post", date: "2024-02-25", type: "Blog", assignee: "Mike", tags: ["community", "updates"], content: "Community newsletter...", score: 89 },
  { id: 14, title: "Sales Presentation", date: "2024-03-10", type: "Presentation", assignee: "Lisa", tags: ["sales", "presentation"], content: "Sales deck content...", score: 91 },
  { id: 15, title: "Product Roadmap", date: "2024-03-25", type: "Strategy", assignee: "Tom", tags: ["product", "roadmap"], content: "Product development roadmap...", score: 94 }
];
