
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentAnalyzer } from "@/components/ContentAnalyzer";
import { BrandCompassOverlay } from "@/components/BrandCompassOverlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: number;
  title: string;
  date: string;
  score: number;
}

interface ContentProps {
  documents: Document[];
  onAddDocument: (title: string) => void;
  onRemoveDocument: (id: number) => void;
}

const Content = ({ documents, onAddDocument, onRemoveDocument }: ContentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrandCompass, setShowBrandCompass] = useState(false);
  const [compassContent, setCompassContent] = useState("");
  const [brandVoices] = useState([
    {
      id: 1,
      name: "Technical Authority",
      description: "Expert-driven, precise communication that builds trust through deep industry knowledge and thought leadership.",
      tonePillars: ["Authoritative", "Clear", "Educational", "Professional"],
      contentThemes: ["Industry Insights", "Technical Deep-dives", "Best Practices", "Innovation"],
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {showBrandCompass ? (
        <BrandCompassOverlay
          onClose={() => setShowBrandCompass(false)}
          brandVoices={brandVoices}
          compassContent={compassContent}
          setCompassContent={setCompassContent}
        />
      ) : (
        <>
          <div className="w-full px-6 py-4 flex items-center justify-between bg-brand-primary">
            <Button
              variant="ghost"
              className="text-white hover:bg-brand-lighter"
              onClick={() => navigate("/index")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-white absolute left-1/2 transform -translate-x-1/2">
              {location.state?.title || "New Document"}
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-brand-lighter">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setShowBrandCompass(true)}>
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
          
          <div className="w-full px-6 py-6">
            <ContentAnalyzer
              initialContent={location.state?.content}
              documentType="Blog Post"
              brandVoice="Technical Authority"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Content;
