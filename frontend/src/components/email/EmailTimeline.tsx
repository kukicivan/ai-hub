import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Send,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Tag,
  Clock,
  Paperclip,
  Eye,
  CheckCheck,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday, isSameDay } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "received" | "sent" | "reply" | "forward" | "archive" | "star" | "label" | "read" | "scheduled";
  timestamp: Date;
  subject?: string;
  from?: string;
  to?: string;
  fromAvatar?: string;
  toAvatar?: string;
  snippet?: string;
  label?: string;
  hasAttachments?: boolean;
  isRead?: boolean;
  emailId?: string;
}

interface EmailTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  maxHeight?: number;
  showFilters?: boolean;
  className?: string;
}

const eventConfig: Record<
  TimelineEvent["type"],
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  received: {
    icon: Mail,
    label: "Primljeno",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  sent: {
    icon: Send,
    label: "Poslano",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  reply: {
    icon: Reply,
    label: "Odgovor",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  forward: {
    icon: Forward,
    label: "Proslijeđeno",
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  archive: {
    icon: Archive,
    label: "Arhivirano",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
  star: {
    icon: Star,
    label: "Označeno",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  label: {
    icon: Tag,
    label: "Označeno",
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  read: {
    icon: Eye,
    label: "Pročitano",
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  scheduled: {
    icon: Clock,
    label: "Zakazano",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
};

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "received",
    timestamp: new Date(),
    subject: "Kvartalni izvještaj Q4 2024",
    from: "Marko Horvat",
    fromAvatar: "",
    snippet: "Poštovani, u prilogu šaljem kvartalni izvještaj za pregled...",
    hasAttachments: true,
    isRead: false,
  },
  {
    id: "2",
    type: "sent",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    subject: "Re: Projekt dokumentacija",
    to: "Ana Kovač",
    snippet: "Hvala na ažuriranoj dokumentaciji. Pregledao sam...",
  },
  {
    id: "3",
    type: "reply",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    subject: "Re: Meeting sutra",
    from: "Ivan Perić",
    snippet: "Da, potvrđujem dolazak na sastanak u 14:00.",
  },
  {
    id: "4",
    type: "star",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    subject: "Važna obavijest",
  },
  {
    id: "5",
    type: "archive",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    subject: "Newsletter - Studeni 2024",
  },
  {
    id: "6",
    type: "forward",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
    subject: "Fwd: Prijedlog suradnje",
    to: "Tim prodaje",
  },
  {
    id: "7",
    type: "scheduled",
    timestamp: new Date(Date.now() + 1000 * 60 * 60 * 2),
    subject: "Follow-up: Ponuda",
    to: "Klijent d.o.o.",
  },
];

export function EmailTimeline({
  events = mockEvents,
  onEventClick,
  maxHeight = 500,
  showFilters = true,
  className,
}: EmailTimelineProps) {
  const [filter, setFilter] = useState<TimelineEvent["type"] | "all">("all");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(["today"]));

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  const groupedEvents = filteredEvents.reduce(
    (groups, event) => {
      let key: string;
      if (isToday(event.timestamp)) {
        key = "today";
      } else if (isYesterday(event.timestamp)) {
        key = "yesterday";
      } else {
        key = format(event.timestamp, "yyyy-MM-dd");
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
      return groups;
    },
    {} as Record<string, TimelineEvent[]>
  );

  const formatDayLabel = (key: string): string => {
    if (key === "today") return "Danas";
    if (key === "yesterday") return "Jučer";
    return format(new Date(key), "EEEE, d. MMMM", { locale: hr });
  };

  const toggleDay = (key: string) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Vremenska crta
          </CardTitle>
          {showFilters && (
            <div className="flex items-center gap-1">
              <Button
                variant={filter === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Sve
              </Button>
              <Button
                variant={filter === "received" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("received")}
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                variant={filter === "sent" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("sent")}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([dayKey, dayEvents]) => {
              const isExpanded = expandedDays.has(dayKey);
              return (
                <div key={dayKey}>
                  {/* Day header */}
                  <button
                    onClick={() => toggleDay(dayKey)}
                    className="flex items-center gap-2 w-full text-left mb-2"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">
                      {formatDayLabel(dayKey)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {dayEvents.length}
                    </Badge>
                  </button>

                  {/* Events */}
                  {isExpanded && (
                    <div className="relative ml-4 pl-4 border-l-2 border-muted space-y-4">
                      {dayEvents.map((event) => {
                        const config = eventConfig[event.type];
                        const Icon = config.icon;

                        return (
                          <div
                            key={event.id}
                            className="relative group cursor-pointer"
                            onClick={() => onEventClick?.(event)}
                          >
                            {/* Timeline dot */}
                            <div
                              className={cn(
                                "absolute -left-[25px] p-1.5 rounded-full border-2 border-background",
                                config.bgColor
                              )}
                            >
                              <Icon className={cn("h-3 w-3", config.color)} />
                            </div>

                            {/* Event content */}
                            <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        config.color,
                                        config.bgColor
                                      )}
                                    >
                                      {config.label}
                                    </Badge>
                                    {event.hasAttachments && (
                                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    {!event.isRead && event.type === "received" && (
                                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    )}
                                  </div>

                                  {event.subject && (
                                    <p className="font-medium text-sm truncate">
                                      {event.subject}
                                    </p>
                                  )}

                                  {(event.from || event.to) && (
                                    <div className="flex items-center gap-2 mt-1">
                                      {event.from && (
                                        <div className="flex items-center gap-1.5">
                                          <Avatar className="h-4 w-4">
                                            <AvatarImage src={event.fromAvatar} />
                                            <AvatarFallback className="text-[8px]">
                                              {getInitials(event.from)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs text-muted-foreground">
                                            od {event.from}
                                          </span>
                                        </div>
                                      )}
                                      {event.to && (
                                        <span className="text-xs text-muted-foreground">
                                          za {event.to}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {event.snippet && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {event.snippet}
                                    </p>
                                  )}
                                </div>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(event.timestamp, "HH:mm")}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {format(event.timestamp, "d. MMMM yyyy. HH:mm", {
                                        locale: hr,
                                      })}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Nema događaja za prikaz</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default EmailTimeline;
