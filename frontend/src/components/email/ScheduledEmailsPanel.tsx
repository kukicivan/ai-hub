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
  Clock,
  Send,
  Trash2,
  Edit2,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface ScheduledEmail {
  id: string;
  to: string;
  subject: string;
  preview: string;
  scheduledAt: Date;
  status: "pending" | "sent" | "failed" | "cancelled";
  isAIGenerated?: boolean;
  linkedEmailId?: number;
}

// Mock scheduled emails - would come from API
const mockScheduledEmails: ScheduledEmail[] = [
  {
    id: "1",
    to: "client@company.com",
    subject: "Re: Ponuda za projekt",
    preview: "Poštovani, hvala na vašem interesu. U prilogu šaljemo detaljnu ponudu...",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 30), // In 30 minutes
    status: "pending",
  },
  {
    id: "2",
    to: "partner@startup.io",
    subject: "Follow-up: Partnerstvo",
    preview: "Samo kratki follow-up na naš razgovor od prošlog tjedna...",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // In 2 hours
    status: "pending",
    isAIGenerated: true,
    linkedEmailId: 42,
  },
  {
    id: "3",
    to: "team@company.hr",
    subject: "Tjedni izvještaj",
    preview: "Evo pregleda ovotjednih aktivnosti i postignuća...",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    status: "pending",
  },
  {
    id: "4",
    to: "investor@fund.com",
    subject: "Q3 Update",
    preview: "Dragi investitori, šaljemo vam kvartalni pregled...",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "sent",
  },
  {
    id: "5",
    to: "support@vendor.com",
    subject: "Podsjetnik: Faktura",
    preview: "Ovo je automatski podsjetnik za nepodmirenu fakturu...",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 30),
    status: "failed",
  },
];

function getStatusBadge(status: ScheduledEmail["status"]) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Čeka
        </Badge>
      );
    case "sent":
      return (
        <Badge className="text-xs bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Poslano
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Neuspjelo
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="text-xs">
          Otkazano
        </Badge>
      );
  }
}

interface ScheduledEmailsPanelProps {
  onEditEmail?: (id: string) => void;
}

export function ScheduledEmailsPanel({ onEditEmail }: ScheduledEmailsPanelProps) {
  const toast = useToast();
  const [emails, setEmails] = useState<ScheduledEmail[]>(mockScheduledEmails);

  const pendingEmails = emails.filter((e) => e.status === "pending");
  const completedEmails = emails.filter((e) => e.status !== "pending");

  const handleSendNow = (id: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "sent" as const, scheduledAt: new Date() } : e
      )
    );
    toast.success("Email poslan");
  };

  const handleCancel = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "cancelled" as const } : e))
    );
    toast.success("Slanje otkazano");
  };

  const handleDelete = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    toast.success("Email obrisan");
  };

  const handleRetry = (id: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "pending" as const, scheduledAt: new Date(Date.now() + 1000 * 60 * 5) }
          : e
      )
    );
    toast.success("Email zakazan za ponovno slanje");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Zakazani emailovi
          </CardTitle>
          <Badge variant="secondary">{pendingEmails.length} čeka</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pending Emails */}
        {pendingEmails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              Čekaju slanje
            </h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {pendingEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{email.to}</span>
                        {email.isAIGenerated && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendNow(email.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Pošalji sada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditEmail?.(email.id)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Uredi
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCancel(email.id)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Otkaži
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(email.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Obriši
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm font-medium truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {email.preview}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(email.scheduledAt, "d MMM, HH:mm", { locale: hr })}
                      </div>
                      <span className="text-xs text-primary">
                        za {formatDistanceToNow(email.scheduledAt, { locale: hr })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Completed/Failed Emails */}
        {completedEmails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              Nedavno
            </h4>
            <ScrollArea className="h-[150px]">
              <div className="space-y-2">
                {completedEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-3 border rounded-lg ${
                      email.status === "failed"
                        ? "border-destructive/50 bg-destructive/5"
                        : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{email.to}</span>
                          {getStatusBadge(email.status)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {email.subject}
                        </p>
                      </div>
                      {email.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleRetry(email.id)}
                        >
                          Ponovi
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(email.scheduledAt, "d MMM, HH:mm", { locale: hr })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Empty State */}
        {emails.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nema zakazanih emailova</p>
            <p className="text-xs mt-1">
              Zakazani emailovi će se pojaviti ovdje
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ScheduledEmailsPanel;
