
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, Check, AlertCircle } from "lucide-react";
import { NewGuidelineDialog } from "@/components/dialogs/NewGuidelineDialog";
import { GuidelineFormData } from "@/types/guidelines";

interface Guideline {
  id: string;
  title: string;
  description: string;
  contentType: string;
  publication: string;
  audience: string;
  status: "active" | "draft";
  lastModified: string;
  rules: {
    tone: string[];
    style: string[];
    terminology: string[];
  };
}

interface GuidelineCardProps {
  guideline: Guideline;
  onUpdate: (id: string, data: GuidelineFormData) => void;
  onDelete: (id: string) => void;
}

export function GuidelineCard({ guideline, onUpdate, onDelete }: GuidelineCardProps) {
  const formatRules = (rules: string[]) => {
    if (!rules?.length) return "...";
    if (rules.length === 1) return rules[0];
    return `${rules[0]} ...`;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <CardHeader className="space-y-2 pb-4">
          <div>
            <CardTitle className="line-clamp-1">
              {guideline.title}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardDescription className="mt-1 truncate">
                    {guideline.description || "..."}
                  </CardDescription>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-words">
                  {guideline.description || "No description provided"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                {guideline.contentType}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 whitespace-nowrap">
                {guideline.publication}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 whitespace-nowrap">
                {guideline.audience}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {guideline.status === "active" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Draft
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border text-left">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Tone Rules</h4>
                  <p className="text-sm text-slate-600 truncate">
                    {formatRules(guideline.rules.tone)}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] break-words">
                {guideline.rules.tone.length > 0 ? guideline.rules.tone.join(", ") : "No tone rules defined"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border text-left">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Style Rules</h4>
                  <p className="text-sm text-slate-600 truncate">
                    {formatRules(guideline.rules.style)}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] break-words">
                {guideline.rules.style.length > 0 ? guideline.rules.style.join(", ") : "No style rules defined"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border text-left">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Terminology Rules</h4>
                  <p className="text-sm text-slate-600 truncate">
                    {formatRules(guideline.rules.terminology)}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] break-words">
                {guideline.rules.terminology.length > 0 ? guideline.rules.terminology.join(", ") : "No terminology rules defined"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </div>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-slate-500 whitespace-nowrap">
            Last modified: {guideline.lastModified}
          </p>
          <div className="flex space-x-2">
            <div>
              <NewGuidelineDialog 
                mode="edit"
                initialData={{
                  title: guideline.title,
                  description: guideline.description,
                  contentType: guideline.contentType,
                  publication: guideline.publication,
                  audience: guideline.audience,
                  status: guideline.status,
                  categories: {
                    tone: { name: "Tone", rules: guideline.rules.tone },
                    style: { name: "Style", rules: guideline.rules.style },
                    terminology: { name: "Terminology", rules: guideline.rules.terminology }
                  }
                }}
                onSave={(formData) => onUpdate(guideline.id, formData)}
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(guideline.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
