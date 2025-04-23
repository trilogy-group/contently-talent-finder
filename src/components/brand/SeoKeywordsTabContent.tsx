import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeoKeyword, SortConfig } from "./seo-keywords/utils";
import { KeywordForm } from "./seo-keywords/KeywordForm";
import { KeywordToolbar } from "./seo-keywords/KeywordToolbar";
import { KeywordsTable } from "./seo-keywords/KeywordsTable";
import { EmptyKeywords } from "./seo-keywords/EmptyKeywords";
import { showToastAlert } from "@/components/ui/toast-alert";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { contentStrategyApi } from "@/utils/api";

// Define the type for new keywords (without id)
type NewSeoKeyword = Omit<SeoKeyword, 'id'>;

interface SeoKeywordsTabContentProps {
  keywords: SeoKeyword[];
  setKeywords: (keywords: SeoKeyword[]) => void;
  isLoading?: boolean;
  selectedPublication: string;
}

export const SeoKeywordsTabContent: React.FC<SeoKeywordsTabContentProps> = ({
  keywords,
  setKeywords,
  isLoading = false,
  selectedPublication
}) => {
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'descending'
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { showConfirm, confirmDialog } = useConfirmDialog();
  
  // Initialize with all required fields
  const [newKeyword, setNewKeyword] = useState<NewSeoKeyword>({
    keyword: '',
    searchResults: 0,
    searchVolume: 0,
    costPerClick: '0'
  });

  // Reset form function should also reset to initial state
  const resetForm = () => {
    setNewKeyword({
      keyword: '',
      searchResults: 0,
      searchVolume: 0,
      costPerClick: '0'
    });
    setIsAddingKeyword(false);
  };

  // Show the add keyword form
  const showAddKeywordForm = () => {
    setIsAddingKeyword(true);
  };

  // Add keywords
  const addKeywords = (newKeywords: SeoKeyword[]) => {
    setKeywords([...keywords, ...newKeywords]);
  };

  // Remove a keyword
  const removeKeyword = (id: string) => {
    showConfirm(
      () => {
        setKeywords(keywords.filter(keyword => keyword.id !== id));
        showToastAlert("Keyword deleted successfully", "success");
      },
      {
        title: "Delete Keyword",
        message: "Are you sure you want to delete this keyword? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger"
      }
    );
  };

  // Handle CSV upload
  const handleCsvUpload = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Handle file selection
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        document.body.removeChild(fileInput);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          if (!csvContent) {
            throw new Error("Failed to read file content");
          }
          
          // Parse CSV content
          const lines = csvContent.split('\n');
          const headers = lines[0].split(',');
          
          // Validate headers
          const requiredHeaders = ["Keyword", "Search Results", "Search Volume", "Cost Per Click"];
          const headerIndexes: Record<string, number> = {};
          
          requiredHeaders.forEach(header => {
            const index = headers.findIndex(h => h.trim() === header);
            if (index === -1) {
              throw new Error(`Missing required header: ${header}`);
            }
            headerIndexes[header] = index;
          });
          
          // Parse data rows
          const newKeywords: SeoKeyword[] = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = parseCSVLine(lines[i]);
            if (values.length < requiredHeaders.length) continue;
            
            const keyword = values[headerIndexes["Keyword"]].replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
            const searchResults = parseInt(values[headerIndexes["Search Results"]], 10) || 0;
            const searchVolume = parseInt(values[headerIndexes["Search Volume"]], 10) || 0;
            const costPerClick = values[headerIndexes["Cost Per Click"]];
            
            newKeywords.push({
              id: crypto.randomUUID(),
              keyword,
              searchResults,
              searchVolume,
              costPerClick
            });
          }
          
          if (newKeywords.length > 0) {
            setKeywords([...keywords, ...newKeywords]);
            showToastAlert(`Successfully imported ${newKeywords.length} keywords`, "success");
          } else {
            showToastAlert("No valid keywords found in the CSV file", "warning");
          }
        } catch (error) {
          console.error("Error parsing CSV:", error);
          showToastAlert(`Error parsing CSV: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
        }
        
        document.body.removeChild(fileInput);
      };
      
      reader.onerror = () => {
        showToastAlert("Failed to read the file", "error");
        document.body.removeChild(fileInput);
      };
      
      reader.readAsText(file);
    };
    
    // Trigger file selection
    fileInput.click();
  };
  
  // Helper function to parse CSV line correctly (handling quoted values with commas)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (i < line.length - 1 && line[i + 1] === '"') {
          // Handle escaped quotes (two double quotes in a row)
          current += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    
    return result;
  };

  // Download keywords as CSV
  const downloadKeywords = () => {
    try {
      // Convert keywords to CSV format
      const headers = ["Keyword", "Search Results", "Search Volume", "Cost Per Click"];
      const csvContent = [
        headers.join(","),
        ...keywords.map(kw => 
          [
            `"${kw.keyword.replace(/"/g, '""')}"`, // Escape quotes in the keyword
            kw.searchResults,
            kw.searchVolume,
            kw.costPerClick
          ].join(",")
        )
      ].join("\n");
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'seo-keywords.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToastAlert("Keywords downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading keywords:", error);
      showToastAlert("Failed to download keywords", "error");
    }
  };

  // Sort table by column
  const requestSort = (key: 'keyword' | 'searchResults' | 'searchVolume' | 'costPerClick') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key) return keywords;
    
    return [...keywords].sort((a, b) => {
      if (sortConfig.key === 'keyword') {
        if (sortConfig.direction === 'ascending') {
          return a.keyword.localeCompare(b.keyword);
        } else {
          return b.keyword.localeCompare(a.keyword);
        }
      } else if (sortConfig.key === 'costPerClick') {
        // Handle 'N/A' and dollar signs in cost per click
        const valueA = a[sortConfig.key] === 'N/A' ? -1 : parseFloat(a[sortConfig.key].replace('$', ''));
        const valueB = b[sortConfig.key] === 'N/A' ? -1 : parseFloat(b[sortConfig.key].replace('$', ''));
        
        if (sortConfig.direction === 'ascending') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      } else {
        // For numeric columns
        if (sortConfig.direction === 'ascending') {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        } else {
          return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
      }
    });
  };

  // Get sorted keywords
  const sortedKeywords = getSortedData();

  // Filter keywords based on search term
  const filteredKeywords = sortedKeywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKeyword = async (keyword: Omit<SeoKeyword, 'id'>) => {
    try {
      const newKeyword = await contentStrategyApi.createSeoKeyword(keyword, selectedPublication);
      setKeywords([...keywords, newKeyword]);
      showToastAlert('Keyword added successfully!', 'success');
    } catch (error) {
      console.error('Error adding keyword:', error);
      showToastAlert('Error adding keyword. Please try again.', 'error');
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      await contentStrategyApi.deleteSeoKeyword(id, selectedPublication);
      setKeywords(keywords.filter(k => k.id !== id));
      showToastAlert('Keyword deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting keyword:', error);
      showToastAlert('Error deleting keyword. Please try again.', 'error');
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {confirmDialog}
        {/* Hidden button for the + button in the header */}
        <button 
          className="hidden add-keyword-button" 
          onClick={showAddKeywordForm}
        ></button>
        
        {/* Hidden button for the download functionality */}
        <button 
          className="hidden download-keywords-button" 
          onClick={downloadKeywords}
        ></button>
        
        {/* Hidden button for the upload functionality */}
        <button 
          className="hidden upload-keywords-button" 
          onClick={handleCsvUpload}
        ></button>

        {/* Keyword Form Component */}
        <KeywordForm 
          isOpen={isAddingKeyword} 
          onClose={resetForm}
          onAddKeywords={addKeywords}
        />

        {/* Keywords list view */}
        <div className="space-y-6">
          {/* Empty State or Table */}
          {keywords.length === 0 ? (
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-0">
                <div className="flex justify-between items-center p-4 bg-blue-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">SEO Keywords</h2>
                </div>
                <EmptyKeywords onAddKeyword={showAddKeywordForm} />
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <KeywordsTable 
                keywords={filteredKeywords} 
                sortConfig={sortConfig} 
                onSort={requestSort}
                onDelete={handleDeleteKeyword}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
