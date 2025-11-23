import React from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Reply, Clock, Archive, Calendar, Search, Bell, CheckSquare } from "lucide-react";

export type ActionType =
  | "RESPOND"
  | "SCHEDULE"
  | "TODO"
  | "POSTPONE"
  | "RESEARCH"
  | "FOLLOW_UP"
  | "ARCHIVE";

export interface ActionStep {
  type: ActionType;
  description: string;
  timeline?: string;
  deadline?: string | null;
  estimated_time?: number;
  template_suggestion?: string | null;
}

interface SmartActionButtonProps {
  primaryAction?: ActionStep;
  recommendedActions?: ActionStep[];
  onActionSelect: (action: ActionStep) => void;
  disabled?: boolean;
}

// Action type configurations
const actionConfig: Record<
  ActionType,
  { label: string; bgColor: string; hoverColor: string; icon: React.ReactNode }
> = {
  RESPOND: {
    label: "Odgovori",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    icon: <Reply className="h-5 w-5" />,
  },
  SCHEDULE: {
    label: "Zakaži",
    bgColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    icon: <Calendar className="h-5 w-5" />,
  },
  TODO: {
    label: "Dodaj u zadatke",
    bgColor: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-600",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  POSTPONE: {
    label: "Odloži",
    bgColor: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    icon: <Clock className="h-5 w-5" />,
  },
  RESEARCH: {
    label: "Istraži",
    bgColor: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
    icon: <Search className="h-5 w-5" />,
  },
  FOLLOW_UP: {
    label: "Prati",
    bgColor: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    icon: <Bell className="h-5 w-5" />,
  },
  ARCHIVE: {
    label: "Arhiviraj",
    bgColor: "bg-gray-500",
    hoverColor: "hover:bg-gray-600",
    icon: <Archive className="h-5 w-5" />,
  },
};

export const SmartActionButton: React.FC<SmartActionButtonProps> = ({
  primaryAction,
  recommendedActions = [],
  onActionSelect,
  disabled = false,
}) => {
  // Default to RESPOND if no primary action
  const primary = primaryAction || {
    type: "RESPOND" as ActionType,
    description: "Odgovori na email",
  };

  const config = actionConfig[primary.type] || actionConfig.RESPOND;

  // Filter out primary action from recommended
  const secondaryActions = recommendedActions.filter(
    (a) => a.type !== primary.type
  );

  return (
    <div className="flex items-center gap-0">
      {/* Main Button */}
      <Button
        onClick={() => onActionSelect(primary)}
        disabled={disabled}
        className={`px-6 py-3 rounded-l-lg rounded-r-none ${config.bgColor} ${config.hoverColor} text-white font-semibold text-lg shadow-md transition-colors flex items-center gap-2`}
      >
        {config.icon}
        {config.label}
      </Button>

      {/* Divider */}
      <div className={`w-px h-12 ${config.bgColor}`} style={{ opacity: 0.7 }}></div>

      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={disabled}
            className={`px-3 py-3 rounded-r-lg rounded-l-none ${config.bgColor} ${config.hoverColor} text-white shadow-md transition-colors h-12`}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-lg p-3 bg-white shadow-lg">
          {/* Primary action at top */}
          <DropdownMenuItem
            className={`w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 ${config.bgColor} text-white cursor-pointer ${config.hoverColor}`}
            onClick={() => onActionSelect(primary)}
          >
            {config.icon}
            <div>
              <span className="text-base font-medium">{config.label}</span>
              {primary.timeline && (
                <span className="block text-xs opacity-80">{primary.timeline}</span>
              )}
            </div>
          </DropdownMenuItem>

          {/* Secondary actions */}
          {secondaryActions.map((action, idx) => {
            const actionConf = actionConfig[action.type] || actionConfig.RESPOND;
            return (
              <DropdownMenuItem
                key={idx}
                className={`w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 ${actionConf.bgColor} text-white cursor-pointer ${actionConf.hoverColor}`}
                onClick={() => onActionSelect(action)}
              >
                {actionConf.icon}
                <div>
                  <span className="text-base font-medium">{actionConf.label}</span>
                  {action.timeline && (
                    <span className="block text-xs opacity-80">{action.timeline}</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}

          {/* If no secondary actions, show all options */}
          {secondaryActions.length === 0 && (
            <>
              {Object.entries(actionConfig)
                .filter(([type]) => type !== primary.type)
                .map(([type, conf]) => (
                  <DropdownMenuItem
                    key={type}
                    className={`w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 ${conf.bgColor} text-white cursor-pointer ${conf.hoverColor}`}
                    onClick={() =>
                      onActionSelect({ type: type as ActionType, description: conf.label })
                    }
                  >
                    {conf.icon}
                    <span className="text-base font-medium">{conf.label}</span>
                  </DropdownMenuItem>
                ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

/**
 * Get primary action from AI analysis action_steps.
 * Returns the first action or a default RESPOND action.
 */
export function getPrimaryAction(actionSteps?: ActionStep[]): ActionStep {
  if (!actionSteps || actionSteps.length === 0) {
    return {
      type: "RESPOND",
      description: "Odgovori na email",
    };
  }

  // First action is primary
  return actionSteps[0];
}

/**
 * Get recommended actions (all except primary).
 */
export function getRecommendedActions(actionSteps?: ActionStep[]): ActionStep[] {
  if (!actionSteps || actionSteps.length <= 1) {
    return [];
  }

  return actionSteps.slice(1);
}

export default SmartActionButton;
