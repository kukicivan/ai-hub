import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Clock,
  Bell,
  Mail,
  MoreVertical,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Send,
  User,
  Plus,
} from "lucide-react";
import { format, formatDistanceToNow, addDays, isPast, isToday, isTomorrow } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface FollowUp {
  id: string;
  emailId: number;
  subject: string;
  recipient: string;
  reason: string;
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  isAIGenerated: boolean;
  suggestedAction?: string;
}

const mockFollowUps: FollowUp[] = [
  {
    id: "1",
    emailId: 101,
    subject: "Re: Ponuda za projekt",
    recipient: "client@company.com",
    reason: "Čekanje odgovora na ponudu",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday (overdue)
    status: "overdue",
    isAIGenerated: true,
    suggestedAction: "Pošaljite prijateljski podsjetnik s kratkim sažetkom ponude",
  },
  {
    id: "2",
    emailId: 102,
    subject: "Sastanak u ponedjeljak",
    recipient: "team@partner.io",
    reason: "Potvrda dolaska na sastanak",
    dueDate: new Date(), // Today
    status: "pending",
    isAIGenerated: true,
    suggestedAction: "Potvrdite detalje sastanka i pošaljite agendu",
  },
  {
    id: "3",
    emailId: 103,
    subject: "Dokumentacija projekta",
    recipient: "developer@team.hr",
    reason: "Provjera statusa dostave",
    dueDate: addDays(new Date(), 1), // Tomorrow
    status: "pending",
    isAIGenerated: false,
  },
  {
    id: "4",
    emailId: 104,
    subject: "Faktura #2024-089",
    recipient: "accounting@vendor.com",
    reason: "Podsjetnik za plaćanje",
    dueDate: addDays(new Date(), 3),
    status: "pending",
    isAIGenerated: true,
    suggestedAction: "Pošaljite službeni podsjetnik s detaljima fakture",
  },
];

const getDueDateLabel = (date: Date): { label: string; className: string } => {
  if (isPast(date) && !isToday(date)) {
    return { label: "Prekoračeno", className: "text-red-600 bg-red-100 dark:bg-red-900/30" };
  }
  if (isToday(date)) {
    return { label: "Danas", className: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" };
  }
  if (isTomorrow(date)) {
    return { label: "Sutra", className: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" };
  }
  return { label: format(date, "d MMM", { locale: hr }), className: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" };
};

export function EmailFollowUpReminder() {
  const toast = useToast();
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    recipient: "",
    subject: "",
    reason: "",
    dueDate: addDays(new Date(), 1),
  });

  const overdueCount = followUps.filter((f) => f.status === "overdue").length;
  const todayCount = followUps.filter((f) => isToday(f.dueDate) && f.status === "pending").length;

  const handleMarkComplete = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "completed" as const } : f))
    );
    toast.success("Follow-up označen kao završen");
  };

  const handleDelete = (id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
    toast.success("Follow-up obrisan");
  };

  const handleSendFollowUp = (followUp: FollowUp) => {
    toast.success(`Otvaram email za: ${followUp.recipient}`);
    // Would open compose modal with pre-filled data
  };

  const handleSnooze = (id: string, days: number) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, dueDate: addDays(new Date(), days), status: "pending" as const }
          : f
      )
    );
    toast.success(`Follow-up odgođen za ${days} dana`);
  };

  const handleAddFollowUp = () => {
    if (!newFollowUp.recipient || !newFollowUp.reason) {
      toast.error("Unesite primatelja i razlog");
      return;
    }

    const followUp: FollowUp = {
      id: Date.now().toString(),
      emailId: 0,
      subject: newFollowUp.subject,
      recipient: newFollowUp.recipient,
      reason: newFollowUp.reason,
      dueDate: newFollowUp.dueDate,
      status: "pending",
      isAIGenerated: false,
    };

    setFollowUps((prev) => [followUp, ...prev]);
    setShowAddDialog(false);
    setNewFollowUp({
      recipient: "",
      subject: "",
      reason: "",
      dueDate: addDays(new Date(), 1),
    });
    toast.success("Follow-up kreiran");
  };

  const activeFollowUps = followUps.filter((f) => f.status !== "completed");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Follow-up podsjetnici
          </CardTitle>
          <div className="flex items-center gap-2">
            {overdueCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {overdueCount} prekoračeno
              </Badge>
            )}
            {todayCount > 0 && (
              <Badge className="text-xs bg-orange-500">
                {todayCount} danas
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-3">
            {activeFollowUps.map((followUp) => {
              const dueDateInfo = getDueDateLabel(followUp.dueDate);

              return (
                <div
                  key={followUp.id}
                  className={cn(
                    "p-3 border rounded-lg transition-colors",
                    followUp.status === "overdue"
                      ? "border-red-200 bg-red-50/50 dark:bg-red-900/10"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm truncate">
                          {followUp.recipient}
                        </span>
                        {followUp.isAIGenerated && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </Badge>
                        )}
                      </div>
                      {followUp.subject && (
                        <p className="text-sm text-muted-foreground truncate">
                          {followUp.subject}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSendFollowUp(followUp)}>
                          <Send className="h-4 w-4 mr-2" />
                          Pošalji follow-up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkComplete(followUp.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Označi završenim
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze(followUp.id, 1)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Odgodi 1 dan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze(followUp.id, 3)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Odgodi 3 dana
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(followUp.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={cn("text-xs", dueDateInfo.className)}>
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {dueDateInfo.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {followUp.reason}
                    </span>
                  </div>

                  {followUp.suggestedAction && (
                    <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                      <span className="font-medium text-primary">AI prijedlog: </span>
                      {followUp.suggestedAction}
                    </div>
                  )}

                  {followUp.status === "overdue" && (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">
                        Prekoračeno za {formatDistanceToNow(followUp.dueDate, { locale: hr })}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {activeFollowUps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nema aktivnih follow-up podsjetnika</p>
                <p className="text-xs mt-1">
                  AI će automatski predložiti follow-up za neogovorene emailove
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* AI Insight */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                AI praćenje
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                AI automatski prati emailove bez odgovora i predlaže optimalno vrijeme
                za follow-up na temelju povijesti komunikacije.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Add Follow-up Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novi follow-up podsjetnik</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Primatelj</Label>
              <Input
                value={newFollowUp.recipient}
                onChange={(e) =>
                  setNewFollowUp({ ...newFollowUp, recipient: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label>Predmet (opciono)</Label>
              <Input
                value={newFollowUp.subject}
                onChange={(e) =>
                  setNewFollowUp({ ...newFollowUp, subject: e.target.value })
                }
                placeholder="Re: Ponuda..."
              />
            </div>

            <div>
              <Label>Razlog</Label>
              <Textarea
                value={newFollowUp.reason}
                onChange={(e) =>
                  setNewFollowUp({ ...newFollowUp, reason: e.target.value })
                }
                placeholder="Zašto trebate follow-up..."
                rows={2}
              />
            </div>

            <div>
              <Label>Podsjeti me</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newFollowUp.dueDate, "d MMMM yyyy", { locale: hr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newFollowUp.dueDate}
                    onSelect={(date) =>
                      date && setNewFollowUp({ ...newFollowUp, dueDate: date })
                    }
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleAddFollowUp}>Kreiraj podsjetnik</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EmailFollowUpReminder;
