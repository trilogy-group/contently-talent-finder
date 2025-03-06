
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TitleBar } from "@/components/TitleBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Check, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewGuidelineDialog } from "@/components/dialogs/NewGuidelineDialog";
import { GuidelineFormData } from "@/types/guidelines";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Guideline {
  id: string;
  title: string;
  description: string;
  contentType: string;
  publication: string;
  audience: string;
  status: "active" | "draft";
  lastModified: string;
  rules: {
    tone: string[];
    style: string[];
    terminology: string[];
  };
}

interface Filters {
  status: string[];
  contentType: string[];
  publication: string[];
  audience: string[];
}

export default function Guidelines() {
  const [guidelines, setGuidelines] = useState<Guideline[]>(() => {
    const savedGuidelines = localStorage.getItem('brand-guidelines');
    return savedGuidelines ? JSON.parse(savedGuidelines) : [
      {
        id: "1",
        title: "Technical Blog Posts",
        description: "Guidelines for writing technical blog posts and documentation",
        contentType: "Blog Post",
        publication: "Blog",
        audience: "Developers",
        status: "active",
        lastModified: "2024-02-20",
        rules: {
          tone: [
            "Clear and precise",
            "Professional but approachable",
            "Educational without being condescending"
          ],
          style: [
            "Use active voice",
            "Include code examples where relevant",
            "Break down complex concepts"
          ],
          terminology: [
            "Use consistent technical terms",
            "Define acronyms on first use",
            "Follow industry standard naming"
          ]
        }
      },
      {
        id: "2",
        title: "Social Media Content",
        description: "Guidelines for social media posts and engagement",
        contentType: "Social Media",
        publication: "Social Media",
        audience: "General Public",
        status: "draft",
        lastModified: "2024-02-19",
        rules: {
          tone: [
            "Conversational and friendly",
            "Engaging and energetic",
            "Brief but informative"
          ],
          style: [
            "Keep posts concise",
            "Use relevant hashtags",
            "Include call-to-actions"
          ],
          terminology: [
            "Use platform-specific terms",
            "Keep language accessible",
            "Avoid jargon"
          ]
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('brand-guidelines', JSON.stringify(guidelines));
  }, [guidelines]);

  const [filters, setFilters] = useState<Filters>({
    status: [],
    contentType: [],
    publication: [],
    audience: []
  });

  const [guidelineToDelete, setGuidelineToDelete] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const handleFilterChange = (filterType: keyof Filters) => (value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filterGuidelines = (guidelines: Guideline[]) => {
    return guidelines.filter(guideline => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(guideline.status);
      const typeMatch = filters.contentType.length === 0 || filters.contentType.includes(guideline.contentType);
      const publicationMatch = filters.publication.length === 0 || filters.publication.includes(guideline.publication);
      const audienceMatch = filters.audience.length === 0 || filters.audience.includes(guideline.audience);

      return statusMatch && typeMatch && publicationMatch && audienceMatch;
    });
  };

  const handleSaveGuideline = (formData: GuidelineFormData) => {
    const newGuideline: Guideline = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType,
      publication: formData.publication,
      audience: formData.audience,
      status: formData.status,
      lastModified: new Date().toISOString().split('T')[0],
      rules: {
        tone: formData.categories.tone.rules,
        style: formData.categories.style.rules,
        terminology: formData.categories.terminology.rules
      }
    };
    
    setGuidelines(prev => [...prev, newGuideline]);
    toast.success("New guideline created successfully");
  };

  const handleUpdateGuideline = (guidelineId: string, formData: GuidelineFormData) => {
    setGuidelines(prev => prev.map(guideline => {
      if (guideline.id === guidelineId) {
        return {
          ...guideline,
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType,
          publication: formData.publication,
          audience: formData.audience,
          status: formData.status,
          lastModified: new Date().toISOString().split('T')[0],
          rules: {
            tone: formData.categories.tone.rules,
            style: formData.categories.style.rules,
            terminology: formData.categories.terminology.rules
          }
        };
      }
      return guideline;
    }));
    toast.success("Guideline updated successfully");
  };

  const handleDelete = (guidelineId: string) => {
    setGuidelines(prev => prev.filter(g => g.id !== guidelineId));
    toast.success("Guideline deleted successfully");
    setGuidelineToDelete(null);
  };

  const uniqueContentTypes = Array.from(new Set(guidelines.map(g => g.contentType)));
  const uniquePublications = Array.from(new Set(guidelines.map(g => g.publication)));
  const uniqueAudiences = Array.from(new Set(guidelines.map(g => g.audience)));

  const GuidelineCard = ({ guideline }: { guideline: Guideline }) => (
    <Card key={guideline.id} className="hover:shadow-md transition-all duration-300 h-[600px] flex flex-col">
      <div className="flex-1">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="line-clamp-1 pb-1">
              {guideline.title}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardDescription className="mt-2 truncate">
                    {guideline.description || "..."}
                  </CardDescription>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-words">
                  {guideline.description || "No description provided"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                {guideline.contentType}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 whitespace-nowrap">
                {guideline.publication}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 whitespace-nowrap">
                {guideline.audience}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {guideline.status === "active" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Draft
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Tone Rules</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-slate-600 truncate">
                    {guideline.rules.tone.length > 0 
                      ? guideline.rules.tone.join(", ")
                      : "..."}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-words">
                  {guideline.rules.tone.length > 0 
                    ? guideline.rules.tone.join(", ")
                    : "No tone rules defined"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card>
          <Card className="p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Style Rules</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-slate-600 truncate">
                    {guideline.rules.style.length > 0 
                      ? guideline.rules.style.join(", ")
                      : "..."}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-words">
                  {guideline.rules.style.length > 0 
                    ? guideline.rules.style.join(", ")
                    : "No style rules defined"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card>
          <Card className="p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Terminology Rules</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-slate-600 truncate">
                    {guideline.rules.terminology.length > 0 
                      ? guideline.rules.terminology.join(", ")
                      : "..."}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] break-words">
                  {guideline.rules.terminology.length > 0 
                    ? guideline.rules.terminology.join(", ")
                    : "No terminology rules defined"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card>
        </CardContent>
      </div>
      <CardFooter className="border-t pt-6">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-slate-500 whitespace-nowrap">
            Last modified: {guideline.lastModified}
          </p>
          <div className="flex space-x-2">
            <div>
              <NewGuidelineDialog 
                mode="edit"
                initialData={{
                  title: guideline.title,
                  description: guideline.description,
                  contentType: guideline.contentType,
                  publication: guideline.publication,
                  audience: guideline.audience,
                  status: guideline.status,
                  categories: {
                    tone: { name: "Tone", rules: guideline.rules.tone },
                    style: { name: "Style", rules: guideline.rules.style },
                    terminology: { name: "Terminology", rules: guideline.rules.terminology }
                  }
                }}
                onSave={(formData) => handleUpdateGuideline(guideline.id, formData)}
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setGuidelineToDelete(guideline.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col bg-white">
        <TitleBar 
          breadcrumbs={[
            { label: "Brand Compass", href: "/brand-compass" },
            { label: "Guidelines" }
          ]} 
        />
        <div className="w-full p-8">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Guidelines</h1>
                  <p className="text-slate-600 mt-2">
                    Create and manage your brand voice guidelines
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div>
                    <NewGuidelineDialog mode="create" onSave={handleSaveGuideline} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  >
                    {isFiltersVisible ? (
                      <>
                        Hide Filters <ChevronUp className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Show Filters <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFiltersVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-40">
                      <FilterSelect
                        placeholder="Status"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'draft', label: 'Draft' }
                        ]}
                        value={filters.status}
                        onChange={handleFilterChange('status')}
                      />
                    </div>
                    <div className="w-48">
                      <FilterSelect
                        placeholder="Content Type"
                        options={uniqueContentTypes.map(type => ({ value: type, label: type }))}
                        value={filters.contentType}
                        onChange={handleFilterChange('contentType')}
                      />
                    </div>
                    <div className="w-48">
                      <FilterSelect
                        placeholder="Publication"
                        options={uniquePublications.map(pub => ({ value: pub, label: pub }))}
                        value={filters.publication}
                        onChange={handleFilterChange('publication')}
                      />
                    </div>
                    <div className="w-48">
                      <FilterSelect
                        placeholder="Audience"
                        options={uniqueAudiences.map(audience => ({ value: audience, label: audience }))}
                        value={filters.audience}
                        onChange={handleFilterChange('audience')}
                      />
                    </div>
                  </div>
                  <Separator />
                </div>
              </div>

              <div className="relative mt-6 overflow-x-auto">
                <Carousel
                  opts={{
                    align: "start",
                    dragFree: true,
                    containScroll: "trimSnaps",
                    skipSnaps: true,
                    axis: "x"
                  }}
                  className="w-full cursor-grab active:cursor-grabbing overflow-x-auto"
                >
                  <CarouselContent className="-ml-4">
                    {filterGuidelines(guidelines).map((guideline) => (
                      <CarouselItem key={guideline.id} className="pl-4 basis-1/2">
                        <GuidelineCard guideline={guideline} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
                  <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>

        <AlertDialog open={!!guidelineToDelete} onOpenChange={() => setGuidelineToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this guideline?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the guideline and remove it from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => guidelineToDelete && handleDelete(guidelineToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
}

