import { useState, useRef, TouchEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  Paperclip,
  Archive,
  Trash2,
  Mail,
  MailOpen,
} from "lucide-react";
import { EmailMessage } from "@/redux/features/email/emailApi";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

interface EmailListItemProps {
  email: EmailMessage;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onClick?: (email: EmailMessage) => void;
  onStar?: (id: number, starred: boolean) => void;
  onArchive?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMarkRead?: (id: number, read: boolean) => void;
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "high":
      return { color: "bg-red-500", label: "HITNO", badge: "destructive" as const };
    case "normal":
      return { color: "bg-yellow-500", label: "VAŽNO", badge: "warning" as const };
    case "low":
      return { color: "bg-green-500", label: "NORMALNO", badge: "secondary" as const };
    default:
      return { color: "bg-gray-400", label: "", badge: "outline" as const };
  }
}

const SWIPE_THRESHOLD = 80;

export function EmailListItem({
  email,
  isSelected = false,
  onSelect,
  onClick,
  onStar,
  onArchive,
  onDelete,
  onMarkRead,
}: EmailListItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const priorityConfig = getPriorityConfig(email.priority);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    // Only handle horizontal swipes
    if (isHorizontalSwipe.current) {
      e.preventDefault();
      // Limit swipe offset
      const maxOffset = 120;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, diffX));
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (swipeOffset > SWIPE_THRESHOLD) {
      // Swipe right - Archive
      onArchive?.(email.id);
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      // Swipe left - Delete
      onDelete?.(email.id);
    }

    setSwipeOffset(0);
    isHorizontalSwipe.current = null;
  };

  const handleClick = () => {
    if (Math.abs(swipeOffset) < 5) {
      onClick?.(email);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left swipe action (Archive) */}
      <div
        className="absolute inset-y-0 left-0 flex items-center justify-end px-4 bg-green-500 text-white transition-opacity"
        style={{
          width: "120px",
          opacity: swipeOffset > 20 ? 1 : 0,
        }}
      >
        <Archive className="h-6 w-6" />
        <span className="ml-2 text-sm font-medium">Arhiviraj</span>
      </div>

      {/* Right swipe action (Delete) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-start px-4 bg-red-500 text-white transition-opacity"
        style={{
          width: "120px",
          opacity: swipeOffset < -20 ? 1 : 0,
        }}
      >
        <Trash2 className="h-6 w-6" />
        <span className="ml-2 text-sm font-medium">Obriši</span>
      </div>

      {/* Main content */}
      <div
        className={`relative bg-background border-b transition-transform ${
          email.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3 p-4">
          {/* Selection Checkbox */}
          {onSelect && (
            <div className="pt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(email.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Avatar */}
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="text-sm bg-primary/10">
              {getInitials(email.sender)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Priority Indicator */}
              <div className={`w-2 h-2 rounded-full ${priorityConfig.color} flex-shrink-0`} />

              {/* Sender */}
              <span className={`font-medium truncate ${email.unread ? "text-foreground" : "text-muted-foreground"}`}>
                {email.sender.split("@")[0]}
              </span>

              {/* Star Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStar?.(email.id, !email.starred);
                }}
                className="ml-auto flex-shrink-0"
              >
                <Star
                  className={`h-4 w-4 ${
                    email.starred
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground hover:text-yellow-500"
                  }`}
                />
              </button>

              {/* Time */}
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatDistanceToNow(new Date(email.received_at), {
                  addSuffix: false,
                  locale: hr,
                })}
              </span>
            </div>

            {/* Subject */}
            <p className={`text-sm truncate ${email.unread ? "font-medium" : ""}`}>
              {email.subject}
            </p>

            {/* Summary */}
            {email.summary && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {email.summary}
              </p>
            )}

            {/* Tags */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {email.classification?.primary_category && (
                <Badge variant="outline" className="text-xs">
                  {email.classification.primary_category}
                </Badge>
              )}

              {email.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  {priorityConfig.label}
                </Badge>
              )}

              {email.important && (
                <Badge variant="secondary" className="text-xs">
                  Važno
                </Badge>
              )}
            </div>
          </div>

          {/* Right side indicators */}
          <div className="flex flex-col items-center gap-2">
            {/* Read/Unread indicator */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead?.(email.id, !email.unread);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              {email.unread ? (
                <Mail className="h-4 w-4" />
              ) : (
                <MailOpen className="h-4 w-4" />
              )}
            </button>

            {/* Attachment indicator */}
            {email.html_analysis?.is_newsletter === false && (
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailListItem;
