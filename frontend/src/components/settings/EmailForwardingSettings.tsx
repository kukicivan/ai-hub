import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Forward,
  Plus,
  Trash2,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Info,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface ForwardingRule {
  id: string;
  email: string;
  verified: boolean;
  enabled: boolean;
  filter: "all" | "filtered";
  filterCriteria?: {
    from?: string[];
    subject?: string;
    labels?: string[];
  };
  keepCopy: boolean;
  createdAt: Date;
}

const mockRules: ForwardingRule[] = [
  {
    id: "1",
    email: "backup@personal.com",
    verified: true,
    enabled: true,
    filter: "all",
    keepCopy: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "2",
    email: "work@company.hr",
    verified: true,
    enabled: true,
    filter: "filtered",
    filterCriteria: {
      from: ["*@client.com"],
      labels: ["Klijent"],
    },
    keepCopy: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: "3",
    email: "pending@test.com",
    verified: false,
    enabled: false,
    filter: "all",
    keepCopy: true,
    createdAt: new Date(),
  },
];

export function EmailForwardingSettings() {
  const toast = useToast();
  const [rules, setRules] = useState<ForwardingRule[]>(mockRules);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ForwardingRule | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  // New rule form
  const [newEmail, setNewEmail] = useState("");
  const [newFilter, setNewFilter] = useState<"all" | "filtered">("all");
  const [newKeepCopy, setNewKeepCopy] = useState(true);

  const handleAddRule = () => {
    if (!newEmail.trim()) {
      toast.error("Unesite email adresu");
      return;
    }

    const newRule: ForwardingRule = {
      id: Date.now().toString(),
      email: newEmail.trim(),
      verified: false,
      enabled: false,
      filter: newFilter,
      keepCopy: newKeepCopy,
      createdAt: new Date(),
    };

    setRules([...rules, newRule]);
    setShowAddDialog(false);
    setNewEmail("");
    setNewFilter("all");
    setNewKeepCopy(true);

    toast.success("Pravilo dodano. Provjerite email za verifikaciju.");
  };

  const handleVerify = (rule: ForwardingRule) => {
    setSelectedRule(rule);
    setShowVerifyDialog(true);
  };

  const confirmVerification = () => {
    if (selectedRule && verificationCode === "123456") {
      setRules((prev) =>
        prev.map((r) =>
          r.id === selectedRule.id ? { ...r, verified: true, enabled: true } : r
        )
      );
      toast.success("Email adresa verificirana");
    } else {
      toast.error("Neispravan verifikacijski kod");
    }
    setShowVerifyDialog(false);
    setVerificationCode("");
    setSelectedRule(null);
  };

  const handleToggleEnabled = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (rule && !rule.verified) {
      toast.error("Potrebna je verifikacija prije aktivacije");
      return;
    }

    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Pravilo obrisano");
  };

  const handleResendVerification = (rule: ForwardingRule) => {
    toast.success(`Verifikacijski email poslan na ${rule.email}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Forward className="h-5 w-5 text-primary" />
              Prosljeđivanje emailova
            </CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Dodaj pravilo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Automatski prosljeđujte dolazne emailove na druge adrese.
            Svaka adresa mora biti verificirana prije aktivacije.
          </p>
        </CardContent>
      </Card>

      {/* Rules List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Pravila prosljeđivanja ({rules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Forward className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nema konfiguriranih pravila prosljeđivanja</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj prvo pravilo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 border rounded-lg ${
                    !rule.verified
                      ? "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10"
                      : rule.enabled
                        ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10"
                        : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          rule.verified && rule.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-muted"
                        }`}
                      >
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{rule.email}</span>
                          {rule.verified ? (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verificirano
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Čeka verifikaciju
                            </Badge>
                          )}
                          {rule.enabled && (
                            <Badge variant="secondary">Aktivno</Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            {rule.filter === "all"
                              ? "Svi emailovi"
                              : "Filtrirani emailovi"}
                            {rule.keepCopy && " • Čuva kopiju"}
                          </p>
                          {rule.filterCriteria && (
                            <div className="flex flex-wrap gap-1">
                              {rule.filterCriteria.from?.map((f) => (
                                <Badge key={f} variant="outline" className="text-xs">
                                  Od: {f}
                                </Badge>
                              ))}
                              {rule.filterCriteria.labels?.map((l) => (
                                <Badge key={l} variant="outline" className="text-xs">
                                  Oznaka: {l}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs">
                            Dodano: {format(rule.createdAt, "dd.MM.yyyy.", { locale: hr })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!rule.verified ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendVerification(rule)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Pošalji ponovno
                          </Button>
                          <Button size="sm" onClick={() => handleVerify(rule)}>
                            Verificiraj
                          </Button>
                        </>
                      ) : (
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleEnabled(rule.id)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Napomene o prosljeđivanju</p>
              <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Prosljeđivanje se primjenjuje samo na nove dolazne emailove</li>
                <li>• Emailovi označeni kao spam neće biti proslijeđeni</li>
                <li>• Možete imati maksimalno 5 aktivnih pravila prosljeđivanja</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo pravilo prosljeđivanja</DialogTitle>
            <DialogDescription>
              Dodajte email adresu na koju želite prosljeđivati emailove.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email adresa</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Koje emailove prosljeđivati?</Label>
              <Select
                value={newFilter}
                onValueChange={(v) => setNewFilter(v as "all" | "filtered")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve dolazne emailove</SelectItem>
                  <SelectItem value="filtered">
                    Samo emailove koji zadovoljavaju kriterije
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Zadrži kopiju</Label>
                <p className="text-xs text-muted-foreground">
                  Zadrži kopiju emaila u ovom sandučiću
                </p>
              </div>
              <Switch checked={newKeepCopy} onCheckedChange={setNewKeepCopy} />
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Na navedenu adresu bit će poslan verifikacijski email.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleAddRule}>
              <Plus className="h-4 w-4 mr-1" />
              Dodaj pravilo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikacija email adrese</DialogTitle>
            <DialogDescription>
              Unesite 6-znamenkasti kod poslan na{" "}
              <strong>{selectedRule?.email}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Verifikacijski kod"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
            />
            <p className="text-xs text-muted-foreground text-center">
              Demo: Unesite 123456 za uspješnu verifikaciju
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Odustani
            </Button>
            <Button onClick={confirmVerification}>Verificiraj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmailForwardingSettings;
