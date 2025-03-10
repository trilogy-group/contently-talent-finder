import { Routes, Route } from "react-router-dom";
import SimplifiedTalentSearch from "@/pages/SimplifiedTalentSearch";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Content from "@/pages/Content";

// Sample documents data
const sampleDocuments = [
  {
    id: 1,
    title: "Q1 Marketing Strategy",
    type: "Strategy",
    assignee: "John",
    date: "2024-01-15",
    tags: ["marketing", "strategy"],
    content: "This is the Q1 marketing strategy content...",
    score: 85
  },
  {
    id: 2,
    title: "Product Launch Blog Post",
    type: "Blog",
    assignee: "Sarah",
    date: "2024-02-01",
    tags: ["product", "launch"],
    content: "This is the product launch blog post content...",
    score: 92
  },
  {
    id: 3,
    title: "Customer Success Story",
    type: "Case Study",
    assignee: "Mike",
    date: "2024-02-15",
    tags: ["customer", "success"],
    content: "This is the customer success story content...",
    score: 88
  },
  {
    id: 4,
    title: "Technical Documentation",
    type: "Documentation",
    assignee: "Lisa",
    date: "2024-03-01",
    tags: ["technical", "docs"],
    content: "This is the technical documentation content...",
    score: 78
  },
  {
    id: 5,
    title: "Social Media Campaign",
    type: "Campaign",
    assignee: "Tom",
    date: "2024-03-15",
    tags: ["social", "campaign"],
    content: "This is the social media campaign content...",
    score: 90
  },
  {
    id: 6,
    title: "Email Newsletter Draft",
    type: "Email",
    assignee: "John",
    date: "2024-01-20",
    tags: ["email", "newsletter"],
    content: "This is the email newsletter draft content...",
    score: 82
  },
  {
    id: 7,
    title: "SEO Guidelines Update",
    type: "Documentation",
    assignee: "Sarah",
    date: "2024-02-05",
    tags: ["seo", "guidelines"],
    content: "This is the SEO guidelines update content...",
    score: 86
  },
  {
    id: 8,
    title: "Product Feature Overview",
    type: "Blog",
    assignee: "Mike",
    date: "2024-02-20",
    tags: ["product", "features"],
    content: "This is the product feature overview content...",
    score: 91
  },
  {
    id: 9,
    title: "User Interview Results",
    type: "Research",
    assignee: "Lisa",
    date: "2024-03-05",
    tags: ["research", "user feedback"],
    content: "This is the user interview results content...",
    score: 84
  },
  {
    id: 10,
    title: "Brand Guidelines",
    type: "Documentation",
    assignee: "Tom",
    date: "2024-03-20",
    tags: ["brand", "guidelines"],
    content: "This is the brand guidelines content...",
    score: 89
  },
  {
    id: 11,
    title: "Website Redesign Plan",
    type: "Strategy",
    assignee: "John",
    date: "2024-01-25",
    tags: ["website", "design"],
    content: "This is the website redesign plan content...",
    score: 87
  },
  {
    id: 12,
    title: "API Documentation",
    type: "Documentation",
    assignee: "Sarah",
    date: "2024-02-10",
    tags: ["api", "technical"],
    content: "This is the API documentation content...",
    score: 80
  },
  {
    id: 13,
    title: "Community Update Post",
    type: "Blog",
    assignee: "Mike",
    date: "2024-02-25",
    tags: ["community", "updates"],
    content: "This is the community update post content...",
    score: 83
  },
  {
    id: 14,
    title: "Sales Presentation",
    type: "Presentation",
    assignee: "Lisa",
    date: "2024-03-10",
    tags: ["sales", "presentation"],
    content: "This is the sales presentation content...",
    score: 88
  }
];

function App() {
  const handleAddDocument = (title: string) => {
    console.log("Adding document:", title);
  };

  const handleRemoveDocument = (id: number) => {
    console.log("Removing document:", id);
  };

  return (
    <Routes>
      <Route path="/" element={<SimplifiedTalentSearch />} />
      <Route path="/login" element={<Login />} />
      <Route path="/content" element={<Content documents={sampleDocuments} onAddDocument={handleAddDocument} onRemoveDocument={handleRemoveDocument} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
