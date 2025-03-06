import { useNavigate } from "react-router-dom";
import { Users, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TitleBar } from "@/components/TitleBar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <TitleBar breadcrumbs={[]} />
      <div className="p-8">
        <div className="flex flex-col space-y-6">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer border-2 border-brand-primary"
            onClick={() => navigate("/brand-compass")}
          >
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-brand-primary" />
              </div>
              <div className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Content Strategy</CardTitle>
                  </div>
                  <CardDescription>
                    Comprehensive tools to plan, create, and manage your content ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Create a unified content strategy that drives engagement, builds your brand, and achieves your business goals.
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer border-2 border-brand-primary"
            onClick={() => navigate("/talent-search")}
          >
            <div className="flex">
              <div className="p-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-brand-primary" />
              </div>
              <div className="flex-1">
                <CardHeader>
                  <CardTitle>Talent Search</CardTitle>
                  <CardDescription>
                    Find the perfect content creators for your brand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Match your brand requirements with our curated network of content creators, influencers, and specialists.
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
