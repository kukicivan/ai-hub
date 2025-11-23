import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
} from "lucide-react";

interface InsightItem {
  id: string;
  type: "trend" | "tip" | "alert" | "achievement";
  title: string;
  description: string;
  value?: string;
  change?: number;
}

// Mock insights - in production these would come from AI analysis
const mockInsights: InsightItem[] = [
  {
    id: "1",
    type: "trend",
    title: "Response Time",
    description: "Prosječno vrijeme odgovora na emailove",
    value: "2.5h",
    change: -15,
  },
  {
    id: "2",
    type: "achievement",
    title: "Email Produktivnost",
    description: "Obradili ste 25% više emailova nego prošle sedmice",
    change: 25,
  },
  {
    id: "3",
    type: "tip",
    title: "AI Preporuka",
    description: "3 emaila čekaju odgovor više od 24h. Preporučujemo prioritizaciju.",
  },
  {
    id: "4",
    type: "alert",
    title: "Poslovne Prilike",
    description: "Otkriveno 2 potencijalna projekta u nepročitanim emailovima",
  },
];

const productivityMetrics = {
  emailsProcessed: 156,
  emailsProcessedGoal: 200,
  timeSaved: 4.5,
  aiAccuracy: 94,
  responseRate: 87,
};

function InsightIcon({ type }: { type: InsightItem["type"] }) {
  switch (type) {
    case "trend":
      return <BarChart3 className="h-4 w-4 text-blue-500" />;
    case "tip":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    case "alert":
      return <Target className="h-4 w-4 text-red-500" />;
    case "achievement":
      return <Zap className="h-4 w-4 text-green-500" />;
  }
}

export function AIInsightsWidget() {
  const progressPercent =
    (productivityMetrics.emailsProcessed / productivityMetrics.emailsProcessedGoal) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          AI Uvidi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Productivity Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sedmični cilj emailova</span>
            <span className="font-medium">
              {productivityMetrics.emailsProcessed}/{productivityMetrics.emailsProcessedGoal}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <Clock className="h-3 w-3" />
              <span className="text-lg font-semibold">{productivityMetrics.timeSaved}h</span>
            </div>
            <div className="text-xs text-muted-foreground">Ušteda vremena</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {productivityMetrics.aiAccuracy}%
            </div>
            <div className="text-xs text-muted-foreground">AI preciznost</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              {productivityMetrics.responseRate}%
            </div>
            <div className="text-xs text-muted-foreground">Stopa odgovora</div>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Uvidi i preporuke</h4>
          <div className="space-y-2">
            {mockInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="mt-0.5">
                  <InsightIcon type={insight.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{insight.title}</span>
                    {insight.value && (
                      <Badge variant="secondary" className="text-xs">
                        {insight.value}
                      </Badge>
                    )}
                    {insight.change !== undefined && (
                      <div
                        className={`flex items-center gap-0.5 text-xs ${
                          insight.change > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {insight.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(insight.change)}%
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIInsightsWidget;
