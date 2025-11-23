import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Mail,
  Users,
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  HardDrive,
  Cloud,
  Archive,
  Trash2,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface ExportHistory {
  id: string;
  type: "full" | "partial";
  format: string;
  size: string;
  createdAt: Date;
  status: "completed" | "pending" | "failed";
  downloadUrl?: string;
}

const mockExportHistory: ExportHistory[] = [
  {
    id: "1",
    type: "full",
    format: "JSON",
    size: "45.2 MB",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "2",
    type: "partial",
    format: "CSV",
    size: "12.8 MB",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "3",
    type: "full",
    format: "ZIP",
    size: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    status: "pending",
  },
];

interface DataCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  size?: string;
}

const dataCategories: DataCategory[] = [
  {
    id: "emails",
    label: "Emailovi",
    description: "Svi emailovi, privici i oznake",
    icon: <Mail className="h-4 w-4" />,
    count: 15420,
    size: "2.3 GB",
  },
  {
    id: "contacts",
    label: "Kontakti",
    description: "Kontakti i grupe",
    icon: <Users className="h-4 w-4" />,
    count: 847,
    size: "1.2 MB",
  },
  {
    id: "calendar",
    label: "Kalendar",
    description: "Događaji i podsjetnici",
    icon: <Calendar className="h-4 w-4" />,
    count: 234,
    size: "450 KB",
  },
  {
    id: "settings",
    label: "Postavke",
    description: "Konfiguracija i preference",
    icon: <Settings className="h-4 w-4" />,
    size: "12 KB",
  },
];

export function DataImportExport() {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(["emails", "contacts", "calendar", "settings"])
  );
  const [exportFormat, setExportFormat] = useState("json");
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>(mockExportHistory);

  const toggleCategory = (id: string) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCategories(newSelection);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    setIsExporting(false);
    setShowExportDialog(false);
    setExportProgress(0);

    const newExport: ExportHistory = {
      id: Date.now().toString(),
      type: selectedCategories.size === 4 ? "full" : "partial",
      format: exportFormat.toUpperCase(),
      size: "Izračunava se...",
      createdAt: new Date(),
      status: "completed",
      downloadUrl: "#",
    };
    setExportHistory([newExport, ...exportHistory]);

    toast.success("Izvoz podataka završen");
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    setIsImporting(false);
    setShowImportDialog(false);
    setImportProgress(0);
    toast.success("Uvoz podataka završen");
  };

  const handleDeleteExport = (id: string) => {
    setExportHistory((prev) => prev.filter((e) => e.id !== id));
    toast.success("Izvoz obrisan");
  };

  const getStatusBadge = (status: ExportHistory["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Završeno
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            U tijeku
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Neuspjelo
          </Badge>
        );
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "json":
        return <FileJson className="h-4 w-4 text-yellow-500" />;
      case "csv":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const totalSize = "2.4 GB";
  const lastBackup = new Date(Date.now() - 1000 * 60 * 60 * 24);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5 text-primary" />
            Upravljanje podacima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Ukupna veličina</span>
              </div>
              <p className="text-2xl font-bold">{totalSize}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Zadnja sigurnosna kopija</span>
              </div>
              <p className="text-2xl font-bold">
                {format(lastBackup, "dd.MM.", { locale: hr })}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Izvoza</span>
              </div>
              <p className="text-2xl font-bold">{exportHistory.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export/Import Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4" />
              Izvoz podataka
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Preuzmite kopiju svojih podataka u različitim formatima.
              Izvezeni podaci mogu se koristiti za migraciju ili backup.
            </p>
            <Button onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-2" />
              Pokreni izvoz
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Uvoz podataka
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Uvezite podatke iz druge aplikacije ili prethodnog izvoza.
              Podržani formati: JSON, CSV, MBOX.
            </p>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Uvezi podatke
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kategorije podataka</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {dataCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">{category.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.label}</span>
                      {category.size && (
                        <Badge variant="outline" className="text-xs">
                          {category.size}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    {category.count && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.count.toLocaleString()} stavki
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Povijest izvoza
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exportHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nema prethodnih izvoza</p>
            </div>
          ) : (
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getFormatIcon(item.format)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.type === "full" ? "Potpuni izvoz" : "Djelomični izvoz"}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(item.createdAt, "dd.MM.yyyy. HH:mm", { locale: hr })}
                          {item.size !== "pending" && ` • ${item.size}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "completed" && item.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Preuzmi
                        </Button>
                      )}
                      {item.status === "pending" && (
                        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteExport(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Izvoz podataka</DialogTitle>
            <DialogDescription>
              Odaberite koje podatke želite izvesti i format datoteke.
            </DialogDescription>
          </DialogHeader>

          {isExporting ? (
            <div className="py-8 space-y-4">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
                <p className="font-medium">Izvoz u tijeku...</p>
                <p className="text-sm text-muted-foreground">
                  Molimo pričekajte, ovo može potrajati nekoliko minuta
                </p>
              </div>
              <Progress value={exportProgress} />
              <p className="text-center text-sm text-muted-foreground">
                {exportProgress}% završeno
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Odaberite podatke za izvoz
                  </Label>
                  <div className="space-y-2">
                    {dataCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <Checkbox checked={selectedCategories.has(category.id)} />
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span className="text-sm">{category.label}</span>
                        </div>
                        {category.size && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {category.size}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2 block">Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-4 w-4" />
                          JSON (preporučeno)
                        </div>
                      </SelectItem>
                      <SelectItem value="csv">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          CSV (tabele)
                        </div>
                      </SelectItem>
                      <SelectItem value="zip">
                        <div className="flex items-center gap-2">
                          <Archive className="h-4 w-4" />
                          ZIP (sve datoteke)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                  Odustani
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={selectedCategories.size === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Započni izvoz
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Uvoz podataka</DialogTitle>
            <DialogDescription>
              Učitajte datoteku s podacima za uvoz.
            </DialogDescription>
          </DialogHeader>

          {isImporting ? (
            <div className="py-8 space-y-4">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
                <p className="font-medium">Uvoz u tijeku...</p>
                <p className="text-sm text-muted-foreground">
                  Provjeravamo i uvozimo vaše podatke
                </p>
              </div>
              <Progress value={importProgress} />
              <p className="text-center text-sm text-muted-foreground">
                {importProgress}% završeno
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Povucite datoteku ovdje</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    ili kliknite za odabir
                  </p>
                  <Button variant="outline">Odaberi datoteku</Button>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Podržani formati:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">.json</Badge>
                    <Badge variant="outline">.csv</Badge>
                    <Badge variant="outline">.mbox</Badge>
                    <Badge variant="outline">.zip</Badge>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Napomena
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Uvoz velikih datoteka može potrajati. Ne zatvarajte prozor tijekom uvoza.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                  Odustani
                </Button>
                <Button onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Započni uvoz
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataImportExport;
