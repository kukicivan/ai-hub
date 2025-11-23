import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  Trash2,
  Download,
  QrCode,
  Copy,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: Date;
  current: boolean;
}

interface SecurityEvent {
  id: string;
  type: "login" | "password_change" | "2fa_enabled" | "suspicious";
  description: string;
  timestamp: Date;
  location?: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    device: "Windows PC",
    browser: "Chrome 120",
    location: "Zagreb, Hrvatska",
    ip: "192.168.1.***",
    lastActive: new Date(),
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari Mobile",
    location: "Zagreb, Hrvatska",
    ip: "192.168.1.***",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    current: false,
  },
  {
    id: "3",
    device: "MacBook Pro",
    browser: "Firefox 121",
    location: "Split, Hrvatska",
    ip: "10.0.0.***",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    current: false,
  },
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "login",
    description: "Uspješna prijava",
    timestamp: new Date(),
    location: "Zagreb, Hrvatska",
  },
  {
    id: "2",
    type: "password_change",
    description: "Lozinka promijenjena",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "3",
    type: "2fa_enabled",
    description: "2FA autentifikacija omogućena",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "4",
    type: "login",
    description: "Uspješna prijava s novog uređaja",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    location: "Split, Hrvatska",
  },
];

export function AccountSecuritySettings() {
  const toast = useToast();
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Security settings
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score < 40) return { score, label: "Slaba", color: "bg-red-500" };
    if (score < 70) return { score, label: "Srednja", color: "bg-yellow-500" };
    return { score, label: "Jaka", color: "bg-green-500" };
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Lozinke se ne podudaraju");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Lozinka mora imati najmanje 8 znakova");
      return;
    }
    toast.success("Lozinka uspješno promijenjena");
    setShowPasswordDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setShow2FADialog(false);
    toast.success("Dvofaktorska autentifikacija omogućena");
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast.success("Dvofaktorska autentifikacija onemogućena");
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Sesija prekinuta");
  };

  const handleTerminateAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    toast.success("Sve ostale sesije prekinute");
  };

  const handleExportData = () => {
    toast.success("Podaci će biti poslani na vaš email");
    setShowExportDialog(false);
  };

  const handleDeleteAccount = () => {
    toast.error("Ova funkcija je onemogućena u demo verziji");
    setShowDeleteDialog(false);
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "password_change":
        return <Key className="h-4 w-4 text-blue-500" />;
      case "2fa_enabled":
        return <Shield className="h-4 w-4 text-purple-500" />;
      case "suspicious":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Sigurnost računa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Vaš račun je siguran
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Sve sigurnosne značajke su aktivne
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Lozinka
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lozinka računa</p>
              <p className="text-sm text-muted-foreground">
                Zadnja promjena: prije 30 dana
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
              <Key className="h-4 w-4 mr-2" />
              Promijeni lozinku
            </Button>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Preporučamo redovitu promjenu lozinke svakih 90 dana.
              Koristite jedinstvenu lozinku s kombinacijom slova, brojeva i simbola.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Dvofaktorska autentifikacija (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {twoFactorEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {twoFactorEnabled ? "2FA je omogućena" : "2FA nije omogućena"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? "Vaš račun ima dodatni sloj zaštite"
                    : "Omogućite 2FA za veću sigurnost"}
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <Button variant="outline" onClick={handleDisable2FA}>
                Onemogući
              </Button>
            ) : (
              <Button onClick={() => setShow2FADialog(true)}>
                <Shield className="h-4 w-4 mr-2" />
                Omogući 2FA
              </Button>
            )}
          </div>

          {twoFactorEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Metoda autentifikacije</span>
                <Badge>Authenticator aplikacija</Badge>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generiraj backup kodove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Aktivne sesije ({sessions.length})
            </CardTitle>
            {sessions.length > 1 && (
              <Button variant="outline" size="sm" onClick={handleTerminateAllSessions}>
                <LogOut className="h-4 w-4 mr-1" />
                Odjavi sve ostale
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 border rounded-lg ${
                session.current ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {session.device.includes("iPhone") || session.device.includes("Android") ? (
                      <Smartphone className="h-4 w-4" />
                    ) : (
                      <Monitor className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <Badge className="text-xs bg-green-500">Trenutna</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.browser}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.current
                          ? "Aktivna sada"
                          : format(session.lastActive, "dd.MM.yyyy. HH:mm", { locale: hr })}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sigurnosne postavke</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Obavijesti o prijavi</Label>
              <p className="text-xs text-muted-foreground">
                Email obavijest pri svakoj novoj prijavi
              </p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Detekcija sumnjive aktivnosti</Label>
              <p className="text-xs text-muted-foreground">
                Upozorenja o neuobičajenom ponašanju
              </p>
            </div>
            <Switch checked={suspiciousActivity} onCheckedChange={setSuspiciousActivity} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Automatska odjava</Label>
              <p className="text-xs text-muted-foreground">
                Odjava nakon 30 minuta neaktivnosti
              </p>
            </div>
            <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
          </div>
        </CardContent>
      </Card>

      {/* Security Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sigurnosni događaji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSecurityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg"
              >
                {getEventIcon(event.type)}
                <div className="flex-1">
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(event.timestamp, "dd.MM.yyyy. HH:mm", { locale: hr })}
                    {event.location && ` • ${event.location}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Podaci i privatnost</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Izvezi podatke</p>
              <p className="text-sm text-muted-foreground">
                Preuzmite kopiju svih vaših podataka
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-2" />
              Izvezi
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Obriši račun</p>
              <p className="text-sm text-muted-foreground">
                Trajno obrišite račun i sve podatke
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Obriši račun
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promjena lozinke</DialogTitle>
            <DialogDescription>
              Unesite trenutnu lozinku i novu lozinku.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Trenutna lozinka</Label>
              <div className="relative">
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nova lozinka</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={passwordStrength.score} className="h-2" />
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.score < 40
                          ? "text-red-500"
                          : passwordStrength.score < 70
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Potvrdite novu lozinku</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500">Lozinke se ne podudaraju</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleChangePassword}>Promijeni lozinku</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enable 2FA Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Omogući dvofaktorsku autentifikaciju</DialogTitle>
            <DialogDescription>
              Skenirajte QR kod s aplikacijom za autentifikaciju.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Ili unesite kod ručno:
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-1 bg-muted rounded font-mono text-sm">
                  ABCD EFGH IJKL MNOP
                </code>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Verifikacijski kod</Label>
              <Input placeholder="Unesite 6-znamenkasti kod" maxLength={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleEnable2FA}>Potvrdi i omogući</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izvoz podataka</DialogTitle>
            <DialogDescription>
              Zatražite kopiju svih vaših podataka. Link za preuzimanje bit će poslan na vašu email adresu.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email za dostavu</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Zatraži izvoz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Brisanje računa
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ova radnja je <strong>nepovratna</strong>. Svi vaši podaci, emailovi,
              kontakti i postavke bit će trajno obrisani. Nećete moći vratiti račun.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              Obriši trajno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AccountSecuritySettings;
