
import { cn } from "@/lib/utils";

interface PatternCardProps {
  title: string;
  description: string;
  impact: string;
  className?: string;
}

export const PatternCard = ({ title, description, impact, className }: PatternCardProps) => {
  return (
    <div className={cn("insight-card animate-slide-up", className)}>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-emerald-600">{impact}</span>
        <span className="text-emerald-500">↑</span>
      </div>
    </div>
  );
};
