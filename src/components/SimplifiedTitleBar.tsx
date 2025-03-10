import { Save, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToastAlert } from "@/components/ui/toast-alert";

interface SimplifiedTitleBarProps {
  onSaveToDatabase?: () => void;
  onLoadFromDatabase?: () => void;
}

export const SimplifiedTitleBar = ({
  onSaveToDatabase,
  onLoadFromDatabase,
}: SimplifiedTitleBarProps) => {
  return (
    <div className="w-full bg-brand-primary px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    if (onSaveToDatabase) {
                      onSaveToDatabase();
                    } else {
                      showToastAlert(
                        "Save to database functionality would be implemented here",
                        "info"
                      );
                    }
                  }}
                >
                  <Save className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save to Database</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    if (onLoadFromDatabase) {
                      onLoadFromDatabase();
                    } else {
                      showToastAlert(
                        "Load from database functionality would be implemented here",
                        "info"
                      );
                    }
                  }}
                >
                  <Database className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load from Database</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
