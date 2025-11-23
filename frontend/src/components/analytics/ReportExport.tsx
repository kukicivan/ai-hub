import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  Table,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Mail,
  BarChart,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

type ExportFormat = "pdf" | "csv" | "xlsx";
type DateRange = "7d" | "30d" | "90d" | "custom";

interface ReportSection {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  included: boolean;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  format: ExportFormat;
  lastGenerated?: Date;
  nextGeneration?: Date;
  enabled: boolean;
}

export function ReportExport() {
  const toast = useToast();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [customStartDate, setCustomStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const [sections, setSections] = useState<ReportSection[]>([
    {
      id: "overview",
      label: "Pregled",
      description: "Ukupna statistika emailova i aktivnosti",
      icon: <BarChart className="h-4 w-4" />,
      included: true,
    },
    {
      id: "emails",
      label: "Email analiza",
      description: "Detaljna analiza primljenih i poslanih emailova",
      icon: <Mail className="h-4 w-4" />,
      included: true,
    },
    {
      id: "productivity",
      label: "Produktivnost",
      description: "Vrijeme odgovora, uštede vremena, učinkovitost",
      icon: <TrendingUp className="h-4 w-4" />,
      included: true,
    },
    {
      id: "contacts",
      label: "Kontakti",
      description: "Top pošiljatelji, VIP kontakti, interakcije",
      icon: <Users className="h-4 w-4" />,
      included: false,
    },
    {
      id: "ai",
      label: "AI aktivnost",
      description: "AI analize, prijedlozi, generirani odgovori",
      icon: <Sparkles className="h-4 w-4" />,
      included: true,
    },
    {
      id: "timeline",
      label: "Vremenska linija",
      description: "Detaljna aktivnost po danima/satima",
      icon: <Clock className="h-4 w-4" />,
      included: false,
    },
  ]);

  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Tjedni pregled",
      frequency: "weekly",
      format: "pdf",
      lastGenerated: subDays(new Date(), 2),
      nextGeneration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      enabled: true,
    },
    {
      id: "2",
      name: "Mjesečni izvještaj",
      frequency: "monthly",
      format: "xlsx",
      lastGenerated: subDays(new Date(), 15),
      nextGeneration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      enabled: true,
    },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, included: !s.included } : s))
    );
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "7d":
        return "Zadnjih 7 dana";
      case "30d":
        return "Zadnjih 30 dana";
      case "90d":
        return "Zadnjih 90 dana";
      case "custom":
        return `${format(customStartDate, "d MMM", { locale: hr })} - ${format(customEndDate, "d MMM yyyy", { locale: hr })}`;
    }
  };

  const handleExport = async () => {
    const includedSections = sections.filter((s) => s.included);
    if (includedSections.length === 0) {
      toast.error("Odaberite barem jednu sekciju za izvoz");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    setIsExporting(false);
    setExportProgress(0);
    toast.success(`Izvještaj uspješno generiran (${exportFormat.toUpperCase()})`);
  };

  const handleToggleScheduledReport = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteScheduledReport = (id: string) => {
    setScheduledReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Zakazani izvještaj obrisan");
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "csv":
        return <Table className="h-4 w-4 text-green-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    }
  };

  const getFrequencyLabel = (frequency: ScheduledReport["frequency"]) => {
    switch (frequency) {
      case "daily":
        return "Dnevno";
      case "weekly":
        return "Tjedno";
      case "monthly":
        return "Mjesečno";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Izvoz izvještaja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div>
            <Label className="mb-2 block">Vremenski raspon</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "7d", label: "7 dana" },
                { value: "30d", label: "30 dana" },
                { value: "90d", label: "90 dana" },
                { value: "custom", label: "Prilagođeno" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={dateRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange(option.value as DateRange)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {dateRange === "custom" && (
              <div className="flex items-center gap-2 mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(customStartDate, "d MMM yyyy", { locale: hr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={(date) => date && setCustomStartDate(date)}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">do</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(customEndDate, "d MMM yyyy", { locale: hr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={(date) => date && setCustomEndDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div>
            <Label className="mb-2 block">Format izvještaja</Label>
            <div className="flex gap-2">
              {[
                { value: "pdf", label: "PDF", icon: FileText, color: "text-red-500" },
                { value: "csv", label: "CSV", icon: Table, color: "text-green-500" },
                { value: "xlsx", label: "Excel", icon: FileSpreadsheet, color: "text-green-600" },
              ].map((format) => (
                <Button
                  key={format.value}
                  variant={exportFormat === format.value ? "default" : "outline"}
                  onClick={() => setExportFormat(format.value as ExportFormat)}
                  className="flex items-center gap-2"
                >
                  <format.icon className={cn("h-4 w-4", exportFormat !== format.value && format.color)} />
                  {format.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sections to Include */}
          <div>
            <Label className="mb-2 block">Sadržaj izvještaja</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={cn(
                    "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                    section.included
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  )}
                  onClick={() => toggleSection(section.id)}
                >
                  <Checkbox checked={section.included} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span className="font-medium text-sm">{section.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generiranje izvještaja...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          {/* Export Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{getDateRangeLabel()}</span>
              <span className="mx-2">•</span>
              <span>{sections.filter((s) => s.included).length} sekcija</span>
            </div>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generiranje...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generiraj izvještaj
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Zakazani izvještaji
            </CardTitle>
            <Button size="sm" onClick={() => setShowScheduleDialog(true)}>
              Zakaži novi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scheduledReports.length > 0 ? (
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <div
                  key={report.id}
                  className={cn(
                    "p-4 border rounded-lg",
                    report.enabled ? "border-primary/30" : "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getFormatIcon(report.format)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{report.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {getFrequencyLabel(report.frequency)}
                          </Badge>
                          {report.enabled && (
                            <Badge className="text-xs bg-green-500">Aktivno</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          {report.lastGenerated && (
                            <span>
                              Zadnje: {format(report.lastGenerated, "d MMM yyyy", { locale: hr })}
                            </span>
                          )}
                          {report.nextGeneration && report.enabled && (
                            <span>
                              Sljedeće: {format(report.nextGeneration, "d MMM yyyy", { locale: hr })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={report.enabled}
                        onCheckedChange={() => handleToggleScheduledReport(report.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteScheduledReport(report.id)}
                      >
                        Obriši
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nema zakazanih izvještaja</p>
              <p className="text-xs mt-1">
                Zakazani izvještaji automatski se generiraju i šalju na email
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nedavni izvještaji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                name: "Izvještaj_30d_2024-11-01.pdf",
                date: subDays(new Date(), 5),
                size: "1.2 MB",
                status: "ready",
              },
              {
                name: "Izvještaj_tjedni_2024-10-28.xlsx",
                date: subDays(new Date(), 10),
                size: "856 KB",
                status: "ready",
              },
              {
                name: "Izvještaj_90d_2024-10-15.pdf",
                date: subDays(new Date(), 20),
                size: "2.4 MB",
                status: "ready",
              },
            ].map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {report.name.endsWith(".pdf") ? (
                    <FileText className="h-5 w-5 text-red-500" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(report.date, "d MMM yyyy", { locale: hr })} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zakaži novi izvještaj</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Naziv izvještaja</Label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Npr. Mjesečni pregled"
              />
            </div>
            <div>
              <Label>Učestalost</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Dnevno</SelectItem>
                  <SelectItem value="weekly">Tjedno</SelectItem>
                  <SelectItem value="monthly">Mjesečno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Pošalji na email</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Odustani
            </Button>
            <Button
              onClick={() => {
                toast.success("Izvještaj zakazan");
                setShowScheduleDialog(false);
              }}
            >
              Zakaži
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReportExport;
