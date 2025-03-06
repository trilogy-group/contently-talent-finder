
import React, { useState } from "react";
import { Send, MessageSquare, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PatternCard } from "./PatternCard";

interface ContentAnalyzerProps {
  initialContent?: string;
  documentType: string;
  brandVoice: string;
  guidelines?: string[];
}

interface Suggestion {
  title: string;
  description: string;
  impact: string;
  textRange: [number, number];
  suggestion: string;
}

const demoText = `We are pleased to announce that our company has achieved remarkable growth in the last quarter. Despite of the challenging market conditions, our team has worked tirelessly to ensure we maintain our competitive edge. The data shows that we have exceeded our targets by 25%, which is a testament to our dedication and hard work.

In respects to our future plans, we will continue to invest heavily in innovation and customer satisfaction. We believe that these investments will bare fruit in the coming months. Our customers have been very satisfied with our services, and we have received alot of positive feedback.`;

const sampleSuggestions: Suggestion[] = [
  {
    title: "Incorrect Preposition",
    description: "The phrase 'despite of' is incorrect. Use 'despite' without 'of'.",
    impact: "Improved Grammar",
    textRange: [115, 124],
    suggestion: "despite",
  },
  {
    title: "Word Choice",
    description: "'In respects to' should be 'With respect to' or 'Regarding'.",
    impact: "Better Clarity",
    textRange: [276, 289],
    suggestion: "With respect to",
  },
  {
    title: "Spelling Error",
    description: "'bare fruit' should be 'bear fruit'.",
    impact: "Correct Usage",
    textRange: [379, 389],
    suggestion: "bear fruit",
  },
  {
    title: "Common Mistake",
    description: "'alot' should be written as 'a lot'.",
    impact: "Proper Spelling",
    textRange: [485, 489],
    suggestion: "a lot",
  },
];

export const ContentAnalyzer = ({ 
  initialContent = "", 
  documentType, 
  brandVoice,
  guidelines = [] 
}: ContentAnalyzerProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<Suggestion | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);

  const analyzeContent = (text: string) => {
    setIsAnalyzing(true);
    console.log("Analyzing with guidelines:", guidelines);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  React.useEffect(() => {
    analyzeContent(content);
  }, [content, documentType, brandVoice]);

  const applySuggestion = () => {
    if (selectedSuggestion) {
      const [start, end] = selectedSuggestion.textRange;
      const newContent = 
        content.substring(0, start) + 
        selectedSuggestion.suggestion + 
        content.substring(end);
      setContent(newContent);
      setSelectedSuggestion(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, isUser: true }]);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "I'm analyzing your content and will help you improve it. What specific aspects would you like me to focus on?", 
          isUser: false 
        }]);
      }, 1000);
      setMessage("");
    }
  };

  const textToAnalyze = content || demoText;
  const suggestions = content ? [] : sampleSuggestions;

  const renderHighlightedContent = () => {
    let lastIndex = 0;
    const elements: JSX.Element[] = [];
    const currentSuggestions = content ? [] : sampleSuggestions;

    currentSuggestions.forEach((suggestion, idx) => {
      const [start, end] = suggestion.textRange;

      if (start > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>
            {textToAnalyze.substring(lastIndex, start)}
          </span>
        );
      }

      elements.push(
        <span
          key={`highlight-${idx}`}
          className="bg-yellow-100 cursor-pointer hover:bg-yellow-200 transition-colors"
          onMouseEnter={() => setHoveredSuggestion(suggestion)}
          onMouseLeave={() => setHoveredSuggestion(null)}
          onClick={() => setSelectedSuggestion(suggestion)}
        >
          {textToAnalyze.substring(start, end)}
        </span>
      );

      lastIndex = end;
    });

    if (lastIndex < textToAnalyze.length) {
      elements.push(
        <span key="text-end">
          {textToAnalyze.substring(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const renderChatPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Chat Assistant</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowChat(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ask about your content..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Content Editor</h2>
          </div>
          <div className="min-h-[600px] whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700">
            {renderHighlightedContent()}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 flex flex-col h-full">
          {!showChat ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  {selectedSuggestion ? "Suggestion Details" : "Live Analysis"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {(selectedSuggestion || hoveredSuggestion) ? (
                  <div className="space-y-4">
                    <PatternCard
                      title={(selectedSuggestion || hoveredSuggestion)!.title}
                      description={(selectedSuggestion || hoveredSuggestion)!.description}
                      impact={(selectedSuggestion || hoveredSuggestion)!.impact}
                      className="cursor-pointer hover:border-emerald-500 border-2 transition-colors"
                    />
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2">Suggested Change:</p>
                      <p className="text-sm text-slate-600">
                        {(selectedSuggestion || hoveredSuggestion)!.suggestion}
                      </p>
                    </div>
                    {selectedSuggestion && (
                      <Button className="w-full" onClick={applySuggestion}>
                        Apply Suggestion
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <p className="text-center mb-2">
                      {isAnalyzing ? "Analyzing content..." : content ? "Your content is being analyzed" : "This is a demo document. Add your own content to get started"}
                    </p>
                    <p className="text-sm text-center text-slate-400">
                      Optimizing for: {documentType}
                    </p>
                    <p className="text-sm text-center text-slate-400">
                      Brand Voice: {brandVoice}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            renderChatPanel()
          )}
        </Card>
      </div>
    </div>
  );
};
