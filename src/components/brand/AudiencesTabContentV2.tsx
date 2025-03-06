import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Pencil, Trash2, Upload, Check, X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToastAlert } from "@/components/ui/toast-alert";

interface Audience {
  id: string;
  name: string;
  description: string;
  educationLevel: string;
  gender: "female" | "male" | "";
  minAge: number | null;
  maxAge: number | null;
  attachments?: string[];
}

interface AudiencesTabContentProps {
  audiences: Audience[];
  setAudiences: React.Dispatch<React.SetStateAction<Audience[]>>;
}

export const AudiencesTabContentV2: React.FC<AudiencesTabContentProps> = ({ audiences, setAudiences }) => {
  const [isAddingAudience, setIsAddingAudience] = useState(false);
  const [isEditingAudience, setIsEditingAudience] = useState(false);
  const [currentAudience, setCurrentAudience] = useState<Audience | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [educationLevel, setEducationLevel] = useState("high_school");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 65]);
  const [attachments, setAttachments] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Confirm dialog
  const { showConfirm, confirmDialog } = useConfirmDialog();

  const resetForm = () => {
    setName("");
    setDescription("");
    setEducationLevel("high_school");
    setGender("female");
    setAgeRange([18, 65]);
    setAttachments([]);
    setCurrentAudience(null);
  };

  const openAddAudienceDialog = () => {
    resetForm();
    setIsAddingAudience(true);
  };

  const handleAddAudience = () => {
    const newAudience: Audience = {
      id: Date.now().toString(),
      name,
      description,
      educationLevel,
      gender,
      minAge: ageRange[0],
      maxAge: ageRange[1],
      attachments: attachments
    };

    setAudiences(prevAudiences => [...prevAudiences, newAudience]);
    setIsAddingAudience(false);
    resetForm();
  };

  const handleEditAudience = () => {
    if (!currentAudience) return;

    setAudiences(prevAudiences => 
      prevAudiences.map(audience => 
        audience.id === currentAudience.id 
          ? { 
              ...audience, 
              name, 
              description, 
              educationLevel, 
              gender, 
              minAge: ageRange[0], 
              maxAge: ageRange[1],
              attachments 
            }
          : audience
      )
    );
    
    setIsEditingAudience(false);
    resetForm();
  };

  const handleDeleteAudience = (id: string) => {
    showConfirm(
      () => {
        setAudiences(prevAudiences => prevAudiences.filter(audience => audience.id !== id));
        showToastAlert("Audience deleted successfully", "success");
      },
      {
        title: "Delete Audience",
        message: "Are you sure you want to delete this audience? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger"
      }
    );
  };

  const startEditing = (audience: Audience) => {
    setCurrentAudience(audience);
    setName(audience.name);
    setDescription(audience.description);
    setEducationLevel(audience.educationLevel);
    setGender(audience.gender || "female");
    setAgeRange([audience.minAge || 18, audience.maxAge || 65]);
    setAttachments(audience.attachments || []);
    setIsEditingAudience(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => file.name);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => file.name);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const getEducationLabel = (value: string, shortened = false) => {
    if (shortened) {
      switch(value) {
        case "high_school": return "High School";
        case "some_college": return "Some College";
        case "associates": return "Associate's";
        case "bachelors": return "Bachelor's";
        case "masters": return "Master's";
        case "doctorate": return "Doctorate";
        default: return value;
      }
    }
    
    switch(value) {
      case "high_school": return "High School";
      case "some_college": return "Some College";
      case "associates": return "Associate's Degree";
      case "bachelors": return "Bachelor's Degree";
      case "masters": return "Master's Degree";
      case "doctorate": return "Doctorate";
      default: return value;
    }
  };

  const getAgeRange = (min: number | null, max: number | null) => {
    if (min && max) return `${min}-${max}`;
    if (min) return `${min}+`;
    if (max) return `Under ${max}`;
    return "Any age";
  };

  return (
    <div>
      {confirmDialog}
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          {audiences.map(audience => (
            <Card key={audience.id} className="overflow-hidden w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{audience.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => startEditing(audience)} className="text-amber-500 hover:text-amber-700 hover:bg-amber-50">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAudience(audience.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-600 w-full mb-2">{audience.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {audience.educationLevel && (
                    <Badge variant="outline" className="truncate bg-blue-50 text-blue-700 border-blue-200">{getEducationLabel(audience.educationLevel, true)}</Badge>
                  )}
                  {audience.gender && (
                    <Badge variant="outline" className="capitalize truncate bg-purple-50 text-purple-700 border-purple-200">{audience.gender}</Badge>
                  )}
                  <Badge variant="outline" className="truncate bg-green-50 text-green-700 border-green-200">{getAgeRange(audience.minAge, audience.maxAge)}</Badge>
                  
                  {audience.attachments && audience.attachments.map((attachment, index) => (
                    <Badge key={index} variant="secondary" className="truncate max-w-[150px]">{attachment}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Hidden button that will be triggered by the + button in the parent component */}
        <Button 
          className="hidden add-audience-button" 
          onClick={openAddAudienceDialog}
        >
          <span className="sr-only">Add Audience</span>
        </Button>
      </div>
      
      {/* Add Audience Dialog */}
      <Dialog open={isAddingAudience} onOpenChange={setIsAddingAudience}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Audience</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input 
                id="add-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Young Professionals"
              />
            </div>
            
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea 
                id="add-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your target audience..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-education">Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger id="add-education">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="some_college">Some College</SelectItem>
                    <SelectItem value="associates">Associate's Degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="add-gender">Gender</Label>
                <Select value={gender} onValueChange={setGender as (value: string) => void}>
                  <SelectTrigger id="add-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-age-range">Age Range</Label>
              <Slider
                id="add-age-range"
                value={ageRange}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => setAgeRange(values as [number, number])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">{ageRange[0]} years</span>
                <span className="text-sm text-gray-500">{ageRange[1]} years</span>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Attachments</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                      <span className="text-sm text-gray-700 truncate max-w-[150px]">{file}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingAudience(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAudience} className="bg-[#00A6C2] hover:bg-[#00A6C2]/90 text-white">
              Add Audience
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Audience Dialog */}
      <Dialog open={isEditingAudience} onOpenChange={setIsEditingAudience}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Audience</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Young Professionals"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your target audience..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-education">Education Level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger id="edit-education">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="some_college">Some College</SelectItem>
                    <SelectItem value="associates">Associate's Degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-gender">Gender</Label>
                <Select value={gender} onValueChange={setGender as (value: string) => void}>
                  <SelectTrigger id="edit-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-age-range">Age Range</Label>
              <Slider
                id="edit-age-range"
                value={ageRange}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => setAgeRange(values as [number, number])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">{ageRange[0]} years</span>
                <span className="text-sm text-gray-500">{ageRange[1]} years</span>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Attachments</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                      <span className="text-sm text-gray-700 truncate max-w-[150px]">{file}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditingAudience(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditAudience} className="bg-[#00A6C2] hover:bg-[#00A6C2]/90 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
