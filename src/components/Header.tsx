import { User, FileText, ChevronDown, File, ArrowRight, Search, Compass, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface AppDocument {
  id: number;
  title: string;
  date: string;
  score: number;
  type: string;
  assignee: string;
  tags: string[];
  content: string;
}

interface HeaderProps {
  documents: AppDocument[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBrandCompassClick: () => void;
  onRemoveDocument: (id: number) => void;
}

export const Header = ({ 
  documents, 
  searchQuery, 
  setSearchQuery,
  onBrandCompassClick,
  onRemoveDocument
}: HeaderProps) => {
  const navigate = useNavigate();
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-brand-primary w-full">
      <div className="w-full px-6 py-4 flex items-center">
        <div className="flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-brand-lighter flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Recent Documents
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[400px]">
              <div className="p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px]">
                {filteredDocuments.map((doc) => (
                  <DropdownMenuItem
                    key={doc.id}
                    className="flex items-center gap-3 p-3 cursor-pointer group"
                  >
                    <div 
                      className="flex-1 flex items-center gap-3"
                      onClick={() => navigate("/content", { 
                        state: { title: doc.title, isExisting: true } 
                      })}
                    >
                      <File className="h-4 w-4 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{doc.title}</p>
                        <p className="text-xs text-slate-500">
                          {doc.date} • Score: {doc.score}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDocument(doc.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="text-3xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          ContentLens
        </h1>
        
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-brand-lighter">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={onBrandCompassClick}>
                <Compass className="h-4 w-4 mr-2" />
                Brand Compass
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
