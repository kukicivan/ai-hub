import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  BellOff,
  Mail,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Monitor,
  Palette,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";

interface QuickSettings {
  notifications: boolean;
  soundEnabled: boolean;
  previewEmails: boolean;
  compactMode: boolean;
  aiEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export function QuickSettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [settings, setSettings] = useState<QuickSettings>({
    notifications: true,
    soundEnabled: true,
    previewEmails: true,
    compactMode: false,
    aiEnabled: true,
    autoRefresh: true,
    refreshInterval: 5,
  });

  const handleToggle = (key: keyof QuickSettings) => {
    setSettings((prev) => {
      const newValue = !prev[key];
      const labels: Record<string, { on: string; off: string }> = {
        notifications: { on: "Obavijesti uključene", off: "Obavijesti isključene" },
        soundEnabled: { on: "Zvuk uključen", off: "Zvuk isključen" },
        previewEmails: { on: "Pregled emailova uključen", off: "Pregled emailova isključen" },
        compactMode: { on: "Kompaktan prikaz uključen", off: "Normalan prikaz" },
        aiEnabled: { on: "AI značajke uključene", off: "AI značajke isključene" },
        autoRefresh: { on: "Automatsko osvježavanje uključeno", off: "Automatsko osvježavanje isključeno" },
      };

      if (labels[key]) {
        toast.success(newValue ? labels[key].on : labels[key].off);
      }

      return { ...prev, [key]: newValue };
    });
  };

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);

    const labels = {
      light: "Svijetla tema",
      dark: "Tamna tema",
      system: "Sistemska tema",
    };
    toast.success(labels[nextTheme]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel>Brze postavke</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme */}
        <DropdownMenuGroup>
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tema</span>
              </div>
              <Button variant="outline" size="sm" onClick={cycleTheme} className="h-8">
                {getThemeIcon()}
                <span className="ml-2 capitalize">
                  {theme === "system" ? "Auto" : theme === "light" ? "Svijetla" : "Tamna"}
                </span>
              </Button>
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Quick Toggles */}
        <DropdownMenuGroup>
          {/* Notifications */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.notifications ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Obavijesti</span>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleToggle("notifications")}
              />
            </div>
          </div>

          {/* Sound */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Zvuk</span>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={() => handleToggle("soundEnabled")}
              />
            </div>
          </div>

          {/* Email Preview */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.previewEmails ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Pregled emailova</span>
              </div>
              <Switch
                checked={settings.previewEmails}
                onCheckedChange={() => handleToggle("previewEmails")}
              />
            </div>
          </div>

          {/* Compact Mode */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Kompaktan prikaz</span>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={() => handleToggle("compactMode")}
              />
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* AI Settings */}
        <DropdownMenuGroup>
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm">AI značajke</span>
                {settings.aiEnabled && (
                  <Badge className="text-[10px] h-4 bg-purple-500">ON</Badge>
                )}
              </div>
              <Switch
                checked={settings.aiEnabled}
                onCheckedChange={() => handleToggle("aiEnabled")}
              />
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Auto Refresh */}
        <DropdownMenuGroup>
          <div className="px-2 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Automatsko osvježavanje</span>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={() => handleToggle("autoRefresh")}
              />
            </div>
            {settings.autoRefresh && (
              <div className="pl-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Interval</span>
                  <span className="text-xs font-medium">{settings.refreshInterval} min</span>
                </div>
                <Slider
                  value={[settings.refreshInterval]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, refreshInterval: value })
                  }
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Link to Full Settings */}
        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Sve postavke
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default QuickSettingsDropdown;
