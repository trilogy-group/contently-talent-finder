
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ContentEditorProps {
  newContent: string;
  setNewContent: (content: string) => void;
  onAnalyze: (content: string) => void;
  showFiltersHint?: boolean;
}

export const ContentEditor = ({ newContent, setNewContent, onAnalyze, showFiltersHint = false }: ContentEditorProps) => {
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewContent(event.target.result.toString());
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = () => {
    if (newContent.trim()) {
      onAnalyze(newContent);
      navigate("/content", { 
        state: { 
          content: newContent,
          title: newContent.split("\n")[0].slice(0, 50) + "..."
        } 
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {showFiltersHint 
            ? "Use the filters to select a story" 
            : "Create new content"}
        </h2>
        <p className="text-sm text-slate-600">
          {showFiltersHint 
            ? "Or paste new content in the window below"
            : "Drag and drop or paste content in the window below"}
        </p>
      </div>
      <div
        className="min-h-[600px] border-2 border-dashed border-slate-200 rounded-lg"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Textarea
          className="w-full h-full min-h-[600px] resize-none border-none"
          placeholder="Paste or type your content here..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Button 
          className="w-full" 
          onClick={handleAnalyze}
          disabled={!newContent.trim()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Analyze Content
        </Button>
      </div>
    </Card>
  );
};
