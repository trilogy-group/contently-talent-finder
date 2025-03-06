
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Edit, FileText } from 'lucide-react';

interface BrandVoiceCardProps {
  name: string;
  description: string;
  tonePillars: string[];
  contentThemes: string[];
  onEdit?: () => void;
  className?: string;
}

export const BrandVoiceCard = ({
  name,
  description,
  tonePillars,
  contentThemes,
  onEdit,
  className = "",
}: BrandVoiceCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">Brand Voice Profile</p>
        </div>
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Tone Pillars</h4>
          <div className="flex flex-wrap gap-2">
            {tonePillars.map((pillar, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Content Themes</h4>
          <div className="flex flex-wrap gap-2">
            {contentThemes.map((theme, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-50 rounded-full text-xs text-emerald-600"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
