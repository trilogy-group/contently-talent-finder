import { ChevronRight, Home, User, LogOut, Save, Database } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { showToastAlert } from "@/components/ui/toast-alert";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TitleBarProps {
  breadcrumbs: BreadcrumbItem[];
  totalAmount?: string;
  showTotal?: boolean;
  onSaveToDatabase?: () => void;
  onLoadFromDatabase?: () => void;
}

export const TitleBar = ({ 
  breadcrumbs, 
  totalAmount, 
  showTotal = false,
  onSaveToDatabase,
  onLoadFromDatabase
}: TitleBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-brand-primary px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Link to="/index" className="hover:text-white/90">
            <Home className="w-4 h-4" />
          </Link>

          {breadcrumbs.length > 0 && (
            <>
              <ChevronRight className="w-3 h-3 text-white/50" />
              <div className="flex items-center gap-2">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.href ? (
                      <Link to={item.href} className="text-sm hover:text-white/90">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-sm">{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-white/50" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showTotal && totalAmount && (
            <div className="text-white font-semibold text-lg">
              Total: {totalAmount}
            </div>
          )}
          
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
                      showToastAlert("Save to database functionality would be implemented here", "info");
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
                      showToastAlert("Load from database functionality would be implemented here", "info");
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
