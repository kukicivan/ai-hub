import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Mail,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SenderStats {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  emailCount: number;
  responseRate: number;
  avgResponseTime: string;
  sentiment: "positive" | "neutral" | "negative";
  isVIP: boolean;
  lastContact: string;
  trend: "up" | "down" | "stable";
}

// Mock sender data - would come from API
const topSenders: SenderStats[] = [
  {
    id: "1",
    name: "Marko Horvat",
    email: "marko@company.hr",
    emailCount: 45,
    responseRate: 95,
    avgResponseTime: "2h",
    sentiment: "positive",
    isVIP: true,
    lastContact: "Danas",
    trend: "up",
  },
  {
    id: "2",
    name: "Ana Novak",
    email: "ana@startup.io",
    emailCount: 32,
    responseRate: 88,
    avgResponseTime: "4h",
    sentiment: "positive",
    isVIP: true,
    lastContact: "Jučer",
    trend: "up",
  },
  {
    id: "3",
    name: "Ivan Petrović",
    email: "ivan@enterprise.com",
    emailCount: 28,
    responseRate: 72,
    avgResponseTime: "1d",
    sentiment: "neutral",
    isVIP: false,
    lastContact: "Prije 3 dana",
    trend: "down",
  },
  {
    id: "4",
    name: "Petra Babić",
    email: "petra@design.studio",
    emailCount: 18,
    responseRate: 100,
    avgResponseTime: "1h",
    sentiment: "positive",
    isVIP: false,
    lastContact: "Ovaj tjedan",
    trend: "stable",
  },
  {
    id: "5",
    name: "Luka Matić",
    email: "luka@fintech.hr",
    emailCount: 15,
    responseRate: 65,
    avgResponseTime: "2d",
    sentiment: "negative",
    isVIP: false,
    lastContact: "Prošli tjedan",
    trend: "down",
  },
];

function getSentimentColor(sentiment: SenderStats["sentiment"]) {
  switch (sentiment) {
    case "positive":
      return "text-green-500";
    case "neutral":
      return "text-blue-500";
    case "negative":
      return "text-red-500";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SenderAnalyticsCard() {
  const navigate = useNavigate();

  const totalEmails = topSenders.reduce((acc, s) => acc + s.emailCount, 0);
  const avgResponseRate = Math.round(
    topSenders.reduce((acc, s) => acc + s.responseRate, 0) / topSenders.length
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Analitika pošiljatelja
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => navigate("/contacts")}
          >
            Svi kontakti
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold">{totalEmails}</span>
            </div>
            <p className="text-xs text-muted-foreground">Ukupno emailova</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold">{avgResponseRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Prosj. odgovor</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-lg font-bold">
                {topSenders.filter((s) => s.isVIP).length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">VIP kontakata</p>
          </div>
        </div>

        {/* Top Senders */}
        <div>
          <h4 className="text-sm font-medium mb-2">Najaktivniji pošiljatelji</h4>
          <ScrollArea className="h-[280px]">
            <div className="space-y-2">
              {topSenders.map((sender) => (
                <div
                  key={sender.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate("/contacts")}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={sender.avatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(sender.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {sender.name}
                        </span>
                        {sender.isVIP && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                        {sender.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : sender.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {sender.email}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{sender.emailCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{sender.avgResponseTime}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSentimentColor(sender.sentiment)}`}
                        >
                          {sender.sentiment === "positive"
                            ? "Pozitivno"
                            : sender.sentiment === "neutral"
                            ? "Neutralno"
                            : "Negativno"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">
                        Odgovor
                      </div>
                      <div className="flex items-center gap-1">
                        <Progress
                          value={sender.responseRate}
                          className="w-12 h-1.5"
                        />
                        <span className="text-xs font-medium">
                          {sender.responseRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* AI Insight */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
              AI uvid
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            <strong>Marko Horvat</strong> i <strong>Ana Novak</strong> su vaši
            najvažniji kontakti ovaj tjedan. Preporučujemo prioritizirati njihove
            emailove.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SenderAnalyticsCard;
