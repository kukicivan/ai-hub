import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PriorityLevel = "critical" | "high" | "medium" | "low" | "none";

interface EmailPriorityBadgeProps {
  priority: PriorityLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  aiDetected?: boolean;
  className?: string;
}

const priorityConfig: Record<
  PriorityLevel,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  critical: {
    label: "Kritično",
    icon: Flame,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    borderColor: "border-red-300 dark:border-red-700",
    description: "Zahtijeva hitnu pažnju",
  },
  high: {
    label: "Visoki",
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-300 dark:border-orange-700",
    description: "Važan email",
  },
  medium: {
    label: "Srednji",
    icon: ArrowUp,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    description: "Standardni prioritet",
  },
  low: {
    label: "Niski",
    icon: ArrowDown,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-300 dark:border-green-700",
    description: "Može čekati",
  },
  none: {
    label: "Bez prioriteta",
    icon: Minus,
    color: "text-gray-500 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-300 dark:border-gray-700",
    description: "Nema postavljenog prioriteta",
  },
};

const sizeConfig = {
  sm: {
    badge: "text-xs px-1.5 py-0.5",
    icon: "h-3 w-3",
    gap: "gap-1",
  },
  md: {
    badge: "text-sm px-2 py-1",
    icon: "h-4 w-4",
    gap: "gap-1.5",
  },
  lg: {
    badge: "text-base px-3 py-1.5",
    icon: "h-5 w-5",
    gap: "gap-2",
  },
};

export function EmailPriorityBadge({
  priority,
  showLabel = true,
  size = "md",
  aiDetected = false,
  className,
}: EmailPriorityBadgeProps) {
  const config = priorityConfig[priority];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  if (priority === "none" && !showLabel) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              sizeStyles.badge,
              sizeStyles.gap,
              config.bgColor,
              config.borderColor,
              config.color,
              "flex items-center font-medium",
              className
            )}
          >
            <Icon className={sizeStyles.icon} />
            {showLabel && <span>{config.label}</span>}
            {aiDetected && (
              <Sparkles className={cn(sizeStyles.icon, "text-purple-500")} />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{config.description}</p>
            {aiDetected && (
              <p className="text-xs text-muted-foreground mt-1">
                Prioritet određen AI analizom
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Priority indicator dot for compact displays
interface PriorityDotProps {
  priority: PriorityLevel;
  className?: string;
  pulse?: boolean;
}

export function PriorityDot({ priority, className, pulse = false }: PriorityDotProps) {
  const config = priorityConfig[priority];

  if (priority === "none") return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative", className)}>
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                priority === "critical" && "bg-red-500",
                priority === "high" && "bg-orange-500",
                priority === "medium" && "bg-yellow-500",
                priority === "low" && "bg-green-500"
              )}
            />
            {pulse && (priority === "critical" || priority === "high") && (
              <div
                className={cn(
                  "absolute inset-0 h-2 w-2 rounded-full animate-ping",
                  priority === "critical" && "bg-red-500",
                  priority === "high" && "bg-orange-500"
                )}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label} prioritet</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Priority selector for settings or filters
interface PrioritySelectorProps {
  value: PriorityLevel;
  onChange: (priority: PriorityLevel) => void;
  className?: string;
}

export function PrioritySelector({
  value,
  onChange,
  className,
}: PrioritySelectorProps) {
  const priorities: PriorityLevel[] = ["critical", "high", "medium", "low", "none"];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {priorities.map((priority) => {
        const config = priorityConfig[priority];
        const Icon = config.icon;
        const isSelected = value === priority;

        return (
          <TooltipProvider key={priority}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(priority)}
                  className={cn(
                    "p-2 rounded-lg border transition-all",
                    isSelected
                      ? cn(config.bgColor, config.borderColor, config.color)
                      : "border-transparent hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{config.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

// Priority stats for dashboard
interface PriorityStatsProps {
  stats: Record<PriorityLevel, number>;
  className?: string;
}

export function PriorityStats({ stats, className }: PriorityStatsProps) {
  const priorities: PriorityLevel[] = ["critical", "high", "medium", "low"];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {priorities.map((priority) => {
        const config = priorityConfig[priority];
        const count = stats[priority] || 0;

        if (count === 0) return null;

        return (
          <div key={priority} className="flex items-center gap-1.5">
            <PriorityDot priority={priority} />
            <span className="text-sm font-medium">{count}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {config.label.toLowerCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default EmailPriorityBadge;
