import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Mail,
  BarChart2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductivityMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

// Mock productivity data - would come from API
const metrics: ProductivityMetric[] = [
  {
    label: "Emailova odgovoreno",
    value: 45,
    target: 50,
    unit: "",
    trend: "up",
    trendValue: 12,
  },
  {
    label: "Prosječno vrijeme odgovora",
    value: 23,
    target: 30,
    unit: "min",
    trend: "down",
    trendValue: 8,
  },
  {
    label: "Zadataka završeno",
    value: 8,
    target: 10,
    unit: "",
    trend: "up",
    trendValue: 3,
  },
];

interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  aiGenerated?: boolean;
}

const dailyGoals: DailyGoal[] = [
  { id: "1", title: "Odgovoriti na sve VIP emailove", completed: true },
  { id: "2", title: "Pregledati sve hitne emailove", completed: true },
  { id: "3", title: "Završiti 5 zadataka", completed: false, aiGenerated: true },
  { id: "4", title: "Follow-up na ponude", completed: false, aiGenerated: true },
];

export function ProductivityWidget() {
  const navigate = useNavigate();

  const completedGoals = dailyGoals.filter((g) => g.completed).length;
  const goalProgress = (completedGoals / dailyGoals.length) * 100;

  // Calculate overall productivity score
  const productivityScore = Math.round(
    metrics.reduce((acc, m) => acc + (m.value / m.target) * 100, 0) / metrics.length
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Produktivnost
          </CardTitle>
          <Badge
            variant={productivityScore >= 80 ? "default" : productivityScore >= 60 ? "secondary" : "outline"}
            className="text-sm"
          >
            {productivityScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Productivity Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dnevni cilj</span>
            <span className="font-medium">
              {completedGoals}/{dailyGoals.length} ciljeva
            </span>
          </div>
          <Progress value={goalProgress} className="h-2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-3 bg-muted/50 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xl font-bold">{metric.value}</span>
                {metric.unit && (
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
              <div className="flex items-center justify-center gap-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                ) : null}
                <span
                  className={`text-xs ${
                    metric.trend === "up"
                      ? "text-green-500"
                      : metric.trend === "down"
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {metric.trendValue > 0 ? "+" : ""}
                  {metric.trendValue}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Dnevni ciljevi</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate("/todos")}
            >
              Svi zadaci
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  goal.completed
                    ? "bg-green-50 dark:bg-green-900/10"
                    : "bg-muted/30"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    goal.completed
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm flex-1 ${
                    goal.completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {goal.title}
                </span>
                {goal.aiGenerated && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI preporuka</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Na temelju vaše aktivnosti, preporučujemo da se fokusirate na odgovaranje
            VIP emailova u sljedećih 2 sata za optimalan produktivni dan.
          </p>
        </div>

        {/* Time Stats */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Ušteda vremena danas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">2.5h</span>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductivityWidget;
