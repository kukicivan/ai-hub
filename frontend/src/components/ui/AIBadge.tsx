import React from "react";
import {
  BadgeType,
  StatusValue,
  SentimentValue,
  PriorityValue,
  IntentValue,
} from "../../types/email.types";

interface AIBadgeProps {
  type: BadgeType;
  value: StatusValue | SentimentValue | PriorityValue | IntentValue;
}

const AIBadge: React.FC<AIBadgeProps> = ({ type, value }) => {
  const getStatusStyles = (status: StatusValue): string => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "pending":
        return "bg-gray-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getSentimentStyles = (sentiment: SentimentValue): string => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500 text-white";
      case "neutral":
        return "bg-blue-500 text-white";
      case "negative":
        return "bg-red-500 text-white";
      case "urgent":
        return "bg-red-600 text-white animate-pulse";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getPriorityStyles = (priority: PriorityValue): string => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "normal":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getIntentStyles = (intent: IntentValue): string => {
    switch (intent) {
      case "question":
        return "bg-blue-500 text-white";
      case "request":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-green-500 text-white";
      case "other":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getIntentIcon = (intent: IntentValue): string | null => {
    switch (intent) {
      case "question":
        return "?";
      case "request":
        return "!";
      case "info":
        return "i";
      default:
        return null;
    }
  };

  const getBadgeStyles = (): string => {
    switch (type) {
      case "status":
        return getStatusStyles(value as StatusValue);
      case "sentiment":
        return getSentimentStyles(value as SentimentValue);
      case "priority":
        return getPriorityStyles(value as PriorityValue);
      case "intent":
        return getIntentStyles(value as IntentValue);
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getIcon = (): string | null => {
    if (type === "intent") {
      return getIntentIcon(value as IntentValue);
    }
    return null;
  };

  const getLabel = (): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const icon = getIcon();

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold ${getBadgeStyles()} transition-all duration-300`}
    >
      {icon && <span className="font-bold">{icon}</span>}
      <span>{getLabel()}</span>
    </span>
  );
};

export default AIBadge;
