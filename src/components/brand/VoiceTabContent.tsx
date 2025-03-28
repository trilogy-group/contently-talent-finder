import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, PenLine, Wand2, Eye } from "lucide-react";
import { contentStrategyApi } from "@/utils/api";
import { showToastAlert } from "@/components/ui/toast-alert";

interface VoiceTabContentProps {
  voiceDescription: string;
  setVoiceDescription: (value: string) => void;
  blockedWords: string;
  setBlockedWords: (value: string) => void;
  styleGuide: string;
  setStyleGuide: (value: string) => void;
  useFirstPerson: boolean;
  setUseFirstPerson: (value: boolean) => void;
  notes: string;
  setNotes: (value: string) => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const VoiceTabContent: React.FC<VoiceTabContentProps> = ({
  voiceDescription,
  setVoiceDescription,
  blockedWords,
  setBlockedWords,
  styleGuide,
  setStyleGuide,
  useFirstPerson,
  setUseFirstPerson,
  notes,
  setNotes,
  isEditing = false,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save changes when editing is toggled off
  useEffect(() => {
    if (!isEditing) {
      handleSave();
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await contentStrategyApi.updateVoiceAndStyle({
        voiceDescription,
        blockedWords,
        styleGuide,
        useFirstPerson,
        notes
      });
    } catch (error) {
      console.error('Error saving voice and style:', error);
      showToastAlert('Error saving changes. Please try again.', 'error');
    }
  };

  const handleAIEnhance = () => {
    console.log("Enhance content with AI");
    // Implement AI enhancement logic here
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected:", e.target.files[0].name);
      // Implement file handling logic here
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4" />
              <div className="h-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
              <div className="h-24 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-6 bg-gray-50 bg-opacity-30">
                  {/* First row: Brand Voice and Blocked Words side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-medium text-gray-800">Brand Voice</h3>
                      </div>
                      
                      {isEditing ? (
                        <Textarea 
                          value={voiceDescription}
                          onChange={(e) => setVoiceDescription(e.target.value)}
                          className="h-40 resize-none focus-visible:ring-blue-500 border-gray-200"
                          placeholder="Describe your brand's voice and tone..."
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line min-h-[120px] text-gray-700">
                          {voiceDescription || "No voice description provided."}
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-800 mb-3">Blocklisted Words or Phrases</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Words or phrases your contributors should avoid. Separate with commas.
                      </p>
                      
                      {isEditing ? (
                        <Input 
                          value={blockedWords}
                          onChange={(e) => setBlockedWords(e.target.value)}
                          placeholder="E.g., cheap, easy, guaranteed, instantly..."
                          className="focus-visible:ring-blue-500 border-gray-200"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                          {blockedWords || "No blocked words specified."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second row: Style Guide and First Person side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-800 mb-3">Preferred Style Guide</h3>
                      
                      <RadioGroup 
                        value={styleGuide} 
                        onValueChange={setStyleGuide}
                        disabled={!isEditing}
                        className="space-y-2"
                      >
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${styleGuide === 'ap' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="ap" id="ap" />
                          <Label htmlFor="ap" className="flex-1 cursor-pointer">Associated Press Stylebook</Label>
                        </div>
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${styleGuide === 'canadian' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="canadian" id="canadian" />
                          <Label htmlFor="canadian" className="flex-1 cursor-pointer">Canadian Style</Label>
                        </div>
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${styleGuide === 'chicago' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="chicago" id="chicago" />
                          <Label htmlFor="chicago" className="flex-1 cursor-pointer">Chicago Manual of Style</Label>
                        </div>
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${styleGuide === 'other' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="flex-1 cursor-pointer">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-800 mb-3">First Person Usage</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Can contributors use "I", "we", "our" in content?
                      </p>
                      
                      <RadioGroup 
                        value={useFirstPerson ? "yes" : "no"} 
                        onValueChange={(value) => setUseFirstPerson(value === "yes")}
                        disabled={!isEditing}
                        className="space-y-2"
                      >
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${useFirstPerson ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="flex-1 cursor-pointer">Yes, allow first person</Label>
                        </div>
                        <div className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${!useFirstPerson ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="flex-1 cursor-pointer">No, avoid first person</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Third row: Additional Materials (full width) */}
                  <div className="mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-800 mb-3">Additional Materials</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Upload brand guidelines, style guides, or other reference documents
                      </p>
                      
                      {isEditing ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center">
                          <Upload className="h-7 w-7 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Drag and drop files here or</p>
                          <Button 
                            onClick={handleFileUpload} 
                            variant="outline"
                            size="sm"
                            className="mt-1"
                          >
                            Browse Files
                          </Button>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                          No materials uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Final row: Additional Notes (full width) */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-md font-medium text-gray-800 mb-3">Additional Notes & Guidelines</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Share detailed instructions, examples, and requirements with your contributors
                    </p>
                    
                    {isEditing ? (
                      <Textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="h-64 focus-visible:ring-blue-500 border-gray-200"
                        placeholder="Enter detailed guidelines, examples, disclaimers, etc."
                      />
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line min-h-[120px] prose max-w-none text-gray-700">
                        {notes || "No additional guidelines provided."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
