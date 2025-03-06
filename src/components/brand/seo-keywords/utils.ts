
// Format large numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generate mock data for keyword stats
export const generateKeywordStats = () => {
  // Generate realistic search results and volume
  const searchResults = Math.floor(Math.random() * 5000000000) + 10000000;
  const searchVolume = Math.floor(Math.random() * 500000) + 500;
  const costPerClick = Math.random() < 0.1 ? "N/A" : `$${(Math.random() * 10).toFixed(2)}`;

  return {
    searchResults,
    searchVolume,
    costPerClick
  };
};

// Define the SEO Keyword type
export interface SeoKeyword {
  id: string;
  keyword: string;
  searchResults: number;
  searchVolume: number;
  costPerClick: string;
}

export interface SortConfig {
  key: 'keyword' | 'searchResults' | 'searchVolume' | 'costPerClick' | null;
  direction: 'ascending' | 'descending';
}
