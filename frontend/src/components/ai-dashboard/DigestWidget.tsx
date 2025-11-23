import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  FolderOpen,
  ChevronRight,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useGetDigestQuery } from "@/redux/features/email/emailApi";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

interface DigestWidgetProps {
  defaultType?: "daily" | "weekly";
}

export function DigestWidget({ defaultType = "daily" }: DigestWidgetProps) {
  const [digestType, setDigestType] = useState<"daily" | "weekly">(defaultType);
  const { data: digest, isLoading, refetch, isFetching } = useGetDigestQuery({ type: digestType });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!digest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            AI Digest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nema dostupnih podataka za digest
          </p>
        </CardContent>
      </Card>
    );
  }

  const timeSavedHours = Math.floor(digest.summary.time_saved_minutes / 60);
  const timeSavedMins = digest.summary.time_saved_minutes % 60;
  const timeSavedText = timeSavedHours > 0
    ? `${timeSavedHours}h ${timeSavedMins}min`
    : `${timeSavedMins}min`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            AI Digest
          </CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={digestType} onValueChange={(v) => setDigestType(v as "daily" | "weekly")}>
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs px-2">Dnevni</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-2">Tjedni</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {digest.period.start} - {digest.period.end}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{digest.summary.total_emails}</div>
            <div className="text-xs text-muted-foreground">Ukupno</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{digest.summary.unread}</div>
            <div className="text-xs text-muted-foreground">Nepročitano</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">{digest.summary.high_priority}</div>
            <div className="text-xs text-muted-foreground">Hitno</div>
          </div>
          <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="text-lg font-semibold text-green-600">{timeSavedText}</div>
            <div className="text-xs text-muted-foreground">Ušteda</div>
          </div>
        </div>

        {/* Urgent Items */}
        {digest.urgent_items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Hitni emailovi ({digest.urgent_items.length})
            </div>
            <div className="space-y-1">
              {digest.urgent_items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.sender} · {formatDistanceToNow(new Date(item.received_at), { addSuffix: true, locale: hr })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Opportunities */}
        {digest.business_opportunities.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              Poslovne prilike ({digest.business_opportunities.length})
            </div>
            <div className="space-y-1">
              {digest.business_opportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{opp.subject}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {opp.potential}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {opp.sender} {opp.roi_estimate && `· ROI: ${opp.roi_estimate}`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Actions */}
        {digest.pending_actions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
              <Clock className="h-4 w-4" />
              Akcije na čekanju ({digest.pending_actions.length})
            </div>
            <div className="space-y-1">
              {digest.pending_actions.slice(0, 3).map((action, idx) => (
                <div
                  key={`${action.email_id}-${idx}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{action.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {action.subject}
                      {action.deadline && ` · Rok: ${action.deadline}`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {action.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(digest.category_breakdown).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FolderOpen className="h-4 w-4" />
              Kategorije
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(digest.category_breakdown).map(([category, count]) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* No data states */}
        {digest.urgent_items.length === 0 &&
         digest.business_opportunities.length === 0 &&
         digest.pending_actions.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Sve je pod kontrolom! Nema hitnih stavki.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default DigestWidget;
