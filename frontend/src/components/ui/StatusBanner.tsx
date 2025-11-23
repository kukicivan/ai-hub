import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Cloud,
  CloudOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

type Status = "online" | "offline" | "syncing" | "error" | "maintenance";

interface StatusBannerProps {
  initialStatus?: Status;
  onRetry?: () => void;
  dismissible?: boolean;
  message?: string;
}

interface SyncStatus {
  emails: boolean;
  contacts: boolean;
  calendar: boolean;
  lastSync?: Date;
}

const statusConfig: Record<Status, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className: string;
  bgClassName: string;
}> = {
  online: {
    icon: CheckCircle,
    label: "Povezano",
    className: "text-green-600",
    bgClassName: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  },
  offline: {
    icon: WifiOff,
    label: "Offline",
    className: "text-red-600",
    bgClassName: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
  syncing: {
    icon: RefreshCw,
    label: "Sinkronizacija",
    className: "text-blue-600",
    bgClassName: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
  error: {
    icon: XCircle,
    label: "Greška",
    className: "text-red-600",
    bgClassName: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
  maintenance: {
    icon: AlertTriangle,
    label: "Održavanje",
    className: "text-yellow-600",
    bgClassName: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  },
};

export function StatusBanner({
  initialStatus = "online",
  onRetry,
  dismissible = true,
  message,
}: StatusBannerProps) {
  const toast = useToast();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [syncProgress, setSyncProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    emails: true,
    contacts: true,
    calendar: true,
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
  });

  // Simulate online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      toast.success("Ponovo ste povezani");
    };

    const handleOffline = () => {
      setStatus("offline");
      toast.error("Izgubljena internet veza");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Simulate sync progress
  useEffect(() => {
    if (status === "syncing") {
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            setStatus("online");
            setSyncStatus((s) => ({ ...s, lastSync: new Date() }));
            clearInterval(interval);
            return 0;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [status]);

  const handleSync = () => {
    setStatus("syncing");
    setSyncProgress(0);
  };

  const handleRetry = () => {
    onRetry?.();
    handleSync();
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return "Nikad";
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Upravo sada";
    if (minutes < 60) return `Prije ${minutes} min`;
    return `Prije ${Math.floor(minutes / 60)}h`;
  };

  if (dismissed || status === "online") {
    return null;
  }

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={cn("border-b px-4 py-2", config.bgClassName)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon
            className={cn(
              "h-5 w-5",
              config.className,
              status === "syncing" && "animate-spin"
            )}
          />
          <div>
            <span className={cn("font-medium text-sm", config.className)}>
              {config.label}
            </span>
            {message && (
              <span className="text-sm text-muted-foreground ml-2">
                {message}
              </span>
            )}
          </div>

          {status === "syncing" && (
            <div className="flex items-center gap-2 ml-4">
              <Progress value={syncProgress} className="w-32 h-1.5" />
              <span className="text-xs text-muted-foreground">
                {syncProgress}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(status === "offline" || status === "error") && (
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={handleRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Pokušaj ponovno
            </Button>
          )}

          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact status indicator for header
export function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
          isOnline
            ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
            : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
        )}
      >
        {isOnline ? (
          <>
            <Cloud className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sinkronizirano</span>
          </>
        ) : (
          <>
            <CloudOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Offline</span>
          </>
        )}
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-1 w-64 p-3 bg-popover border rounded-lg shadow-lg z-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={isOnline ? "default" : "destructive"}
                className="text-xs"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Zadnja sinkronizacija</span>
              <span className="text-xs">Prije 2 min</span>
            </div>
            <div className="pt-2 border-t space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Emailovi sinkronizirani</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Kontakti sinkronizirani</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Kalendar sinkroniziran</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusBanner;
