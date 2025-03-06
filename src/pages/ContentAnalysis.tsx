import { useState } from "react";
import { TitleBar } from "@/components/TitleBar";
import { Collapsible } from "@/components/ui/collapsible";
import { ContentHeader } from "@/components/content-analysis/ContentHeader";
import { FilterBar } from "@/components/content-analysis/FilterBar";
import { ContentPanel } from "@/components/content-analysis/ContentPanel";
import { contentTypes, publications, audiences, allGuidelines } from "@/components/content-analysis/constants";

export default function ContentAnalysis() {
  const [content, setContent] = useState("");
  const [improvedContent, setImprovedContent] = useState("");
  const [selectedGuideline, setSelectedGuideline] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const filteredGuidelines = allGuidelines.filter(guideline => {
    if (selectedType.length === 0 && selectedPublication.length === 0 && selectedAudience.length === 0) return true;
    
    const matchesType = selectedType.length === 0 || selectedType.includes(guideline.type);
    const matchesPublication = selectedPublication.length === 0 || selectedPublication.includes(guideline.publication);
    const matchesAudience = selectedAudience.length === 0 || selectedAudience.includes(guideline.audience);
    
    return matchesType && matchesPublication && matchesAudience;
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setImprovedContent(
        content
          .replace("bad", "excellent")
          .replace("okay", "outstanding")
          .replace("good", "exceptional")
      );
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TitleBar 
        breadcrumbs={[
          { label: "Brand Compass", href: "/brand-compass" },
          { label: "Content Analysis" }
        ]} 
      />
      
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="flex-1 flex flex-col">
        <div className="w-full px-6 py-6 flex-1 flex flex-col">
          <ContentHeader
            selectedGuideline={selectedGuideline}
            onGuidelineChange={setSelectedGuideline}
            onAnalyze={handleAnalyze}
            hasContent={!!content}
            isAnalyzing={isAnalyzing}
            guidelines={filteredGuidelines}
          />

          <FilterBar
            contentTypes={contentTypes}
            publications={publications}
            audiences={audiences}
            selectedType={selectedType}
            selectedPublication={selectedPublication}
            selectedAudience={selectedAudience}
            onTypeChange={setSelectedType}
            onPublicationChange={setSelectedPublication}
            onAudienceChange={setSelectedAudience}
          />

          <div className="grid grid-cols-2 gap-6 flex-1">
            <ContentPanel
              type="original"
              content={content}
              onChange={setContent}
            />
            <ContentPanel
              type="improved"
              content={improvedContent}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
