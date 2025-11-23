import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Layout,
  Type,
  Maximize2,
  Minimize2,
  Eye,
  Sparkles,
  Grid,
  List,
  SidebarOpen,
  SidebarClose,
  Check,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";

interface AppearanceConfig {
  density: "comfortable" | "compact" | "spacious";
  fontSize: number;
  sidebarPosition: "left" | "right";
  sidebarCollapsed: boolean;
  showAvatars: boolean;
  showPreviews: boolean;
  emailListView: "comfortable" | "compact";
  animationsEnabled: boolean;
  reduceMotion: boolean;
  accentColor: string;
}

const accentColors = [
  { id: "blue", label: "Plava", value: "#3b82f6" },
  { id: "purple", label: "Ljubičasta", value: "#8b5cf6" },
  { id: "green", label: "Zelena", value: "#22c55e" },
  { id: "orange", label: "Narančasta", value: "#f97316" },
  { id: "pink", label: "Roza", value: "#ec4899" },
  { id: "teal", label: "Tirkizna", value: "#14b8a6" },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [config, setConfig] = useState<AppearanceConfig>({
    density: "comfortable",
    fontSize: 14,
    sidebarPosition: "left",
    sidebarCollapsed: false,
    showAvatars: true,
    showPreviews: true,
    emailListView: "comfortable",
    animationsEnabled: true,
    reduceMotion: false,
    accentColor: "blue",
  });

  const handleSave = () => {
    toast.success("Postavke izgleda spremljene");
  };

  const handleResetDefaults = () => {
    setConfig({
      density: "comfortable",
      fontSize: 14,
      sidebarPosition: "left",
      sidebarCollapsed: false,
      showAvatars: true,
      showPreviews: true,
      emailListView: "comfortable",
      animationsEnabled: true,
      reduceMotion: false,
      accentColor: "blue",
    });
    setTheme("system");
    toast.success("Postavke vraćene na zadano");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              Izgled
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetDefaults}>
                Vrati zadano
              </Button>
              <Button size="sm" onClick={handleSave}>
                Spremi
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Tema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/50"
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="w-full h-20 bg-white border rounded-md mb-2 flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <span className="text-sm font-medium">Svijetla</span>
              {theme === "light" && (
                <Check className="h-4 w-4 text-primary mx-auto mt-1" />
              )}
            </button>

            <button
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/50"
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="w-full h-20 bg-gray-900 border border-gray-700 rounded-md mb-2 flex items-center justify-center">
                <Moon className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Tamna</span>
              {theme === "dark" && (
                <Check className="h-4 w-4 text-primary mx-auto mt-1" />
              )}
            </button>

            <button
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/50"
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium">Sistemska</span>
              {theme === "system" && (
                <Check className="h-4 w-4 text-primary mx-auto mt-1" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Akcentna boja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.id}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  config.accentColor === color.id
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setConfig({ ...config, accentColor: color.id })}
                title={color.label}
              >
                {config.accentColor === color.id && (
                  <Check className="h-5 w-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Density */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Gustoća prikaza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={config.density}
            onValueChange={(v) =>
              setConfig({ ...config, density: v as AppearanceConfig["density"] })
            }
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
              <Label
                htmlFor="compact"
                className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <Minimize2 className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Kompaktno</span>
                <span className="text-xs text-muted-foreground">Više sadržaja</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="comfortable"
                id="comfortable"
                className="peer sr-only"
              />
              <Label
                htmlFor="comfortable"
                className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <Layout className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Ugodno</span>
                <span className="text-xs text-muted-foreground">Preporučeno</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="spacious" id="spacious" className="peer sr-only" />
              <Label
                htmlFor="spacious"
                className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <Maximize2 className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Prostrano</span>
                <span className="text-xs text-muted-foreground">Više razmaka</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Veličina fonta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Manje</span>
            <span className="text-lg font-medium">{config.fontSize}px</span>
            <span className="text-sm">Veće</span>
          </div>
          <Slider
            value={[config.fontSize]}
            onValueChange={([value]) => setConfig({ ...config, fontSize: value })}
            min={12}
            max={18}
            step={1}
          />
          <p
            className="p-3 bg-muted rounded-lg"
            style={{ fontSize: `${config.fontSize}px` }}
          >
            Ovo je primjer teksta s odabranom veličinom fonta.
          </p>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <SidebarOpen className="h-4 w-4" />
            Bočna traka
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Pozicija</Label>
              <p className="text-xs text-muted-foreground">
                Odaberite stranu za bočnu traku
              </p>
            </div>
            <Select
              value={config.sidebarPosition}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  sidebarPosition: v as "left" | "right",
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Lijevo</SelectItem>
                <SelectItem value="right">Desno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Skupljena po zadanome</Label>
              <p className="text-xs text-muted-foreground">
                Prikazuj samo ikone u bočnoj traci
              </p>
            </div>
            <Switch
              checked={config.sidebarCollapsed}
              onCheckedChange={(v) => setConfig({ ...config, sidebarCollapsed: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email List View */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <List className="h-4 w-4" />
            Prikaz liste emailova
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={config.emailListView}
            onValueChange={(v) =>
              setConfig({
                ...config,
                emailListView: v as "comfortable" | "compact",
              })
            }
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="comfortable"
                id="list-comfortable"
                className="peer sr-only"
              />
              <Label
                htmlFor="list-comfortable"
                className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <div className="w-full space-y-2 mb-2">
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded" />
                </div>
                <span className="text-sm font-medium">Ugodno</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="compact"
                id="list-compact"
                className="peer sr-only"
              />
              <Label
                htmlFor="list-compact"
                className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <div className="w-full space-y-1 mb-2">
                  <div className="h-5 bg-muted rounded" />
                  <div className="h-5 bg-muted rounded" />
                  <div className="h-5 bg-muted rounded" />
                  <div className="h-5 bg-muted rounded" />
                </div>
                <span className="text-sm font-medium">Kompaktno</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between">
            <div>
              <Label>Prikaži avatare</Label>
              <p className="text-xs text-muted-foreground">
                Prikaži slike pošiljatelja u listi
              </p>
            </div>
            <Switch
              checked={config.showAvatars}
              onCheckedChange={(v) => setConfig({ ...config, showAvatars: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Prikaži pregled</Label>
              <p className="text-xs text-muted-foreground">
                Prikaži dio teksta emaila u listi
              </p>
            </div>
            <Switch
              checked={config.showPreviews}
              onCheckedChange={(v) => setConfig({ ...config, showPreviews: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Animacije
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Animacije sučelja</Label>
              <p className="text-xs text-muted-foreground">
                Glatke tranzicije i efekti
              </p>
            </div>
            <Switch
              checked={config.animationsEnabled}
              onCheckedChange={(v) => setConfig({ ...config, animationsEnabled: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Smanji pokrete</Label>
              <p className="text-xs text-muted-foreground">
                Minimalne animacije za pristupačnost
              </p>
            </div>
            <Switch
              checked={config.reduceMotion}
              onCheckedChange={(v) => setConfig({ ...config, reduceMotion: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppearanceSettings;
