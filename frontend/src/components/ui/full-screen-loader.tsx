import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isLoading,
  message = "Molimo sačekajte...",
  className,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-200",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-2xl">
        <div className="relative">
          {/* Outer ring animation */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse" />
          {/* Spinner */}
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        </div>
        {message && <p className="text-sm font-medium text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default FullScreenLoader;
