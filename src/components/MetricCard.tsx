
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard = ({ title, value, change, icon, className }: MetricCardProps) => {
  return (
    <div className={cn("pattern-card glass-card animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-muted">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-brand-primary">{value}</p>
        </div>
        {icon && <div className="text-brand-lighter">{icon}</div>}
      </div>
      {change && (
        <p className="mt-2 text-sm text-gray-DEFAULT">
          <span className="text-brand-primary">↑</span> {change}
        </p>
      )}
    </div>
  );
};
