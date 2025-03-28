import { useState, useEffect } from "react";
import { TitleBar } from "@/components/TitleBar";
import { Target, Users, Type, LayoutGrid, CalendarDays, Share2, Search, PenLine, Plus, Eye, Download, Upload } from "lucide-react";
import { StrategySidebar } from "@/components/brand/StrategySidebar";
import { StrategyBanner } from "@/components/brand/StrategyBanner";
import { GoalsTabContent } from "@/components/brand/GoalsTabContent";
import { AudiencesTabContentV2 } from "@/components/brand/AudiencesTabContentV2";
import { VoiceTabContent } from "@/components/brand/VoiceTabContent";
import { PillarsTabContent } from "@/components/brand/PillarsTabContent";
import { ContentPlanTabContent } from "@/components/brand/ContentPlanTabContent";
import { DistributionTabContent } from "@/components/brand/DistributionTabContent";
import { SeoKeywordsTabContent } from "@/components/brand/SeoKeywordsTabContent";
import { DefaultTabContent } from "@/components/brand/DefaultTabContent";
import { Button } from "@/components/ui/button";
import { showToastAlert } from "@/components/ui/toast-alert";
import { contentStrategyApi } from '@/utils/api';
import { ContentPlan, ContentPillar } from "@/types/content";

// Define the Audience type
interface Audience {
  id: string;
  name: string;
  description: string;
  educationLevel: string;
  gender: "female" | "male" | "";
  minAge: number | null;
  maxAge: number | null;
  attachments?: string[];
}

// Define ContentFormat type
type ContentFormat = {
  id: string;
  format: string;
  subFormat: string;
  quantity: number;
  frequency: string;
  price: number;
};

// Define Channel type
type ChannelStatus = "cannot_use" | "currently_using" | "interested" | "not_interested";

interface Channel {
  id: string;
  name: string;
  status: ChannelStatus;
}

// Define SEO Keyword type
interface SeoKeyword {
  id: string;
  keyword: string;
  searchResults: number;
  searchVolume: number;
  costPerClick: string;
}

const BrandCompass = () => {
  const breadcrumbs = [
    { label: "Content Strategy", href: "/brand-compass" }
  ];
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("goals");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("all");
  const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected strategy from localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load data from all endpoints in parallel
        const [
          missionAndGoals,
          audiences,
          voiceAndStyle,
          pillars,
          contentPlan,
          distribution,
          seoKeywords
        ] = await Promise.all([
          contentStrategyApi.getMissionAndGoals(),
          contentStrategyApi.getAudiences(),
          contentStrategyApi.getVoiceAndStyle(),
          contentStrategyApi.getPillars(),
          contentStrategyApi.getPlan(),
          contentStrategyApi.getDistribution(),
          contentStrategyApi.getSeoKeywords()
        ]);

        // Update state with fetched data
        setPrimaryGoal(missionAndGoals.primaryGoal || "brand_awareness");
        setOrgType(missionAndGoals.orgType || "b2c");
        setContentMission(missionAndGoals.contentMission || "");
        setNeedsRecommendations(missionAndGoals.needsRecommendations || false);
        setSelectedKpis(missionAndGoals.selectedKpis || []);
        
        setAudiences(audiences || []);
        
        setVoiceDescription(voiceAndStyle.voiceDescription || "");
        setBlockedWords(voiceAndStyle.blockedWords || "");
        setStyleGuide(voiceAndStyle.styleGuide || "");
        setUseFirstPerson(voiceAndStyle.useFirstPerson || false);
        setNotes(voiceAndStyle.notes || "");
        
        setPillars(pillars || []);
        setDistributionChannels(distribution.channels || []);
        setSeoKeywords(seoKeywords || []);
        setContentPlan(contentPlan);

      } catch (error) {
        console.error('Error loading initial data:', error);
        showToastAlert('Error loading data. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // State for tracking if distribution is in edit mode
  const [isDistributionEditing, setIsDistributionEditing] = useState(false);

  // Function to handle distribution edit toggle
  const handleDistributionEditToggle = () => {
    setIsDistributionEditing(!isDistributionEditing);
    const toggleEditButton = document.querySelector('.toggle-distribution-edit');
    if (toggleEditButton) {
      (toggleEditButton as HTMLButtonElement).click();
    }
  };

  // Function to save data to database
  const saveToDatabase = async () => {
    try {
      // Get the original keywords from the API to compare
      const originalKeywords = await contentStrategyApi.getSeoKeywords();
      
      // Find keywords to delete (exist in original but not in current state)
      const keywordsToDelete = originalKeywords.filter(
        origKeyword => !seoKeywords.some(
          currKeyword => currKeyword.id === origKeyword.id
        )
      );

      // Find keywords to create (exist in current state but not in original)
      const keywordsToCreate = seoKeywords.filter(
        currKeyword => !originalKeywords.some(
          origKeyword => origKeyword.id === currKeyword.id
        )
      );

      // Save data to all endpoints in parallel
      await Promise.all([
        contentStrategyApi.updateMissionAndGoals({
          primaryGoal,
          orgType,
          contentMission,
          needsRecommendations,
          selectedKpis
        }),
        contentStrategyApi.updateVoiceAndStyle({
          voiceDescription,
          blockedWords,
          styleGuide,
          useFirstPerson,
          notes
        }),
        ...pillars.map(pillar => contentStrategyApi.updatePillar(pillar.id, pillar)),
        contentStrategyApi.updatePlan(contentPlan),
        contentStrategyApi.updateDistribution({ channels: distributionChannels }),
        // Handle SEO keywords separately
        ...keywordsToDelete.map(keyword => 
          contentStrategyApi.deleteSeoKeyword(keyword.id)
        ),
        ...keywordsToCreate.map(keyword => 
          contentStrategyApi.createSeoKeyword(keyword)
        )
      ]);

      showToastAlert('Strategy saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showToastAlert('Error saving data. Please try again.', 'error');
    }
  };

  // Goals tab state
  const [primaryGoal, setPrimaryGoal] = useState<string>("brand_awareness");
  const [orgType, setOrgType] = useState<string>("b2c");
  const [contentMission, setContentMission] = useState<string>("Formatting arms brands with the tools and talent to create content people love.\n\nWe do that by connecting the people who tell great stories (talent) with the people who want to share those stories with the world (brands). Then, we give them the tools (the software) to work together and create better and better content.");
  const [needsRecommendations, setNeedsRecommendations] = useState<boolean>(false);
  
  const [selectedKpis, setSelectedKpis] = useState<string[]>([
    "total_people",
    "total_attention",
    "direct_source",
    "social_actions",
    "avg_attention",
    "avg_social",
    "engagement_rate",
    "avg_stories",
    "finish_rate",
    "returning_visitors"
  ]);

  // Audiences tab state
  const [audiences, setAudiences] = useState<Audience[]>([
    {
      id: "1",
      name: "Marketing Professionals",
      description: "Content marketing managers and digital strategists working in mid to large-sized companies.",
      educationLevel: "bachelors",
      gender: "female",
      minAge: 25,
      maxAge: 45,
      attachments: ["marketing_persona.pdf"]
    },
    {
      id: "2",
      name: "Small Business Owners",
      description: "Entrepreneurs managing their own content and marketing initiatives with limited resources.",
      educationLevel: "other",
      gender: "male",
      minAge: 30,
      maxAge: 55,
      attachments: []
    }
  ]);

  // Voice and Style tab state
  const [voiceDescription, setVoiceDescription] = useState<string>("Conversational. Always helpful and optimistic, never negative or judgmental, and knowledgeable but nurturing and advice-driven.");
  const [blockedWords, setBlockedWords] = useState<string>("meetings");
  const [styleGuide, setStyleGuide] = useState<string>("chicago");
  const [useFirstPerson, setUseFirstPerson] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("**REQUIRED DISCLAIMER:**\n\n1) The following disclaimer should be included in **all Content:** \"The content in this published material is provided for general informational purposes only and does not constitute investment, financial, tax, legal or other professional advice on any subject matter. Please contact your investment, financial, tax, legal or other professional advisor regarding your specific needs and situation.\n\nPlease avoid absolute, definitive statements that guarantee results\n\n- Appropriate substantiation probably does not exist to support the following words: Exclusive; Unique; Expert; Ensure; Custom; Secure; Security; All; None; Always; Never; Instantly; Shortly; Immediately; Maximize; Make the most of; Minimize; Better (this makes a comparative claim, which should be avoided).\n\n- Appropriate substantiation may be exist for the following words, but will probably require, qualifying language such as \"may,\" \"can,\" or \"help\": Improve; Increase; Decrease; Efficient; Efficiency; Right; Wrong; Worse.");

  // Content Pillars tab state
  const [pillars, setPillars] = useState<ContentPillar[]>([
    {
      id: "1",
      name: "Content Creation",
      description: "Best practices and strategies for creating engaging content across different platforms.",
      headlines: "10 Ways to Create Viral Content\nHow to Optimize Your Content for Search Engines\nVideo Content Tips for Beginners",
      keywords: ["content creation", "content strategy", "video content", "blogging"]
    },
    {
      id: "2",
      name: "Digital Marketing Trends",
      description: "Latest trends and developments in the field of digital marketing.",
      headlines: "Emerging Social Media Platforms to Watch\nAI in Marketing: Current Applications and Future Potential\nThe Rise of Voice Search",
      keywords: ["digital marketing", "marketing trends", "AI marketing", "voice search"]
    }
  ]);

  // Distribution channels state
  const [distributionChannels, setDistributionChannels] = useState<Channel[]>([
    { id: "1", name: "Company affiliated website", status: "not_interested" },
    { id: "2", name: "Snapchat", status: "not_interested" },
    { id: "3", name: "External publishing partners", status: "not_interested" },
    { id: "4", name: "Email", status: "not_interested" },
    { id: "5", name: "Print deliverables", status: "interested" },
    { id: "6", name: "Press releases", status: "not_interested" },
    { id: "7", name: "Reddit", status: "not_interested" },
    { id: "8", name: "Facebook", status: "not_interested" },
    { id: "9", name: "Medium", status: "not_interested" },
    { id: "10", name: "LinkedIn", status: "not_interested" },
    { id: "11", name: "Pinterest", status: "not_interested" },
    { id: "12", name: "Forums", status: "not_interested" },
    { id: "13", name: "YouTube", status: "not_interested" },
    { id: "14", name: "Influencers", status: "not_interested" },
    { id: "15", name: "Twitter", status: "not_interested" },
    { id: "16", name: "Quora", status: "not_interested" },
  ]);

  // SEO Keywords state
  const [seoKeywords, setSeoKeywords] = useState<SeoKeyword[]>([
    { id: "1", keyword: "new puppy", searchResults: 567000000, searchVolume: 880, costPerClick: "$0.46" },
    { id: "2", keyword: "vacation", searchResults: 1970000000, searchVolume: 110000, costPerClick: "$0.87" },
    { id: "3", keyword: "lawyer", searchResults: 1100000000, searchVolume: 135000, costPerClick: "$6.73" },
    { id: "4", keyword: "crypto", searchResults: 1030000000, searchVolume: 165000, costPerClick: "$5.42" },
    { id: "5", keyword: "bitcoin", searchResults: 460000000, searchVolume: 1220000, costPerClick: "N/A" },
    { id: "6", keyword: "travel", searchResults: 6860000000, searchVolume: 201000, costPerClick: "$0.98" },
    { id: "7", keyword: "travel rewards", searchResults: 952000000, searchVolume: 880, costPerClick: "$5.87" },
    { id: "8", keyword: "alt coins", searchResults: 85300000, searchVolume: 2400, costPerClick: "$3.36" },
    { id: "9", keyword: "streaming", searchResults: 6740000000, searchVolume: 40500, costPerClick: "$1.25" },
    { id: "10", keyword: "netflix", searchResults: 4280000000, searchVolume: 16600000, costPerClick: "$2.75" },
    { id: "11", keyword: "firestick", searchResults: 205000000, searchVolume: 110000, costPerClick: "$0.73" },
    { id: "12", keyword: "dogecoin", searchResults: 69900000, searchVolume: 450000, costPerClick: "N/A" },
  ]);

  const strategyTabs = [
    { id: "goals", title: "Strategic Goals", icon: <Target size={20} /> },
    { id: "audiences", title: "Target Audiences", icon: <Users size={20} /> },
    { id: "voice", title: "Voice and Style", icon: <Type size={20} /> },
    { id: "pillars", title: "Content Pillars", icon: <LayoutGrid size={20} /> },
    { id: "plan", title: "Content Plan", icon: <CalendarDays size={20} /> },
    { id: "distribution", title: "Distribution", icon: <Share2 size={20} /> },
    { id: "seo", title: "SEO Keywords", icon: <Search size={20} /> },
  ];

  const tabContent = {
    goals: {
      title: "Strategic Goals",
      description: "Define clear objectives and KPIs for your content strategy.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    audiences: {
      title: "Target Audiences",
      description: "Define audience demographics for targeted, effective content creation.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    },
    voice: {
      title: "Voice and Style",
      description: "Define your brand's tone, voice, and writing style guidelines.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    pillars: {
      title: "Content Pillars",
      description: "Establish the main themes and topics that support your strategy.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5c6f44d"
    },
    plan: {
      title: "Content Plan",
      description: "Create a comprehensive content calendar and production schedule.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    },
    distribution: {
      title: "Distribution",
      description: "Plan your content distribution across different channels.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    },
    seo: {
      title: "SEO Keywords",
      description: "Research and target strategic keywords for your content.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    }
  };

  const kpiOptions = [
    { value: "total_people", label: "Total people" },
    { value: "total_attention", label: "Total attention time" },
    { value: "direct_source", label: "People from source (Direct)" },
    { value: "social_actions", label: "Total social actions" },
    { value: "avg_attention", label: "Average attention time per person" },
    { value: "avg_social", label: "Average number of social actions per story" },
    { value: "engagement_rate", label: "Engagement rate" },
    { value: "avg_stories", label: "Average engaged stories per person" },
    { value: "finish_rate", label: "Finish rate" },
    { value: "returning_visitors", label: "Returning visitors" }
  ];

  const toggleKpi = (kpiId: string) => {
    setSelectedKpis(prev => 
      prev.includes(kpiId) 
        ? prev.filter(id => id !== kpiId) 
        : [...prev, kpiId]
    );
  };

  const currentTab = tabContent[activeTab as keyof typeof tabContent];

  const renderTabContent = () => {
    switch (activeTab) {
      case "goals":
        return (
          <GoalsTabContent
            primaryGoal={primaryGoal}
            setPrimaryGoal={setPrimaryGoal}
            orgType={orgType}
            setOrgType={setOrgType}
            contentMission={contentMission}
            setContentMission={setContentMission}
            needsRecommendations={needsRecommendations}
            setNeedsRecommendations={setNeedsRecommendations}
            selectedKpis={selectedKpis}
            toggleKpi={toggleKpi}
            kpiOptions={kpiOptions}
            isEditing={isEditing}
            isLoading={isLoading}
          />
        );
      case "audiences":
        return (
          <AudiencesTabContentV2
            audiences={audiences}
            setAudiences={setAudiences}
            isLoading={isLoading}
          />
        );
      case "voice":
        return (
          <VoiceTabContent
            voiceDescription={voiceDescription}
            setVoiceDescription={setVoiceDescription}
            blockedWords={blockedWords}
            setBlockedWords={setBlockedWords}
            styleGuide={styleGuide}
            setStyleGuide={setStyleGuide}
            useFirstPerson={useFirstPerson}
            setUseFirstPerson={setUseFirstPerson}
            notes={notes}
            setNotes={setNotes}
            isEditing={isEditing}
            isLoading={isLoading}
          />
        );
      case "pillars":
        return (
          <PillarsTabContent
            pillars={pillars}
            setPillars={setPillars}
            seoKeywords={seoKeywords}
            isLoading={isLoading}
          />
        );
      case "plan":
        return (
          <ContentPlanTabContent
            contentPlan={contentPlan}
            setContentPlan={setContentPlan}
            isLoading={isLoading}
          />
        );
      case "distribution":
        return (
          <DistributionTabContent
            channels={distributionChannels}
            setChannels={setDistributionChannels}
            isEditing={isDistributionEditing}
            isLoading={isLoading}
          />
        );
      case "seo":
        return (
          <SeoKeywordsTabContent
            keywords={seoKeywords}
            setKeywords={setSeoKeywords}
            isLoading={isLoading}
          />
        );
      default:
        return <DefaultTabContent title={currentTab.title} />;
    }
  };

  // Calculate quarterly spend for content plans
  const calculateQuarterlySpend = (formats: ContentFormat[]) => {
    return formats.reduce((total, format) => {
      const multiplier = getFrequencyMultiplier(format.frequency);
      return total + format.price * format.quantity * multiplier;
    }, 0);
  };

  // Get frequency multiplier for quarterly calculation
  const getFrequencyMultiplier = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "monthly":
        return 3;
      case "quarterly":
        return 1;
      case "yearly":
        return 0.25;
      default:
        return 1;
    }
  };

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Total quarterly spend across all plans
  const totalQuarterlySpend = contentPlan ? calculateQuarterlySpend(contentPlan.contentFormats) : 0;

  // Add the handler function
  const handleStrategyChange = (strategy: string) => {
    setSelectedStrategy(strategy);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TitleBar 
        breadcrumbs={breadcrumbs} 
        totalAmount={activeTab === "plan" ? formatCurrency(totalQuarterlySpend) : undefined}
        showTotal={activeTab === "plan"}
        onSaveToDatabase={saveToDatabase}
      />
      <div className="flex h-[calc(100vh-64px)]">
        <StrategySidebar
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          tabs={strategyTabs}
          onTabChange={setActiveTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          selectedStrategy={selectedStrategy}
          onStrategyChange={handleStrategyChange}
        />

        <div className="flex-1 p-6 overflow-auto w-4/5">
          <div className="mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-orange-500">{currentTab.title}</h1>
              <p className="text-gray-600">{currentTab.description}</p>
              {selectedStrategy && (
                <div className="mt-2 text-sm text-gray-500">
                  Strategy: <span className="font-medium">{selectedStrategy}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            {activeTab === "goals" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Eye className="h-5 w-5 text-orange-500" />
                ) : (
                  <PenLine className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            ) : activeTab === "audiences" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={() => {
                  // This will be handled by the AudiencesTabContentV2 component
                  const audiencesTabContent = document.querySelector('.add-audience-button');
                  if (audiencesTabContent) {
                    (audiencesTabContent as HTMLButtonElement).click();
                  }
                }}
              >
                <Plus className="h-5 w-5 text-orange-500" />
              </Button>
            ) : activeTab === "voice" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Eye className="h-5 w-5 text-orange-500" />
                ) : (
                  <PenLine className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            ) : activeTab === "pillars" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={() => {
                  // This will be handled by the PillarsTabContent component
                  const pillarsAddButton = document.querySelector('.add-pillar-button');
                  if (pillarsAddButton) {
                    (pillarsAddButton as HTMLButtonElement).click();
                  }
                }}
              >
                <Plus className="h-5 w-5 text-orange-500" />
              </Button>
            ) : activeTab === "plan" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={() => {
                  // This will be handled by the ContentPlanTabContent component
                  const planAddButton = document.querySelector('.add-plan-button');
                  if (planAddButton) {
                    (planAddButton as HTMLButtonElement).click();
                  }
                }}
              >
                <Plus className="h-5 w-5 text-orange-500" />
              </Button>
            ) : activeTab === "distribution" ? (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 absolute -top-16 right-0"
                onClick={handleDistributionEditToggle}
              >
                {isDistributionEditing ? (
                  <Eye className="h-5 w-5 text-orange-500" />
                ) : (
                  <PenLine className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            ) : activeTab === "seo" ? (
              <div className="absolute -top-16 right-0 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    // Trigger the upload keywords functionality
                    const uploadButton = document.querySelector('.upload-keywords-button');
                    if (uploadButton) {
                      (uploadButton as HTMLButtonElement).click();
                    }
                  }}
                >
                  <Upload className="h-5 w-5 text-orange-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    // Trigger the download keywords functionality
                    const downloadButton = document.querySelector('.download-keywords-button');
                    if (downloadButton) {
                      (downloadButton as HTMLButtonElement).click();
                    }
                  }}
                >
                  <Download className="h-5 w-5 text-orange-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    // This will be handled by the SeoKeywordsTabContent component
                    const addKeywordButton = document.querySelector('.add-keyword-button');
                    if (addKeywordButton) {
                      (addKeywordButton as HTMLButtonElement).click();
                    }
                  }}
                >
                  <Plus className="h-5 w-5 text-orange-500" />
                </Button>
              </div>
            ) : null}

            <StrategyBanner
              title={currentTab.title}
              description={currentTab.description}
              image={currentTab.image}
              activeTab={activeTab}
            />

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCompass;
