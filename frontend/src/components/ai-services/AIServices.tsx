import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, MessageSquare, Target, CheckCircle } from "lucide-react";

export function AIServices() {
  const services = [
    { name: "HTML analiza", status: "active", accuracy: 98.2, icon: MessageSquare },
    { name: "Klasifikacija", status: "active", accuracy: 95.7, icon: Target },
    { name: "Sentiment analiza", status: "active", accuracy: 92.4, icon: Brain },
    { name: "Preporuke", status: "active", accuracy: 89.1, icon: Zap },
    { name: "Kreiranje akcija", status: "active", accuracy: 94.3, icon: CheckCircle },
  ];
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-foreground text-2xl font-bold">AI Servisi</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={String(s.name)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {typeof s.icon === "function" ? (
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                ) : null}
                {typeof s.name === "string" ? s.name : ""}
              </CardTitle>
              <Badge variant="outline">{typeof s.status === "string" ? s.status : ""}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {typeof s.accuracy === "number" ? `${s.accuracy}%` : ""}
                </span>
                <Progress
                  value={typeof s.accuracy === "number" ? s.accuracy : 0}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AIServices;
