
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PenLine, ChevronLeft, ChevronRight, UserPlus, Upload, X, Users, Edit2, Save, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FilterSelect } from "@/components/filters/FilterSelect";

// Define the audience interface
interface Audience {
  id: string;
  name: string;
  description: string;
  educationLevel: string;
  gender: "female" | "male" | "non-binary" | "";
  minAge: number | null;
  maxAge: number | null;
  attachments?: string[];
}

interface AudiencesTabContentProps {
  audiences: Audience[];
  setAudiences: (audiences: Audience[]) => void;
}

export const AudiencesTabContent = ({
  audiences,
  setAudiences,
}: AudiencesTabContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [editingAudienceId, setEditingAudienceId] = useState<string | null>(null);
  const [newAudience, setNewAudience] = useState<Audience>({
    id: "",
    name: "",
    description: "",
    educationLevel: "",
    gender: "",
    minAge: null,
    maxAge: null,
    attachments: [],
  });
  
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null);

  const handleAddAudience = () => {
    const audience = {
      ...newAudience,
      id: crypto.randomUUID(),
    };
    setAudiences([...audiences, audience]);
    setShowAddDialog(false);
    resetNewAudience();
  };

  const resetNewAudience = () => {
    setNewAudience({
      id: "",
      name: "",
      description: "",
      educationLevel: "",
      gender: "",
      minAge: null,
      maxAge: null,
      attachments: [],
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real application, you would upload this file to a server
      // For now, we'll just store the file name
      const fileName = e.target.files[0].name;
      setNewAudience({
        ...newAudience,
        attachments: [...(newAudience.attachments || []), fileName],
      });
    }
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...(newAudience.attachments || [])];
    updatedAttachments.splice(index, 1);
    setNewAudience({
      ...newAudience,
      attachments: updatedAttachments,
    });
  };

  const nextSlide = () => {
    if (activeSlide < audiences.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };
  
  const startEditing = (audience: Audience) => {
    setEditingAudienceId(audience.id);
    setEditingAudience({...audience});
  };
  
  const saveEditing = () => {
    if (editingAudience) {
      setAudiences(audiences.map(a => 
        a.id === editingAudienceId ? editingAudience : a
      ));
      setEditingAudienceId(null);
      setEditingAudience(null);
    }
  };
  
  const cancelEditing = () => {
    setEditingAudienceId(null);
    setEditingAudience(null);
  };
  
  const deleteAudience = (id: string) => {
    setAudiences(audiences.filter(a => a.id !== id));
    if (audiences.length <= 1) {
      setActiveSlide(0);
    } else if (activeSlide === audiences.length - 1) {
      setActiveSlide(activeSlide - 1);
    }
  };
  
  const educationOptions = [
    { value: "high_school", label: "High School" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "other", label: "Other" }
  ];
  
  const getEducationLabel = (value: string) => {
    const option = educationOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Target Audiences</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto mr-2"
        >
          <PenLine className={`h-5 w-5 ${isEditing ? 'text-brand-primary' : 'text-gray-500'}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="mb-6 overflow-hidden border-none bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <div className="p-5">
            <p className="text-gray-700">
              This page helps you create detailed audience profiles by defining demographic characteristics including education, gender, and age range. Well-defined audience segments enable targeted content creation that resonates with specific groups, ensuring your messaging addresses their unique needs and preferences while improving overall campaign effectiveness.
            </p>
          </div>
        </Card>
      
        {audiences.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {audiences.map((audience) => (
                  <div key={audience.id} className="w-full flex-shrink-0 px-2">
                    <Card className={`min-h-[400px] bg-white shadow-lg overflow-hidden ${editingAudienceId === audience.id ? 'border-2 border-blue-400' : ''}`}>
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-2 flex flex-row justify-between items-center">
                        {editingAudienceId === audience.id ? (
                          <Input 
                            value={editingAudience?.name || ""}
                            onChange={(e) => setEditingAudience({
                              ...editingAudience!,
                              name: e.target.value
                            })}
                            className="font-semibold text-lg"
                          />
                        ) : (
                          <CardTitle className="text-xl">{audience.name}</CardTitle>
                        )}
                        
                        {isEditing && (
                          <div className="flex gap-1">
                            {editingAudienceId === audience.id ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={saveEditing}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={cancelEditing}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => startEditing(audience)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteAudience(audience.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        <div className="bg-slate-50 p-3 rounded-md">
                          {editingAudienceId === audience.id ? (
                            <Textarea 
                              value={editingAudience?.description || ""}
                              onChange={(e) => setEditingAudience({
                                ...editingAudience!,
                                description: e.target.value
                              })}
                              className="min-h-[80px]"
                            />
                          ) : (
                            <p className="text-sm text-gray-700">{audience.description}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Education Level</h4>
                            {editingAudienceId === audience.id ? (
                              <Select 
                                value={editingAudience?.educationLevel || ""}
                                onValueChange={(value) => setEditingAudience({
                                  ...editingAudience!,
                                  educationLevel: value
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {educationOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="bg-blue-50 text-blue-800 py-1 px-3 rounded-full text-sm inline-block">
                                {getEducationLabel(audience.educationLevel)}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Gender</h4>
                            {editingAudienceId === audience.id ? (
                              <div className="flex space-x-4">
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem 
                                    value="female" 
                                    id={`female-${audience.id}`}
                                    checked={editingAudience?.gender === "female"}
                                    onClick={() => setEditingAudience({
                                      ...editingAudience!,
                                      gender: "female"
                                    })}
                                  />
                                  <Label htmlFor={`female-${audience.id}`}>Female</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem 
                                    value="male" 
                                    id={`male-${audience.id}`}
                                    checked={editingAudience?.gender === "male"}
                                    onClick={() => setEditingAudience({
                                      ...editingAudience!,
                                      gender: "male"
                                    })}
                                  />
                                  <Label htmlFor={`male-${audience.id}`}>Male</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem 
                                    value="non-binary" 
                                    id={`non-binary-${audience.id}`}
                                    checked={editingAudience?.gender === "non-binary"}
                                    onClick={() => setEditingAudience({
                                      ...editingAudience!,
                                      gender: "non-binary"
                                    })}
                                  />
                                  <Label htmlFor={`non-binary-${audience.id}`}>Non-binary</Label>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-purple-50 text-purple-800 py-1 px-3 rounded-full text-sm inline-block">
                                {audience.gender.charAt(0).toUpperCase() + audience.gender.slice(1)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-1">
                          <h4 className="text-sm font-medium">Age Range</h4>
                          {editingAudienceId === audience.id ? (
                            <div className="px-2">
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[
                                  editingAudience?.minAge || 0, 
                                  editingAudience?.maxAge || 100
                                ]}
                                onValueChange={(values) => setEditingAudience({
                                  ...editingAudience!,
                                  minAge: values[0],
                                  maxAge: values[1]
                                })}
                                className="my-4"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{editingAudience?.minAge || 0} years</span>
                                <span>{editingAudience?.maxAge || 100} years</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-green-50 text-green-800 py-1 px-3 rounded-full text-sm inline-block">
                              {audience.minAge || 0} - {audience.maxAge || 100} years
                            </div>
                          )}
                        </div>
                        
                        {audience.attachments && audience.attachments.length > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <h4 className="text-sm font-medium mb-2">Attachments</h4>
                            <ul className="space-y-1">
                              {audience.attachments.map((attachment, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                                  <span className="text-blue-600 truncate">{attachment}</span>
                                  {editingAudienceId === audience.id && (
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-6 w-6"
                                      onClick={() => {
                                        const newAttachments = [...(editingAudience?.attachments || [])];
                                        newAttachments.splice(index, 1);
                                        setEditingAudience({
                                          ...editingAudience!,
                                          attachments: newAttachments
                                        });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {audiences.length > 1 && (
              <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevSlide} 
                  disabled={activeSlide === 0}
                  className="bg-white rounded-full shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextSlide} 
                  disabled={activeSlide === audiences.length - 1}
                  className="bg-white rounded-full shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-center mt-4 gap-1">
              {audiences.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === activeSlide ? "bg-brand-primary" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-1">No audiences defined</h3>
            <p className="text-gray-500 mb-4">
              Create target audiences to better understand who you're creating content for.
            </p>
          </div>
        )}

        {isEditing && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="w-full mt-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Audience
          </Button>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create audience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div>
                <Label htmlFor="audience-name">Name</Label>
                <Input 
                  id="audience-name" 
                  placeholder="Name your audience"
                  value={newAudience.name}
                  onChange={(e) => setNewAudience({...newAudience, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="audience-description">Description</Label>
                <Textarea 
                  id="audience-description" 
                  placeholder="Describe this audience in a few short sentences."
                  value={newAudience.description}
                  onChange={(e) => setNewAudience({...newAudience, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="education-level">Education level</Label>
                <Select 
                  value={newAudience.educationLevel} 
                  onValueChange={(value) => setNewAudience({...newAudience, educationLevel: value})}
                >
                  <SelectTrigger id="education-level">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Gender</Label>
                <RadioGroup 
                  value={newAudience.gender} 
                  onValueChange={(value) => 
                    setNewAudience({
                      ...newAudience, 
                      gender: value as "female" | "male" | "non-binary" | ""
                    })
                  }
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="non-binary" id="non-binary" />
                    <Label htmlFor="non-binary">Non-binary</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Age range</Label>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[
                      newAudience.minAge || 0, 
                      newAudience.maxAge || 100
                    ]}
                    onValueChange={(values) => setNewAudience({
                      ...newAudience,
                      minAge: values[0],
                      maxAge: values[1]
                    })}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{newAudience.minAge || 0} years</span>
                    <span>{newAudience.maxAge || 100} years</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Additional materials</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Attach a document such as your visual guidelines or brand style guide
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="bg-brand-primary hover:bg-brand-darker text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <span className="text-sm text-gray-500">
                    {newAudience.attachments && newAudience.attachments.length > 0
                      ? `${newAudience.attachments.length} file(s) chosen`
                      : "No file chosen"}
                  </span>
                </div>
                
                {newAudience.attachments && newAudience.attachments.length > 0 && (
                  <div className="mt-2">
                    <ul className="space-y-1">
                      {newAudience.attachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span>{file}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAudience} disabled={!newAudience.name}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
