import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Paperclip,
  Search,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Film,
  Music,
  Archive,
  Cloud,
  Share2,
  Filter,
  Calendar,
  SortAsc,
  SortDesc,
  Grid,
  List,
  HardDrive,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  emailSubject: string;
  emailFrom: string;
  previewUrl?: string;
  downloadUrl: string;
}

const mockAttachments: Attachment[] = [
  {
    id: "1",
    name: "Ponuda_2024_v2.pdf",
    type: "application/pdf",
    size: 2456000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    emailSubject: "Re: Ponuda za projekt",
    emailFrom: "partner@company.com",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "logo_visoka_rezolucija.png",
    type: "image/png",
    size: 1234000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    emailSubject: "Materijali za marketing",
    emailFrom: "marketing@company.hr",
    previewUrl: "https://via.placeholder.com/400x300",
    downloadUrl: "#",
  },
  {
    id: "3",
    name: "Izvještaj_Q3_2024.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 567000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    emailSubject: "Kvartalni izvještaj",
    emailFrom: "financije@company.hr",
    downloadUrl: "#",
  },
  {
    id: "4",
    name: "Prezentacija_proizvoda.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 8900000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    emailSubject: "Novi proizvod - prezentacija",
    emailFrom: "sales@partner.io",
    downloadUrl: "#",
  },
  {
    id: "5",
    name: "ugovor_scan.pdf",
    type: "application/pdf",
    size: 3400000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    emailSubject: "Potpisan ugovor",
    emailFrom: "legal@company.hr",
    downloadUrl: "#",
  },
  {
    id: "6",
    name: "meeting_recording.mp4",
    type: "video/mp4",
    size: 45000000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    emailSubject: "Snimka sastanka",
    emailFrom: "team@company.hr",
    downloadUrl: "#",
  },
  {
    id: "7",
    name: "backup_data.zip",
    type: "application/zip",
    size: 125000000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    emailSubject: "Backup podataka",
    emailFrom: "admin@company.hr",
    downloadUrl: "#",
  },
];

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <Image className="h-5 w-5 text-green-500" />;
  if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  if (type.includes("spreadsheet") || type.includes("excel"))
    return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
  if (type.includes("presentation") || type.includes("powerpoint"))
    return <FileText className="h-5 w-5 text-orange-500" />;
  if (type.startsWith("video/")) return <Film className="h-5 w-5 text-purple-500" />;
  if (type.startsWith("audio/")) return <Music className="h-5 w-5 text-pink-500" />;
  if (type.includes("zip") || type.includes("archive"))
    return <Archive className="h-5 w-5 text-yellow-600" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

type ViewMode = "list" | "grid";
type SortBy = "date" | "name" | "size";

export function AttachmentManager() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const totalSize = mockAttachments.reduce((acc, a) => acc + a.size, 0);
  const usedPercentage = Math.min((totalSize / (1024 * 1024 * 1024)) * 100, 100);

  const fileTypes = [
    { value: "image", label: "Slike", icon: Image },
    { value: "pdf", label: "PDF", icon: FileText },
    { value: "spreadsheet", label: "Tablice", icon: FileSpreadsheet },
    { value: "video", label: "Video", icon: Film },
    { value: "archive", label: "Arhive", icon: Archive },
  ];

  const filteredAttachments = mockAttachments
    .filter((attachment) => {
      const matchesSearch =
        searchQuery === "" ||
        attachment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attachment.emailSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attachment.emailFrom.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === null ||
        (selectedType === "image" && attachment.type.startsWith("image/")) ||
        (selectedType === "pdf" && attachment.type.includes("pdf")) ||
        (selectedType === "spreadsheet" &&
          (attachment.type.includes("spreadsheet") || attachment.type.includes("excel"))) ||
        (selectedType === "video" && attachment.type.startsWith("video/")) ||
        (selectedType === "archive" &&
          (attachment.type.includes("zip") || attachment.type.includes("archive")));

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = b.uploadedAt.getTime() - a.uploadedAt.getTime();
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = b.size - a.size;
          break;
      }
      return sortAsc ? -comparison : comparison;
    });

  const handleDownload = (attachment: Attachment) => {
    toast.success(`Preuzimanje: ${attachment.name}`);
  };

  const handleDelete = (id: string) => {
    toast.success("Privitak obrisan");
  };

  const handleSaveToCloud = (attachment: Attachment) => {
    toast.success(`Spremljeno na cloud: ${attachment.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5 text-primary" />
            Pohrana privitaka
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Iskorišteno: {formatFileSize(totalSize)} od 1 GB
            </span>
            <span className="text-sm font-medium">{usedPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usedPercentage} className="h-2" />
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>PDF ({mockAttachments.filter((a) => a.type.includes("pdf")).length})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Slike ({mockAttachments.filter((a) => a.type.startsWith("image/")).length})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Video ({mockAttachments.filter((a) => a.type.startsWith("video/")).length})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Ostalo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži privitke..."
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedType === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                Sve
              </Button>
              {fileTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  <type.icon className="h-4 w-4 mr-1" />
                  {type.label}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortAsc ? <SortAsc className="h-4 w-4 mr-1" /> : <SortDesc className="h-4 w-4 mr-1" />}
                    Sortiraj
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Po datumu {sortBy === "date" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Po imenu {sortBy === "name" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("size")}>
                    <HardDrive className="h-4 w-4 mr-2" />
                    Po veličini {sortBy === "size" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortAsc(!sortAsc)}>
                    {sortAsc ? "Silazno" : "Uzlazno"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments List/Grid */}
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px]">
            {viewMode === "list" ? (
              <div className="space-y-2">
                {filteredAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 bg-muted rounded-lg">
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {attachment.emailSubject} • {attachment.emailFrom}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{formatFileSize(attachment.size)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(attachment.uploadedAt, "d MMM", { locale: hr })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {attachment.previewUrl && (
                          <DropdownMenuItem onClick={() => setPreviewAttachment(attachment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Pregled
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDownload(attachment)}>
                          <Download className="h-4 w-4 mr-2" />
                          Preuzmi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSaveToCloud(attachment)}>
                          <Cloud className="h-4 w-4 mr-2" />
                          Spremi na cloud
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Dijeli
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(attachment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="aspect-square flex items-center justify-center bg-muted rounded-lg mb-3">
                      {attachment.previewUrl ? (
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="scale-150">
                          {getFileIcon(attachment.type)}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm truncate" title={attachment.name}>
                      {attachment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleDownload(attachment)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {attachment.previewUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setPreviewAttachment(attachment)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleDelete(attachment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAttachments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Paperclip className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nema privitaka</p>
                <p className="text-xs mt-1">
                  Privici iz vaših emailova pojavit će se ovdje
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewAttachment} onOpenChange={() => setPreviewAttachment(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAttachment?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewAttachment?.previewUrl && (
              <img
                src={previewAttachment.previewUrl}
                alt={previewAttachment.name}
                className="w-full rounded-lg"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewAttachment(null)}>
              Zatvori
            </Button>
            <Button onClick={() => previewAttachment && handleDownload(previewAttachment)}>
              <Download className="h-4 w-4 mr-2" />
              Preuzmi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AttachmentManager;
