import { Star, FileText } from "lucide-react";
import { TalentProfile } from "@/types/talent-search";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TalentCardProps {
  profile: TalentProfile;
  isStarred: boolean;
  onToggleStar: (profileId: number) => void;
}

export const TalentCard = ({ profile, isStarred, onToggleStar }: TalentCardProps) => {
  const [showBioDialog, setShowBioDialog] = useState(false);

  // Color assignments for different categories
  const industryColors = "bg-[#FEF7CD] text-gray-700 hover:bg-[#FDE1D3]";
  const specialtyColors = "bg-[#E5DEFF] text-gray-700 hover:bg-[#D3E4FD]";
  const skillColors = "bg-[#F2FCE2] text-gray-700 hover:bg-[#FFDEE2]";



  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          {/* Header Section with Name, Title and Stats */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => onToggleStar(profile.id)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                        aria-label={isStarred ? "Remove from starred" : "Add to starred"}
                      >
                        <Star className={`h-5 w-5 ${isStarred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isStarred ? "Remove from favorites" : "Add to favorites"}</p>
                    </TooltipContent>
                  </Tooltip>
                  

                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setShowBioDialog(true)}
                        className="text-gray-400 hover:text-brand-primary transition-colors"
                        aria-label="View full bio"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View full bio</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-brand-primary font-medium">{profile.role}</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{profile.yearsOfExperience}+ years</span> experience
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mb-4">
            <p className="text-gray-700">{profile.bio}</p>
          </div>
          

          
          {/* Tags Section */}
          <div>
            <div className="flex flex-wrap gap-2">
              {profile.industries?.map((industry, index) => (
                <Badge key={`industry-${index}`} variant="outline" className={industryColors}>
                  {industry}
                </Badge>
              ))}
              
              {profile.specialties?.map((specialty, index) => (
                <Badge key={`specialty-${index}`} variant="outline" className={specialtyColors}>
                  {specialty}
                </Badge>
              ))}
              
              {profile.skills?.map((skill, index) => (
                <Badge key={`skill-${index}`} variant="outline" className={skillColors}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      

      
      {/* Bio Dialog */}
      <Dialog open={showBioDialog} onOpenChange={setShowBioDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{profile.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-medium">{profile.role}</h3>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
            
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">EXPERTISE</h4>
              <div className="flex flex-wrap gap-2">
                {profile.industries?.map((industry, index) => (
                  <Badge key={`industry-${index}`} variant="outline" className={industryColors}>
                    {industry}
                  </Badge>
                ))}
                
                {profile.specialties?.map((specialty, index) => (
                  <Badge key={`specialty-${index}`} variant="outline" className={specialtyColors}>
                    {specialty}
                  </Badge>
                ))}
                
                {profile.skills?.map((skill, index) => (
                  <Badge key={`skill-${index}`} variant="outline" className={skillColors}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBioDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      

    </TooltipProvider>
  );
};
