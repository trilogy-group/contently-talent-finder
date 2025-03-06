
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DefaultTabContentProps {
  title: string;
}

export const DefaultTabContent = ({ title }: DefaultTabContentProps) => {
  // For the Audiences tab, we've moved the content to the banner image area,
  // so we'll just show a minimal card without any title or text
  if (title === "Target Audiences") {
    return (
      <Card className="w-full">
        <CardContent>
          {/* Empty card, no title or text */}
        </CardContent>
      </Card>
    );
  }

  // Default content for other tabs
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This section is currently under development.</p>
        <p className="mt-2">Check back soon for updates on this feature!</p>
      </CardContent>
    </Card>
  );
};
