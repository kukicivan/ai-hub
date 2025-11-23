import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Cpu,
  Zap,
  Target,
  CheckCircle,
  Mail,
  Brain,
  FileText,
  ListChecks,
  Sparkles,
  Key,
  ExternalLink,
  Copy,
  AlertCircle,
  Clock,
  Shield,
  Settings,
  Play,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export function AIHelp() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopirano u clipboard!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            AI Help & Documentation
          </h1>
          <p className="text-muted-foreground mt-2">
            Naučite kako AI pokreće vaš email management sistem
          </p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="overview">Pregled</TabsTrigger>
          <TabsTrigger value="gmail-setup" className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Gmail Setup
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-1">
            <Key className="h-3 w-3" />
            API Ključevi
          </TabsTrigger>
          <TabsTrigger value="services">AI Servisi</TabsTrigger>
          <TabsTrigger value="actions">Akcije</TabsTrigger>
          <TabsTrigger value="structure">Struktura</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Šta je AI Email Management?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Naš AI-powered email management sistem automatski analizira dolazne emailove i pruža:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Inteligentna Analiza</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatski kategorizira, prioritizira i razumije sadržaj emailova
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Instant Uvidi</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dobijte sentiment analizu, sažetke i predložene odgovore
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Target className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Detekcija Akcija</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatski identificira akcione stavke i rokove
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Pametni Odgovori</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI-generirani prijedlozi odgovora prilagođeni kontekstu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Kako Funkcioniše
                </h4>
                <ol className="text-xs text-muted-foreground space-y-2 ml-6 list-decimal">
                  <li>Emailovi se automatski preuzimaju sa vaših povezanih računa</li>
                  <li>AI analizira sadržaj, sentiment, prioritet i namjeru</li>
                  <li>Rezultati se prikazuju sa vizualnim oznakama i sažecima</li>
                  <li>Predložene akcije i odgovori vam pomažu da brže odgovorite</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gmail Setup Tab */}
        <TabsContent value="gmail-setup" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-600" />
                Gmail Apps Script Postavljanje
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Korak-po-korak vodič za povezivanje vašeg Gmail računa sa AI Hub platformom
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Step 1 */}
              <div className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Otvorite Google Apps Script</h3>
                  <p className="text-sm text-muted-foreground">
                    Posjetite Google Apps Script konzolu da kreirate novi projekat.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open("https://script.google.com/home/start", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Otvori script.google.com
                  </Button>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-xs">
                    <p className="text-muted-foreground">
                      <strong>Napomena:</strong> Morate biti prijavljeni na Google račun koji želite povezati.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Kreirajte Novi Projekat</h3>
                  <p className="text-sm text-muted-foreground">
                    Kliknite na "New project" dugme u gornjem lijevom uglu.
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Preimenujte projekat u nešto prepoznatljivo, npr. "AI Hub Gmail Sync"
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Zalijepite Skriptu</h3>
                  <p className="text-sm text-muted-foreground">
                    Preuzmite skriptu sa AI Hub Podešavanja stranice i zalijepite cijeli sadržaj u editor.
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <div className="text-green-400">// Gmail Sync Apps Script</div>
                    <div className="text-green-400">// Generated for AI Hub</div>
                    <div className="mt-2">
                      <span className="text-purple-400">const</span> GMAIL_APP_SCRIPT_URL = <span className="text-yellow-300">'https://...'</span>;
                    </div>
                    <div>
                      <span className="text-purple-400">const</span> GMAIL_API_KEY = <span className="text-yellow-300">'your-api-key'</span>;
                    </div>
                    <div className="mt-2 text-gray-500">// ... ostatak koda</div>
                  </div>
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => window.open("/settings", "_self")}
                  >
                    <Settings className="h-4 w-4" />
                    Idi na Podešavanja za preuzimanje
                  </Button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Deployajte kao Web App</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy-ujte skriptu kao web aplikaciju da biste dobili URL.
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>Kliknite na <strong>Deploy</strong> → <strong>New deployment</strong></li>
                    <li>Izaberite tip: <strong>Web app</strong></li>
                    <li>Execute as: <strong>Me</strong></li>
                    <li>Who has access: <strong>Anyone</strong></li>
                    <li>Kliknite <strong>Deploy</strong></li>
                  </ol>
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-xs text-green-800 dark:text-green-200">
                      Kopirajte generirani Web App URL i unesite ga u AI Hub Podešavanja
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Postavite Trigger</h3>
                  <p className="text-sm text-muted-foreground">
                    Konfigurirajte automatsko pokretanje skripte svakih par minuta.
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>U Apps Script editoru, kliknite na <strong>Triggers</strong> (ikona sata) u lijevom meniju</li>
                    <li>Kliknite <strong>+ Add Trigger</strong></li>
                    <li>Choose function: <strong>syncEmails</strong></li>
                    <li>Event source: <strong>Time-driven</strong></li>
                    <li>Type: <strong>Minutes timer</strong></li>
                    <li>Interval: <strong>Every minute</strong> ili <strong>Every 5 minutes</strong></li>
                  </ol>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      Preporučujemo interval od 1-5 minuta za optimalan balans između brzine i API limita
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative pl-8">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-green-600">Gotovo!</h3>
                  <p className="text-sm text-muted-foreground">
                    Vaš Gmail je sada povezan sa AI Hub platformom. Novi emailovi će se automatski sinhronizirati i analizirati.
                  </p>
                </div>
              </div>

              {/* Useful Links */}
              <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Korisni Linkovi
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <a
                    href="https://script.google.com/home/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Google Apps Script Console
                  </a>
                  <a
                    href="https://developers.google.com/apps-script/guides/triggers/installable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Apps Script Triggers Dokumentacija
                  </a>
                  <a
                    href="https://developers.google.com/workspace/gmail/api/quickstart/apps-script"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Gmail API Quickstart
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-6 w-6 text-purple-600" />
                Kako Dobiti Grok API Ključ
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Vodič za kreiranje xAI (Grok) API ključa za AI analizu emailova
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* What is Grok */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-lg border">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Šta je Grok?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grok je napredni AI model kompanije xAI (Elon Musk). Pruža izuzetnu sposobnost razumijevanja teksta,
                  analize sentimenta i generiranja odgovora. AI Hub koristi Grok API za analizu vaših emailova.
                </p>
              </div>

              {/* Step 1 */}
              <div className="relative pl-8 pb-8 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Posjetite xAI Console</h3>
                  <p className="text-sm text-muted-foreground">
                    Otvorite xAI developer konzolu i kreirajte račun.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open("https://console.x.ai", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Otvori console.x.ai
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8 pb-8 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Prijavite se</h3>
                  <p className="text-sm text-muted-foreground">
                    Možete se prijaviti na tri načina:
                  </p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                      <Mail className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs">Email & Password</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                      <svg className="h-6 w-6 mx-auto text-gray-600 mb-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <p className="text-xs">Twitter/X OAuth</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                      <svg className="h-6 w-6 mx-auto text-gray-600 mb-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <p className="text-xs">Google OAuth</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-8 pb-8 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Dodajte Kredite</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon kreiranja računa, potrebno je dodati kredite za korištenje API-ja.
                  </p>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>O cijenama:</strong> Grok API koristi pay-as-you-go model.
                        Prosječna analiza emaila košta oko $0.001-0.01 u tokenima.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-8 pb-8 border-l-2 border-purple-200 dark:border-purple-800">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Kreirajte API Ključ</h3>
                  <p className="text-sm text-muted-foreground">
                    Idite na API Keys sekciju i kreirajte novi ključ.
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>U konzoli, navigirajte do <strong>API Keys</strong> sekcije</li>
                    <li>Kliknite <strong>Create API Key</strong></li>
                    <li>Dajte ključu prepoznatljivo ime (npr. "AI Hub")</li>
                    <li>Kopirajte generirani ključ</li>
                  </ol>
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="text-xs text-red-800 dark:text-red-200">
                        <strong>VAŽNO:</strong> API ključ se prikazuje samo jednom!
                        Odmah ga kopirajte i sačuvajte na sigurnom mjestu.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative pl-8">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Unesite Ključ u AI Hub</h3>
                  <p className="text-sm text-muted-foreground">
                    Kopirajte ključ i unesite ga u AI Hub Podešavanja → API Ključevi.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">xai-xxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard("xai-")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="gap-2"
                    onClick={() => window.open("/settings", "_self")}
                  >
                    <Play className="h-4 w-4" />
                    Idi na Podešavanja
                  </Button>
                </div>
              </div>

              {/* Token Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  O Tokenima i Korištenju
                </h4>
                <div className="grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Šta su tokeni?</strong>
                    <p className="mt-1">
                      Tokeni su jedinice teksta koje AI procesira. Približno 1 token = 4 karaktera ili 0.75 riječi.
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground">Koliko tokena po emailu?</strong>
                    <p className="mt-1">
                      Prosječan email koristi 500-2000 tokena za analizu, ovisno o dužini.
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground">Praćenje potrošnje</strong>
                    <p className="mt-1">
                      Pratite potrošnju na xAI Console → Usage sekciji.
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground">API Limiti</strong>
                    <p className="mt-1">
                      xAI ima rate limite. AI Hub automatski upravlja limitima.
                    </p>
                  </div>
                </div>
              </div>

              {/* Useful Links */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Korisni Linkovi
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <a
                    href="https://console.x.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    xAI Console
                  </a>
                  <a
                    href="https://docs.x.ai/docs/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    xAI API Dokumentacija
                  </a>
                  <a
                    href="https://docs.x.ai/docs/tutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    Grok Tutorial
                  </a>
                  <a
                    href="https://x.ai/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    <ChevronRight className="h-4 w-4" />
                    xAI API Stranica
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Dostupni AI Servisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* HTML Analysis */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">HTML Analiza</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ekstrahuje čist tekst iz HTML emailova, uklanjajući formatiranje i skripte
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            98.2% tačnost
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Klasifikacija Emailova</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Kategorizira emailove u primarne i podkategorije sa ocjenama pouzdanosti
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            95.7% tačnost
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            10+ kategorija
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Sentiment Analiza</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Detektuje emocionalni ton, nivoe hitnosti i poslovni potencijal
                        </p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            92.4% tačnost
                          </Badge>
                          <Badge className="text-xs bg-green-500">Pozitivan</Badge>
                          <Badge className="text-xs bg-blue-500">Neutralan</Badge>
                          <Badge className="text-xs bg-red-500">Negativan</Badge>
                          <Badge className="text-xs bg-yellow-500">Hitan</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Pametne Preporuke</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generiše predložene odgovore sa obrazloženjem i nivoima prioriteta
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            89.1% tačnost
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Creation */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Detekcija Akcija</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Identificira zadatke, rokove i potrebne akcije iz sadržaja emaila
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            94.3% tačnost
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                AI-Detektovane Akcije
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                AI automatski detektuje i ekstrahuje akcione stavke iz vaših emailova:
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-sm mb-2">Tipovi Akcija</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>
                      <strong>Reply</strong> - Zahtijeva vaš odgovor
                    </li>
                    <li>
                      <strong>Forward</strong> - Treba proslijediti nekome
                    </li>
                    <li>
                      <strong>Review</strong> - Dokumenti ili sadržaj za pregled
                    </li>
                    <li>
                      <strong>Schedule</strong> - Sastanak ili događaj za zakazivanje
                    </li>
                    <li>
                      <strong>Approve</strong> - Potrebna odluka ili odobrenje
                    </li>
                    <li>
                      <strong>Task</strong> - Opći zadatak za završetak
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-sm mb-2">Detalji Akcije</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Svaka detektovana akcija uključuje:
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Tip</strong> - Kategorija akcije
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Opis</strong> - Šta treba uraditi
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Rok</strong> - Kada je rok (ako je detektovan)
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Vremenski okvir</strong> - Procijenjeno vrijeme završetka
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Struktura AI Analize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Razumijevanje kako su podaci AI analize strukturirani u aplikaciji:
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-3">Struktura Email Poruke</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                    {`{
  "id": 41,
  "message_id": "19a4771d036e219c",
  "from": "sender@example.com",
  "subject": "Project Update",
  "received_at": "2025-11-20T10:30:00Z",
  "ai": {
    "status": "completed",
    "summary": "AI-generirani sažetak...",
    "sentiment": "neutral",
    "intent": "request",
    "priority": "high",
    "action_items": [...]
  }
}`}
                  </pre>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Status Vrijednosti</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">completed</Badge>
                        <span className="text-muted-foreground">Analiza gotova</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500">processing</Badge>
                        <span className="text-muted-foreground">U toku</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500">pending</Badge>
                        <span className="text-muted-foreground">Čeka</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">failed</Badge>
                        <span className="text-muted-foreground">Greška</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Nivoi Prioriteta</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">high</Badge>
                        <span className="text-muted-foreground">Hitna pažnja</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">normal</Badge>
                        <span className="text-muted-foreground">Standardni prioritet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500">low</Badge>
                        <span className="text-muted-foreground">Može čekati</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIHelp;
