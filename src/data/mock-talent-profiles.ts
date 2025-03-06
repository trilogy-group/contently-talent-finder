import { TalentProfile } from "@/types/talent-search";

export const mockTalentProfiles: TalentProfile[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Content Writer",
    specialties: ["Blog Posts", "Whitepapers", "Technical Writing"],
    experience: 5,
    yearsOfExperience: 5,
    rating: 4.8,
    score: 92,
    completedProjects: 78,
    industries: ["Technology", "SaaS", "Fintech"],
    skills: ["SEO Writing", "Research", "Editing"],
    bio: "Experienced content writer specializing in B2B technology content with a focus on clarity and conversion.",
    expandedBio: "With over 5 years of dedicated experience in B2B technology content creation, I've developed a precise approach to communicating complex technical concepts in accessible language. My background in computer science combined with professional writing training allows me to bridge the gap between technical subject matter and engaging content that drives conversion. I specialize in creating content marketing assets that not only educate but also strategically guide readers through the customer journey.",
    projects: [
      {
        title: "SaaS Platform Website Overhaul",
        description: "Rewrote all website copy for a leading SaaS platform, resulting in 32% increase in conversion rate and improved user engagement metrics."
      },
      {
        title: "Technical Documentation Series",
        description: "Created a comprehensive documentation series for a cloud security product, including user guides, API documentation, and implementation tutorials."
      },
      {
        title: "Fintech Blog Strategy",
        description: "Developed and executed a 6-month content strategy for a fintech startup, producing 24 blog posts that drove a 45% increase in organic traffic."
      }
    ],
    sampleWritings: [
      {
        title: "The Future of Cloud Security",
        excerpt: "As organizations increasingly move their operations to the cloud, security concerns remain at the forefront of decision-making processes. This article explores emerging trends in cloud security architecture and how zero-trust models are becoming the new standard..."
      },
      {
        title: "Understanding Microservices",
        excerpt: "Microservices architecture has revolutionized how we build and deploy applications. This technical guide breaks down the key components of microservices, their advantages over monolithic structures, and implementation best practices for scalable systems..."
      },
      {
        title: "AI in Content Marketing",
        excerpt: "Artificial intelligence is transforming how brands create and distribute content. This analysis examines practical applications of AI in content strategy, from personalization engines to predictive analytics and automated content generation..."
      },
      {
        title: "Blockchain Beyond Cryptocurrency",
        excerpt: "While blockchain is known primarily for powering cryptocurrencies, its applications extend far beyond. This deep dive explores how distributed ledger technology is revolutionizing supply chain management, identity verification, and smart contracts..."
      },
      {
        title: "The Rise of Edge Computing",
        excerpt: "As IoT devices proliferate, the demand for edge computing solutions continues to grow. This technical overview explains how processing data closer to its source is changing network architecture and enabling new real-time applications..."
      },
      {
        title: "Data Privacy Regulations",
        excerpt: "Navigating the complex landscape of international data privacy regulations presents challenges for global businesses. This comprehensive guide covers GDPR, CCPA, and emerging frameworks with actionable compliance strategies..."
      }
    ]
  },
  {
    id: 2,
    name: "Morgan Smith",
    role: "Multimedia Project Manager",
    specialties: ["Video Production", "Podcast Management", "Content Distribution"],
    experience: 7,
    yearsOfExperience: 7,
    rating: 4.9,
    score: 95,
    completedProjects: 42,
    industries: ["Healthcare", "Education", "Non-profit"],
    skills: ["Project Management", "Team Leadership", "Budget Planning"],
    bio: "Multimedia project manager with expertise in coordinating cross-functional teams to deliver high-quality content across channels.",
    projects: [
      {
        title: "Healthcare Education Video Series",
        description: "Managed the production of a 12-part video series for a major healthcare provider, coordinating with medical experts, videographers, and editors to deliver content on schedule and under budget."
      },
      {
        title: "University Podcast Launch",
        description: "Led the development and launch of a weekly podcast for a top university, establishing production workflows and distribution channels that reached 50,000+ listeners in the first quarter."
      }
    ],
    sampleWritings: [
      {
        title: "Project Scope Document: Documentary Series",
        excerpt: "This comprehensive scope document outlines the production timeline, resource allocation, and creative direction for a six-part documentary series exploring sustainable technologies. The project encompasses pre-production research, on-location filming across three continents, and post-production workflow..."
      },
      {
        title: "Podcast Production Guide",
        excerpt: "A strategic overview of podcast production best practices, from concept development through distribution. This guide covers technical setup requirements, interview techniques, editing workflows, and promotion strategies to maximize audience engagement..."
      }
    ]
  },
  {
    id: 3,
    name: "Jamie Rivera",
    role: "SEO Specialist",
    specialties: ["Keyword Research", "Content Optimization", "Analytics"],
    experience: 4,
    yearsOfExperience: 4,
    rating: 4.7,
    score: 90,
    completedProjects: 56,
    industries: ["E-commerce", "Health", "Local Business"],
    skills: ["Google Analytics", "SEMrush", "Technical SEO"],
    bio: "Data-driven SEO specialist who combines technical expertise with content strategy to drive organic traffic growth.",
    projects: [
      {
        title: "E-commerce Website Audit",
        description: "Conducted a comprehensive technical SEO audit for an e-commerce website, identifying and implementing fixes for crawlability issues, improving page speed, and enhancing mobile usability."
      },
      {
        title: "Content Marketing Strategy",
        description: "Developed and executed a content marketing strategy for a health and wellness brand, creating and promoting high-quality content that drove a 25% increase in organic traffic and 15% increase in conversions."
      }
    ],
    sampleWritings: [
      {
        title: "Technical SEO Audit Report",
        excerpt: "This comprehensive audit identified critical issues affecting search performance including site architecture problems, duplicate content, and crawlability barriers. The document provides prioritized recommendations with estimated impact levels and implementation difficulty..."
      },
      {
        title: "Content Gap Analysis",
        excerpt: "By analyzing competitor content performance against client offerings, this report identifies high-opportunity keyword clusters and content types currently underserved in the market. The strategic recommendations outline a 6-month content development roadmap..."
      }
    ]
  },
  {
    id: 4,
    name: "Taylor Wilson",
    role: "Social Media Manager",
    specialties: ["Instagram", "TikTok", "Strategy Development"],
    experience: 3,
    yearsOfExperience: 3,
    rating: 4.6,
    score: 88,
    completedProjects: 42,
    industries: ["Fashion", "Beauty", "Lifestyle"],
    skills: ["Content Calendar Planning", "Analytics", "Community Management"],
    bio: "Passionate about creating engaging social media content that builds communities around brands.",
    projects: [
      {
        title: "Fashion Brand Instagram Campaign",
        description: "Developed and executed a 3-month Instagram campaign for a fashion brand, creating and curating content that drove a 20% increase in followers and 15% increase in engagement."
      },
      {
        title: "Beauty Influencer Partnership",
        description: "Managed a 6-month influencer partnership for a beauty brand, collaborating with 10 influencers to create sponsored content that reached 1 million+ impressions and drove a 10% increase in sales."
      }
    ],
    sampleWritings: [
      {
        title: "Instagram Growth Strategy",
        excerpt: "This strategic document outlines a 90-day plan for revitalizing an underperforming Instagram account. The approach includes content pillar development, engagement tactics, hashtag strategy, and a posting schedule optimized for the target demographic..."
      },
      {
        title: "TikTok Campaign Brief",
        excerpt: "A comprehensive brief for a UGC-driven campaign designed to increase brand awareness among Gen Z consumers. The document covers creative direction, influencer partnership guidelines, sound selection strategy, and performance benchmarks..."
      }
    ]
  },
  {
    id: 5,
    name: "Jordan Lee",
    role: "Content Strategist",
    specialties: ["Content Calendars", "Brand Voice Development", "Editorial Planning"],
    experience: 6,
    yearsOfExperience: 6,
    rating: 4.9,
    score: 96,
    completedProjects: 93,
    industries: ["B2B", "Technology", "Professional Services"],
    skills: ["Audience Research", "Content Audits", "Performance Analysis"],
    bio: "Strategic thinker who helps brands align their content with business goals and audience needs.",
    projects: [
      {
        title: "B2B Content Strategy",
        description: "Developed and executed a comprehensive content strategy for a B2B technology company, creating and distributing content that drove a 30% increase in lead generation and 25% increase in sales."
      },
      {
        title: "Technology Blog Launch",
        description: "Managed the launch of a technology blog for a professional services firm, creating and publishing high-quality content that drove a 50% increase in organic traffic and 20% increase in engagement."
      }
    ],
    sampleWritings: [
      {
        title: "Annual Content Strategy",
        excerpt: "This comprehensive strategy document aligns content initiatives with business priorities, outlining target personas, content themes, channel strategy, and success metrics. The strategic framework includes a quarterly editorial calendar with topic clusters organized by business objectives..."
      },
      {
        title: "Content Governance Playbook",
        excerpt: "A detailed playbook establishing content standards, roles and responsibilities, workflow processes, and quality control measures. This document serves as the operational foundation for scaling content production while maintaining consistent quality and strategic alignment..."
      }
    ]
  }
];

export const roleOptions = [
  { value: "Content Writer", label: "Content Writer" },
  { value: "Multimedia Project Manager", label: "Multimedia Project Manager" },
  { value: "SEO Specialist", label: "SEO Specialist" },
  { value: "Social Media Manager", label: "Social Media Manager" },
  { value: "Content Strategist", label: "Content Strategist" },
];

export const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "SaaS", label: "SaaS" },
  { value: "Fintech", label: "Fintech" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Education", label: "Education" },
  { value: "Nonprofit", label: "Nonprofit" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Health", label: "Health" },
  { value: "Fashion", label: "Fashion" },
  { value: "Beauty", label: "Beauty" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "B2B", label: "B2B" },
  { value: "Professional Services", label: "Professional Services" },
];

export const specialtyOptions = [
  { value: "Blog Posts", label: "Blog Posts" },
  { value: "Whitepapers", label: "Whitepapers" },
  { value: "Technical Writing", label: "Technical Writing" },
  { value: "Video Production", label: "Video Production" },
  { value: "Podcast Management", label: "Podcast Management" },
  { value: "Social Media Campaigns", label: "Social Media Campaigns" },
  { value: "Keyword Research", label: "Keyword Research" },
  { value: "Content Optimization", label: "Content Optimization" },
  { value: "Analytics", label: "Analytics" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "Strategy Development", label: "Strategy Development" },
  { value: "Content Calendars", label: "Content Calendars" },
  { value: "Brand Voice Development", label: "Brand Voice Development" },
  { value: "Editorial Planning", label: "Editorial Planning" },
];
