import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Smartphone, Globe } from "lucide-react";

export function AIIntegrations() {
  const integrations = [
    { name: "Gmail", type: "Email", status: "connected", icon: Mail },
    { name: "Outlook", type: "Email", status: "connected", icon: Mail },
    { name: "Slack", type: "Messaging", status: "connected", icon: MessageSquare },
    { name: "WhatsApp", type: "Messaging", status: "connected", icon: Smartphone },
    { name: "Facebook", type: "Social", status: "connected", icon: Globe },
    { name: "LinkedIn", type: "Social", status: "connected", icon: Globe },
  ];
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-foreground text-2xl font-bold">Integracije</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <Card key={i.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <i.icon className="h-4 w-4 text-muted-foreground" />
                {i.name}
              </CardTitle>
              <Badge variant="outline">{i.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{i.type}</div>
              <Button size="sm" className="mt-2">
                Upravljaj
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AIIntegrations;
