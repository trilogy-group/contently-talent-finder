
import { Card, CardContent } from "@/components/ui/card";

interface StrategyBannerProps {
  title: string;
  description: string;
  image: string;
  activeTab: string;
}

export const StrategyBanner = ({ title, description, image, activeTab }: StrategyBannerProps) => {
  // This component is now intentionally empty to remove the banner with image
  // Props are kept for compatibility with parent components
  return null;
};
