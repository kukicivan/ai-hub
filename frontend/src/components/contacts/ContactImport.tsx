import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  ChevronRight,
  Mail,
  User,
  Phone,
  Building,
  MapPin,
  Tag,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImportedContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "valid" | "duplicate" | "invalid" | "pending";
  errors?: string[];
}

type ImportStep = "upload" | "mapping" | "preview" | "importing" | "complete";

const supportedFormats = [
  { id: "csv", name: "CSV", extension: ".csv" },
  { id: "vcf", name: "vCard", extension: ".vcf" },
  { id: "xlsx", name: "Excel", extension: ".xlsx" },
  { id: "google", name: "Google Contacts", icon: "🔵" },
  { id: "outlook", name: "Outlook", icon: "🔷" },
];

const mockImportedContacts: ImportedContact[] = [
  { id: "1", name: "Marko Horvat", email: "marko@example.com", phone: "+385 91 123 4567", company: "Tech d.o.o.", status: "valid" },
  { id: "2", name: "Ana Kovač", email: "ana@example.com", company: "Design Studio", status: "valid" },
  { id: "3", name: "Ivan Perić", email: "ivan@company.com", status: "duplicate", errors: ["Kontakt već postoji"] },
  { id: "4", name: "", email: "invalid-email", status: "invalid", errors: ["Nedostaje ime", "Neispravan email format"] },
  { id: "5", name: "Petra Babić", email: "petra@example.com", phone: "+385 98 765 4321", status: "valid" },
  { id: "6", name: "Luka Matić", email: "luka@startup.hr", company: "StartUp d.o.o.", status: "valid" },
];

export function ContactImport() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contacts, setContacts] = useState<ImportedContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [fieldMapping, setFieldMapping] = useState({
    name: "name",
    email: "email",
    phone: "phone",
    company: "company",
  });
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    // Simulate file processing
    setStep("mapping");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setContacts(mockImportedContacts);

    // Auto-select valid contacts
    const validIds = mockImportedContacts
      .filter((c) => c.status === "valid")
      .map((c) => c.id);
    setSelectedContacts(new Set(validIds));
  };

  const handleConnectService = (serviceId: string) => {
    toast({
      title: "Povezivanje...",
      description: `Pokušavam se povezati s ${serviceId}...`,
    });
    // Simulate OAuth flow
    setTimeout(() => {
      setContacts(mockImportedContacts);
      setStep("preview");
      const validIds = mockImportedContacts
        .filter((c) => c.status === "valid")
        .map((c) => c.id);
      setSelectedContacts(new Set(validIds));
    }, 1500);
  };

  const handleImport = async () => {
    setStep("importing");
    const total = selectedContacts.size;

    for (let i = 0; i <= total; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress((i / total) * 100);
    }

    setStep("complete");
    toast({
      title: "Uvoz završen",
      description: `Uspješno uvezeno ${selectedContacts.size} kontakata`,
    });
  };

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const validIds = contacts.filter((c) => c.status === "valid").map((c) => c.id);
    setSelectedContacts(new Set(validIds));
  };

  const deselectAll = () => {
    setSelectedContacts(new Set());
  };

  const getStatusBadge = (status: ImportedContact["status"]) => {
    switch (status) {
      case "valid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ispravan
          </Badge>
        );
      case "duplicate":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Duplikat
          </Badge>
        );
      case "invalid":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Neispravan
          </Badge>
        );
      default:
        return null;
    }
  };

  const validCount = contacts.filter((c) => c.status === "valid").length;
  const duplicateCount = contacts.filter((c) => c.status === "duplicate").length;
  const invalidCount = contacts.filter((c) => c.status === "invalid").length;

  const renderUploadStep = () => (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">
          Povucite datoteku ovdje ili kliknite za odabir
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Podržani formati: CSV, vCard (.vcf), Excel (.xlsx)
        </p>
        <input
          type="file"
          accept=".csv,.vcf,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Odaberi datoteku
          </label>
        </Button>
      </div>

      {/* Or connect services */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ili poveži servis
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {supportedFormats
          .filter((f) => f.icon)
          .map((format) => (
            <Button
              key={format.id}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleConnectService(format.id)}
            >
              <span className="text-2xl">{format.icon}</span>
              <span>{format.name}</span>
            </Button>
          ))}
      </div>
    </div>
  );

  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Datoteka:</span> {file?.name}
        </p>
        <p className="text-sm text-muted-foreground">
          Pronađeno {contacts.length} kontakata
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Mapiranje polja</h4>
        <div className="grid gap-4">
          {[
            { key: "name", label: "Ime", icon: User },
            { key: "email", label: "Email", icon: Mail },
            { key: "phone", label: "Telefon", icon: Phone },
            { key: "company", label: "Tvrtka", icon: Building },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Select
                value={fieldMapping[key as keyof typeof fieldMapping]}
                onValueChange={(value) =>
                  setFieldMapping((prev) => ({ ...prev, [key]: value }))
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                  <SelectItem value="skip">Preskoči</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={() => setStep("preview")}>
        Nastavi na pregled
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{validCount}</div>
          <p className="text-sm text-green-700 dark:text-green-300">Ispravnih</p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{duplicateCount}</div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Duplikata</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
          <p className="text-sm text-red-700 dark:text-red-300">Neispravnih</p>
        </div>
      </div>

      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Odabrano: {selectedContacts.size} od {validCount}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Odaberi sve
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            Poništi odabir
          </Button>
        </div>
      </div>

      {/* Contact list */}
      <ScrollArea className="h-[300px] border rounded-lg">
        <div className="p-2 space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                contact.status === "valid"
                  ? "hover:bg-muted cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              )}
              onClick={() =>
                contact.status === "valid" && toggleContact(contact.id)
              }
            >
              {contact.status === "valid" && (
                <Checkbox
                  checked={selectedContacts.has(contact.id)}
                  onCheckedChange={() => toggleContact(contact.id)}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {contact.name || "(Bez imena)"}
                  </span>
                  {getStatusBadge(contact.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.email}
                </p>
                {contact.errors && (
                  <p className="text-xs text-red-500 mt-1">
                    {contact.errors.join(", ")}
                  </p>
                )}
              </div>
              {contact.company && (
                <Badge variant="secondary" className="text-xs">
                  {contact.company}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        className="w-full"
        onClick={handleImport}
        disabled={selectedContacts.size === 0}
      >
        <Users className="h-4 w-4 mr-2" />
        Uvezi {selectedContacts.size} kontakata
      </Button>
    </div>
  );

  const renderImportingStep = () => (
    <div className="py-8 text-center space-y-4">
      <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
      <h3 className="font-medium">Uvozim kontakte...</h3>
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-muted-foreground">
        {Math.round(progress)}% završeno
      </p>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="py-8 text-center space-y-4">
      <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 w-fit mx-auto">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-lg font-semibold">Uvoz završen!</h3>
      <p className="text-muted-foreground">
        Uspješno ste uvezli {selectedContacts.size} kontakata
      </p>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setStep("upload");
            setFile(null);
            setContacts([]);
            setSelectedContacts(new Set());
            setProgress(0);
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Uvezi još
        </Button>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Pregledaj kontakte
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Uvoz kontakata
        </CardTitle>
        <CardDescription>
          Uvezite kontakte iz datoteke ili drugih servisa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "upload" && renderUploadStep()}
        {step === "mapping" && renderMappingStep()}
        {step === "preview" && renderPreviewStep()}
        {step === "importing" && renderImportingStep()}
        {step === "complete" && renderCompleteStep()}
      </CardContent>
    </Card>
  );
}

export default ContactImport;
