
import { Button } from "@/components/ui/button";
import { FileText, PenLine } from "lucide-react";

interface ContentModeToggleProps {
  isCreatingNew: boolean;
  onToggle: (isCreatingNew: boolean) => void;
}

export const ContentModeToggle = ({ isCreatingNew, onToggle }: ContentModeToggleProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant={isCreatingNew ? "default" : "outline"}
        onClick={() => onToggle(true)}
        className="flex items-center gap-2"
      >
        <PenLine className="h-4 w-4" />
        New Content
      </Button>
      <Button
        variant={!isCreatingNew ? "default" : "outline"}
        onClick={() => onToggle(false)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Browse Documents
      </Button>
    </div>
  );
};
