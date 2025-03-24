import { Star, Briefcase, Trophy, Mail, Info, Maximize, ChevronRight, Send, Award, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TalentData {
  id: number;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  location: string;
  languages: string[];
  skills: string[];
  topics: string[];
  clips: {
    id: number;
    title: string;
    url: string;
    publication: string;
  }[];
  portfolio: string;
  status: string;
  programmatic_position: number;
}

interface TalentCardProps {
  talent: TalentData;
}

export const TalentCardV5 = ({ talent }: TalentCardProps) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);
  const [showSamplesDialog, setShowSamplesDialog] = useState(false);
  const [showBioDialog, setShowBioDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState<{title: string, excerpt: string} | null>(null);
  const [messageText, setMessageText] = useState("");
  const [workSamplesExpanded, setWorkSamplesExpanded] = useState(false);

  // Color assignments for different categories
  const topicColors = "bg-[#E5DEFF] text-gray-700 hover:bg-[#D3E4FD]";
  const skillColors = "bg-[#F2FCE2] text-gray-700 hover:bg-[#FFDEE2]";

  const handleSendMessage = () => {
    // Here you would implement the actual sending logic
    console.log(`Sending message to ${talent.name}: ${messageText}`);
    setMessageText("");
    setShowContactDialog(false);
  };

  // Sample experience timeline data - in a real app this would come from the profile
  const experienceTimeline = [
    { year: "2021 - Present", role: "Senior Content Writer", company: "Global Media Inc." },
    { year: "2018 - 2021", role: "Content Strategist", company: "Creative Solutions" },
    { year: "2015 - 2018", role: "Content Writer", company: "Digital Marketing Agency" }
  ];

  // Sample projects data - in a real app this would come from the profile
  const projectsList = [
    { name: "E-commerce Content Overhaul", description: "Rewrote product descriptions for 200+ products." },
    { name: "Tech Blog Series", description: "Authored a 12-part series on emerging technologies." },
    { name: "Brand Guidelines", description: "Developed comprehensive voice and tone guidelines." },
    { name: "Email Campaign", description: "Created content for a 5-part email nurture sequence." }
  ];

  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          {/* Header Section with Name, Title and Avatar */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-4">
              <img
                src={talent.avatar_url}
                alt={talent.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{talent.name}</h3>
                <p className="text-gray-600">{talent.headline}</p>
                {talent.location && (
                  <p className="text-sm text-gray-500">{talent.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-4">
            <p className="text-gray-600 line-clamp-2">{talent.bio}</p>
          </div>

          {/* Work Samples Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Work</h4>
            <div className="space-y-2">
              {talent.clips.slice(0, workSamplesExpanded ? undefined : 3).map((clip) => (
                <div key={clip.id} className="text-sm">
                  <a
                    href={clip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {clip.title}
                  </a>
                  <span className="text-gray-500"> - {clip.publication}</span>
                </div>
              ))}
            </div>
            {talent.clips.length > 3 && (
              <Button
                variant="link"
                className="text-sm p-0 h-auto mt-1"
                onClick={() => setWorkSamplesExpanded(!workSamplesExpanded)}
              >
                {workSamplesExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </div>

          {/* Skills and Topics Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">TOPICS</h4>
              <div className="flex flex-wrap gap-1 overflow-y-auto max-h-24">
                {talent.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className={topicColors}>
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">SKILLS</h4>
              <div className="flex flex-wrap gap-1 overflow-y-auto max-h-24">
                {talent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className={skillColors}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Link */}
          {talent.portfolio && (
            <div className="mt-4">
              <a
                href={talent.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Full Portfolio →
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {talent.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Your message will be sent directly to {talent.name}. They typically respond within 24-48 hours.
            </p>
            <Textarea 
              placeholder={`Hello ${talent.name}, I'm interested in discussing a potential project...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-32"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSendMessage}
              className="flex items-center gap-1"
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Dialog */}
      <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Experience Timeline</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-8 max-h-[60vh] overflow-y-auto pr-4 pb-4 custom-scrollbar">
              {experienceTimeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-11 mt-1.5 h-5 w-5 rounded-full bg-orange-400 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                  </div>
                  <time className="mb-1 text-sm font-normal leading-none text-gray-400">{item.year}</time>
                  <h3 className="text-lg font-semibold text-gray-900">{item.role}</h3>
                  <p className="text-base font-normal text-gray-500">{item.company}</p>
                </div>
              ))}
            </div>
            {experienceTimeline.length > 3 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                <p>Scroll to see more</p>
                <ChevronRight className="h-4 w-4 mx-auto rotate-90 animate-bounce mt-1" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Projects Dialog */}
      <Dialog open={showProjectsDialog} onOpenChange={setShowProjectsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Project List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 pb-4 custom-scrollbar">
              {projectsList.map((project, index) => (
                <li key={index} className="flex gap-3">
                  <div className="mt-0.5 bg-blue-100 text-blue-600 p-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            {projectsList.length > 4 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                <p>Scroll to see more</p>
                <ChevronRight className="h-4 w-4 mx-auto rotate-90 animate-bounce mt-1" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Work Sample Dialog */}
      <Dialog open={showSamplesDialog} onOpenChange={setShowSamplesDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSample?.title || "Work Sample"}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {selectedSample ? (
              <div className="bg-white p-4 rounded-lg max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <p className="text-gray-600 whitespace-pre-line">
                  {selectedSample.excerpt}
                  {/* In a real app, this would show the full content, not just the excerpt */}
                  {'\n\n'}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                  aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.
                  {'\n\n'}
                  Maecenas volutpat tellus nec felis dapibus, at lacinia metus finibus. Donec 
                  consectetur augue ac diam venenatis, eu facilisis nulla molestie. Suspendisse 
                  potenti. Ut egestas ligula vitae magna facilisis, vel aliquet metus tincidunt.
                  Nulla facilisi. Suspendisse potenti. Donec congue mi in velit lacinia, a tincidunt
                  magna vehicula.
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-center">Sample content not available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bio Dialog */}
      <Dialog open={showBioDialog} onOpenChange={setShowBioDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About {talent.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-white p-4 rounded-lg max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              <p className="text-gray-600 whitespace-pre-line">
                {talent.expandedBio || talent.bio}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
