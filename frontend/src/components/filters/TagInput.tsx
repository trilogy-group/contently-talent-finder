
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagInput = ({ tags, onAddTag, onRemoveTag }: TagInputProps) => {
  const [newTag, setNewTag] = useState("");

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Add tags..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleTagAdd}
        className="w-full"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
