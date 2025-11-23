import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpCircle,
  Star,
  Users,
  Building2,
  Clock,
  Mail,
  AlertCircle,
  Sparkles,
  Zap,
  Brain,
  Plus,
  X,
  GripVertical,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface PriorityRule {
  id: string;
  type: "sender" | "domain" | "keyword" | "label";
  value: string;
  priority: "high" | "normal" | "low";
}

interface PriorityConfig {
  aiPriorityEnabled: boolean;
  aiConfidenceThreshold: number;
  autoHighPriority: {
    fromContacts: boolean;
    fromVIP: boolean;
    mentionsMe: boolean;
    directMessages: boolean;
    urgentKeywords: boolean;
  };
  autoLowPriority: {
    newsletters: boolean;
    promotions: boolean;
    automated: boolean;
    unsubscribeLink: boolean;
  };
  priorityInbox: boolean;
  separateSections: boolean;
  customRules: PriorityRule[];
}

const defaultUrgentKeywords = ["urgent", "hitno", "asap", "immediately", "critical", "importante"];

export function EmailPrioritySettings() {
  const toast = useToast();
  const [config, setConfig] = useState<PriorityConfig>({
    aiPriorityEnabled: true,
    aiConfidenceThreshold: 70,
    autoHighPriority: {
      fromContacts: true,
      fromVIP: true,
      mentionsMe: true,
      directMessages: true,
      urgentKeywords: true,
    },
    autoLowPriority: {
      newsletters: true,
      promotions: true,
      automated: true,
      unsubscribeLink: false,
    },
    priorityInbox: true,
    separateSections: true,
    customRules: [
      { id: "1", type: "domain", value: "company.hr", priority: "high" },
      { id: "2", type: "sender", value: "ceo@company.hr", priority: "high" },
      { id: "3", type: "keyword", value: "invoice", priority: "high" },
    ],
  });

  const [newRule, setNewRule] = useState<Omit<PriorityRule, "id">>({
    type: "sender",
    value: "",
    priority: "high",
  });

  const handleSave = () => {
    toast.success("Postavke prioriteta spremljene");
  };

  const handleAddRule = () => {
    if (!newRule.value.trim()) {
      toast.error("Unesite vrijednost pravila");
      return;
    }

    const rule: PriorityRule = {
      ...newRule,
      id: Date.now().toString(),
    };

    setConfig({
      ...config,
      customRules: [...config.customRules, rule],
    });
    setNewRule({ type: "sender", value: "", priority: "high" });
    toast.success("Pravilo dodano");
  };

  const handleRemoveRule = (id: string) => {
    setConfig({
      ...config,
      customRules: config.customRules.filter((r) => r.id !== id),
    });
    toast.success("Pravilo uklonjeno");
  };

  const getPriorityBadge = (priority: PriorityRule["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">Visok</Badge>;
      case "normal":
        return <Badge variant="secondary">Normalan</Badge>;
      case "low":
        return <Badge variant="outline">Nizak</Badge>;
    }
  };

  const getRuleTypeLabel = (type: PriorityRule["type"]) => {
    const labels: Record<string, string> = {
      sender: "Pošiljatelj",
      domain: "Domena",
      keyword: "Ključna riječ",
      label: "Oznaka",
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
              Prioritet emailova
            </CardTitle>
            <Button size="sm" onClick={handleSave}>
              Spremi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Konfigurirajte kako se emailovi automatski sortiraju po važnosti.
            AI i pravila pomažu u identificiranju najvažnijih poruka.
          </p>
        </CardContent>
      </Card>

      {/* AI Priority */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            AI prioritizacija
            <Badge className="bg-purple-500">
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Omogući AI prioritizaciju</Label>
              <p className="text-xs text-muted-foreground">
                AI automatski procjenjuje važnost emailova
              </p>
            </div>
            <Switch
              checked={config.aiPriorityEnabled}
              onCheckedChange={(v) => setConfig({ ...config, aiPriorityEnabled: v })}
            />
          </div>

          {config.aiPriorityEnabled && (
            <div className="space-y-2 pl-4 border-l-2 border-purple-200">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Prag pouzdanosti</Label>
                <span className="text-sm font-medium">{config.aiConfidenceThreshold}%</span>
              </div>
              <Slider
                value={[config.aiConfidenceThreshold]}
                onValueChange={([value]) =>
                  setConfig({ ...config, aiConfidenceThreshold: value })
                }
                min={50}
                max={95}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                AI će označiti email kao prioritetan samo ako je {config.aiConfidenceThreshold}% siguran
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto High Priority */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-500" />
            Automatski visok prioritet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label>Od kontakata</Label>
            </div>
            <Switch
              checked={config.autoHighPriority.fromContacts}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoHighPriority: { ...config.autoHighPriority, fromContacts: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <Label>Od VIP kontakata</Label>
            </div>
            <Switch
              checked={config.autoHighPriority.fromVIP}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoHighPriority: { ...config.autoHighPriority, fromVIP: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label>Spominju me (@)</Label>
            </div>
            <Switch
              checked={config.autoHighPriority.mentionsMe}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoHighPriority: { ...config.autoHighPriority, mentionsMe: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label>Direktne poruke (samo ja u TO)</Label>
            </div>
            <Switch
              checked={config.autoHighPriority.directMessages}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoHighPriority: { ...config.autoHighPriority, directMessages: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <Label>Hitne ključne riječi</Label>
            </div>
            <Switch
              checked={config.autoHighPriority.urgentKeywords}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoHighPriority: { ...config.autoHighPriority, urgentKeywords: v },
                })
              }
            />
          </div>

          {config.autoHighPriority.urgentKeywords && (
            <div className="pl-6 text-xs text-muted-foreground">
              Ključne riječi: {defaultUrgentKeywords.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Low Priority */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 rotate-180 text-gray-400" />
            Automatski nizak prioritet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Newsletteri</Label>
            <Switch
              checked={config.autoLowPriority.newsletters}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoLowPriority: { ...config.autoLowPriority, newsletters: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Promocije i ponude</Label>
            <Switch
              checked={config.autoLowPriority.promotions}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoLowPriority: { ...config.autoLowPriority, promotions: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Automatski generirani emailovi</Label>
            <Switch
              checked={config.autoLowPriority.automated}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoLowPriority: { ...config.autoLowPriority, automated: v },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Emailovi s linkom za odjavu</Label>
            <Switch
              checked={config.autoLowPriority.unsubscribeLink}
              onCheckedChange={(v) =>
                setConfig({
                  ...config,
                  autoLowPriority: { ...config.autoLowPriority, unsubscribeLink: v },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Priority Inbox */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Prioritetni inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Omogući prioritetni inbox</Label>
              <p className="text-xs text-muted-foreground">
                Sortira emailove po važnosti umjesto vremena
              </p>
            </div>
            <Switch
              checked={config.priorityInbox}
              onCheckedChange={(v) => setConfig({ ...config, priorityInbox: v })}
            />
          </div>

          {config.priorityInbox && (
            <div className="flex items-center justify-between pl-4">
              <div>
                <Label className="text-sm">Odvojene sekcije</Label>
                <p className="text-xs text-muted-foreground">
                  Prikaži visok/normalan/nizak prioritet odvojeno
                </p>
              </div>
              <Switch
                checked={config.separateSections}
                onCheckedChange={(v) => setConfig({ ...config, separateSections: v })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Prilagođena pravila</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Rules */}
          {config.customRules.length > 0 && (
            <div className="space-y-2">
              {config.customRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Badge variant="outline" className="text-xs">
                    {getRuleTypeLabel(rule.type)}
                  </Badge>
                  <span className="flex-1 text-sm font-mono">{rule.value}</span>
                  {getPriorityBadge(rule.priority)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveRule(rule.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Add New Rule */}
          <div className="space-y-3">
            <Label className="text-sm">Dodaj novo pravilo</Label>
            <div className="flex gap-2">
              <Select
                value={newRule.type}
                onValueChange={(v) =>
                  setNewRule({ ...newRule, type: v as PriorityRule["type"] })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sender">Pošiljatelj</SelectItem>
                  <SelectItem value="domain">Domena</SelectItem>
                  <SelectItem value="keyword">Ključna riječ</SelectItem>
                  <SelectItem value="label">Oznaka</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder={
                  newRule.type === "sender"
                    ? "email@example.com"
                    : newRule.type === "domain"
                      ? "example.com"
                      : "Vrijednost..."
                }
                value={newRule.value}
                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                className="flex-1"
              />

              <Select
                value={newRule.priority}
                onValueChange={(v) =>
                  setNewRule({ ...newRule, priority: v as PriorityRule["priority"] })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Visok</SelectItem>
                  <SelectItem value="normal">Normalan</SelectItem>
                  <SelectItem value="low">Nizak</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleAddRule}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Kako funkcionira prioritizacija?</p>
              <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                <li>• AI analizira sadržaj, pošiljatelja i kontekst emaila</li>
                <li>• Pravila se primjenjuju redoslijedom od vrha prema dnu</li>
                <li>• Ručna pravila imaju prednost nad AI prijedlozima</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmailPrioritySettings;
