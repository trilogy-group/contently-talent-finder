import { useState, useEffect } from "react";
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
  selectedPublication: string;
}

export const ContentPlanTabContent: React.FC<ContentPlanTabContentProps> = ({
  contentPlan,
  setContentPlan,
  isLoading = false,
  selectedPublication
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormats, setEditingFormats] = useState<ContentFormat[]>([]);
  const [planName, setPlanName] = useState("");
  const { showConfirm, confirmDialog } = useConfirmDialog();
  const [formatOptions, setFormatOptions] = useState<Array<{value: string, label: string, dbValue: string}>>([]);

  // Add useEffect to fetch options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${'https://9w2hge8i7d.execute-api.us-east-1.amazonaws.com/prod'}/options`);
        const data = await response.json();
        // Map the format options to match the database values
        const mappedFormats = data.storyFormats.map(format => ({
          value: format.value,
          label: format.label,
          // Add a mapping for the database value
          dbValue: format.value.toLowerCase().replace(/[\s\/]+/g, '')
        }));
        setFormatOptions(mappedFormats);
      } catch (error) {
        console.error('Error fetching format options:', error);
      }
    };

    fetchOptions();
  }, []);

  // Get format icon based on content type
  const getFormatIcon = (format: string) => {
    const normalizedFormat = format.toLowerCase();
    switch (normalizedFormat) {
      case "article":
      case "article / blog post":
        return <FileText className="h-5 w-5" />;
      case "ebook":
        return <BookOpen className="h-5 w-5" />;
      case "presentation":
      case "presentation / brochure":
        return <PresentationIcon className="h-5 w-5" />;
      case "research":
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
      return total + format.estimated_pay_per_story * format.story_count * multiplier;
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
    if (!amount) return null;
    const adjustedAmount = Math.round(amount / 100);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(adjustedAmount);
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
      setEditingFormats([...contentPlan.planned_stories]);
    } else {
      setPlanName("");
      setEditingFormats([]);
    }
    setIsEditing(true);
  };

  // Save the plan
  const handleSave = async () => {
    if (!planName.trim()) {
      showToastAlert("Please enter a plan name", "error");
      return;
    }

    if (editingFormats.length === 0) {
      showToastAlert("Please add at least one content format", "warning");
      return;
    }

    try {
      const updatedPlan = {
        pillar: {
          id: contentPlan?.id || Date.now().toString(),
          name: planName,
          planned_stories_attributes: editingFormats.map(format => ({
            id: format.id || Date.now().toString(),
            story_format: format.story_format,
            subformat: format.subformat,
            story_count: format.story_count,
            frequency: format.frequency.toLowerCase(),
            estimated_pay_per_story_in_dollars: format.estimated_pay_per_story / 100
          }))
        }
      };

      await contentStrategyApi.updatePlan(updatedPlan, selectedPublication);
      setContentPlan({
        id: updatedPlan.pillar.id,
        name: updatedPlan.pillar.name,
        planned_stories: editingFormats.map(format => ({
          ...format,
          id: format.id || Date.now().toString(),
          frequency: format.frequency.toLowerCase()
        }))
      });
      setIsEditing(false);
      showToastAlert('Content plan updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating content plan:', error);
      showToastAlert('Error updating content plan. Please try again.', 'error');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    if (contentPlan) {
      setPlanName(contentPlan.name);
      setEditingFormats([...contentPlan.planned_stories]);
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
      story_format: "article",
      subformat: "",
      story_count: 1,
      frequency: "monthly",
      estimated_pay_per_story: 0,
    };
    setEditingFormats([...editingFormats, newFormat]);
  };

  // Remove a content format
  const removeContentFormat = (id: string) => {
    setEditingFormats(editingFormats.filter(format => format.id !== id));
  };

  // Update frequency options to include value/label pairs
  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" }
  ];

  // Total quarterly spend across all plans
  const totalQuarterlySpend = contentPlan ? calculateQuarterlySpend(contentPlan.planned_stories) : 0;

  // Update getSubFormatOptions to work with format labels
  const getSubFormatOptions = (format: string) => {
    switch (format.toLowerCase()) {
      case "article / blog post":
        return ["Reported article", "Opinion piece", "How-to guide", "Listicle"];
      case "ebook":
        return ["Educational", "Guide", "Report", "Collection"];
      case "presentation / brochure":
        return ["Data-driven", "Sales", "Educational", "Training"];
      default:
        return [];
    }
  };

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
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-4">
                              {/* Story Format */}
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Format</Label>
                                <Select
                                  value={formatOptions.find(opt => opt.dbValue === format.story_format)?.label || ''}
                                  onValueChange={(value) => {
                                    const selectedFormat = formatOptions.find(opt => opt.label === value);
                                    updateContentFormat(format.id, "story_format", selectedFormat?.dbValue || value);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {formatOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.label}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Subformat - only show if subformat options exist */}
                              {getSubFormatOptions(format.story_format).length > 0 && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Subformat</Label>
                                  <Select
                                    value={format.subformat}
                                    onValueChange={(value) => updateContentFormat(format.id, "subformat", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select subformat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getSubFormatOptions(format.story_format).map((subformat) => (
                                        <SelectItem key={subformat} value={subformat}>
                                          {subformat}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {/* Story Count */}
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Number of Stories</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={format.story_count}
                                  onChange={(e) => updateContentFormat(format.id, "story_count", parseInt(e.target.value) || 1)}
                                />
                              </div>

                              {/* Frequency */}
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Frequency</Label>
                                <Select
                                  value={format.frequency.toLowerCase()}
                                  onValueChange={(value) => updateContentFormat(format.id, "frequency", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {frequencyOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Estimated Pay */}
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Estimated Pay per Story</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={format.estimated_pay_per_story / 100}
                                  onChange={(e) => updateContentFormat(format.id, "estimated_pay_per_story", Math.round(parseFloat(e.target.value) * 100) || 0)}
                                />
                              </div>
                            </div>

                            {/* Remove Format Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeContentFormat(format.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
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
                      <Button onClick={handleSave}>
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
                        {contentPlan.planned_stories.map((format) => (
                          <div key={format.id} className="flex items-start">
                            <div className="h-6 w-6 mt-1 mr-2">
                              {getFormatIcon(format.story_format)}
                            </div>
                            <div>
                              {format.story_count} {format.frequency.toLowerCase()} {format.story_format}{format.story_count > 1 ? 's' : ''} 
                              {format.subformat ? ` (${format.subformat})` : ''} {format.estimated_pay_per_story ? `at ${formatCurrency(format.estimated_pay_per_story)} each` : ''}
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
