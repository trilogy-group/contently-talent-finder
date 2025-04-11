import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CardRadioSelector } from "@/components/brand/CardRadioSelector";
import { Target, Users, Wand2, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { contentStrategyApi } from "@/utils/api";
import { showToastAlert } from "@/components/ui/toast-alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
  toggleKpi: (kpi: string) => void;
  kpiOptions: { value: string; label: string }[];
  isEditing: boolean;
  isLoading?: boolean;
}

export const GoalsTabContent: React.FC<GoalsTabContentProps> = ({
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
  isEditing,
  isLoading = false
}) => {
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
  const [previousIsEditing, setPreviousIsEditing] = useState(isEditing);

  useEffect(() => {
    if (previousIsEditing && !isEditing) {
      handleSave();
    }
    setPreviousIsEditing(isEditing);
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await contentStrategyApi.updateMissionAndGoals({
        content_strategy: {
          mission: contentMission,
          goal: primaryGoal.replace(/_/g, ' ')
                         .split(' ')
                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                         .join(' '),
          organization_type: orgType.toUpperCase(),
          kpis: selectedKpis.map(kpi => 
            kpi.replace(/_/g, ' ')
               .split(' ')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
               .join(' ')
          )
        }
      });
      showToastAlert('Goals and mission updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating goals and mission:', error);
      showToastAlert('Error updating goals and mission. Please try again.', 'error');
    }
  };

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
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded" />
              <div className="h-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary Goal Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Primary Goal</h3>
                <p className="text-sm text-gray-500 mb-4">What's the main objective of your content strategy?</p>
                
                <RadioGroup
                  value={primaryGoal}
                  onValueChange={setPrimaryGoal}
                  disabled={!isEditing}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="brand_awareness" id="brand_awareness" />
                    <Label htmlFor="brand_awareness">Brand Awareness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lead_generation" id="lead_generation" />
                    <Label htmlFor="lead_generation">Lead Generation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thought_leadership" id="thought_leadership" />
                    <Label htmlFor="thought_leadership">Thought Leadership</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Organization Type Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Organization Type</h3>
                <p className="text-sm text-gray-500 mb-4">What type of organization are you creating content for?</p>
                
                <RadioGroup
                  value={orgType}
                  onValueChange={setOrgType}
                  disabled={!isEditing}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b2b" id="b2b" />
                    <Label htmlFor="b2b">B2B</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b2c" id="b2c" />
                    <Label htmlFor="b2c">B2C</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Content Mission Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Content Mission</h3>
                <p className="text-sm text-gray-500 mb-4">Define the purpose of your content strategy in a clear, concise statement.</p>
                
                {isEditing ? (
                  <Textarea
                    value={contentMission}
                    onChange={(e) => setContentMission(e.target.value)}
                    placeholder="Enter your content mission statement..."
                    className="h-32"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line min-h-[80px]">
                    {contentMission || "No content mission defined."}
                  </div>
                )}
              </div>

              {/* KPIs Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Key Performance Indicators (KPIs)</h3>
                <p className="text-sm text-gray-500 mb-4">Select the metrics you'll use to measure success.</p>
                
                <div className="space-y-2">
                  {kpiOptions.map((kpi) => (
                    <div key={kpi.value} className="flex items-center justify-between">
                      <Label htmlFor={kpi.value}>{kpi.label}</Label>
                      <Switch
                        id={kpi.value}
                        checked={selectedKpis.includes(kpi.value)}
                        onCheckedChange={() => toggleKpi(kpi.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">AI Recommendations</h3>
                    <p className="text-sm text-gray-500">Enable AI-powered content recommendations</p>
                  </div>
                  <Switch
                    checked={needsRecommendations}
                    onCheckedChange={setNeedsRecommendations}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
