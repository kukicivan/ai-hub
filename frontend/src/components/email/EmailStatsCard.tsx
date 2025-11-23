import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Inbox,
  Send,
  Archive,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  Mail,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailStats {
  inbox: number;
  unread: number;
  sent: number;
  archived: number;
  starred: number;
  drafts: number;
  scheduled: number;
  avgResponseTime: number; // minutes
}

interface TrendData {
  inbox?: number;
  sent?: number;
  responseTime?: number;
}

interface EmailStatsCardProps {
  stats: EmailStats;
  trends?: TrendData;
  compact?: boolean;
}

const defaultStats: EmailStats = {
  inbox: 156,
  unread: 23,
  sent: 45,
  archived: 312,
  starred: 18,
  drafts: 3,
  scheduled: 2,
  avgResponseTime: 45,
};

const defaultTrends: TrendData = {
  inbox: 12,
  sent: -5,
  responseTime: -15,
};

export function EmailStatsCard({
  stats = defaultStats,
  trends = defaultTrends,
  compact = false,
}: EmailStatsCardProps) {
  const getTrendIcon = (value: number | undefined, inverse = false) => {
    if (value === undefined) return null;
    const isPositive = inverse ? value < 0 : value > 0;
    return isPositive ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const formatTrend = (value: number | undefined) => {
    if (value === undefined) return "";
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Inbox className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{stats.inbox}</span>
                {stats.unread > 0 && (
                  <Badge className="h-5 text-[10px] bg-red-500">{stats.unread}</Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>Inbox ({stats.unread} nepročitano)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-4 w-px bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Send className="h-4 w-4 text-green-500" />
                <span className="font-medium">{stats.sent}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Poslano danas</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-4 w-px bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{stats.avgResponseTime}m</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Prosječno vrijeme odgovora</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {stats.scheduled > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{stats.scheduled}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Zakazano za slanje</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Inbox */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Inbox className="h-5 w-5 text-blue-500" />
              {stats.unread > 0 && (
                <Badge className="h-5 text-[10px] bg-red-500">{stats.unread} novo</Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{stats.inbox}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Inbox</span>
              {trends.inbox !== undefined && (
                <div className="flex items-center gap-0.5 text-xs">
                  {getTrendIcon(trends.inbox)}
                  <span className={trends.inbox > 0 ? "text-green-500" : "text-red-500"}>
                    {formatTrend(trends.inbox)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sent */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Send className="h-5 w-5 text-green-500" />
              {stats.drafts > 0 && (
                <Badge variant="outline" className="h-5 text-[10px]">
                  {stats.drafts} skica
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{stats.sent}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Poslano</span>
              {trends.sent !== undefined && (
                <div className="flex items-center gap-0.5 text-xs">
                  {getTrendIcon(trends.sent)}
                  <span className={trends.sent > 0 ? "text-green-500" : "text-red-500"}>
                    {formatTrend(trends.sent)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Response Time */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              {stats.scheduled > 0 && (
                <Badge variant="outline" className="h-5 text-[10px]">
                  {stats.scheduled} zakazano
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{stats.avgResponseTime}m</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Prosječni odgovor</span>
              {trends.responseTime !== undefined && (
                <div className="flex items-center gap-0.5 text-xs">
                  {getTrendIcon(trends.responseTime, true)}
                  <span className={trends.responseTime < 0 ? "text-green-500" : "text-red-500"}>
                    {formatTrend(Math.abs(trends.responseTime))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Archive & Starred */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-purple-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{stats.archived}</p>
              <span className="text-lg text-muted-foreground">/</span>
              <p className="text-lg font-medium text-yellow-600">{stats.starred}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Arhivirano / Označeno
            </p>
          </div>
        </div>

        {/* Quick Status */}
        <div className="mt-4 flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {stats.unread === 0 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Inbox prazan</span>
              </>
            ) : stats.unread <= 5 ? (
              <>
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{stats.unread} nepročitanih emailova</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{stats.unread} emailova čeka odgovor</span>
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Ažurirano: Upravo sada
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailStatsCard;
