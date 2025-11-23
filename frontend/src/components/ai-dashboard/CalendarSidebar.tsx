import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { format, isToday, isTomorrow, addDays, startOfDay } from "date-fns";
import { hr } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isOnline?: boolean;
  meetingLink?: string;
  attendees?: number;
  color: string;
  isAllDay?: boolean;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Standup tim",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(9, 30, 0, 0)),
    isOnline: true,
    meetingLink: "#",
    attendees: 5,
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Review projekta",
    startTime: new Date(new Date().setHours(11, 0, 0, 0)),
    endTime: new Date(new Date().setHours(12, 0, 0, 0)),
    location: "Soba A",
    attendees: 3,
    color: "bg-green-500",
  },
  {
    id: "3",
    title: "Ručak s klijentom",
    startTime: new Date(new Date().setHours(13, 0, 0, 0)),
    endTime: new Date(new Date().setHours(14, 30, 0, 0)),
    location: "Restoran Dubravkin put",
    color: "bg-orange-500",
  },
  {
    id: "4",
    title: "Planiranje sprinta",
    startTime: new Date(new Date().setHours(15, 0, 0, 0)),
    endTime: new Date(new Date().setHours(16, 30, 0, 0)),
    isOnline: true,
    meetingLink: "#",
    attendees: 8,
    color: "bg-purple-500",
  },
  {
    id: "5",
    title: "1:1 s Markom",
    startTime: new Date(addDays(new Date(), 1).setHours(10, 0, 0, 0)),
    endTime: new Date(addDays(new Date(), 1).setHours(10, 30, 0, 0)),
    isOnline: true,
    attendees: 2,
    color: "bg-pink-500",
  },
  {
    id: "6",
    title: "Prezentacija kvartala",
    startTime: new Date(addDays(new Date(), 1).setHours(14, 0, 0, 0)),
    endTime: new Date(addDays(new Date(), 1).setHours(15, 30, 0, 0)),
    location: "Velika dvorana",
    attendees: 25,
    color: "bg-red-500",
    isAllDay: false,
  },
];

interface CalendarSidebarProps {
  compact?: boolean;
}

export function CalendarSidebar({ compact = false }: CalendarSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(!compact);

  const todayEvents = mockEvents.filter(
    (event) => startOfDay(event.startTime).getTime() === startOfDay(selectedDate).getTime()
  );

  const upcomingEvents = mockEvents
    .filter((event) => event.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 5);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Danas";
    if (isTomorrow(date)) return "Sutra";
    return format(date, "EEEE, d. MMMM", { locale: hr });
  };

  const formatEventTime = (start: Date, end: Date) => {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  };

  const isEventNow = (event: CalendarEvent) => {
    const now = new Date();
    return now >= event.startTime && now <= event.endTime;
  };

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - new Date().getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 0) return null;
    if (minutes < 60) return `za ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `za ${hours}h`;
    return `za ${Math.floor(hours / 24)} dana`;
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalendar
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Novi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <div className={`w-1 h-8 rounded-full ${event.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.startTime, "HH:mm")}
                    {getTimeUntil(event.startTime) && (
                      <span className="ml-1">({getTimeUntil(event.startTime)})</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Kalendar
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Novi događaj
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Calendar */}
        {showCalendar && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={hr}
              className="rounded-md border"
            />
          </div>
        )}

        {/* Toggle Calendar */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sakrij kalendar
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4 mr-1" />
              Prikaži kalendar
            </>
          )}
        </Button>

        {/* Selected Date Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">{getDateLabel(selectedDate)}</h4>
            <Badge variant="secondary">{todayEvents.length} događaja</Badge>
          </div>

          {todayEvents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nema događaja za ovaj dan</p>
            </div>
          ) : (
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {todayEvents.map((event) => {
                  const happening = isEventNow(event);
                  return (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer ${
                        happening ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-1 h-full min-h-[40px] rounded-full ${event.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{event.title}</span>
                            {happening && (
                              <Badge className="text-xs bg-green-500">Sada</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatEventTime(event.startTime, event.endTime)}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            {event.isOnline && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Video className="h-3 w-3" />
                                Online
                              </span>
                            )}
                          </div>
                          {event.attendees && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {event.attendees} sudionika
                            </div>
                          )}
                        </div>
                      </div>
                      {event.isOnline && event.meetingLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 h-7 text-xs"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Pridruži se
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="text-sm font-medium mb-3">Nadolazeći događaji</h4>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full ${event.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.startTime, "EEEE, HH:mm", { locale: hr })}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {getTimeUntil(event.startTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CalendarSidebar;
