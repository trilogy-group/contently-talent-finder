
export const filterOptions = {
  status: [
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
  ],
  format: [
    { value: "case-study", label: "Case Study" },
    { value: "article-blog", label: "Article / Blog Post" },
    { value: "design", label: "Design" },
    { value: "whitepaper", label: "Whitepaper" },
  ],
  publication: [
    { value: "building-contently", label: "Building Contently SNUFFLES" },
    { value: "tech-blog", label: "Tech Blog" },
    { value: "marketing-blog", label: "Marketing Blog" },
  ],
  assignee: [
    { value: "me", label: "Assigned to Me" },
    { value: "unassigned", label: "Unassigned" },
  ],
  wordCount: [
    { value: "short", label: "Less than 500 words" },
    { value: "medium", label: "500-1500 words" },
    { value: "long", label: "More than 1500 words" },
  ],
  campaign: [
    { value: "q1-2024", label: "Q1 2024" },
    { value: "q2-2024", label: "Q2 2024" },
    { value: "product-launch", label: "Product Launch" },
  ],
  pillars: [
    { value: "thought-leadership", label: "Thought Leadership" },
    { value: "product", label: "Product" },
    { value: "company", label: "Company" },
  ],
  audience: [
    { value: "customers", label: "Customers" },
    { value: "prospects", label: "Prospects" },
    { value: "developers", label: "Developers" },
  ],
} as const;
