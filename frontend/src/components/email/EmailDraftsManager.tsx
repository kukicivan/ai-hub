import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileEdit,
  Search,
  MoreVertical,
  Trash2,
  Send,
  Clock,
  Edit,
  Copy,
  Calendar,
  Paperclip,
  AlertCircle,
  RefreshCw,
  SortAsc,
  SortDesc,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Draft {
  id: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachments: { name: string; size: number }[];
  createdAt: Date;
  updatedAt: Date;
  autoSaved: boolean;
  scheduledFor?: Date;
}

const mockDrafts: Draft[] = [
  {
    id: "1",
    to: ["marko.horvat@example.com"],
    subject: "Prijedlog za novi projekt",
    body: "Poštovani Marko,\n\nŽelio bih vam predstaviti prijedlog za novi projekt...",
    attachments: [{ name: "prijedlog.pdf", size: 2500000 }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    autoSaved: true,
  },
  {
    id: "2",
    to: ["ana.kovac@example.com", "ivan.babic@example.com"],
    cc: ["petra.novak@example.com"],
    subject: "Sastanak tima - ponedjeljak",
    body: "Dragi kolege,\n\nPodsjećam vas na sastanak...",
    attachments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    autoSaved: false,
  },
  {
    id: "3",
    to: [],
    subject: "",
    body: "Napomene za izvještaj:\n- Povećanje produktivnosti\n- Novi KPI...",
    attachments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    autoSaved: true,
  },
  {
    id: "4",
    to: ["klijent@firma.hr"],
    subject: "Re: Ponuda za usluge",
    body: "Hvala na upitu. U privitku šaljem...",
    attachments: [
      { name: "ponuda_2024.xlsx", size: 150000 },
      { name: "prezentacija.pptx", size: 5000000 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    autoSaved: false,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
];

export function EmailDraftsManager() {
  const toast = useToast();
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null);

  const filteredDrafts = drafts
    .filter((draft) => {
      const query = searchQuery.toLowerCase();
      return (
        draft.subject.toLowerCase().includes(query) ||
        draft.body.toLowerCase().includes(query) ||
        draft.to.some((email) => email.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      const dateA = a.updatedAt.getTime();
      const dateB = b.updatedAt.getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedDrafts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDrafts(newSelection);
  };

  const selectAll = () => {
    if (selectedDrafts.size === filteredDrafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(filteredDrafts.map((d) => d.id)));
    }
  };

  const handleEdit = (draft: Draft) => {
    toast.info(`Otvaranje skice: ${draft.subject || "(Bez predmeta)"}`);
  };

  const handleSend = (draft: Draft) => {
    if (draft.to.length === 0) {
      toast.error("Dodajte primatelja prije slanja");
      return;
    }
    toast.success("Email poslan");
    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
  };

  const handleDelete = (id: string) => {
    setDeletingDraftId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingDraftId) {
      setDrafts((prev) => prev.filter((d) => d.id !== deletingDraftId));
      selectedDrafts.delete(deletingDraftId);
      setSelectedDrafts(new Set(selectedDrafts));
      toast.success("Skica obrisana");
    }
    setShowDeleteDialog(false);
    setDeletingDraftId(null);
  };

  const handleBulkDelete = () => {
    if (selectedDrafts.size === 0) return;
    setDrafts((prev) => prev.filter((d) => !selectedDrafts.has(d.id)));
    toast.success(`Obrisano ${selectedDrafts.size} skica`);
    setSelectedDrafts(new Set());
  };

  const handleDuplicate = (draft: Draft) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      autoSaved: false,
      scheduledFor: undefined,
    };
    setDrafts((prev) => [newDraft, ...prev]);
    toast.success("Skica duplicirana");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTotalAttachmentsSize = (attachments: Draft["attachments"]): number => {
    return attachments.reduce((sum, att) => sum + att.size, 0);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileEdit className="h-5 w-5 text-primary" />
            Skice
            <Badge variant="secondary">{drafts.length}</Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Osvježi
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži skice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
            title={sortOrder === "desc" ? "Najnovije prvo" : "Najstarije prvo"}
          >
            {sortOrder === "desc" ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <SortAsc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedDrafts.size > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedDrafts.size === filteredDrafts.length ? (
                <CheckSquare className="h-4 w-4 mr-1" />
              ) : (
                <Square className="h-4 w-4 mr-1" />
              )}
              {selectedDrafts.size} odabrano
            </Button>
            <div className="flex-1" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Obriši odabrano
            </Button>
          </div>
        )}

        {/* Drafts List */}
        <ScrollArea className="h-[400px]">
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileEdit className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nema skica</p>
              <p className="text-sm">Nedovršeni emailovi će se pojaviti ovdje</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                    selectedDrafts.has(draft.id) ? "bg-primary/5 border-primary/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      className="mt-1"
                      onClick={() => toggleSelection(draft.id)}
                    >
                      {selectedDrafts.has(draft.id) ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleEdit(draft)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {draft.to.length > 0 ? (
                          <span className="font-medium truncate">
                            {draft.to.join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            Bez primatelja
                          </span>
                        )}
                        {draft.cc && draft.cc.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{draft.cc.length} CC
                          </Badge>
                        )}
                      </div>

                      <p className="font-medium text-sm mb-1">
                        {draft.subject || (
                          <span className="text-muted-foreground italic">
                            (Bez predmeta)
                          </span>
                        )}
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {draft.body.split("\n")[0]}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(draft.updatedAt, {
                            addSuffix: true,
                            locale: hr,
                          })}
                        </span>

                        {draft.attachments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {draft.attachments.length} (
                            {formatFileSize(getTotalAttachmentsSize(draft.attachments))})
                          </span>
                        )}

                        {draft.autoSaved && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-spremljeno
                          </Badge>
                        )}

                        {draft.scheduledFor && (
                          <Badge className="text-xs bg-blue-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Zakazano: {format(draft.scheduledFor, "dd.MM. HH:mm", { locale: hr })}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(draft)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Uredi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSend(draft)}>
                          <Send className="h-4 w-4 mr-2" />
                          Pošalji odmah
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(draft)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliciraj
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(draft.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer Info */}
        {drafts.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>
              {filteredDrafts.length} od {drafts.length} skica
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Skice se automatski spremaju svakih 30 sekundi
            </span>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Obriši skicu</DialogTitle>
              <DialogDescription>
                Jeste li sigurni da želite obrisati ovu skicu? Ova radnja se ne može poništiti.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Odustani
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Obriši
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default EmailDraftsManager;
