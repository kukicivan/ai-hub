import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Settings, RefreshCw, Calendar, Bell, Search } from "lucide-react";
import { useGetEmailStatsQuery } from "@/redux/features/email/emailApi";
import { WelcomeWidget } from "./WelcomeWidget";
import { StatsWidget } from "./StatsWidget";
import { PriorityInbox } from "./PriorityInbox";
import { TodayActionsPanel } from "./TodayActionsPanel";

export function AIDashboard() {
  const { data: stats, isLoading: statsLoading, refetch } = useGetEmailStatsQuery();

  // Chart data - this would come from a real API in production
  const chartData = [
    { name: "Pon", processed: 40 },
    { name: "Uto", processed: 55 },
    { name: "Sre", processed: 48 },
    { name: "Čet", processed: 60 },
    { name: "Pet", processed: 38 },
    { name: "Sub", processed: 20 },
    { name: "Ned", processed: 25 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            AI Automation Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Centralno upravljanje AI servisima za email komunikaciju
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Osvježi
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Podešavanja
          </Button>
        </div>
      </div>

      {/* Welcome Widget */}
      <WelcomeWidget stats={stats} isLoading={statsLoading} />

      {/* Stats Cards */}
      <StatsWidget stats={stats} isLoading={statsLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Inbox - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PriorityInbox limit={5} />
        </div>

        {/* Today's Actions Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <TodayActionsPanel />
        </div>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Obrađeni emailovi po danima</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="processed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Kalendar</h3>
              <p className="text-sm text-muted-foreground">Zakaži sastanke</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Notifikacije</h3>
              <p className="text-sm text-muted-foreground">Podesi obavještenja</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Pretraga</h3>
              <p className="text-sm text-muted-foreground">Cmd+K za brzu pretragu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AIDashboard;
