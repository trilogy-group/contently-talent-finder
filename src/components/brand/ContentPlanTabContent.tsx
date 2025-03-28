import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, FileText, BookOpen, PresentationIcon, Search, PenLine, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { showToastAlert } from "@/components/ui/toast-alert";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { contentStrategyApi } from "@/utils/api";
import { ContentPlan, ContentFormat } from "@/types/content";

interface ContentPlanTabContentProps {
  contentPlan: ContentPlan | null;
  setContentPlan: (plan: ContentPlan | null) => void;
  isLoading?: boolean;
}

export const ContentPlanTabContent: React.FC<ContentPlanTabContentProps> = ({
  contentPlan,
  setContentPlan,
  isLoading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormats, setEditingFormats] = useState<ContentFormat[]>([]);
  const [planName, setPlanName] = useState("");
  const { showConfirm, confirmDialog } = useConfirmDialog();

  // Get format icon based on content type
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "article / blog post":
        return <FileText className="h-5 w-5" />;
      case "ebook":
        return <BookOpen className="h-5 w-5" />;
      case "presentation / brochure":
        return <PresentationIcon className="h-5 w-5" />;
      case "original research":
        return <Search className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Calculate quarterly spend for a plan
  const calculateQuarterlySpend = (formats: ContentFormat[]) => {
    return formats.reduce((total, format) => {
      const multiplier = getFrequencyMultiplier(format.frequency);
      return total + format.price * format.quantity * multiplier;
    }, 0);
  };

  // Get frequency multiplier for quarterly calculation
  const getFrequencyMultiplier = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "monthly":
        return 3;
      case "quarterly":
        return 1;
      case "yearly":
        return 0.25;
      default:
        return 1;
    }
  };

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Convert frequency to yearly format for display
  const getYearlyFrequency = (frequency: string, quantity: number) => {
    switch (frequency.toLowerCase()) {
      case "monthly":
        return `${quantity * 12} yearly`;
      case "quarterly":
        return `${quantity * 4} yearly`;
      case "yearly":
        return `${quantity} yearly`;
      default:
        return `${quantity} ${frequency.toLowerCase()}`;
    }
  };

  // Start editing the plan
  const startEditing = () => {
    if (contentPlan) {
      setPlanName(contentPlan.name);
      setEditingFormats([...contentPlan.contentFormats]);
    } else {
      setPlanName("");
      setEditingFormats([]);
    }
    setIsEditing(true);
  };

  // Save the plan
  const savePlan = async () => {
    if (!planName.trim()) {
      showToastAlert("Please enter a plan name", "error");
      return;
    }

    if (editingFormats.length === 0) {
      showToastAlert("Please add at least one content format", "warning");
      return;
    }

    try {
      const updatedPlan: ContentPlan = {
        id: contentPlan?.id || Date.now().toString(),
        name: planName,
        contentFormats: editingFormats,
      };

      await contentStrategyApi.updatePlan(updatedPlan);
      setContentPlan(updatedPlan);
      setIsEditing(false);
      showToastAlert('Content plan updated successfully!', 'success');
    } catch (error) {
      console.error('Error saving content plan:', error);
      showToastAlert('Error saving content plan. Please try again.', 'error');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    if (contentPlan) {
      setPlanName(contentPlan.name);
      setEditingFormats([...contentPlan.contentFormats]);
    } else {
      setPlanName("");
      setEditingFormats([]);
    }
  };

  // Update a content format field
  const updateContentFormat = (id: string, field: keyof ContentFormat, value: any) => {
    setEditingFormats(editingFormats.map(format => 
      format.id === id ? { ...format, [field]: value } : format
    ));
  };

  // Add a new content format
  const addContentFormat = () => {
    const newFormat: ContentFormat = {
      id: Date.now().toString(),
      format: "Article / blog post",
      subFormat: "",
      quantity: 1,
      frequency: "Monthly",
      price: 0,
    };
    setEditingFormats([...editingFormats, newFormat]);
  };

  // Remove a content format
  const removeContentFormat = (id: string) => {
    setEditingFormats(editingFormats.filter(format => format.id !== id));
  };

  // Format options
  const formatOptions = [
    "Article / blog post",
    "eBook",
    "Presentation / brochure",
    "Original research",
    "Video",
    "Podcast",
    "Infographic",
    "Newsletter",
    "White paper",
    "Case study"
  ];

  // Sub-format options based on format
  const getSubFormatOptions = (format: string) => {
    switch (format) {
      case "Article / blog post":
        return ["Reported article", "Opinion piece", "How-to guide", "Listicle"];
      case "eBook":
        return ["Educational", "Guide", "Report", "Collection"];
      case "Presentation / brochure":
        return ["Data-driven", "Sales", "Educational", "Training"];
      default:
        return [];
    }
  };

  // Frequency options
  const frequencyOptions = ["Monthly", "Quarterly", "Yearly"];

  // Total quarterly spend across all plans
  const totalQuarterlySpend = contentPlan ? calculateQuarterlySpend(contentPlan.contentFormats) : 0;

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Plan name input */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        PLAN NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Enter plan name"
                      />
                    </div>

                    {/* Content formats */}
                    <div className="space-y-6">
                      {editingFormats.map((format) => (
                        <div key={format.id} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                          {/* Format content here */}
                          {/* ... existing format content ... */}
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addContentFormat}
                        className="w-full py-6 border-dashed border-2 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        ADD FORMAT
                      </Button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button onClick={savePlan}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-orange-400">
                      {contentPlan ? contentPlan.name : "No content plan defined yet"}
                    </h2>
                    
                    {contentPlan ? (
                      <div className="space-y-2">
                        {contentPlan.contentFormats.map((format) => (
                          <div key={format.id} className="flex items-start">
                            <div className="h-6 w-6 mt-1 mr-2">
                              {getFormatIcon(format.format)}
                            </div>
                            <div>
                              {format.quantity} {format.frequency.toLowerCase()} {format.format}{format.quantity > 1 ? 's' : ''} 
                              {format.subFormat ? ` (${format.subFormat})` : ''} at {formatCurrency(format.price)} each
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mb-4">
                        Create your first content plan to organize your content strategy
                      </p>
                    )}

                    <Button 
                      onClick={startEditing}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {contentPlan ? "Edit Plan" : "Create Your First Plan"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
