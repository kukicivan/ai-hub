import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Bell,
  BellOff,
  Mail,
  Calendar,
  MessageSquare,
  AlertCircle,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Clock,
  Moon,
  Sun,
  Sparkles,
  Users,
  Star,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface NotificationSettings {
  // Global
  enabled: boolean;
  sound: boolean;
  soundVolume: number;
  vibration: boolean;

  // Channels
  desktop: boolean;
  email: boolean;
  mobile: boolean;

  // Email Notifications
  newEmail: boolean;
  emailFromContacts: boolean;
  emailFromVIP: boolean;
  emailMentions: boolean;
  emailReplies: boolean;
  emailDigest: "none" | "daily" | "weekly";

  // Calendar
  calendarReminders: boolean;
  calendarReminderTime: number;
  calendarInvites: boolean;
  calendarUpdates: boolean;

  // AI
  aiSuggestions: boolean;
  aiPriorityAlerts: boolean;
  aiSummaries: boolean;

  // Security
  securityAlerts: boolean;
  loginNotifications: boolean;

  // Quiet Hours
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursWeekends: boolean;
}

export function NotificationPreferences() {
  const toast = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    soundVolume: 70,
    vibration: true,
    desktop: true,
    email: true,
    mobile: true,
    newEmail: true,
    emailFromContacts: true,
    emailFromVIP: true,
    emailMentions: true,
    emailReplies: true,
    emailDigest: "daily",
    calendarReminders: true,
    calendarReminderTime: 15,
    calendarInvites: true,
    calendarUpdates: true,
    aiSuggestions: true,
    aiPriorityAlerts: true,
    aiSummaries: false,
    securityAlerts: true,
    loginNotifications: true,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    quietHoursWeekends: true,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Postavke obavijesti spremljene");
  };

  const handleTestNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Test obavijest", {
        body: "Ovo je test obavijest iz AI Productivity Hub",
        icon: "/favicon.ico",
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Test obavijest", {
            body: "Ovo je test obavijest iz AI Productivity Hub",
          });
        }
      });
    }
    toast.info("Test obavijest poslana");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-primary" />
              Postavke obavijesti
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTestNotification}>
                Test obavijest
              </Button>
              <Button size="sm" onClick={handleSave}>
                Spremi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.enabled ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Sve obavijesti</p>
                <p className="text-sm text-muted-foreground">
                  {settings.enabled
                    ? "Obavijesti su uključene"
                    : "Sve obavijesti su isključene"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={() => handleToggle("enabled")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kanali obavijesti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Desktop obavijesti</Label>
                <p className="text-xs text-muted-foreground">
                  Prikazuj obavijesti na radnoj površini
                </p>
              </div>
            </div>
            <Switch
              checked={settings.desktop}
              onCheckedChange={() => handleToggle("desktop")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Email obavijesti</Label>
                <p className="text-xs text-muted-foreground">
                  Primaj obavijesti putem emaila
                </p>
              </div>
            </div>
            <Switch
              checked={settings.email}
              onCheckedChange={() => handleToggle("email")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Mobilne obavijesti</Label>
                <p className="text-xs text-muted-foreground">Push obavijesti na mobitelu</p>
              </div>
            </div>
            <Switch
              checked={settings.mobile}
              onCheckedChange={() => handleToggle("mobile")}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {settings.sound ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            Zvuk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Zvuk obavijesti</Label>
            <Switch
              checked={settings.sound}
              onCheckedChange={() => handleToggle("sound")}
              disabled={!settings.enabled}
            />
          </div>

          {settings.sound && settings.enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Glasnoća</Label>
                <span className="text-sm text-muted-foreground">{settings.soundVolume}%</span>
              </div>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, soundVolume: value })
                }
                min={0}
                max={100}
                step={10}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Vibracija (mobilno)</Label>
            <Switch
              checked={settings.vibration}
              onCheckedChange={() => handleToggle("vibration")}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email obavijesti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Novi emailovi</Label>
              <Badge variant="secondary" className="text-xs">Svi</Badge>
            </div>
            <Switch
              checked={settings.newEmail}
              onCheckedChange={() => handleToggle("newEmail")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label>Od kontakata</Label>
            </div>
            <Switch
              checked={settings.emailFromContacts}
              onCheckedChange={() => handleToggle("emailFromContacts")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <Label>Od VIP kontakata</Label>
            </div>
            <Switch
              checked={settings.emailFromVIP}
              onCheckedChange={() => handleToggle("emailFromVIP")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Spominjanja (@)</Label>
            <Switch
              checked={settings.emailMentions}
              onCheckedChange={() => handleToggle("emailMentions")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Odgovori na moje emailove</Label>
            <Switch
              checked={settings.emailReplies}
              onCheckedChange={() => handleToggle("emailReplies")}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Dnevni/tjedni sažetak</Label>
              <p className="text-xs text-muted-foreground">
                Primaj sažetak propuštenih emailova
              </p>
            </div>
            <Select
              value={settings.emailDigest}
              onValueChange={(value: "none" | "daily" | "weekly") =>
                setSettings({ ...settings, emailDigest: value })
              }
              disabled={!settings.enabled}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Isključeno</SelectItem>
                <SelectItem value="daily">Dnevno</SelectItem>
                <SelectItem value="weekly">Tjedno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Kalendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Podsjetnici za događaje</Label>
            <Switch
              checked={settings.calendarReminders}
              onCheckedChange={() => handleToggle("calendarReminders")}
              disabled={!settings.enabled}
            />
          </div>

          {settings.calendarReminders && (
            <div className="flex items-center justify-between pl-4">
              <Label className="text-sm text-muted-foreground">Vrijeme prije</Label>
              <Select
                value={settings.calendarReminderTime.toString()}
                onValueChange={(value) =>
                  setSettings({ ...settings, calendarReminderTime: parseInt(value) })
                }
                disabled={!settings.enabled}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minuta</SelectItem>
                  <SelectItem value="10">10 minuta</SelectItem>
                  <SelectItem value="15">15 minuta</SelectItem>
                  <SelectItem value="30">30 minuta</SelectItem>
                  <SelectItem value="60">1 sat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Pozivnice na događaje</Label>
            <Switch
              checked={settings.calendarInvites}
              onCheckedChange={() => handleToggle("calendarInvites")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Promjene događaja</Label>
            <Switch
              checked={settings.calendarUpdates}
              onCheckedChange={() => handleToggle("calendarUpdates")}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI obavijesti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>AI prijedlozi</Label>
              <p className="text-xs text-muted-foreground">
                Prijedlozi za odgovor, raspoređivanje, itd.
              </p>
            </div>
            <Switch
              checked={settings.aiSuggestions}
              onCheckedChange={() => handleToggle("aiSuggestions")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Upozorenja za prioritet</Label>
              <p className="text-xs text-muted-foreground">
                Obavijesti o hitnim emailovima
              </p>
            </div>
            <Switch
              checked={settings.aiPriorityAlerts}
              onCheckedChange={() => handleToggle("aiPriorityAlerts")}
              disabled={!settings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Dnevni AI sažetak</Label>
              <p className="text-xs text-muted-foreground">
                Automatski generirani sažetak dana
              </p>
            </div>
            <Switch
              checked={settings.aiSummaries}
              onCheckedChange={() => handleToggle("aiSummaries")}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            Sigurnost
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sigurnosna upozorenja</Label>
              <p className="text-xs text-muted-foreground">
                Sumnjive aktivnosti na računu
              </p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={() => handleToggle("securityAlerts")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Obavijesti o prijavi</Label>
              <p className="text-xs text-muted-foreground">
                Nova prijava s nepoznatog uređaja
              </p>
            </div>
            <Switch
              checked={settings.loginNotifications}
              onCheckedChange={() => handleToggle("loginNotifications")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Tihi sati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Omogući tihe sate</Label>
              <p className="text-xs text-muted-foreground">
                Pauziraj obavijesti u određeno vrijeme
              </p>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={() => handleToggle("quietHoursEnabled")}
            />
          </div>

          {settings.quietHoursEnabled && (
            <>
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Od</Label>
                  <Select
                    value={settings.quietHoursStart}
                    onValueChange={(value) =>
                      setSettings({ ...settings, quietHoursStart: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Do</Label>
                  <Select
                    value={settings.quietHoursEnd}
                    onValueChange={(value) =>
                      setSettings({ ...settings, quietHoursEnd: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pl-4">
                <Label className="text-sm text-muted-foreground">Uključi vikende</Label>
                <Switch
                  checked={settings.quietHoursWeekends}
                  onCheckedChange={() => handleToggle("quietHoursWeekends")}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationPreferences;
