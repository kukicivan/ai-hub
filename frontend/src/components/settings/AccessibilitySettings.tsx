import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accessibility,
  Eye,
  Ear,
  Hand,
  Keyboard,
  MousePointer,
  Volume2,
  Type,
  Contrast,
  ZoomIn,
  Focus,
  Monitor,
  Play,
  Pause,
  Info,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface AccessibilityConfig {
  // Vision
  highContrast: boolean;
  largeText: boolean;
  textScaling: number;
  reduceTransparency: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  cursorSize: "default" | "large" | "extra-large";

  // Motion
  reduceMotion: boolean;
  pauseAnimations: boolean;
  autoplayVideos: boolean;

  // Audio
  screenReaderOptimized: boolean;
  soundEffects: boolean;
  voiceAnnouncements: boolean;

  // Interaction
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  stickyKeys: boolean;
  longPressDelay: number;

  // Reading
  dyslexiaFriendlyFont: boolean;
  lineSpacing: "normal" | "relaxed" | "loose";
  wordSpacing: "normal" | "wide" | "wider";
}

export function AccessibilitySettings() {
  const toast = useToast();
  const [config, setConfig] = useState<AccessibilityConfig>({
    highContrast: false,
    largeText: false,
    textScaling: 100,
    reduceTransparency: false,
    colorBlindMode: "none",
    cursorSize: "default",
    reduceMotion: false,
    pauseAnimations: false,
    autoplayVideos: false,
    screenReaderOptimized: false,
    soundEffects: true,
    voiceAnnouncements: false,
    keyboardNavigation: true,
    focusIndicators: true,
    stickyKeys: false,
    longPressDelay: 500,
    dyslexiaFriendlyFont: false,
    lineSpacing: "normal",
    wordSpacing: "normal",
  });

  const handleSave = () => {
    toast.success("Postavke pristupačnosti spremljene");
  };

  const handleResetDefaults = () => {
    setConfig({
      highContrast: false,
      largeText: false,
      textScaling: 100,
      reduceTransparency: false,
      colorBlindMode: "none",
      cursorSize: "default",
      reduceMotion: false,
      pauseAnimations: false,
      autoplayVideos: false,
      screenReaderOptimized: false,
      soundEffects: true,
      voiceAnnouncements: false,
      keyboardNavigation: true,
      focusIndicators: true,
      stickyKeys: false,
      longPressDelay: 500,
      dyslexiaFriendlyFont: false,
      lineSpacing: "normal",
      wordSpacing: "normal",
    });
    toast.success("Postavke vraćene na zadano");
  };

  const activeFeatures = [
    config.highContrast && "Visoki kontrast",
    config.largeText && "Veliki tekst",
    config.reduceMotion && "Smanjeni pokreti",
    config.screenReaderOptimized && "Čitač ekrana",
    config.dyslexiaFriendlyFont && "Disleksija font",
    config.keyboardNavigation && "Tipkovnica",
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Accessibility className="h-5 w-5 text-primary" />
              Pristupačnost
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
        <CardContent>
          {activeFeatures.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Aktivne značajke:</span>
              {activeFeatures.map((feature) => (
                <Badge key={feature as string} variant="secondary">
                  <Check className="h-3 w-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Prilagodite aplikaciju vašim potrebama
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vision */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vid
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Visoki kontrast</Label>
              <p className="text-xs text-muted-foreground">
                Povećava kontrast između elemenata
              </p>
            </div>
            <Switch
              checked={config.highContrast}
              onCheckedChange={(v) => setConfig({ ...config, highContrast: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Veliki tekst</Label>
              <p className="text-xs text-muted-foreground">
                Povećava osnovnu veličinu fonta
              </p>
            </div>
            <Switch
              checked={config.largeText}
              onCheckedChange={(v) => setConfig({ ...config, largeText: v })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Skaliranje teksta</Label>
              <span className="text-sm font-medium">{config.textScaling}%</span>
            </div>
            <Slider
              value={[config.textScaling]}
              onValueChange={([value]) => setConfig({ ...config, textScaling: value })}
              min={75}
              max={200}
              step={25}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>75%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Smanji prozirnost</Label>
              <p className="text-xs text-muted-foreground">
                Uklanja prozirne pozadine
              </p>
            </div>
            <Switch
              checked={config.reduceTransparency}
              onCheckedChange={(v) => setConfig({ ...config, reduceTransparency: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Način za daltonizam</Label>
              <p className="text-xs text-muted-foreground">
                Prilagođava boje za različite tipove
              </p>
            </div>
            <Select
              value={config.colorBlindMode}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  colorBlindMode: v as AccessibilityConfig["colorBlindMode"],
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Isključeno</SelectItem>
                <SelectItem value="protanopia">Protanopija (crveno)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopija (zeleno)</SelectItem>
                <SelectItem value="tritanopia">Tritanopija (plavo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Veličina kursora</Label>
              <p className="text-xs text-muted-foreground">
                Povećava vidljivost pokazivača
              </p>
            </div>
            <Select
              value={config.cursorSize}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  cursorSize: v as AccessibilityConfig["cursorSize"],
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Zadano</SelectItem>
                <SelectItem value="large">Veliko</SelectItem>
                <SelectItem value="extra-large">Vrlo veliko</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Motion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Play className="h-4 w-4" />
            Pokreti i animacije
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Smanji pokrete</Label>
              <p className="text-xs text-muted-foreground">
                Minimizira animacije u sučelju
              </p>
            </div>
            <Switch
              checked={config.reduceMotion}
              onCheckedChange={(v) => setConfig({ ...config, reduceMotion: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Pauziraj animacije</Label>
              <p className="text-xs text-muted-foreground">
                Zaustavlja sve animacije
              </p>
            </div>
            <Switch
              checked={config.pauseAnimations}
              onCheckedChange={(v) => setConfig({ ...config, pauseAnimations: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Automatska reprodukcija videa</Label>
              <p className="text-xs text-muted-foreground">
                Automatski pokreće video sadržaj
              </p>
            </div>
            <Switch
              checked={config.autoplayVideos}
              onCheckedChange={(v) => setConfig({ ...config, autoplayVideos: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Ear className="h-4 w-4" />
            Zvuk i govor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Optimizirano za čitač ekrana</Label>
              <p className="text-xs text-muted-foreground">
                Poboljšava kompatibilnost s čitačima
              </p>
            </div>
            <Switch
              checked={config.screenReaderOptimized}
              onCheckedChange={(v) => setConfig({ ...config, screenReaderOptimized: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Zvučni efekti</Label>
              <p className="text-xs text-muted-foreground">
                Zvukovi za akcije i obavijesti
              </p>
            </div>
            <Switch
              checked={config.soundEffects}
              onCheckedChange={(v) => setConfig({ ...config, soundEffects: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Glasovne najave</Label>
              <p className="text-xs text-muted-foreground">
                Izgovara obavijesti i statuse
              </p>
            </div>
            <Switch
              checked={config.voiceAnnouncements}
              onCheckedChange={(v) => setConfig({ ...config, voiceAnnouncements: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interaction */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hand className="h-4 w-4" />
            Interakcija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Navigacija tipkovnicom</Label>
              <p className="text-xs text-muted-foreground">
                Omogućuje potpunu navigaciju tipkovnicom
              </p>
            </div>
            <Switch
              checked={config.keyboardNavigation}
              onCheckedChange={(v) => setConfig({ ...config, keyboardNavigation: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Indikatori fokusa</Label>
              <p className="text-xs text-muted-foreground">
                Naglašava fokusirane elemente
              </p>
            </div>
            <Switch
              checked={config.focusIndicators}
              onCheckedChange={(v) => setConfig({ ...config, focusIndicators: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Ljepljive tipke</Label>
              <p className="text-xs text-muted-foreground">
                Drži modifikatore (Ctrl, Shift) aktivnima
              </p>
            </div>
            <Switch
              checked={config.stickyKeys}
              onCheckedChange={(v) => setConfig({ ...config, stickyKeys: v })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Dugi pritisak</Label>
              <span className="text-sm font-medium">{config.longPressDelay}ms</span>
            </div>
            <Slider
              value={[config.longPressDelay]}
              onValueChange={([value]) => setConfig({ ...config, longPressDelay: value })}
              min={200}
              max={1000}
              step={100}
            />
            <p className="text-xs text-muted-foreground">
              Vrijeme potrebno za aktiviranje dugog pritiska
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reading */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Čitanje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Font prilagođen disleksiji</Label>
              <p className="text-xs text-muted-foreground">
                Koristi OpenDyslexic ili sličan font
              </p>
            </div>
            <Switch
              checked={config.dyslexiaFriendlyFont}
              onCheckedChange={(v) => setConfig({ ...config, dyslexiaFriendlyFont: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Razmak između redaka</Label>
              <p className="text-xs text-muted-foreground">
                Povećava čitljivost teksta
              </p>
            </div>
            <Select
              value={config.lineSpacing}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  lineSpacing: v as AccessibilityConfig["lineSpacing"],
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normalno</SelectItem>
                <SelectItem value="relaxed">Opušteno</SelectItem>
                <SelectItem value="loose">Široko</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Razmak između riječi</Label>
              <p className="text-xs text-muted-foreground">
                Povećava razmak između riječi
              </p>
            </div>
            <Select
              value={config.wordSpacing}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  wordSpacing: v as AccessibilityConfig["wordSpacing"],
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normalno</SelectItem>
                <SelectItem value="wide">Široko</SelectItem>
                <SelectItem value="wider">Vrlo široko</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div
            className="p-4 bg-muted rounded-lg"
            style={{
              fontSize: config.largeText ? "18px" : "14px",
              lineHeight: config.lineSpacing === "normal" ? 1.5 : config.lineSpacing === "relaxed" ? 1.75 : 2,
              wordSpacing: config.wordSpacing === "normal" ? "0" : config.wordSpacing === "wide" ? "0.1em" : "0.2em",
              fontFamily: config.dyslexiaFriendlyFont ? "OpenDyslexic, sans-serif" : "inherit",
            }}
          >
            <p>
              Ovo je primjer teksta s vašim odabranim postavkama. Možete vidjeti kako
              će tekst izgledati s trenutnim postavkama razmaka i fonta.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Pomoć
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ako imate poteškoća s korištenjem aplikacije, obratite nam se za pomoć.
              Naš tim za podršku može vam pomoći prilagoditi postavke prema vašim potrebama.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Keyboard className="h-4 w-4 mr-1" />
                Prečaci tipkovnice
              </Button>
              <Button variant="outline" size="sm">
                Kontaktirajte podršku
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AccessibilitySettings;
