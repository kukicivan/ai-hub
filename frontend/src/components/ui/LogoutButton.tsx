import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout as logoutAction } from "@/redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={cn("ml-auto px-4", className)}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Log out
    </Button>
  );
};

export default LogoutButton;
