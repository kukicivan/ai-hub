import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Mail,
  Sparkles,
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from "date-fns";
import { hr } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "meeting" | "call" | "task" | "reminder" | "email-followup";
  location?: string;
  attendees?: string[];
  isAIGenerated?: boolean;
  emailId?: number;
}

// Mock events - would come from API
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Sastanak s klijentom",
    description: "Razgovor o novom projektu",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting",
    location: "Zoom",
    attendees: ["client@company.com"],
  },
  {
    id: "2",
    title: "Follow-up: Ponuda projekta",
    description: "Odgovoriti na email o ponudi",
    date: new Date(),
    startTime: "14:00",
    endTime: "14:30",
    type: "email-followup",
    isAIGenerated: true,
    emailId: 42,
  },
  {
    id: "3",
    title: "Tim standup",
    date: addDays(new Date(), 1),
    startTime: "09:00",
    endTime: "09:30",
    type: "call",
    attendees: ["team@company.com"],
  },
  {
    id: "4",
    title: "Prezentacija",
    description: "Prezentacija novog proizvoda",
    date: addDays(new Date(), 2),
    startTime: "15:00",
    endTime: "16:30",
    type: "meeting",
    location: "Konferencijska soba A",
  },
];

function getEventTypeColor(type: CalendarEvent["type"]) {
  switch (type) {
    case "meeting":
      return "bg-blue-500";
    case "call":
      return "bg-green-500";
    case "task":
      return "bg-orange-500";
    case "reminder":
      return "bg-yellow-500";
    case "email-followup":
      return "bg-purple-500";
  }
}

function getEventTypeLabel(type: CalendarEvent["type"]) {
  switch (type) {
    case "meeting":
      return "Sastanak";
    case "call":
      return "Poziv";
    case "task":
      return "Zadatak";
    case "reminder":
      return "Podsjetnik";
    case "email-followup":
      return "Email praćenje";
  }
}

export function Calendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting" as CalendarEvent["type"],
    location: "",
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleCreateEvent = () => {
    if (!newEvent.title) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      location: newEvent.location,
    };

    setEvents((prev) => [...prev, event]);
    setNewEvent({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      type: "meeting",
      location: "",
    });
    setIsCreateDialogOpen(false);
  };

  const selectedDayEvents = getEventsForDay(selectedDate);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-7 w-7 text-primary" />
            Kalendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Upravljajte sastancima i zadacima
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novi događaj
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {format(currentWeekStart, "MMMM yyyy", { locale: hr })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Danas
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {format(day, "EEE", { locale: hr })}
                  </div>
                ))}
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday
                            ? "w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                            : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate text-white ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.startTime} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayEvents.length - 3} više
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Detail */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{format(selectedDate, "EEEE, d MMMM", { locale: hr })}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nema događaja za ovaj dan</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      Dodaj događaj
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getEventTypeColor(
                                event.type
                              )}`}
                            />
                            <span className="font-medium text-sm">{event.title}</span>
                          </div>
                          {event.isAIGenerated && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {event.startTime} - {event.endTime}
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-2">
                              {event.location.toLowerCase().includes("zoom") ? (
                                <Video className="h-3 w-3" />
                              ) : (
                                <MapPin className="h-3 w-3" />
                              )}
                              {event.location}
                            </div>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} sudionika
                            </div>
                          )}

                          {event.type === "email-followup" && (
                            <div className="flex items-center gap-2 text-purple-600">
                              <Mail className="h-3 w-3" />
                              Povezano s emailom
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novi događaj</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Naslov</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Naziv događaja"
              />
            </div>

            <div>
              <Label>Opis</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Opis događaja..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Početak</Label>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Kraj</Label>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Tip</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value: CalendarEvent["type"]) =>
                  setNewEvent({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Sastanak</SelectItem>
                  <SelectItem value="call">Poziv</SelectItem>
                  <SelectItem value="task">Zadatak</SelectItem>
                  <SelectItem value="reminder">Podsjetnik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lokacija (opciono)</Label>
              <Input
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Zoom, konferencijska soba..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleCreateEvent}>Kreiraj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Calendar;
