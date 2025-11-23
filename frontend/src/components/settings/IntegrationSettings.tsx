import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plug,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Cloud,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Settings,
  Trash2,
  AlertTriangle,
  Zap,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "email" | "calendar" | "communication" | "storage" | "productivity";
  connected: boolean;
  accountEmail?: string;
  lastSync?: Date;
  features: string[];
}

const availableIntegrations: Omit<Integration, "connected" | "accountEmail" | "lastSync">[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Povežite Gmail račun za upravljanje emailovima",
    icon: <Mail className="h-6 w-6 text-red-500" />,
    category: "email",
    features: ["Sinkronizacija emailova", "Slanje emailova", "Oznake i mape", "Pretraživanje"],
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Povežite Outlook/Microsoft 365 račun",
    icon: <Mail className="h-6 w-6 text-blue-500" />,
    category: "email",
    features: ["Sinkronizacija emailova", "Kalendar", "Kontakti", "Teams integracija"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sinkronizirajte kalendar s Google računom",
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
    category: "calendar",
    features: ["Događaji", "Podsjetnici", "Dijeljeni kalendari", "Meet linkovi"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Primajte obavijesti i šaljite poruke putem Slacka",
    icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
    category: "communication",
    features: ["Obavijesti", "Dijeljenje emailova", "Status sinkronizacija"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Spremajte emailove i bilješke u Notion",
    icon: <FileText className="h-6 w-6" />,
    category: "productivity",
    features: ["Spremanje emailova", "Kreiranje zadataka", "Baza podataka"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Spremajte privitke na Google Drive",
    icon: <Cloud className="h-6 w-6 text-yellow-500" />,
    category: "storage",
    features: ["Spremanje privitaka", "Dijeljenje datoteka", "Pretraživanje"],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Automatski spremajte privitke na Dropbox",
    icon: <Cloud className="h-6 w-6 text-blue-400" />,
    category: "storage",
    features: ["Spremanje privitaka", "Sinkronizacija", "Dijeljenje"],
  },
  {
    id: "trello",
    name: "Trello",
    description: "Pretvorite emailove u Trello kartice",
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    category: "productivity",
    features: ["Kreiranje kartica", "Dodavanje komentara", "Privici"],
  },
];

export function IntegrationSettings() {
  const toast = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      ...availableIntegrations[0],
      connected: true,
      accountEmail: "user@gmail.com",
      lastSync: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      ...availableIntegrations[2],
      connected: true,
      accountEmail: "user@gmail.com",
      lastSync: new Date(Date.now() - 1000 * 60 * 30),
    },
    ...availableIntegrations.slice(1, 2).map((i) => ({ ...i, connected: false })),
    ...availableIntegrations.slice(3).map((i) => ({ ...i, connected: false })),
  ]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const connectedIntegrations = integrations.filter((i) => i.connected);
  const availableToConnect = integrations.filter((i) => !i.connected);

  const handleConnect = async (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConnecting(true);

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integration.id
          ? {
              ...i,
              connected: true,
              accountEmail: "connected@example.com",
              lastSync: new Date(),
            }
          : i
      )
    );

    setIsConnecting(false);
    setSelectedIntegration(null);
    toast.success(`${integration.name} uspješno povezan`);
  };

  const handleDisconnect = (id: string) => {
    setDisconnectingId(id);
    setShowDisconnectDialog(true);
  };

  const confirmDisconnect = () => {
    if (!disconnectingId) return;

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === disconnectingId
          ? { ...i, connected: false, accountEmail: undefined, lastSync: undefined }
          : i
      )
    );

    const integration = integrations.find((i) => i.id === disconnectingId);
    toast.success(`${integration?.name} odspojeno`);
    setShowDisconnectDialog(false);
    setDisconnectingId(null);
  };

  const handleSync = async (id: string) => {
    toast.info("Sinkronizacija u tijeku...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, lastSync: new Date() } : i
      )
    );

    toast.success("Sinkronizacija završena");
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return "Nikad";
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Upravo sada";
    if (minutes < 60) return `Prije ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Prije ${hours}h`;
    return `Prije ${Math.floor(hours / 24)} dana`;
  };

  const getCategoryLabel = (category: Integration["category"]) => {
    switch (category) {
      case "email": return "Email";
      case "calendar": return "Kalendar";
      case "communication": return "Komunikacija";
      case "storage": return "Pohrana";
      case "productivity": return "Produktivnost";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plug className="h-5 w-5 text-primary" />
            Integracije
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Povežite vanjske servise za proširenje mogućnosti aplikacije.
            Vaši podaci su sigurni i koriste se samo za funkcionalnost koju odaberete.
          </p>
        </CardContent>
      </Card>

      {/* Connected Integrations */}
      {connectedIntegrations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Povezane integracije ({connectedIntegrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectedIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{integration.name}</span>
                      <Badge className="text-xs bg-green-500">Povezano</Badge>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(integration.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {integration.accountEmail}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Zadnja sinkronizacija: {formatLastSync(integration.lastSync)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {integration.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(integration.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Sync
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Available Integrations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Dostupne integracije
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {availableToConnect.map((integration) => (
              <div
                key={integration.id}
                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{integration.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(integration.category)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration)}
                      disabled={isConnecting}
                    >
                      {isConnecting && selectedIntegration?.id === integration.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Povezivanje...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Poveži
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Keys Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">API pristup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Koristite API ključ za pristup vašim podacima iz vanjskih aplikacija.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value="••••••••••••••••••••••••••••••••"
              readOnly
              className="font-mono"
            />
            <Button variant="outline">
              Kopiraj
            </Button>
            <Button variant="outline">
              Regeneriraj
            </Button>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Upozorenje
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              API ključ daje pristup vašim podacima. Nikada ga ne dijelite i čuvajte na sigurnom mjestu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Webhooks</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Primajte obavijesti o događajima u stvarnom vremenu putem HTTP zahtjeva.
          </p>
          <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
            <Plug className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nema konfiguriranih webhookova</p>
          </div>
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Odspoji integraciju</DialogTitle>
            <DialogDescription>
              Jeste li sigurni da želite odspojiti ovu integraciju?
              Svi povezani podaci i postavke bit će uklonjeni.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
              Odustani
            </Button>
            <Button variant="destructive" onClick={confirmDisconnect}>
              Odspoji
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IntegrationSettings;
