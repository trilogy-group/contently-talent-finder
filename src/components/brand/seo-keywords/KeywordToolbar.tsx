import { Upload, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface KeywordToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onAddKeyword: () => void;
}

export const KeywordToolbar = ({ onUpload, onDownload, onAddKeyword }: KeywordToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onUpload}
              className="rounded-full h-10 w-10 border-brand-primary/30 text-brand-primary hover:bg-blue-50"
            >
              <Upload className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload CSV</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onDownload}
              className="rounded-full h-10 w-10 border-brand-primary/30 text-brand-primary hover:bg-blue-50"
            >
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download keywords</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              onClick={onAddKeyword}
              className="rounded-full h-10 w-10 bg-brand-primary hover:bg-brand-darker text-white"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add keywords</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
