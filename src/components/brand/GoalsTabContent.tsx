import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CardRadioSelector } from "@/components/brand/CardRadioSelector";
import { Target, Users, Wand2, Upload } from "lucide-react";
import { useState, useRef } from "react";

interface KpiOption {
  id: string;
  label: string;
}

interface GoalsTabContentProps {
  primaryGoal: string;
  setPrimaryGoal: (value: string) => void;
  orgType: string;
  setOrgType: (value: string) => void;
  contentMission: string;
  setContentMission: (value: string) => void;
  needsRecommendations: boolean;
  setNeedsRecommendations: (value: boolean) => void;
  selectedKpis: string[];
  toggleKpi: (kpiId: string) => void;
  kpiOptions: KpiOption[];
  isEditing: boolean;
}

export function GoalsTabContent({
  primaryGoal,
  setPrimaryGoal,
  orgType,
  setOrgType,
  contentMission,
  setContentMission,
  needsRecommendations,
  setNeedsRecommendations,
  selectedKpis,
  toggleKpi,
  kpiOptions,
  isEditing
}: GoalsTabContentProps) {
  const primaryGoalOptions = [
    {
      value: "brand_awareness",
      label: "Brand awareness",
      icon: <Target className="h-5 w-5" />,
    },
    {
      value: "lead_generation",
      label: "Lead generation",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const orgTypeOptions = [
    {
      value: "b2c",
      label: "B2C",
      icon: <Users className="h-5 w-5" />,
    },
    {
      value: "b2b",
      label: "B2B",
      icon: <Target className="h-5 w-5" />,
    },
  ];

  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIEnhance = () => {
    setIsEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      setContentMission("Our content mission is to educate and inspire our audience with valuable insights about financial wellness and investment strategies, helping them make informed decisions to achieve their financial goals.");
      setIsEnhancing(false);
    }, 1500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle file drop logic here
    console.log("File dropped");
  };

  const handleFileAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file selection logic here
    console.log("File selected:", e.target.files);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-2/3">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium">Primary goal</h3>
              </div>
            </div>
            <div className="w-1/3 pl-8">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium">Organization type</h3>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2/3 pr-4">
              <CardRadioSelector
                name="primary-goal"
                value={primaryGoal}
                options={primaryGoalOptions}
                onChange={setPrimaryGoal}
                disabled={!isEditing}
                className="grid-cols-2"
              />
            </div>
            <Separator orientation="vertical" className="mx-2 h-16" />
            <div className="w-1/3 pl-4">
              <CardRadioSelector
                name="org-type"
                value={orgType}
                options={orgTypeOptions}
                onChange={setOrgType}
                disabled={!isEditing}
                variant="orange"
                className="grid-cols-2"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Content mission</h3>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-brand-accent hover:text-brand-primary"
                onClick={handleAIEnhance}
                disabled={isEnhancing}
              >
                <Wand2 className={`h-5 w-5 ${isEnhancing ? 'animate-pulse' : ''}`} />
              </Button>
            )}
          </div>
          {isEditing ? (
            <Textarea 
              value={contentMission}
              onChange={(e) => setContentMission(e.target.value)}
              className="h-32"
              placeholder="Enter your content mission statement..."
            />
          ) : (
            <div className="bg-slate-50 p-3 rounded-md">
              <p className="text-sm whitespace-pre-line">{contentMission}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Content marketing KPIs</h3>
          <div className="grid grid-cols-2 gap-2">
            {kpiOptions.map(kpi => (
              <div key={kpi.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={kpi.id} 
                  checked={selectedKpis.includes(kpi.id)}
                  onCheckedChange={() => toggleKpi(kpi.id)}
                  disabled={!isEditing}
                />
                <Label htmlFor={kpi.id}>{kpi.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Prospect would like recommendations</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recommendations" 
              checked={needsRecommendations}
              onCheckedChange={(checked) => {
                setNeedsRecommendations(checked as boolean);
              }}
              disabled={!isEditing}
            />
            <Label htmlFor="recommendations">Yes, provide recommendations</Label>
          </div>
        </div>

        {isEditing && (
          <div>
            <h3 className="text-md font-medium mb-2">Additional materials</h3>
            <p className="text-sm text-gray-500 mb-2">
              Attach a document such as your visual guidelines or brand style guide
            </p>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={handleFileAreaClick}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Drag & drop files here, or click to select files</p>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
