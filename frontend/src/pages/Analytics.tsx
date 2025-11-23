import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Mail,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Send,
  Inbox,
  Reply,
  Archive,
  Star,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { hr } from "date-fns/locale";
import { ReportExport } from "@/components/analytics/ReportExport";

// Mock data
const emailVolumeData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "d MMM", { locale: hr }),
  received: Math.floor(Math.random() * 40) + 20,
  sent: Math.floor(Math.random() * 20) + 5,
}));

const responseTimeData = Array.from({ length: 7 }, (_, i) => ({
  day: format(subDays(new Date(), 6 - i), "EEE", { locale: hr }),
  avgTime: Math.floor(Math.random() * 120) + 30,
}));

const categoryDistribution = [
  { name: "Posao", value: 45, color: "#3B82F6" },
  { name: "Newsletter", value: 25, color: "#10B981" },
  { name: "Osobno", value: 15, color: "#F59E0B" },
  { name: "Promocije", value: 10, color: "#EF4444" },
  { name: "Ostalo", value: 5, color: "#6B7280" },
];

const topSenders = [
  { email: "team@company.hr", count: 156, trend: 12 },
  { email: "client@partner.com", count: 89, trend: -5 },
  { email: "newsletter@tech.io", count: 67, trend: 8 },
  { email: "support@service.com", count: 45, trend: 0 },
  { email: "hr@company.hr", count: 34, trend: 15 },
];

const productivityData = Array.from({ length: 7 }, (_, i) => ({
  day: format(subDays(new Date(), 6 - i), "EEE", { locale: hr }),
  focusTime: Math.floor(Math.random() * 180) + 60,
  emailsProcessed: Math.floor(Math.random() * 50) + 10,
  tasksCompleted: Math.floor(Math.random() * 15) + 2,
}));

export function Analytics() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Summary stats
  const stats = {
    totalReceived: 847,
    totalSent: 234,
    avgResponseTime: 45, // minutes
    unreadCount: 23,
    archivedCount: 312,
    starredCount: 45,
    aiSavings: 320, // minutes saved by AI
    focusMinutes: 540,
  };

  const trends = {
    received: 12, // percentage change
    sent: -5,
    responseTime: -15, // negative is good
    productivity: 8,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Pregled email statistike i produktivnosti
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Zadnjih 7 dana</SelectItem>
              <SelectItem value="30d">Zadnjih 30 dana</SelectItem>
              <SelectItem value="90d">Zadnjih 90 dana</SelectItem>
              <SelectItem value="year">Ova godina</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Primljeno</p>
                <p className="text-2xl font-bold">{stats.totalReceived}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Inbox className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {trends.received > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  trends.received > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(trends.received)}%
              </span>
              <span className="text-xs text-muted-foreground">vs prošli period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Poslano</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Send className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {trends.sent > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  trends.sent > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(trends.sent)}%
              </span>
              <span className="text-xs text-muted-foreground">vs prošli period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prosječni odgovor</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}m</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                {Math.abs(trends.responseTime)}%
              </span>
              <span className="text-xs text-muted-foreground">brže</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI ušteda</p>
                <p className="text-2xl font-bold">{Math.floor(stats.aiSavings / 60)}h {stats.aiSavings % 60}m</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">
                automatizacijom
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Pregled</TabsTrigger>
          <TabsTrigger value="volume">Volumen</TabsTrigger>
          <TabsTrigger value="productivity">Produktivnost</TabsTrigger>
          <TabsTrigger value="export">Izvoz</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email volumen</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={emailVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="received"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Primljeno"
                    />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Poslano"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribucija po kategorijama</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Senders & Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Top pošiljatelji
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSenders.map((sender, idx) => (
                    <div
                      key={sender.email}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{idx + 1}
                        </span>
                        <span className="text-sm">{sender.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{sender.count}</span>
                        {sender.trend !== 0 && (
                          <Badge
                            variant={sender.trend > 0 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {sender.trend > 0 ? "+" : ""}
                            {sender.trend}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brzi pregled</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Nepročitano
                  </span>
                  <span className="font-medium">{stats.unreadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Arhivirano
                  </span>
                  <span className="font-medium">{stats.archivedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Označeno
                  </span>
                  <span className="font-medium">{stats.starredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Focus vrijeme
                  </span>
                  <span className="font-medium">{Math.floor(stats.focusMinutes / 60)}h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Volume Tab */}
        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detaljan volumen emailova</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={emailVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="received"
                    stroke="#3B82F6"
                    name="Primljeno"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#10B981"
                    name="Poslano"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prosječno vrijeme odgovora po danu</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis unit="m" />
                  <Tooltip formatter={(value) => [`${value} min`, "Prosječno vrijeme"]} />
                  <Area
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Productivity Tab */}
        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tjedna produktivnost</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="focusTime"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    name="Focus vrijeme (min)"
                  />
                  <Area
                    type="monotone"
                    dataKey="emailsProcessed"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Obrađeni emailovi"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasksCompleted"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name="Završeni zadaci"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold">{Math.floor(stats.focusMinutes / 60)}h {stats.focusMinutes % 60}m</p>
                <p className="text-sm text-muted-foreground">Ukupno focus vrijeme</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold">{stats.totalReceived + stats.totalSent}</p>
                <p className="text-sm text-muted-foreground">Ukupno emailova</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold">{Math.floor(stats.aiSavings / 60)}h</p>
                <p className="text-sm text-muted-foreground">Ušteđeno AI-jem</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <ReportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Analytics;
