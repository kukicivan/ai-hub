import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plane,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Building,
  MessageSquare,
  Sparkles,
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OutOfOfficeSettings {
  enabled: boolean;
  startDate: Date | null;
  endDate: Date | null;
  subject: string;
  internalMessage: string;
  externalMessage: string;
  sendToContacts: boolean;
  sendToAll: boolean;
  excludeDomains: string[];
  forwardTo: string;
  forwardEnabled: boolean;
}

const defaultSettings: OutOfOfficeSettings = {
  enabled: false,
  startDate: null,
  endDate: null,
  subject: "Automatski odgovor - Izvan ureda",
  internalMessage: `Poštovani,

Trenutno sam izvan ureda i nemam pristup emailu. Vratit ću se [DATUM].

Za hitne stvari, molim kontaktirajte [KONTAKT].

Hvala na razumijevanju.`,
  externalMessage: `Poštovani,

Hvala na vašoj poruci. Trenutno sam izvan ureda do [DATUM].

Odgovorit ću vam po povratku.

Srdačan pozdrav`,
  sendToContacts: true,
  sendToAll: false,
  excludeDomains: [],
  forwardTo: "",
  forwardEnabled: false,
};

const templateMessages = [
  {
    id: "vacation",
    name: "Godišnji odmor",
    icon: "🏖️",
    message: `Poštovani,

Trenutno sam na godišnjem odmoru od [POČETAK] do [KRAJ].

Za hitne stvari kontaktirajte [ZAMJENA] na [EMAIL].

Hvala na razumijevanju i javit ću vam se po povratku.

Srdačan pozdrav`,
  },
  {
    id: "business",
    name: "Poslovno putovanje",
    icon: "✈️",
    message: `Poštovani,

Trenutno sam na poslovnom putovanju s ograničenim pristupom emailu.

Vraćam se [DATUM] i odgovorit ću na vaš email čim budem u mogućnosti.

Za hitna pitanja kontaktirajte [ZAMJENA].

Srdačan pozdrav`,
  },
  {
    id: "sick",
    name: "Bolovanje",
    icon: "🏥",
    message: `Poštovani,

Trenutno nisam u mogućnosti odgovoriti na vaš email.

Za hitne stvari kontaktirajte [ZAMJENA] ili pošaljite email na [EMAIL].

Hvala na razumijevanju.`,
  },
  {
    id: "meeting",
    name: "Sastanci",
    icon: "📅",
    message: `Poštovani,

Danas imam cjelodnevne sastanke i neću biti u mogućnosti odgovoriti na emailove do kraja radnog vremena.

Za hitna pitanja nazovite [TELEFON].

Hvala`,
  },
];

export function EmailOutOfOffice() {
  const [settings, setSettings] = useState<OutOfOfficeSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("internal");
  const [newDomain, setNewDomain] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: settings.enabled ? "Automatski odgovor aktiviran" : "Postavke spremljene",
      description: settings.enabled
        ? `Aktivan od ${settings.startDate ? format(settings.startDate, "d. MMMM", { locale: hr }) : "odmah"}`
        : "Automatski odgovor je isključen",
    });
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templateMessages.find((t) => t.id === templateId);
    if (template) {
      setSettings((prev) => ({
        ...prev,
        internalMessage: template.message,
        externalMessage: template.message,
      }));
      toast({
        title: "Predložak primijenjen",
        description: `Korišten predložak "${template.name}"`,
      });
    }
  };

  const handleGenerateAI = async () => {
    toast({
      title: "AI generira poruku...",
      description: "Molimo pričekajte",
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSettings((prev) => ({
      ...prev,
      externalMessage: `Poštovani,

Hvala vam na poruci. Trenutno sam izvan ureda${
        settings.endDate
          ? ` do ${format(settings.endDate, "d. MMMM yyyy.", { locale: hr })}`
          : ""
      }.

Vaš email sam primio/la i odgovorit ću vam u najkraćem mogućem roku po povratku.

Za hitna pitanja, molim kontaktirajte moj tim.

Srdačan pozdrav`,
    }));
    toast({
      title: "Poruka generirana",
      description: "AI je generirao personaliziranu poruku",
    });
  };

  const addExcludeDomain = () => {
    if (newDomain && !settings.excludeDomains.includes(newDomain)) {
      setSettings((prev) => ({
        ...prev,
        excludeDomains: [...prev.excludeDomains, newDomain],
      }));
      setNewDomain("");
    }
  };

  const removeExcludeDomain = (domain: string) => {
    setSettings((prev) => ({
      ...prev,
      excludeDomains: prev.excludeDomains.filter((d) => d !== domain),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                settings.enabled ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"
              )}>
                <Plane className={cn(
                  "h-5 w-5",
                  settings.enabled ? "text-green-600" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <CardTitle className="text-lg">Automatski odgovor</CardTitle>
                <CardDescription>
                  {settings.enabled
                    ? "Aktivno - automatski odgovor je uključen"
                    : "Isključeno - poruke neće dobiti automatski odgovor"}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) =>
                setSettings((prev) => ({ ...prev, enabled }))
              }
            />
          </div>
        </CardHeader>
        {settings.enabled && (
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Automatski odgovor je aktivan
                {settings.startDate && settings.endDate && (
                  <>
                    {" "}od {format(settings.startDate, "d.M.yyyy.", { locale: hr })} do{" "}
                    {format(settings.endDate, "d.M.yyyy.", { locale: hr })}
                  </>
                )}
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Razdoblje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Početak</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !settings.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.startDate
                      ? format(settings.startDate, "d. MMMM yyyy.", { locale: hr })
                      : "Odaberi datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={settings.startDate || undefined}
                    onSelect={(date) =>
                      setSettings((prev) => ({ ...prev, startDate: date || null }))
                    }
                    locale={hr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Završetak</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !settings.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.endDate
                      ? format(settings.endDate, "d. MMMM yyyy.", { locale: hr })
                      : "Odaberi datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={settings.endDate || undefined}
                    onSelect={(date) =>
                      setSettings((prev) => ({ ...prev, endDate: date || null }))
                    }
                    locale={hr}
                    disabled={(date) =>
                      settings.startDate ? date < settings.startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Predlošci poruka
          </CardTitle>
          <CardDescription>
            Odaberite predložak ili napišite vlastitu poruku
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {templateMessages.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto py-3 flex flex-col gap-1"
                onClick={() => handleApplyTemplate(template.id)}
              >
                <span className="text-lg">{template.icon}</span>
                <span className="text-xs">{template.name}</span>
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateAI}
          >
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            AI generiraj poruku
          </Button>
        </CardContent>
      </Card>

      {/* Message Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sadržaj poruke</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Predmet</Label>
              <Input
                value={settings.subject}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Automatski odgovor"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="internal" className="gap-2">
                  <Building className="h-4 w-4" />
                  Interni
                </TabsTrigger>
                <TabsTrigger value="external" className="gap-2">
                  <Users className="h-4 w-4" />
                  Eksterni
                </TabsTrigger>
              </TabsList>
              <TabsContent value="internal" className="space-y-2">
                <Label>Poruka za kolege (ista domena)</Label>
                <Textarea
                  value={settings.internalMessage}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      internalMessage: e.target.value,
                    }))
                  }
                  placeholder="Napišite poruku za kolege..."
                  rows={8}
                />
              </TabsContent>
              <TabsContent value="external" className="space-y-2">
                <Label>Poruka za vanjske kontakte</Label>
                <Textarea
                  value={settings.externalMessage}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      externalMessage: e.target.value,
                    }))
                  }
                  placeholder="Napišite poruku za vanjske kontakte..."
                  rows={8}
                />
              </TabsContent>
            </Tabs>

            <div className="text-xs text-muted-foreground">
              Dostupni placeholderi: [DATUM], [POČETAK], [KRAJ], [ZAMJENA], [EMAIL], [TELEFON]
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipients Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Primatelji
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Šalji samo kontaktima</Label>
              <p className="text-xs text-muted-foreground">
                Odgovor samo osobama u vašim kontaktima
              </p>
            </div>
            <Switch
              checked={settings.sendToContacts}
              onCheckedChange={(sendToContacts) =>
                setSettings((prev) => ({ ...prev, sendToContacts }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Šalji svima</Label>
              <p className="text-xs text-muted-foreground">
                Odgovor svim pošiljateljima
              </p>
            </div>
            <Switch
              checked={settings.sendToAll}
              onCheckedChange={(sendToAll) =>
                setSettings((prev) => ({ ...prev, sendToAll }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Isključi domene</Label>
            <div className="flex gap-2">
              <Input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="npr. newsletter.com"
              />
              <Button onClick={addExcludeDomain} variant="outline">
                Dodaj
              </Button>
            </div>
            {settings.excludeDomains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.excludeDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeExcludeDomain(domain)}
                  >
                    {domain} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forwarding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Prosljeđivanje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Proslijedi emailove</Label>
              <p className="text-xs text-muted-foreground">
                Proslijedi dolazne emailove kolegi
              </p>
            </div>
            <Switch
              checked={settings.forwardEnabled}
              onCheckedChange={(forwardEnabled) =>
                setSettings((prev) => ({ ...prev, forwardEnabled }))
              }
            />
          </div>

          {settings.forwardEnabled && (
            <div className="space-y-2">
              <Label>Email za prosljeđivanje</Label>
              <Input
                type="email"
                value={settings.forwardTo}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, forwardTo: e.target.value }))
                }
                placeholder="kolega@firma.com"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setSettings(defaultSettings)}
        >
          Poništi promjene
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Spremanje...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Spremi postavke
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default EmailOutOfOffice;
