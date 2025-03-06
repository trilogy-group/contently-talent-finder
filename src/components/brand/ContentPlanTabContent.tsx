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

// Define content format types
type ContentFormat = {
  id: string;
  format: string;
  subFormat: string;
  quantity: number;
  frequency: string;
  price: number;
};

// Define content plan type
type ContentPlan = {
  id: string;
  name: string;
  contentFormats: ContentFormat[];
};

interface ContentPlanTabContentProps {
  contentPlans: ContentPlan[];
  setContentPlans: (plans: ContentPlan[]) => void;
}

export const ContentPlanTabContent = ({
  contentPlans,
  setContentPlans,
}: ContentPlanTabContentProps) => {
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [editingFormats, setEditingFormats] = useState<ContentFormat[]>([]);
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

  // Create a new content format
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

  // Update a content format field
  const updateContentFormat = (id: string, field: keyof ContentFormat, value: any) => {
    setEditingFormats(editingFormats.map(format => 
      format.id === id ? { ...format, [field]: value } : format
    ));
  };

  // Start creating a new plan
  const startNewPlan = () => {
    setPlanName("");
    setEditingFormats([]);
    setIsCreatingPlan(true);
    setIsEditingPlan(null);
  };

  // Start editing an existing plan
  const editPlan = (planId: string) => {
    const plan = contentPlans.find(p => p.id === planId);
    if (plan) {
      setPlanName(plan.name);
      setEditingFormats([...plan.contentFormats]);
      setIsCreatingPlan(true);
      setIsEditingPlan(planId);
    }
  };

  // Save the current plan
  const savePlan = () => {
    if (!planName.trim()) {
      showToastAlert("Please enter a plan name", "error");
      return;
    }

    if (editingFormats.length === 0) {
      showToastAlert("Please add at least one content format", "warning");
      return;
    }

    if (isEditingPlan) {
      // Update existing plan
      setContentPlans(contentPlans.map(plan => 
        plan.id === isEditingPlan 
          ? { ...plan, name: planName, contentFormats: editingFormats }
          : plan
      ));
    } else {
      // Create new plan
      const newPlan: ContentPlan = {
        id: Date.now().toString(),
        name: planName,
        contentFormats: editingFormats,
      };
      setContentPlans([...contentPlans, newPlan]);
    }

    // Reset form
    setIsCreatingPlan(false);
    setIsEditingPlan(null);
    setPlanName("");
    setEditingFormats([]);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsCreatingPlan(false);
    setIsEditingPlan(null);
    setPlanName("");
    setEditingFormats([]);
  };

  // Delete a plan
  const deletePlan = (planId: string) => {
    showConfirm(
      () => {
        setContentPlans(contentPlans.filter(plan => plan.id !== planId));
        showToastAlert("Plan deleted successfully", "success");
      },
      {
        title: "Delete Plan",
        message: "Are you sure you want to delete this plan? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger"
      }
    );
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
  const totalQuarterlySpend = contentPlans.reduce((total, plan) => {
    return total + calculateQuarterlySpend(plan.contentFormats);
  }, 0);

  return (
    <div>
      {confirmDialog}
      <div className="space-y-6">
        {isCreatingPlan ? (
          // Plan editor
          <Card className="bg-white shadow border border-gray-200">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-orange-400">
                  {isEditingPlan ? "Edit plan" : "Create content plan"}
                </h2>
                
                <div>
                  <Label htmlFor="plan-name" className="text-sm font-medium text-gray-700">
                    Plan Name
                  </Label>
                  <Input
                    id="plan-name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g. Energy, Health & wellness, Travel abroad"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800">Story formats</h3>
                  
                  {editingFormats.map((format, index) => (
                    <div 
                      key={format.id} 
                      className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative"
                    >
                      <button
                        onClick={() => removeContentFormat(format.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        aria-label="Remove format"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            FORMAT <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={format.format}
                            onValueChange={(value) => updateContentFormat(format.id, "format", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              {formatOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            SUBFORMAT
                          </Label>
                          <Select
                            value={format.subFormat}
                            onValueChange={(value) => updateContentFormat(format.id, "subFormat", value)}
                            disabled={getSubFormatOptions(format.format).length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a sub-format" />
                            </SelectTrigger>
                            <SelectContent>
                              {getSubFormatOptions(format.format).map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            NUMBER OF STORIES <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            value={format.quantity}
                            onChange={(e) => updateContentFormat(format.id, "quantity", parseInt(e.target.value) || 0)}
                            min={1}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            FREQUENCY <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={format.frequency}
                            onValueChange={(value) => updateContentFormat(format.id, "frequency", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            YOU PAY <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input
                              type="number"
                              value={format.price}
                              onChange={(e) => updateContentFormat(format.id, "price", parseInt(e.target.value) || 0)}
                              className="pl-8"
                              min={0}
                            />
                          </div>
                          <p className="text-xs text-blue-500 mt-1">
                            <a href="#" className="flex items-center hover:underline">
                              See the Content Menu
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                            </a>
                          </p>
                        </div>
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
                  <Button 
                    onClick={savePlan}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Content plans list view
          <div className="space-y-6">
            {/* Hidden button that can be triggered from the main page */}
            <Button 
              className="hidden add-plan-button" 
              onClick={() => startNewPlan()}
            >
              Add Plan
            </Button>

            {contentPlans.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No content plans defined yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first content plan to organize your content strategy
                </p>
                <Button 
                  onClick={startNewPlan}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                {contentPlans.map((plan, planIndex) => (
                  <div key={plan.id}>
                    {planIndex > 0 && <Separator />}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium">{plan.name}</h3>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => editPlan(plan.id)}
                            className="rounded-full hover:bg-gray-100"
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deletePlan(plan.id)}
                            className="rounded-full hover:bg-gray-100 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {plan.contentFormats.map((format) => (
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
