import { ArrowUpDown, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, SeoKeyword, SortConfig } from "./utils";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

export interface KeywordsTableProps {
  keywords: SeoKeyword[];
  sortConfig: SortConfig;
  onSort: (key: 'keyword' | 'searchResults' | 'searchVolume' | 'costPerClick') => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export const KeywordsTable = ({ 
  keywords, 
  sortConfig, 
  onSort, 
  onDelete,
  searchTerm,
  setSearchTerm
}: KeywordsTableProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 bg-blue-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">SEO Keywords</h2>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm mr-4"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left font-medium text-gray-700 uppercase">
                  <button 
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                    onClick={() => onSort('keyword')}
                  >
                    KEYWORD
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 uppercase">
                  <button 
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                    onClick={() => onSort('searchResults')}
                  >
                    NUMBER OF RESULTS
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 uppercase">
                  <button 
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                    onClick={() => onSort('searchVolume')}
                  >
                    SEARCH VOLUME
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-700 uppercase">
                  <button 
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                    onClick={() => onSort('costPerClick')}
                  >
                    COST PER CLICK
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword) => (
                <tr 
                  key={keyword.id} 
                  className="border-b border-gray-200 hover:bg-gray-50 group relative"
                >
                  <td className="px-6 py-4">
                    {keyword.keyword}
                  </td>
                  <td className="px-6 py-4">{formatNumber(keyword.searchResults)}</td>
                  <td className="px-6 py-4">{formatNumber(keyword.searchVolume)}</td>
                  <td className="px-6 py-4">{keyword.costPerClick}</td>
                  <td className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 inset-y-0 flex items-center">
                    <button
                      onClick={() => onDelete(keyword.id)}
                      className="text-orange-500 hover:text-orange-700"
                      aria-label={`Delete keyword ${keyword.keyword}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
