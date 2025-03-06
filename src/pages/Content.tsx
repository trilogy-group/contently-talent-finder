
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ContentAnalyzer } from "@/components/ContentAnalyzer";
import { BrandCompassOverlay } from "@/components/BrandCompassOverlay";
import { TitleBar } from "@/components/TitleBar";

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
          <TitleBar 
            breadcrumbs={[
              { label: "Content", href: "/index" },
              { label: location.state?.title || "New Document" }
            ]} 
          />
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
