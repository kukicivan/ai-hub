import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Sparkles,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface EmailLabel {
  id: string;
  name: string;
  color: string;
  emailCount: number;
  isAIGenerated?: boolean;
}

const colorOptions = [
  { name: "Crvena", value: "bg-red-500" },
  { name: "Narančasta", value: "bg-orange-500" },
  { name: "Žuta", value: "bg-yellow-500" },
  { name: "Zelena", value: "bg-green-500" },
  { name: "Plava", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Ljubičasta", value: "bg-purple-500" },
  { name: "Roza", value: "bg-pink-500" },
  { name: "Siva", value: "bg-gray-500" },
];

// Mock labels - would come from API
const mockLabels: EmailLabel[] = [
  { id: "1", name: "Klijenti", color: "bg-blue-500", emailCount: 45 },
  { id: "2", name: "Partneri", color: "bg-green-500", emailCount: 23 },
  { id: "3", name: "Hitno", color: "bg-red-500", emailCount: 12 },
  { id: "4", name: "Financije", color: "bg-yellow-500", emailCount: 18 },
  { id: "5", name: "Marketing", color: "bg-purple-500", emailCount: 34, isAIGenerated: true },
  { id: "6", name: "Podrška", color: "bg-orange-500", emailCount: 28 },
  { id: "7", name: "Projekti", color: "bg-indigo-500", emailCount: 15 },
  { id: "8", name: "Newsletter", color: "bg-gray-500", emailCount: 67, isAIGenerated: true },
];

interface EmailLabelsManagerProps {
  selectedLabels?: string[];
  onLabelsChange?: (labels: string[]) => void;
  mode?: "manage" | "select";
}

export function EmailLabelsManager({
  selectedLabels = [],
  onLabelsChange,
  mode = "manage",
}: EmailLabelsManagerProps) {
  const toast = useToast();
  const [labels, setLabels] = useState<EmailLabel[]>(mockLabels);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<EmailLabel | null>(null);
  const [newLabel, setNewLabel] = useState({ name: "", color: "bg-blue-500" });

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLabel = () => {
    if (!newLabel.name.trim()) {
      toast.error("Unesite naziv oznake");
      return;
    }

    const label: EmailLabel = {
      id: Date.now().toString(),
      name: newLabel.name,
      color: newLabel.color,
      emailCount: 0,
    };

    setLabels((prev) => [...prev, label]);
    setNewLabel({ name: "", color: "bg-blue-500" });
    setIsCreateDialogOpen(false);
    toast.success("Oznaka kreirana");
  };

  const handleUpdateLabel = () => {
    if (!editingLabel || !newLabel.name.trim()) return;

    setLabels((prev) =>
      prev.map((l) =>
        l.id === editingLabel.id
          ? { ...l, name: newLabel.name, color: newLabel.color }
          : l
      )
    );
    setEditingLabel(null);
    setNewLabel({ name: "", color: "bg-blue-500" });
    toast.success("Oznaka ažurirana");
  };

  const handleDeleteLabel = (id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    toast.success("Oznaka obrisana");
  };

  const handleSelectLabel = (labelId: string) => {
    if (!onLabelsChange) return;

    const newSelected = selectedLabels.includes(labelId)
      ? selectedLabels.filter((id) => id !== labelId)
      : [...selectedLabels, labelId];

    onLabelsChange(newSelected);
  };

  const openEditDialog = (label: EmailLabel) => {
    setEditingLabel(label);
    setNewLabel({ name: label.name, color: label.color });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            {mode === "manage" ? "Upravljanje oznakama" : "Odaberi oznake"}
          </CardTitle>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pretraži oznake..."
          className="h-9"
        />

        {/* Labels List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {filteredLabels.map((label) => (
              <div
                key={label.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  mode === "select" && selectedLabels.includes(label.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                } ${mode === "select" ? "cursor-pointer" : ""}`}
                onClick={() => mode === "select" && handleSelectLabel(label.id)}
              >
                <div className="flex items-center gap-3">
                  {mode === "select" && (
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedLabels.includes(label.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedLabels.includes(label.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  )}
                  <div className={`w-3 h-3 rounded-full ${label.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{label.name}</span>
                      {label.isAIGenerated && (
                        <Badge variant="secondary" className="text-xs gap-1 h-5">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {label.emailCount} emailova
                    </span>
                  </div>
                </div>

                {mode === "manage" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(label)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Uredi
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteLabel(label.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Obriši
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}

            {filteredLabels.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nema oznaka</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* AI Suggestion */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
              AI preporuka
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            AI je automatski kreirao oznake "Marketing" i "Newsletter" na temelju
            sadržaja emailova.
          </p>
        </div>
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || !!editingLabel}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingLabel(null);
            setNewLabel({ name: "", color: "bg-blue-500" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLabel ? "Uredi oznaku" : "Nova oznaka"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Naziv</Label>
              <Input
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                placeholder="Naziv oznake"
              />
            </div>
            <div>
              <Label>Boja</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewLabel({ ...newLabel, color: color.value })}
                    className={`w-8 h-8 rounded-full ${color.value} ${
                      newLabel.color === color.value
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${newLabel.color}`} />
              <span className="text-sm">
                {newLabel.name || "Pregled oznake"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingLabel(null);
                setNewLabel({ name: "", color: "bg-blue-500" });
              }}
            >
              Odustani
            </Button>
            <Button onClick={editingLabel ? handleUpdateLabel : handleCreateLabel}>
              {editingLabel ? "Spremi" : "Kreiraj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EmailLabelsManager;
