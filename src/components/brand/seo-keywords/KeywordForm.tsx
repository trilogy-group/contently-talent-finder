
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateKeywordStats, SeoKeyword } from "./utils";

interface KeywordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKeywords: (keywords: SeoKeyword[]) => void;
}

export const KeywordForm = ({ isOpen, onClose, onAddKeywords }: KeywordFormProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;

    // Split by commas and trim each keyword
    const keywordsArray = newKeyword
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const newKeywords = keywordsArray.map(keywordText => {
      const { searchResults, searchVolume, costPerClick } = generateKeywordStats();

      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        keyword: keywordText,
        searchResults,
        searchVolume,
        costPerClick
      };
    });

    onAddKeywords(newKeywords);
    setNewKeyword("");
    onClose();
  };

  const handleCancel = () => {
    setNewKeyword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light text-orange-400">Add SEO keywords</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="keyword" className="text-gray-700 text-lg uppercase">
              KEYWORD <span className="text-red-500">*</span>
            </Label>
            <p className="text-gray-500 text-sm">
              Enter a comma-separated list of keywords (e.g., "travel deals, travel rewards, flight deals")
            </p>
            <div className="relative">
              <Input
                id="keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Example: travel rewards deal, flight deal, hotel discount"
                className="pr-10 border-2 h-12 text-lg"
              />
              {newKeyword && (
                <button
                  onClick={() => setNewKeyword("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="text-brand-primary hover:text-brand-darker hover:bg-blue-50 text-lg"
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleAddKeyword}
            className="bg-brand-primary hover:bg-brand-darker text-white text-lg px-8 py-2 h-auto"
            disabled={!newKeyword.trim()}
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
