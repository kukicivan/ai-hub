import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Mail,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface AutoReplyRule {
  id: string;
  name: string;
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
  subject: string;
  body: string;
  applyTo: "all" | "external" | "internal" | "contacts";
  excludeVIP: boolean;
  isAIGenerated?: boolean;
}

export function AutoReplySettings() {
  const toast = useToast();
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [rules, setRules] = useState<AutoReplyRule[]>([
    {
      id: "1",
      name: "Godišnji odmor",
      enabled: false,
      startDate: addDays(new Date(), 7),
      endDate: addDays(new Date(), 14),
      subject: "Automatski odgovor - Na godišnjem odmoru",
      body: "Poštovani,\n\nTrenutno sam na godišnjem odmoru i neću biti u mogućnosti odgovoriti na vašu poruku.\n\nVratit ću se [DATUM] i odgovorit ću vam čim budem u mogućnosti.\n\nZa hitna pitanja, molimo kontaktirajte [KONTAKT].\n\nSrdačan pozdrav",
      applyTo: "all",
      excludeVIP: true,
    },
    {
      id: "2",
      name: "Izvan radnog vremena",
      enabled: true,
      subject: "Primili smo vašu poruku",
      body: "Hvala na vašoj poruci. Trenutno je izvan radnog vremena. Odgovorit ćemo vam prvi sljedeći radni dan.\n\nRadno vrijeme: Pon-Pet, 9:00-17:00",
      applyTo: "external",
      excludeVIP: false,
      isAIGenerated: true,
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoReplyRule | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [newRule, setNewRule] = useState<Partial<AutoReplyRule>>({
    name: "",
    subject: "",
    body: "",
    applyTo: "all",
    excludeVIP: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Postavke automatskog odgovora spremljene");
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Pravilo obrisano");
  };

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.body) {
      toast.error("Unesite naziv i sadržaj poruke");
      return;
    }

    const rule: AutoReplyRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      enabled: false,
      subject: newRule.subject || "Automatski odgovor",
      body: newRule.body!,
      applyTo: newRule.applyTo as AutoReplyRule["applyTo"],
      excludeVIP: newRule.excludeVIP || false,
      startDate: newRule.startDate,
      endDate: newRule.endDate,
    };

    setRules((prev) => [...prev, rule]);
    setNewRule({
      name: "",
      subject: "",
      body: "",
      applyTo: "all",
      excludeVIP: false,
    });
    setEditMode(false);
    toast.success("Pravilo kreirano");
  };

  const generateAIReply = () => {
    setNewRule({
      ...newRule,
      subject: "Hvala na vašoj poruci",
      body: "Poštovani,\n\nHvala vam na poruci. Primili smo vaš upit i odgovorit ćemo vam u najkraćem mogućem roku, obično unutar 24 sata.\n\nAko je vaše pitanje hitno, molimo navedite to u predmetu poruke.\n\nSrdačan pozdrav",
    });
    toast.success("AI je generirao predložak odgovora");
  };

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              Automatski odgovori
            </CardTitle>
            <Switch
              checked={globalEnabled}
              onCheckedChange={setGlobalEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kada je uključeno, automatski odgovori će se slati prema definiranim pravilima.
          </p>
          {globalEnabled && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-200">
                  Automatski odgovori su aktivni
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pravila automatskog odgovora</CardTitle>
            <Button size="sm" onClick={() => setEditMode(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Novo pravilo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 border rounded-lg ${
                rule.enabled ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{rule.name}</span>
                    {rule.enabled && (
                      <Badge className="text-xs bg-green-500">Aktivno</Badge>
                    )}
                    {rule.isAIGenerated && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rule.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {rule.startDate && rule.endDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  {format(rule.startDate, "d MMM", { locale: hr })} -{" "}
                  {format(rule.endDate, "d MMM yyyy", { locale: hr })}
                </div>
              )}

              <div className="mt-2 flex items-center gap-2 text-xs">
                <Badge variant="outline">
                  {rule.applyTo === "all"
                    ? "Svi"
                    : rule.applyTo === "external"
                    ? "Vanjski"
                    : rule.applyTo === "internal"
                    ? "Interni"
                    : "Kontakti"}
                </Badge>
                {rule.excludeVIP && (
                  <Badge variant="outline">Isključi VIP</Badge>
                )}
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nema definiranih pravila</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Rule */}
      {editMode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Novo pravilo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Naziv pravila</Label>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="Npr. Godišnji odmor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Početak (opciono)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newRule.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRule.startDate
                        ? format(newRule.startDate, "d MMM yyyy", { locale: hr })
                        : "Odaberi datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newRule.startDate}
                      onSelect={(date) =>
                        setNewRule({ ...newRule, startDate: date })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Kraj (opciono)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newRule.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRule.endDate
                        ? format(newRule.endDate, "d MMM yyyy", { locale: hr })
                        : "Odaberi datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newRule.endDate}
                      onSelect={(date) =>
                        setNewRule({ ...newRule, endDate: date })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Predmet</Label>
              <Input
                value={newRule.subject}
                onChange={(e) =>
                  setNewRule({ ...newRule, subject: e.target.value })
                }
                placeholder="Automatski odgovor"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Poruka</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateAIReply}
                  className="h-7 text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generiraj AI
                </Button>
              </div>
              <Textarea
                value={newRule.body}
                onChange={(e) => setNewRule({ ...newRule, body: e.target.value })}
                placeholder="Sadržaj automatskog odgovora..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primijeni na</Label>
                <Select
                  value={newRule.applyTo}
                  onValueChange={(value: AutoReplyRule["applyTo"]) =>
                    setNewRule({ ...newRule, applyTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve emailove</SelectItem>
                    <SelectItem value="external">Samo vanjske</SelectItem>
                    <SelectItem value="internal">Samo interne</SelectItem>
                    <SelectItem value="contacts">Samo kontakte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Label>Isključi VIP kontakte</Label>
                <Switch
                  checked={newRule.excludeVIP}
                  onCheckedChange={(checked) =>
                    setNewRule({ ...newRule, excludeVIP: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Odustani
              </Button>
              <Button onClick={handleCreateRule}>Kreiraj pravilo</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Napomena
          </span>
        </div>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Automatski odgovori šalju se samo jednom po pošiljatelju unutar 24 sata
          kako bi se spriječio spam. VIP kontakti mogu biti isključeni iz automatskih odgovora.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Spremanje...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Spremi postavke
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AutoReplySettings;
