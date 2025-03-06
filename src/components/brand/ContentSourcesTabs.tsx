
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatternCard } from "@/components/PatternCard";

interface ContentSourcesTabsProps {
  onSelectGuidelines: () => void;
}

export const ContentSourcesTabs = ({ onSelectGuidelines }: ContentSourcesTabsProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Content Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guidelines">
          <TabsList>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>
          <TabsContent value="guidelines" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div onClick={onSelectGuidelines} className="cursor-pointer">
                <PatternCard
                  title="Voice Guidelines"
                  description="Established brand voice patterns and tone guidelines"
                  impact="32 Guidelines"
                />
              </div>
              <PatternCard
                title="Style Rules"
                description="Visual and written style specifications"
                impact="18 Rules"
              />
            </div>
          </TabsContent>
          <TabsContent value="samples" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <PatternCard
                title="Content Examples"
                description="High-performing content samples across channels"
                impact="45 Samples"
              />
              <PatternCard
                title="Brand Assets"
                description="Visual and design asset examples"
                impact="24 Assets"
              />
            </div>
          </TabsContent>
          <TabsContent value="knowledge" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <PatternCard
                title="Brand Facts"
                description="Key information and brand statistics"
                impact="56 Facts"
              />
              <PatternCard
                title="Market Data"
                description="Industry insights and market position"
                impact="12 Reports"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
