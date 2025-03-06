
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Database, ChartBar } from "lucide-react";
import { BrandStats } from "@/types/brand-compass";

export const StatsCards = ({ stats }: { stats: BrandStats }) => {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Content Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-brand-primary" />
            <span className="text-2xl font-bold">{stats.contentSources}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Active Workers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-brand-primary" />
            <span className="text-2xl font-bold">{stats.workers}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Generations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Database className="w-4 h-4 mr-2 text-brand-primary" />
            <span className="text-2xl font-bold">{stats.generations}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Last Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ChartBar className="w-4 h-4 mr-2 text-brand-primary" />
            <span className="text-sm">{stats.lastAnalysis}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
