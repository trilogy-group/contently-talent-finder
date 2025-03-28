import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, PenLine, Trash2, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToastAlert } from "@/components/ui/toast-alert";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from 'react';
import './PillarsTabContent.css';

interface ContentPillar {
  id: string;
  name: string;
  description: string;
  headlines: string;
  keywords: string[];
}

interface PillarsTabContentProps {
  pillars: ContentPillar[];
  setPillars: (pillars: ContentPillar[]) => void;
  seoKeywords?: { id: string; keyword: string; searchResults: number; searchVolume: number; costPerClick: string }[];
}

export const PillarsTabContent = ({ pillars, setPillars, seoKeywords = [] }: PillarsTabContentProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);
  const [newPillar, setNewPillar] = useState<ContentPillar>({
    id: "",
    name: "",
    description: "",
    headlines: "",
    keywords: []
  });
  const [openKeywordsPopover, setOpenKeywordsPopover] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [hasCommandError, setHasCommandError] = useState(false);

  // Log seoKeywords for debugging
  console.log("SEO Keywords in PillarsTabContent:", seoKeywords);

  // Reset command error state when seoKeywords changes
  React.useEffect(() => {
    setHasCommandError(false);
  }, [seoKeywords]);

  const { showConfirm, confirmDialog } = useConfirmDialog();

  const resetForm = () => {
    setNewPillar({
      id: "",
      name: "",
      description: "",
      headlines: "",
      keywords: []
    });
    setValidationErrors({});
  };

  const handleAddPillar = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const errors: {[key: string]: string} = {};
    
    if (!newPillar.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const pillarToAdd = {
      ...newPillar,
      id: editingPillarId || `pillar-${Date.now()}`
    };
    
    if (editingPillarId) {
      setPillars(pillars.map(p => p.id === editingPillarId ? pillarToAdd : p));
    } else {
      setPillars([...pillars, pillarToAdd]);
    }
    
    resetForm();
    setEditingPillarId(null);
    setDialogOpen(false);
  };

  const handleEditPillar = (pillar: ContentPillar) => {
    setNewPillar({ ...pillar });
    setEditingPillarId(pillar.id);
    setDialogOpen(true);
  };

  const handleDeletePillar = (id: string) => {
    showConfirm(
      () => {
        setPillars(pillars.filter(pillar => pillar.id !== id));
        showToastAlert("Pillar deleted successfully", "success");
      },
      {
        title: "Delete Content Pillar",
        message: "Are you sure you want to delete this content pillar? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger"
      }
    );
  };

  const toggleKeyword = (keyword: string) => {
    try {
      const isSelected = newPillar.keywords.includes(keyword);
      let updatedKeywords: string[];
      
      if (isSelected) {
        // Remove the keyword if it's already selected
        updatedKeywords = newPillar.keywords.filter(k => k !== keyword);
      } else {
        // Add the keyword if it's not already selected
        updatedKeywords = [...newPillar.keywords, keyword];
      }
      
      setNewPillar({
        ...newPillar,
        keywords: updatedKeywords
      });
    } catch (error) {
      console.error("Error toggling keyword:", error);
    }
  };

  return (
    <div className="space-y-6">
      {confirmDialog}
      <Card className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6 bg-gray-50 bg-opacity-30">
          {pillars.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No content pillars defined yet</h3>
              <p className="text-gray-500 mb-4">
                Content pillars are the main themes that support your content strategy
              </p>
              <Button 
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white add-pillar-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Pillar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map(pillar => (
                <Card key={pillar.id} className="bg-white shadow-sm border border-gray-100">
                  <CardHeader className="flex flex-row items-center justify-between bg-blue-50 p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{pillar.name}</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPillar(pillar)}
                        className="rounded-full hover:bg-white hover:text-blue-500"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePillar(pillar.id)}
                        className="rounded-full hover:bg-white hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="text-gray-700">{pillar.description || "No description provided."}</p>
                      </div>
                      
                      {pillar.headlines && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Example Headlines</p>
                          <p className="text-gray-700">{pillar.headlines}</p>
                        </div>
                      )}
                      
                      {pillar.keywords.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">SEO Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {pillar.keywords.map(keyword => (
                              <div key={keyword} className="bg-blue-50 text-orange-500 px-2 py-1 rounded text-sm">
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden button that can be triggered from the parent component */}
      <Button 
        onClick={() => {
          resetForm();
          setDialogOpen(true);
          setEditingPillarId(null);
        }}
        className="hidden add-pillar-button"
      >
        Add Pillar
      </Button>

      {/* Modal Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingPillarId ? "Edit Content Pillar" : "Create Content Pillar"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pillar-name">Pillar Name {validationErrors.name && <span className="text-red-500 text-sm">*</span>}</Label>
              <Input
                id="pillar-name"
                value={newPillar.name}
                onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })}
                placeholder="e.g., Content Creation"
                className={validationErrors.name ? "border-red-500" : ""}
              />
              {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pillar-description">Description</Label>
              <Textarea
                id="pillar-description"
                value={newPillar.description}
                onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })}
                placeholder="Describe this content pillar..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pillar-headlines">Example Headlines</Label>
              <Textarea
                id="pillar-headlines"
                value={newPillar.headlines}
                onChange={(e) => setNewPillar({ ...newPillar, headlines: e.target.value })}
                placeholder="Add some example headlines for this pillar..."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label>SEO Keywords</Label>
              <div className="flex flex-col gap-4">
                {/* Full width dropdown */}
                <div className="w-full">
                  <Popover open={openKeywordsPopover} onOpenChange={setOpenKeywordsPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        type="button" 
                        aria-expanded={openKeywordsPopover}
                        className="w-full justify-between"
                        onClick={(e) => {
                          try {
                            e.preventDefault();
                            setOpenKeywordsPopover(!openKeywordsPopover);
                          } catch (error) {
                            console.error("Error toggling keywords popover:", error);
                          }
                        }}
                      >
                        Select keywords...
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      {!hasCommandError ? (
                        <Command className="overflow-visible">
                          <CommandInput placeholder="Search keywords..." />
                          <CommandList className="max-h-64 overflow-hidden">
                            <CommandEmpty>No keywords found.</CommandEmpty>
                            <CommandGroup 
                              className="max-h-64 overflow-y-auto overflow-x-hidden scrollable-container" 
                              onWheel={(e) => e.stopPropagation()} 
                              style={{ scrollbarWidth: 'thin' }}
                            >
                              {seoKeywords && seoKeywords.length > 0 ? (
                                seoKeywords.map((keywordObj) => (
                                  <CommandItem
                                    key={keywordObj.id}
                                    value={keywordObj.keyword}
                                    onSelect={(value) => {
                                      try {
                                        toggleKeyword(keywordObj.keyword);
                                        // Don't close the popover immediately to allow multiple selections
                                        return false; // Prevent default behavior
                                      } catch (error) {
                                        console.error("Error selecting keyword:", error);
                                        setHasCommandError(true);
                                        return false;
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        newPillar.keywords.includes(keywordObj.keyword) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {keywordObj.keyword}
                                  </CommandItem>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-gray-500">
                                  No SEO keywords available. Please add keywords in the SEO Keywords tab.
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      ) : (
                        // Fallback UI when Command component has an error
                        <div className="p-4">
                          <div className="mb-2 text-sm text-red-500">
                            There was an error loading the keywords dropdown. Please use the manual keyword entry below.
                          </div>
                          <div className="space-y-2">
                            {seoKeywords && seoKeywords.length > 0 ? (
                              <div className="max-h-64 overflow-y-auto scrollable-container">
                                {seoKeywords.map((keywordObj) => (
                                  <div 
                                    key={keywordObj.id}
                                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => toggleKeyword(keywordObj.keyword)}
                                  >
                                    <div className={cn(
                                      "w-4 h-4 mr-2 border rounded flex items-center justify-center",
                                      newPillar.keywords.includes(keywordObj.keyword) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                                    )}>
                                      {newPillar.keywords.includes(keywordObj.keyword) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <span>{keywordObj.keyword}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-2 text-sm text-gray-500">
                                No SEO keywords available. Please add keywords in the SEO Keywords tab.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Selected keywords below the dropdown, full width */}
                <div className="w-full border rounded-md p-2 min-h-[40px] max-h-[120px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {newPillar.keywords.length > 0 ? (
                      newPillar.keywords.map(keyword => (
                        <Badge 
                          key={keyword} 
                          className="bg-blue-50 text-orange-500 hover:bg-blue-100 mb-1"
                        >
                          {keyword}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleKeyword(keyword);
                              } catch (error) {
                                console.error("Error removing keyword:", error);
                              }
                            }}
                          />
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No keywords selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                resetForm();
                setDialogOpen(false);
                setEditingPillarId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddPillar}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
