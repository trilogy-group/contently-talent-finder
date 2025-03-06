
export const contentTypes = [
  { value: "blog", label: "Blog Post" },
  { value: "technical", label: "Technical Documentation" },
  { value: "marketing", label: "Marketing Copy" },
  { value: "social", label: "Social Media" },
  { value: "email", label: "Email Newsletter" },
  { value: "product", label: "Product Description" }
];

export const publications = [
  { value: "blog", label: "Blog" },
  { value: "website", label: "Website" },
  { value: "social", label: "Social Media" },
  { value: "newsletter", label: "Newsletter" },
  { value: "documentation", label: "Documentation" }
];

export const audiences = [
  { value: "developers", label: "Developers" },
  { value: "business", label: "Business Users" },
  { value: "general", label: "General Public" },
  { value: "technical", label: "Technical Writers" },
  { value: "marketing", label: "Marketing" }
];

export const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" }
];

export const allGuidelines = [
  { value: "dev-best-practices", label: "Developer Best Practices", type: "technical", publication: "documentation", audience: "developers" },
  { value: "api-documentation", label: "API Documentation Style", type: "technical", publication: "documentation", audience: "developers" },
  { value: "marketing-voice", label: "Marketing Voice & Tone", type: "marketing", publication: "website", audience: "business" },
  { value: "social-media", label: "Social Media Guidelines", type: "social", publication: "social", audience: "general" },
  { value: "newsletter-style", label: "Newsletter Style Guide", type: "email", publication: "newsletter", audience: "marketing" }
];
