import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export function AIAnalytics() {
  const weeklyData = [
    { name: "Pon", emails: 180, processed: 175, saved_hours: 2.3 },
    { name: "Uto", emails: 220, processed: 218, saved_hours: 2.8 },
    { name: "Sre", emails: 195, processed: 190, saved_hours: 2.5 },
    { name: "Čet", emails: 247, processed: 245, saved_hours: 3.1 },
    { name: "Pet", emails: 201, processed: 198, saved_hours: 2.6 },
    { name: "Sub", emails: 89, processed: 87, saved_hours: 1.1 },
    { name: "Ned", emails: 134, processed: 132, saved_hours: 1.7 },
  ];
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-foreground text-2xl font-bold">Analitika i Izveštaji</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Nedeljni emailovi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="emails" fill="#6366f1" />
              <Bar dataKey="processed" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAnalytics;
