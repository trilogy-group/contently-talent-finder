import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { generateGuidelines } from "@/functions/generate-guidelines";
import { GuidelineProps, GuidelineFormData, CategoryType } from "@/types/guidelines";
import { GuidelineRules } from "@/components/guidelines/GuidelineRules";
import { GuidelineCategorySelector } from "@/components/guidelines/GuidelineCategorySelector";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const defaultContentTypes = [
  "Blog Post",
  "Technical Documentation", 
  "Marketing Copy",
  "Social Media",
  "Email Newsletter",
  "Product Description"
];

const defaultPublications = ["Blog", "Website", "Social Media", "Newsletter", "Documentation"];
const defaultAudiences = ["Developers", "Business Users", "General Public", "Technical Writers", "Marketing"];

export function NewGuidelineDialog({ mode = "create", initialData, onSave }: GuidelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    contentType: false,
    publication: false,
    audience: false
  });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("tone");
  const [contentTypes, setContentTypes] = useState(defaultContentTypes);
  const [publications, setPublications] = useState(defaultPublications);
  const [audiences, setAudiences] = useState(defaultAudiences);
  const [newCategory, setNewCategory] = useState({ contentType: "", publication: "", audience: "" });

  const getInitialData = (): GuidelineFormData => {
    if (initialData) return initialData;
    
    const emptyRules = ["", "", ""];
    return {
      title: "",
      description: "",
      contentType: "",
      publication: "",
      audience: "",
      status: "draft" as const,
      categories: {
        tone: { name: "Tone", rules: [...emptyRules] },
        style: { name: "Style", rules: [...emptyRules] },
        terminology: { name: "Terminology", rules: [...emptyRules] }
      }
    };
  };

  const [formData, setFormData] = useState<GuidelineFormData>(getInitialData());

  const handleAddNewCategory = (type: 'contentType' | 'publication' | 'audience', value: string) => {
    if (!value.trim()) return;
    
    switch (type) {
      case 'contentType':
        if (!contentTypes.includes(value)) {
          setContentTypes(prev => [...prev, value]);
          setFormData(prev => ({ ...prev, contentType: value }));
          setNewCategory(prev => ({ ...prev, contentType: "" }));
          toast.success("Added new content type");
        }
        break;
      case 'publication':
        if (!publications.includes(value)) {
          setPublications(prev => [...prev, value]);
          setFormData(prev => ({ ...prev, publication: value }));
          setNewCategory(prev => ({ ...prev, publication: "" }));
          toast.success("Added new publication");
        }
        break;
      case 'audience':
        if (!audiences.includes(value)) {
          setAudiences(prev => [...prev, value]);
          setFormData(prev => ({ ...prev, audience: value }));
          setNewCategory(prev => ({ ...prev, audience: "" }));
          toast.success("Added new audience");
        }
        break;
    }
  };

  const handleDeleteCategory = (type: 'contentType' | 'publication' | 'audience', value: string) => {
    switch (type) {
      case 'contentType':
        setContentTypes(prev => prev.filter(t => t !== value));
        if (formData.contentType === value) {
          setFormData(prev => ({ ...prev, contentType: "" }));
        }
        break;
      case 'publication':
        setPublications(prev => prev.filter(p => p !== value));
        if (formData.publication === value) {
          setFormData(prev => ({ ...prev, publication: "" }));
        }
        break;
      case 'audience':
        setAudiences(prev => prev.filter(a => a !== value));
        if (formData.audience === value) {
          setFormData(prev => ({ ...prev, audience: "" }));
        }
        break;
    }
    toast.success("Option removed");
  };

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [activeCategory]: {
          ...prev.categories[activeCategory],
          rules: [...prev.categories[activeCategory].rules, ""]
        }
      }
    }));
  };

  const handleSuggest = async (mode: "history" | "market") => {
    try {
      setIsSuggesting(true);
      const suggestions = await generateGuidelines({
        mode,
        category: activeCategory,
        contentType: formData.contentType
      });
      
      setFormData(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [activeCategory]: {
            ...prev.categories[activeCategory],
            rules: suggestions
          }
        }
      }));
    } catch (error) {
      toast.error("Failed to generate guidelines. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleMoveRule = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= formData.categories[activeCategory].rules.length) {
      return;
    }

    setFormData(prev => {
      const newRules = [...prev.categories[activeCategory].rules];
      const [movedItem] = newRules.splice(fromIndex, 1);
      newRules.splice(toIndex, 0, movedItem);

      return {
        ...prev,
        categories: {
          ...prev.categories,
          [activeCategory]: {
            ...prev.categories[activeCategory],
            rules: newRules
          }
        }
      };
    });
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => {
      const newRules = [...prev.categories[activeCategory].rules];
      newRules.splice(index, 1);
      
      if (newRules.length < 3) {
        newRules.push("");
      }

      return {
        ...prev,
        categories: {
          ...prev.categories,
          [activeCategory]: {
            ...prev.categories[activeCategory],
            rules: newRules
          }
        }
      };
    });
  };

  const handleUpdateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [activeCategory]: {
          ...prev.categories[activeCategory],
          rules: prev.categories[activeCategory].rules.map((rule, i) => 
            i === index ? value : rule
          )
        }
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00A6C2] hover:bg-[#00A6C2]/90">
          {mode === "create" ? (
            <Plus className="w-4 h-4 mr-2" />
          ) : (
            <Edit className="w-4 h-4 mr-2" />
          )}
          {mode === "create" ? "New Guideline" : "Edit Guideline"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Guideline" : "Edit Guideline"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Draft</span>
            <Switch
              checked={formData.status === "active"}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, status: checked ? "active" as const : "draft" as const }))
              }
            />
            <span className="text-sm text-slate-600">Active</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter guideline title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter guideline description"
              />
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Popover 
                  open={dropdownStates.contentType}
                  onOpenChange={(open) => setDropdownStates(prev => ({ ...prev, contentType: open }))}
                >
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex min-h-[2.5rem] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        dropdownStates.contentType && "ring-2 ring-ring ring-offset-2"
                      )}
                    >
                      <span className="text-muted-foreground">
                        {formData.contentType || "Select type"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="max-h-[200px] overflow-auto p-1">
                      {contentTypes.map((type) => (
                        <div
                          key={type}
                          className="relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, contentType: type }));
                            setDropdownStates(prev => ({ ...prev, contentType: false }));
                          }}
                        >
                          {type}
                          <X
                            className="h-4 w-4 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory('contentType', type);
                            }}
                          />
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="p-2">
                        <Input
                          placeholder="Add new content type"
                          value={newCategory.contentType}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, contentType: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddNewCategory('contentType', newCategory.contentType);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publication">Publication</Label>
                <Popover
                  open={dropdownStates.publication}
                  onOpenChange={(open) => setDropdownStates(prev => ({ ...prev, publication: open }))}
                >
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex min-h-[2.5rem] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        dropdownStates.publication && "ring-2 ring-ring ring-offset-2"
                      )}
                    >
                      <span className="text-muted-foreground">
                        {formData.publication || "Select publication"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="max-h-[200px] overflow-auto p-1">
                      {publications.map((pub) => (
                        <div
                          key={pub}
                          className="relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, publication: pub }));
                            setDropdownStates(prev => ({ ...prev, publication: false }));
                          }}
                        >
                          {pub}
                          <X
                            className="h-4 w-4 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory('publication', pub);
                            }}
                          />
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="p-2">
                        <Input
                          placeholder="Add new publication"
                          value={newCategory.publication}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, publication: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddNewCategory('publication', newCategory.publication);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Popover
                  open={dropdownStates.audience}
                  onOpenChange={(open) => setDropdownStates(prev => ({ ...prev, audience: open }))}
                >
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex min-h-[2.5rem] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        dropdownStates.audience && "ring-2 ring-ring ring-offset-2"
                      )}
                    >
                      <span className="text-muted-foreground">
                        {formData.audience || "Select audience"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="max-h-[200px] overflow-auto p-1">
                      {audiences.map((audience) => (
                        <div
                          key={audience}
                          className="relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, audience: audience }));
                            setDropdownStates(prev => ({ ...prev, audience: false }));
                          }}
                        >
                          {audience}
                          <X
                            className="h-4 w-4 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory('audience', audience);
                            }}
                          />
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="p-2">
                        <Input
                          placeholder="Add new audience"
                          value={newCategory.audience}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, audience: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddNewCategory('audience', newCategory.audience);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="border rounded-lg p-6 space-y-6 bg-slate-50">
              <div className="space-y-4">
                <GuidelineCategorySelector
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onSuggest={handleSuggest}
                  isSuggesting={isSuggesting}
                />

                <GuidelineRules
                  activeCategory={activeCategory}
                  rules={formData.categories[activeCategory].rules}
                  onAddRule={handleAddRule}
                  onRemoveRule={handleRemoveRule}
                  onUpdateRule={handleUpdateRule}
                  onMoveRule={handleMoveRule}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (onSave) {
                  onSave(formData);
                }
                toast.success(`Guideline ${mode === "create" ? "created" : "updated"} successfully!`);
                setIsOpen(false);
              }}
            >
              {mode === "create" ? "Create Guideline" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
