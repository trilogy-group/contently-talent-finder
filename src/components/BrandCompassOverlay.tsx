
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ReactMarkdown from 'react-markdown';

interface BrandVoice {
  id: number;
  name: string;
  description: string;
  tonePillars: string[];
  contentThemes: string[];
}

interface BrandCompassOverlayProps {
  onClose: () => void;
  brandVoices: BrandVoice[];
  compassContent: string;
  setCompassContent: (content: string) => void;
}

export const BrandCompassOverlay = ({
  onClose,
  brandVoices,
  compassContent,
  setCompassContent,
}: BrandCompassOverlayProps) => {
  const handleGenerate = () => {
    const sampleMarkdown = `# Brand Voice Guidelines

## Overview
${brandVoices[0].description}

## Tone Pillars
${brandVoices[0].tonePillars.map(pillar => `- **${pillar}**: How we express our ${pillar.toLowerCase()} voice\n`).join('')}

## Content Themes
${brandVoices[0].contentThemes.map(theme => `- **${theme}**: Strategic focus on ${theme.toLowerCase()}\n`).join('')}

## Detailed Guidelines

### Writing Style
- Use clear, concise language
- Maintain professional tone while being accessible
- Focus on accuracy and precision
- Back claims with data and research

### Content Structure
- Lead with key insights
- Use descriptive headings and subheadings
- Include relevant examples and case studies
- Conclude with actionable takeaways

### Voice Characteristics
- Authoritative but not condescending
- Educational and informative
- Solution-oriented
- Forward-thinking and innovative

### Best Practices
- Support statements with evidence
- Use industry-standard terminology
- Maintain consistent tone across all content
- Address reader pain points directly
`;
    setCompassContent(sampleMarkdown);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full">
        <div className="bg-brand-primary w-full">
          <div className="flex items-center justify-between w-full px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-brand-lighter"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-white">
              Brand Compass
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGenerate}
              className="text-white hover:bg-brand-lighter"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              <Textarea
                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm p-6"
                placeholder="Edit your brand compass details..."
                value={compassContent}
                onChange={(e) => setCompassContent(e.target.value)}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto p-6">
              <Card className="h-full overflow-auto p-6 prose prose-slate max-w-none">
                <ReactMarkdown>
                  {compassContent}
                </ReactMarkdown>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
