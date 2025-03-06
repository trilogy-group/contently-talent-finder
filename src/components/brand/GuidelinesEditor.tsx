import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Plus } from "lucide-react";
import { GuidelineDetail } from "@/types/brand-compass";
import { toast } from "sonner";

interface GuidelinesEditorProps {
  guidelines: GuidelineDetail[];
  onBack: () => void;
  onUpdate: (guidelines: GuidelineDetail[]) => void;
}

export const GuidelinesEditor = ({ guidelines, onBack, onUpdate }: GuidelinesEditorProps) => {
  const handleGuidelineUpdate = (id: number, updates: Partial<GuidelineDetail>) => {
    onUpdate(
      guidelines.map(guideline =>
        guideline.id === id
          ? { ...guideline, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : guideline
      )
    );
    toast.success("Guideline updated successfully");
  };

  const handleAttributeUpdate = (id: number, attribute: keyof GuidelineDetail['attributes'], value: number) => {
    onUpdate(
      guidelines.map(guideline =>
        guideline.id === id
          ? {
              ...guideline,
              attributes: {
                ...guideline.attributes,
                [attribute]: value
              },
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : guideline
      )
    );
  };

  const handleStatusToggle = (id: number) => {
    onUpdate(
      guidelines.map(guideline =>
        guideline.id === id
          ? {
              ...guideline,
              status: guideline.status === "active" ? "draft" : "active",
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : guideline
      )
    );
    toast.success("Status updated successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Guideline
          </Button>
        </div>

        <div className="grid gap-6">
          {guidelines.map((guideline) => (
            <Card key={guideline.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <Input 
                      value={guideline.title}
                      onChange={(e) => handleGuidelineUpdate(guideline.id, { title: e.target.value })}
                      className="text-xl font-semibold mb-2"
                    />
                    <Textarea 
                      value={guideline.description}
                      onChange={(e) => handleGuidelineUpdate(guideline.id, { description: e.target.value })}
                      className="text-sm text-slate-600"
                    />
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-slate-600">
                      {guideline.status === "active" ? "Active" : "Draft"}
                    </span>
                    <Switch
                      checked={guideline.status === "active"}
                      onCheckedChange={() => handleStatusToggle(guideline.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Technical Knowledge</span>
                        <span className="text-sm text-slate-600">{guideline.attributes.technicalKnowledge}%</span>
                      </div>
                      <Slider
                        value={[guideline.attributes.technicalKnowledge]}
                        onValueChange={(value) => handleAttributeUpdate(guideline.id, 'technicalKnowledge', value[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Authoritative Tone</span>
                        <span className="text-sm text-slate-600">{guideline.attributes.authoritative}%</span>
                      </div>
                      <Slider
                        value={[guideline.attributes.authoritative]}
                        onValueChange={(value) => handleAttributeUpdate(guideline.id, 'authoritative', value[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Accessibility</span>
                        <span className="text-sm text-slate-600">{guideline.attributes.accessibility}%</span>
                      </div>
                      <Slider
                        value={[guideline.attributes.accessibility]}
                        onValueChange={(value) => handleAttributeUpdate(guideline.id, 'accessibility', value[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <Input 
                      value={guideline.category}
                      onChange={(e) => handleGuidelineUpdate(guideline.id, { category: e.target.value })}
                      className="w-32"
                    />
                    <span>Updated: {guideline.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
