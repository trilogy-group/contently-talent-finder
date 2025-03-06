
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Temporarily disabled auth check for development
  // if (!isAuthenticated()) {
  //   toast.error("Please login to access this page");
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
