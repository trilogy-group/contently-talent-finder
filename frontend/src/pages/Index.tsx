
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BrandCompassOverlay } from "@/components/BrandCompassOverlay";
import { ContentEditor } from "@/components/ContentEditor";
import { DocumentFilters, Filters } from "@/components/DocumentFilters";
import { ContentModeToggle } from "@/components/ContentModeToggle";
import { DocumentTable } from "@/components/DocumentTable";
import { mockDocuments } from "@/data/mockDocuments";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

interface AppDocument {
  id: number;
  title: string;
  date: string;
  score: number;
  type: string;
  assignee: string;
  tags: string[];
  content: string;
}

interface IndexProps {
  documents: AppDocument[];
  onAddDocument: (title: string) => void;
  onRemoveDocument: (id: number) => void;
}

const Index = ({ documents, onAddDocument, onRemoveDocument }: IndexProps) => {
  const [newContent, setNewContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrandCompass, setShowBrandCompass] = useState(false);
  const [compassContent, setCompassContent] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [dateFilteredDocs, setDateFilteredDocs] = useState<AppDocument[]>([]);
  const [displayedDocs, setDisplayedDocs] = useState<AppDocument[]>([]);
  
  const [filters, setFilters] = useState<Filters>({
    status: [],
    format: [],
    assignee: [],
    dateRange: {
      from: new Date('2024-01-01'),
      to: new Date('2024-12-31')
    },
    tags: [],
    publication: [],
    campaign: [],
    pillars: [],
    audience: [],
    wordCount: [],
  });

  // First filter: Date range only
  useEffect(() => {
    if (filters.dateRange) {
      const docsInDateRange = mockDocuments.filter(doc => {
        const docDate = new Date(doc.date);
        return (!filters.dateRange.from || docDate >= filters.dateRange.from) &&
               (!filters.dateRange.to || docDate <= filters.dateRange.to);
      });
      setDateFilteredDocs(docsInDateRange);
      setDisplayedDocs(docsInDateRange);
    }
  }, [filters.dateRange]);

  // Second filter: Apply all other filters to dateFilteredDocs
  useEffect(() => {
    const filteredDocs = dateFilteredDocs.filter(doc => {
      // Assignee filter (case insensitive)
      if (filters.assignee?.length > 0 && 
          !filters.assignee.some(a => 
            doc.assignee.toLowerCase() === a.toLowerCase()
          )) {
        return false;
      }
      
      // Format/Type filter (case insensitive)
      if (filters.format?.length > 0 && 
          !filters.format.some(f => 
            doc.type.toLowerCase() === f.toLowerCase()
          )) {
        return false;
      }
      
      // Tags filter (case insensitive)
      if (filters.tags?.length > 0 && 
          !filters.tags.some(filterTag => 
            doc.tags.some(docTag => 
              docTag.toLowerCase() === filterTag.toLowerCase()
            )
          )) {
        return false;
      }
      
      // Search query (case insensitive)
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    setDisplayedDocs(filteredDocs);
    console.log("Applied filters:", filters);
    console.log("Filtered documents:", filteredDocs);
  }, [filters.assignee, filters.format, filters.tags, searchQuery, dateFilteredDocs]);

  const [brandVoices] = useState([
    {
      id: 1,
      name: "Technical Authority",
      description: "Expert-driven, precise communication that builds trust through deep industry knowledge and thought leadership.",
      tonePillars: ["Authoritative", "Clear", "Educational", "Professional"],
      contentThemes: ["Industry Insights", "Technical Deep-dives", "Best Practices", "Innovation"],
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        documents={documents}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBrandCompassClick={() => setShowBrandCompass(true)}
        onRemoveDocument={onRemoveDocument}
      />

      {showBrandCompass ? (
        <BrandCompassOverlay
          onClose={() => setShowBrandCompass(false)}
          brandVoices={brandVoices}
          compassContent={compassContent}
          setCompassContent={setCompassContent}
        />
      ) : (
        <div className="flex-1 w-full px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <ContentModeToggle 
              isCreatingNew={isCreatingNew} 
              onToggle={setIsCreatingNew}
            />
            {!isCreatingNew && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                {showFilters ? (
                  <>
                    <PanelRightClose className="h-4 w-4" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-4 w-4" />
                    Show Filters
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-6 h-[calc(100vh-160px)]">
            <div className={`${isCreatingNew ? 'w-full' : 'flex-1'} h-full`}>
              {isCreatingNew && (
                <ContentEditor
                  newContent={newContent}
                  setNewContent={setNewContent}
                  onAnalyze={(content) => {
                    const title = content.split("\n")[0].slice(0, 50) + "...";
                    onAddDocument(title);
                  }}
                  showFiltersHint={false}
                />
              )}
              {!isCreatingNew && (
                <>
                  {!filters.dateRange ? (
                    <div className="flex items-center justify-center h-full bg-white rounded-lg border border-slate-200">
                      <p className="text-slate-500">Please select a date range</p>
                    </div>
                  ) : (
                    <div className="h-full bg-white rounded-lg border border-slate-200">
                      <DocumentTable documents={displayedDocs} />
                    </div>
                  )}
                </>
              )}
            </div>
            
            {!isCreatingNew && showFilters && (
              <div className="w-1/4 bg-white rounded-lg shadow-sm h-full overflow-auto">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <DocumentFilters
                    filters={filters}
                    onFilterChange={(newFilters: Filters) => setFilters(newFilters)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
