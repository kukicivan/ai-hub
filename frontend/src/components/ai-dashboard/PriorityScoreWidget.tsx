import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  Mail,
  Star,
  Zap,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";

interface PriorityEmail {
  id: number;
  from: string;
  subject: string;
  priorityScore: number;
  factors: PriorityFactor[];
  receivedAt: Date;
  isVIP: boolean;
  hasDeadline: boolean;
  sentimentScore: number;
}

interface PriorityFactor {
  name: string;
  impact: number; // -10 to +10
  description: string;
}

const mockPriorityEmails: PriorityEmail[] = [
  {
    id: 1,
    from: "CEO",
    subject: "Hitno: Odluka potrebna danas",
    priorityScore: 95,
    factors: [
      { name: "VIP pošiljatelj", impact: 10, description: "Izvršni direktor" },
      { name: "Ključna riječ 'hitno'", impact: 8, description: "Označeno kao hitno" },
      { name: "Zahtijeva akciju", impact: 7, description: "Potrebna odluka" },
      { name: "Rok danas", impact: 10, description: "Deadline je danas" },
    ],
    receivedAt: new Date(Date.now() - 1000 * 60 * 30),
    isVIP: true,
    hasDeadline: true,
    sentimentScore: 0.3,
  },
  {
    id: 2,
    from: "Glavni klijent",
    subject: "Re: Ponuda - potrebne izmjene",
    priorityScore: 82,
    factors: [
      { name: "Važan kontakt", impact: 8, description: "Top 10% kontakata" },
      { name: "Poslovni kontekst", impact: 6, description: "Aktivna ponuda" },
      { name: "Čeka odgovor", impact: 5, description: "Follow-up email" },
    ],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isVIP: true,
    hasDeadline: false,
    sentimentScore: 0.1,
  },
  {
    id: 3,
    from: "Tim za podršku",
    subject: "Eskalacija: Klijent nezadovoljan",
    priorityScore: 78,
    factors: [
      { name: "Eskalacija", impact: 9, description: "Problem eskaliran" },
      { name: "Negativan sentiment", impact: 7, description: "Nezadovoljstvo" },
      { name: "Potrebna akcija", impact: 5, description: "Zahtijeva rješenje" },
    ],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isVIP: false,
    hasDeadline: false,
    sentimentScore: -0.6,
  },
  {
    id: 4,
    from: "Računovodstvo",
    subject: "Faktura #2024-156 - rok plaćanja",
    priorityScore: 65,
    factors: [
      { name: "Financijski", impact: 6, description: "Financijski dokument" },
      { name: "Rok plaćanja", impact: 5, description: "Deadline približava" },
    ],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isVIP: false,
    hasDeadline: true,
    sentimentScore: 0,
  },
  {
    id: 5,
    from: "Newsletter",
    subject: "Tjedne vijesti iz industrije",
    priorityScore: 15,
    factors: [
      { name: "Newsletter", impact: -5, description: "Automatski email" },
      { name: "Niska interakcija", impact: -3, description: "Rijetko otvaran" },
    ],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isVIP: false,
    hasDeadline: false,
    sentimentScore: 0.5,
  },
];

const getPriorityColor = (score: number) => {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-orange-500";
  if (score >= 40) return "bg-yellow-500";
  if (score >= 20) return "bg-blue-500";
  return "bg-gray-400";
};

const getPriorityLabel = (score: number) => {
  if (score >= 80) return "Kritično";
  if (score >= 60) return "Visoko";
  if (score >= 40) return "Srednje";
  if (score >= 20) return "Nisko";
  return "Minimalno";
};

const formatTimeAgo = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

export function PriorityScoreWidget() {
  const [showAllFactors, setShowAllFactors] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "vip">("all");

  const filteredEmails = mockPriorityEmails.filter((email) => {
    if (filter === "high") return email.priorityScore >= 60;
    if (filter === "vip") return email.isVIP;
    return true;
  });

  const averageScore = Math.round(
    mockPriorityEmails.reduce((acc, e) => acc + e.priorityScore, 0) /
      mockPriorityEmails.length
  );

  const highPriorityCount = mockPriorityEmails.filter(
    (e) => e.priorityScore >= 60
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            AI Prioritet
          </CardTitle>
          <div className="flex items-center gap-1">
            {[
              { value: "all", label: "Sve" },
              { value: "high", label: "Visoko" },
              { value: "vip", label: "VIP" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter(option.value as typeof filter)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{averageScore}</p>
            <p className="text-xs text-muted-foreground">Prosječni prioritet</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
            <p className="text-xs text-muted-foreground">Visoki prioritet</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {mockPriorityEmails.filter((e) => e.isVIP).length}
            </p>
            <p className="text-xs text-muted-foreground">VIP poruke</p>
          </div>
        </div>

        {/* Priority Emails List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Priority Score Circle */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getPriorityColor(
                            email.priorityScore
                          )}`}
                        >
                          {email.priorityScore}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getPriorityLabel(email.priorityScore)} prioritet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Email Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {email.from}
                      </span>
                      {email.isVIP && (
                        <Badge className="text-xs bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {email.hasDeadline && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Rok
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatTimeAgo(email.receivedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {email.subject}
                    </p>

                    {/* Priority Bar */}
                    <div className="mt-2">
                      <Progress
                        value={email.priorityScore}
                        className="h-1.5"
                      />
                    </div>

                    {/* Factors Preview */}
                    <div className="flex items-center gap-1 mt-2">
                      {email.factors.slice(0, 2).map((factor, idx) => (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant={factor.impact > 0 ? "default" : "secondary"}
                                className="text-xs cursor-help"
                              >
                                {factor.impact > 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {Math.abs(factor.impact)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{factor.name}</p>
                              <p className="text-xs">{factor.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {email.factors.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-xs px-1"
                          onClick={() =>
                            setShowAllFactors(
                              showAllFactors === email.id ? null : email.id
                            )
                          }
                        >
                          +{email.factors.length - 2}
                        </Button>
                      )}
                    </div>

                    {/* Expanded Factors */}
                    {showAllFactors === email.id && (
                      <div className="mt-2 p-2 bg-muted/50 rounded space-y-1">
                        {email.factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs"
                          >
                            <span>{factor.name}</span>
                            <span
                              className={
                                factor.impact > 0
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {factor.impact > 0 ? "+" : ""}
                              {factor.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Kako funkcionira AI prioritet?
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                AI analizira pošiljatelja, sadržaj, rokove i vašu povijest
                interakcija kako bi izračunao prioritet od 0-100.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PriorityScoreWidget;
