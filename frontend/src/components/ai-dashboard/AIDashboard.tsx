import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Mail, CheckCircle, Settings } from "lucide-react";

export function AIDashboard() {
  // Dummy data
  const stats = [
    { title: "Obrađeno danas", value: 247, icon: Mail },
    { title: "AI tačnost", value: "97.2%", icon: CheckCircle },
    { title: "Ušteda vremena", value: "3.2h", icon: Settings },
    { title: "Nove akcije", value: 12, icon: CheckCircle },
  ];
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">AI Automatizacija Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Centralno upravljanje AI servisima za email komunikaciju
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Podešavanja
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Obrađeni emailovi po danima</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="processed" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AIDashboard;
