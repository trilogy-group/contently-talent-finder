
import { useState, useMemo } from "react";
import { KeywordToolbar } from "./KeywordToolbar";
import { KeywordsTable } from "./KeywordsTable";
import { EmptyKeywords } from "./EmptyKeywords";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, SeoKeyword, SortConfig } from "./utils";

interface SeoKeywordsTabContentProps {
  keywords: SeoKeyword[];
  setKeywords: (keywords: SeoKeyword[]) => void;
}

export const SeoKeywordsTabContent = ({
  keywords,
  setKeywords,
}: SeoKeywordsTabContentProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending',
  });
  
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddKeyword = () => {
    console.log("Add keyword");
    // Implementation to be added later
  };

  const handleUploadCsv = () => {
    console.log("Upload CSV");
    // Implementation to be added later
  };

  const handleDownloadKeywords = () => {
    console.log("Download keywords");
    // Implementation to be added later
  };

  const handleSort = (key: "keyword" | "searchResults" | "searchVolume" | "costPerClick") => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedKeywords = useMemo(() => {
    if (!sortConfig.key) return keywords;
    
    return [...keywords].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [keywords, sortConfig]);
  
  const filteredKeywords = useMemo(() => {
    if (!searchTerm) return sortedKeywords;
    
    return sortedKeywords.filter(keyword => 
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedKeywords, searchTerm]);

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter(keyword => keyword.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">SEO Keywords</h2>
              <p className="text-sm text-gray-500">
                {keywords.length} {keywords.length === 1 ? 'keyword' : 'keywords'}
              </p>
            </div>
            <KeywordToolbar 
              onUpload={handleUploadCsv}
              onDownload={handleDownloadKeywords}
              onAddKeyword={handleAddKeyword}
            />
          </div>

          {keywords.length === 0 ? (
            <EmptyKeywords onAddKeyword={handleAddKeyword} />
          ) : (
            <KeywordsTable
              keywords={filteredKeywords}
              onSort={handleSort}
              sortConfig={sortConfig}
              onDelete={handleDeleteKeyword}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
