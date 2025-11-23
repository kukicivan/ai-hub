import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Mail,
  Clock,
  Users,
  Sparkles,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  MinusCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface AnalyticsDashboardProps {
  className?: string;
}

const metrics: MetricCard[] = [
  {
    id: "emails_received",
    label: "Primljeni emailovi",
    value: "1,247",
    change: 12.5,
    changeLabel: "vs prošli tjedan",
    icon: <Mail className="h-5 w-5" />,
    color: "text-blue-500",
  },
  {
    id: "emails_sent",
    label: "Poslani emailovi",
    value: "342",
    change: -5.2,
    changeLabel: "vs prošli tjedan",
    icon: <Mail className="h-5 w-5" />,
    color: "text-green-500",
  },
  {
    id: "response_time",
    label: "Prosječno vrijeme odgovora",
    value: "2.4h",
    change: -18.3,
    changeLabel: "brže nego prije",
    icon: <Clock className="h-5 w-5" />,
    color: "text-purple-500",
  },
  {
    id: "ai_actions",
    label: "AI akcije",
    value: "847",
    change: 45.2,
    changeLabel: "vs prošli tjedan",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-pink-500",
  },
];

const emailVolume: TimeSeriesData[] = [
  { date: "Pon", value: 145 },
  { date: "Uto", value: 189 },
  { date: "Sri", value: 167 },
  { date: "Čet", value: 234 },
  { date: "Pet", value: 198 },
  { date: "Sub", value: 45 },
  { date: "Ned", value: 23 },
];

const topSenders = [
  { name: "newsletter@company.com", count: 87, category: "Newsletter" },
  { name: "support@service.com", count: 56, category: "Podrška" },
  { name: "team@work.com", count: 45, category: "Posao" },
  { name: "alerts@system.com", count: 34, category: "Sustav" },
  { name: "news@industry.com", count: 28, category: "Vijesti" },
];

const aiInsights = [
  { label: "Auto-kategorizacija", value: 92, target: 95 },
  { label: "Prijedlozi odgovora", value: 78, target: 80 },
  { label: "Točnost prioriteta", value: 88, target: 90 },
  { label: "Spam detekcija", value: 99, target: 99 },
];

const productivityGoals = [
  { label: "Inbox Zero", current: 12, target: 0, unit: "emailova" },
  { label: "Vrijeme odgovora", current: 2.4, target: 2, unit: "sati" },
  { label: "Dnevna obrada", current: 85, target: 100, unit: "%" },
];

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const maxVolume = Math.max(...emailVolume.map((d) => d.value));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analitika</h2>
          <p className="text-muted-foreground">
            Pregledajte statistiku vašeg email prometa i produktivnosti
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Danas</SelectItem>
              <SelectItem value="week">Ovaj tjedan</SelectItem>
              <SelectItem value="month">Ovaj mjesec</SelectItem>
              <SelectItem value="quarter">Kvartal</SelectItem>
              <SelectItem value="year">Godina</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Izvoz
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-muted", metric.color)}>
                  {metric.icon}
                </div>
                <Badge
                  variant={metric.change >= 0 ? "default" : "secondary"}
                  className={cn(
                    "flex items-center gap-1",
                    metric.change >= 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30"
                  )}
                >
                  {metric.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.changeLabel}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Volumen emailova
            </CardTitle>
            <CardDescription>Primljeni emailovi po danu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {emailVolume.map((data) => (
                <div
                  key={data.date}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{
                      height: `${(data.value / maxVolume) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {data.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Ukupno: {emailVolume.reduce((a, b) => a + b.value, 0)} emailova
              </span>
              <span className="text-muted-foreground">
                Prosjek: {Math.round(emailVolume.reduce((a, b) => a + b.value, 0) / 7)}/dan
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Top Senders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top pošiljatelji
            </CardTitle>
            <CardDescription>Najčešći pošiljatelji ovaj tjedan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSenders.map((sender, index) => (
              <div key={sender.name} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sender.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sender.category}
                  </p>
                </div>
                <Badge variant="secondary">{sender.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI & Goals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI performanse
            </CardTitle>
            <CardDescription>Točnost AI značajki</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight) => {
              const isOnTarget = insight.value >= insight.target;
              return (
                <div key={insight.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{insight.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{insight.value}%</span>
                      {isOnTarget ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <MinusCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={insight.value} className="h-2" />
                    <div
                      className="absolute top-0 h-2 w-0.5 bg-gray-400"
                      style={{ left: `${insight.target}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cilj: {insight.target}%
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Productivity Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ciljevi produktivnosti
            </CardTitle>
            <CardDescription>Vaš napredak prema ciljevima</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {productivityGoals.map((goal) => {
              const isInboxZero = goal.label === "Inbox Zero";
              const progress = isInboxZero
                ? goal.current === 0
                  ? 100
                  : Math.max(0, 100 - (goal.current / 50) * 100)
                : (goal.current / goal.target) * 100;
              const isComplete = isInboxZero
                ? goal.current === 0
                : goal.current >= goal.target;

              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      {isComplete ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Zap className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={Math.min(100, progress)}
                    className={cn(
                      "h-3",
                      isComplete && "[&>div]:bg-green-500"
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Response Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Analiza vremena odgovora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="by_priority">
            <TabsList>
              <TabsTrigger value="by_priority">Po prioritetu</TabsTrigger>
              <TabsTrigger value="by_sender">Po pošiljatelju</TabsTrigger>
              <TabsTrigger value="by_time">Po dobu dana</TabsTrigger>
            </TabsList>

            <TabsContent value="by_priority" className="mt-4">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Kritični", time: "15 min", color: "bg-red-500" },
                  { label: "Visoki", time: "1.2h", color: "bg-orange-500" },
                  { label: "Srednji", time: "3.5h", color: "bg-yellow-500" },
                  { label: "Niski", time: "8h", color: "bg-green-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-lg bg-muted text-center"
                  >
                    <div
                      className={cn("w-3 h-3 rounded-full mx-auto mb-2", item.color)}
                    />
                    <p className="text-2xl font-bold">{item.time}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="by_sender" className="mt-4">
              <div className="space-y-3">
                {[
                  { type: "VIP kontakti", time: "45 min", count: 23 },
                  { type: "Kolege", time: "2h", count: 145 },
                  { type: "Klijenti", time: "1.5h", count: 67 },
                  { type: "Ostali", time: "6h", count: 234 },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <span className="font-medium">{item.type}</span>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{item.count} emailova</Badge>
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="by_time" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { period: "Jutro (6-12h)", time: "1.8h", emails: 234 },
                  { period: "Popodne (12-18h)", time: "2.1h", emails: 312 },
                  { period: "Večer (18-22h)", time: "4.5h", emails: 89 },
                ].map((item) => (
                  <div
                    key={item.period}
                    className="p-4 rounded-lg bg-muted text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.period}
                    </p>
                    <p className="text-2xl font-bold">{item.time}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.emails} emailova
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsDashboard;
