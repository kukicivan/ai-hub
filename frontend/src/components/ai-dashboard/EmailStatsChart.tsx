import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

// Mock data - would come from API
const weeklyData = [
  { name: "Pon", received: 45, processed: 40, responded: 25 },
  { name: "Uto", received: 52, processed: 50, responded: 30 },
  { name: "Sre", received: 48, processed: 45, responded: 28 },
  { name: "Čet", received: 61, processed: 58, responded: 35 },
  { name: "Pet", received: 55, processed: 52, responded: 32 },
  { name: "Sub", received: 20, processed: 18, responded: 10 },
  { name: "Ned", received: 15, processed: 14, responded: 8 },
];

const categoryData = [
  { name: "Poslovno", value: 45, color: "#3b82f6" },
  { name: "Projekti", value: 25, color: "#10b981" },
  { name: "Newsletter", value: 15, color: "#f59e0b" },
  { name: "Osobno", value: 10, color: "#8b5cf6" },
  { name: "Ostalo", value: 5, color: "#6b7280" },
];

const trendData = [
  { date: "1.", emails: 120, aiProcessed: 110 },
  { date: "5.", emails: 145, aiProcessed: 140 },
  { date: "10.", emails: 130, aiProcessed: 125 },
  { date: "15.", emails: 160, aiProcessed: 155 },
  { date: "20.", emails: 175, aiProcessed: 170 },
  { date: "25.", emails: 150, aiProcessed: 148 },
  { date: "30.", emails: 165, aiProcessed: 162 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmailStatsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Email Statistika
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Sedmično</TabsTrigger>
            <TabsTrigger value="categories">Kategorije</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
          </TabsList>

          {/* Weekly Bar Chart */}
          <TabsContent value="weekly" className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="received"
                  name="Primljeno"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="processed"
                  name="Obrađeno"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="responded"
                  name="Odgovoreno"
                  fill="hsl(var(--chart-3))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">296</p>
                <p className="text-xs text-muted-foreground">Ukupno primljeno</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">277</p>
                <p className="text-xs text-muted-foreground">AI obrađeno</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">168</p>
                <p className="text-xs text-muted-foreground">Odgovoreno</p>
              </div>
            </div>
          </TabsContent>

          {/* Categories Pie Chart */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Monthly Trend Line Chart */}
          <TabsContent value="trend" className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="emails"
                  name="Emailovi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="aiProcessed"
                  name="AI obrađeno"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Ukupno emailova ovaj mjesec: <strong>1,045</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>AI stopa obrade: <strong>97%</strong></span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default EmailStatsChart;
