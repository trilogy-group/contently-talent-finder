
import { Button } from "@/components/ui/button";

interface EmptyKeywordsProps {
  onAddKeyword: () => void;
}

export const EmptyKeywords = ({ onAddKeyword }: EmptyKeywordsProps) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium text-gray-700 mb-2">No SEO keywords defined yet</h3>
      <p className="text-gray-500 mb-4">
        Add keywords to help improve your content's search engine visibility
      </p>
      <Button 
        onClick={onAddKeyword}
        className="bg-brand-primary hover:bg-brand-darker text-white"
      >
        Add Your First Keyword
      </Button>
    </div>
  );
};
