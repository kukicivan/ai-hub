import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Languages,
  Globe,
  Calendar,
  Clock,
  DollarSign,
  Check,
  Sparkles,
  Type,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const availableLanguages: Language[] = [
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "sr", name: "Serbian", nativeName: "Srpski", flag: "🇷🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
];

interface LanguageConfig {
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  firstDayOfWeek: "sunday" | "monday";
  numberFormat: string;
  currency: string;
  timezone: string;
  spellCheck: boolean;
  autoTranslate: boolean;
  translateLanguage: string;
}

const dateFormats = [
  { value: "dd.MM.yyyy.", label: "31.12.2024.", example: "31.12.2024." },
  { value: "dd/MM/yyyy", label: "31/12/2024", example: "31/12/2024" },
  { value: "MM/dd/yyyy", label: "12/31/2024", example: "12/31/2024" },
  { value: "yyyy-MM-dd", label: "2024-12-31", example: "2024-12-31" },
];

const currencies = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna (legacy)" },
];

const timezones = [
  { value: "Europe/Zagreb", label: "Zagreb (CET/CEST)", offset: "+1/+2" },
  { value: "Europe/London", label: "London (GMT/BST)", offset: "0/+1" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: "+1/+2" },
  { value: "America/New_York", label: "New York (EST/EDT)", offset: "-5/-4" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: "-8/-7" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "+9" },
];

export function LanguageSettings() {
  const toast = useToast();
  const [config, setConfig] = useState<LanguageConfig>({
    language: "hr",
    dateFormat: "dd.MM.yyyy.",
    timeFormat: "24h",
    firstDayOfWeek: "monday",
    numberFormat: "1.234,56",
    currency: "EUR",
    timezone: "Europe/Zagreb",
    spellCheck: true,
    autoTranslate: false,
    translateLanguage: "en",
  });

  const handleSave = () => {
    toast.success("Jezične postavke spremljene");
  };

  const selectedLanguage = availableLanguages.find((l) => l.code === config.language);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Languages className="h-5 w-5 text-primary" />
              Jezik i regija
            </CardTitle>
            <Button size="sm" onClick={handleSave}>
              Spremi
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Jezik sučelja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  config.language === language.code
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
                onClick={() => setConfig({ ...config, language: language.code })}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{language.flag}</span>
                  {config.language === language.code && (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  )}
                </div>
                <p className="font-medium text-sm">{language.nativeName}</p>
                <p className="text-xs text-muted-foreground">{language.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Datum i vrijeme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Format */}
          <div className="space-y-3">
            <Label>Format datuma</Label>
            <RadioGroup
              value={config.dateFormat}
              onValueChange={(v) => setConfig({ ...config, dateFormat: v })}
              className="grid grid-cols-2 gap-3"
            >
              {dateFormats.map((format) => (
                <div key={format.value}>
                  <RadioGroupItem
                    value={format.value}
                    id={`date-${format.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`date-${format.value}`}
                    className="flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="font-mono">{format.example}</span>
                    {config.dateFormat === format.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Time Format */}
          <div className="space-y-3">
            <Label>Format vremena</Label>
            <RadioGroup
              value={config.timeFormat}
              onValueChange={(v) =>
                setConfig({ ...config, timeFormat: v as "12h" | "24h" })
              }
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem value="24h" id="time-24h" className="peer sr-only" />
                <Label
                  htmlFor="time-24h"
                  className="flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <div>
                    <p className="font-medium">24 sata</p>
                    <p className="text-xs text-muted-foreground">14:30</p>
                  </div>
                  {config.timeFormat === "24h" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="12h" id="time-12h" className="peer sr-only" />
                <Label
                  htmlFor="time-12h"
                  className="flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <div>
                    <p className="font-medium">12 sati</p>
                    <p className="text-xs text-muted-foreground">2:30 PM</p>
                  </div>
                  {config.timeFormat === "12h" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* First Day of Week */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Prvi dan tjedna</Label>
              <p className="text-xs text-muted-foreground">Za kalendar</p>
            </div>
            <Select
              value={config.firstDayOfWeek}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  firstDayOfWeek: v as "sunday" | "monday",
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Ponedjeljak</SelectItem>
                <SelectItem value="sunday">Nedjelja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Vremenska zona</Label>
              <p className="text-xs text-muted-foreground">
                Trenutno: {new Date().toLocaleTimeString("hr-HR")}
              </p>
            </div>
            <Select
              value={config.timezone}
              onValueChange={(v) => setConfig({ ...config, timezone: v })}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{tz.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Numbers & Currency */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Brojevi i valuta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Format brojeva</Label>
              <p className="text-xs text-muted-foreground">
                Decimalni i grupni separator
              </p>
            </div>
            <Select
              value={config.numberFormat}
              onValueChange={(v) => setConfig({ ...config, numberFormat: v })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.234,56">1.234,56</SelectItem>
                <SelectItem value="1,234.56">1,234.56</SelectItem>
                <SelectItem value="1 234,56">1 234,56</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Valuta</Label>
              <p className="text-xs text-muted-foreground">Za prikaz cijena</p>
            </div>
            <Select
              value={config.currency}
              onValueChange={(v) => setConfig({ ...config, currency: v })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <span className="font-mono">{currency.symbol}</span> {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Spell Check & Translation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Provjera pravopisa i prijevod
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Provjera pravopisa</Label>
              <p className="text-xs text-muted-foreground">
                Automatski označavaj pravopisne greške
              </p>
            </div>
            <Switch
              checked={config.spellCheck}
              onCheckedChange={(v) => setConfig({ ...config, spellCheck: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Label>Automatski prijevod</Label>
                <p className="text-xs text-muted-foreground">
                  Prevodite emailove na odabrani jezik
                </p>
              </div>
              <Badge className="bg-purple-500">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>
            <Switch
              checked={config.autoTranslate}
              onCheckedChange={(v) => setConfig({ ...config, autoTranslate: v })}
            />
          </div>

          {config.autoTranslate && (
            <div className="pl-4 border-l-2 border-primary/30">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Jezik prijevoda</Label>
                <Select
                  value={config.translateLanguage}
                  onValueChange={(v) =>
                    setConfig({ ...config, translateLanguage: v })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pregled postavki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p>
              <strong>Jezik:</strong> {selectedLanguage?.nativeName} {selectedLanguage?.flag}
            </p>
            <p>
              <strong>Datum:</strong>{" "}
              {new Date().toLocaleDateString(
                config.language === "hr" ? "hr-HR" : "en-US",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </p>
            <p>
              <strong>Vrijeme:</strong>{" "}
              {new Date().toLocaleTimeString(
                config.language === "hr" ? "hr-HR" : "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: config.timeFormat === "12h",
                }
              )}
            </p>
            <p>
              <strong>Broj:</strong>{" "}
              {config.numberFormat === "1.234,56"
                ? "1.234,56"
                : config.numberFormat === "1,234.56"
                  ? "1,234.56"
                  : "1 234,56"}
            </p>
            <p>
              <strong>Valuta:</strong>{" "}
              {currencies.find((c) => c.code === config.currency)?.symbol}{" "}
              {config.currency}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LanguageSettings;
