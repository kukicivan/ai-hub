import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Mail,
  Archive,
  Star,
  Tag,
  Folder,
  AlertCircle,
  Sparkles,
  GripVertical,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface EmailRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: RuleCondition[];
  conditionOperator: "all" | "any";
  actions: RuleAction[];
  isAIGenerated?: boolean;
  matchCount?: number;
}

interface RuleCondition {
  id: string;
  field: "from" | "to" | "subject" | "body" | "has_attachment" | "size";
  operator: "contains" | "not_contains" | "equals" | "starts_with" | "ends_with" | "greater_than" | "less_than";
  value: string;
}

interface RuleAction {
  id: string;
  type: "move_to" | "add_label" | "mark_as" | "forward" | "archive" | "delete" | "star";
  value?: string;
}

const fieldOptions = [
  { value: "from", label: "Pošiljatelj" },
  { value: "to", label: "Primatelj" },
  { value: "subject", label: "Predmet" },
  { value: "body", label: "Sadržaj" },
  { value: "has_attachment", label: "Ima privitak" },
  { value: "size", label: "Veličina" },
];

const operatorOptions = [
  { value: "contains", label: "sadrži" },
  { value: "not_contains", label: "ne sadrži" },
  { value: "equals", label: "jednako" },
  { value: "starts_with", label: "počinje s" },
  { value: "ends_with", label: "završava s" },
  { value: "greater_than", label: "veće od" },
  { value: "less_than", label: "manje od" },
];

const actionOptions = [
  { value: "move_to", label: "Premjesti u", icon: Folder },
  { value: "add_label", label: "Dodaj oznaku", icon: Tag },
  { value: "mark_as", label: "Označi kao", icon: Mail },
  { value: "forward", label: "Proslijedi na", icon: ArrowRight },
  { value: "archive", label: "Arhiviraj", icon: Archive },
  { value: "delete", label: "Obriši", icon: Trash2 },
  { value: "star", label: "Dodaj zvjezdicu", icon: Star },
];

const folderOptions = ["Inbox", "Projekti", "Fakture", "Newsletter", "Osobno"];
const labelOptions = ["Važno", "Posao", "Osobno", "Fakture", "Newsletter"];

export function EmailRulesManager() {
  const toast = useToast();
  const [rules, setRules] = useState<EmailRule[]>([
    {
      id: "1",
      name: "Fakture u mapu Fakture",
      enabled: true,
      conditions: [
        { id: "c1", field: "subject", operator: "contains", value: "faktura" },
        { id: "c2", field: "subject", operator: "contains", value: "račun" },
      ],
      conditionOperator: "any",
      actions: [
        { id: "a1", type: "move_to", value: "Fakture" },
        { id: "a2", type: "add_label", value: "Fakture" },
      ],
      matchCount: 47,
    },
    {
      id: "2",
      name: "Newsletter arhiviraj",
      enabled: true,
      conditions: [
        { id: "c1", field: "from", operator: "contains", value: "newsletter" },
      ],
      conditionOperator: "all",
      actions: [
        { id: "a1", type: "move_to", value: "Newsletter" },
        { id: "a2", type: "mark_as", value: "read" },
      ],
      isAIGenerated: true,
      matchCount: 156,
    },
    {
      id: "3",
      name: "VIP pošiljatelji",
      enabled: false,
      conditions: [
        { id: "c1", field: "from", operator: "contains", value: "@partner.com" },
      ],
      conditionOperator: "all",
      actions: [
        { id: "a1", type: "star" },
        { id: "a2", type: "add_label", value: "Važno" },
      ],
      matchCount: 23,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EmailRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<EmailRule>>({
    name: "",
    enabled: true,
    conditions: [{ id: "new-c1", field: "from", operator: "contains", value: "" }],
    conditionOperator: "all",
    actions: [{ id: "new-a1", type: "move_to", value: "" }],
  });

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Pravilo obrisano");
  };

  const handleDuplicateRule = (rule: EmailRule) => {
    const newRuleCopy: EmailRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (kopija)`,
      enabled: false,
      matchCount: 0,
    };
    setRules((prev) => [...prev, newRuleCopy]);
    toast.success("Pravilo duplicirano");
  };

  const handleEditRule = (rule: EmailRule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setIsDialogOpen(true);
  };

  const handleAddCondition = () => {
    setNewRule((prev) => ({
      ...prev,
      conditions: [
        ...(prev.conditions || []),
        { id: `new-c${Date.now()}`, field: "from", operator: "contains", value: "" },
      ],
    }));
  };

  const handleRemoveCondition = (id: string) => {
    setNewRule((prev) => ({
      ...prev,
      conditions: prev.conditions?.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setNewRule((prev) => ({
      ...prev,
      conditions: prev.conditions?.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const handleAddAction = () => {
    setNewRule((prev) => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        { id: `new-a${Date.now()}`, type: "add_label", value: "" },
      ],
    }));
  };

  const handleRemoveAction = (id: string) => {
    setNewRule((prev) => ({
      ...prev,
      actions: prev.actions?.filter((a) => a.id !== id),
    }));
  };

  const handleUpdateAction = (id: string, updates: Partial<RuleAction>) => {
    setNewRule((prev) => ({
      ...prev,
      actions: prev.actions?.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  };

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.conditions?.length || !newRule.actions?.length) {
      toast.error("Unesite sve potrebne podatke");
      return;
    }

    if (editingRule) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? { ...r, ...newRule as EmailRule }
            : r
        )
      );
      toast.success("Pravilo ažurirano");
    } else {
      const rule: EmailRule = {
        id: Date.now().toString(),
        name: newRule.name!,
        enabled: newRule.enabled ?? true,
        conditions: newRule.conditions as RuleCondition[],
        conditionOperator: newRule.conditionOperator || "all",
        actions: newRule.actions as RuleAction[],
        matchCount: 0,
      };
      setRules((prev) => [...prev, rule]);
      toast.success("Pravilo kreirano");
    }

    setIsDialogOpen(false);
    setEditingRule(null);
    setNewRule({
      name: "",
      enabled: true,
      conditions: [{ id: "new-c1", field: "from", operator: "contains", value: "" }],
      conditionOperator: "all",
      actions: [{ id: "new-a1", type: "move_to", value: "" }],
    });
  };

  const generateAIRule = () => {
    setNewRule({
      name: "AI: Pretplata emailovi",
      enabled: true,
      conditions: [
        { id: "ai-c1", field: "subject", operator: "contains", value: "unsubscribe" },
        { id: "ai-c2", field: "body", operator: "contains", value: "manage preferences" },
      ],
      conditionOperator: "any",
      actions: [
        { id: "ai-a1", type: "move_to", value: "Newsletter" },
        { id: "ai-a2", type: "mark_as", value: "read" },
      ],
    });
    toast.success("AI je generirao predložak pravila");
  };

  const getActionLabel = (action: RuleAction) => {
    const option = actionOptions.find((o) => o.value === action.type);
    if (!option) return action.type;
    if (action.value) return `${option.label}: ${action.value}`;
    return option.label;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Pravila filtriranja emailova
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingRule(null);
                setNewRule({
                  name: "",
                  enabled: true,
                  conditions: [{ id: "new-c1", field: "from", operator: "contains", value: "" }],
                  conditionOperator: "all",
                  actions: [{ id: "new-a1", type: "move_to", value: "" }],
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo pravilo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Automatski organizirajte dolazne emailove prema definiranim pravilima.
            Pravila se primjenjuju redoslijedom kojim su prikazana.
          </p>
        </CardContent>
      </Card>

      {/* Rules List */}
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className={`p-4 border rounded-lg ${
                    rule.enabled ? "border-primary/30 bg-primary/5" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="cursor-move text-muted-foreground mt-1">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{rule.name}</span>
                        {rule.enabled && (
                          <Badge className="text-xs bg-green-500">Aktivno</Badge>
                        )}
                        {rule.isAIGenerated && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </Badge>
                        )}
                        {rule.matchCount !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {rule.matchCount} podudaranja
                          </Badge>
                        )}
                      </div>

                      {/* Conditions */}
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Ako </span>
                        {rule.conditionOperator === "all" ? "svi" : "bilo koji"}{" "}
                        uvjeti:
                        <div className="mt-1 space-y-1">
                          {rule.conditions.map((condition, idx) => (
                            <div key={condition.id} className="flex items-center gap-1">
                              {idx > 0 && (
                                <span className="text-xs text-primary">
                                  {rule.conditionOperator === "all" ? "I" : "ILI"}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {fieldOptions.find((f) => f.value === condition.field)?.label}{" "}
                                {operatorOptions.find((o) => o.value === condition.operator)?.label}{" "}
                                "{condition.value}"
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        {rule.actions.map((action) => {
                          const ActionIcon = actionOptions.find((o) => o.value === action.type)?.icon || Mail;
                          return (
                            <Badge key={action.id} variant="secondary" className="text-xs gap-1">
                              <ActionIcon className="h-3 w-3" />
                              {getActionLabel(action)}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicateRule(rule)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {rules.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nema definiranih pravila</p>
                  <p className="text-xs mt-1">
                    Kreirajte pravilo za automatsko sortiranje emailova
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Savjet
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Pravila se primjenjuju na nove dolazne emailove. Za primjenu pravila na
          postojeće emailove, koristite opciju "Primijeni na postojeće".
        </p>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Uredi pravilo" : "Novo pravilo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rule Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Naziv pravila</Label>
                {!editingRule && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateAIRule}
                    className="h-7 text-xs"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI predložak
                  </Button>
                )}
              </div>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="Npr. Fakture u mapu Fakture"
              />
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Uvjeti</Label>
                <Select
                  value={newRule.conditionOperator}
                  onValueChange={(value: "all" | "any") =>
                    setNewRule({ ...newRule, conditionOperator: value })
                  }
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi uvjeti</SelectItem>
                    <SelectItem value="any">Bilo koji</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {newRule.conditions?.map((condition, idx) => (
                  <div key={condition.id} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span className="text-xs text-muted-foreground w-8">
                        {newRule.conditionOperator === "all" ? "I" : "ILI"}
                      </span>
                    )}
                    {idx === 0 && <span className="w-8" />}
                    <Select
                      value={condition.field}
                      onValueChange={(value) =>
                        handleUpdateCondition(condition.id, { field: value as RuleCondition["field"] })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(value) =>
                        handleUpdateCondition(condition.id, { operator: value as RuleCondition["operator"] })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      value={condition.value}
                      onChange={(e) =>
                        handleUpdateCondition(condition.id, { value: e.target.value })
                      }
                      placeholder="Vrijednost"
                      className="flex-1"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveCondition(condition.id)}
                      disabled={(newRule.conditions?.length || 0) <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCondition}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj uvjet
              </Button>
            </div>

            {/* Actions */}
            <div>
              <Label className="mb-2 block">Akcije</Label>
              <div className="space-y-2">
                {newRule.actions?.map((action) => (
                  <div key={action.id} className="flex items-center gap-2">
                    <Select
                      value={action.type}
                      onValueChange={(value) =>
                        handleUpdateAction(action.id, { type: value as RuleAction["type"], value: "" })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="flex items-center gap-2">
                              <opt.icon className="h-4 w-4" />
                              {opt.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {(action.type === "move_to" || action.type === "forward") && (
                      <Select
                        value={action.value}
                        onValueChange={(value) =>
                          handleUpdateAction(action.id, { value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Odaberi mapu" />
                        </SelectTrigger>
                        <SelectContent>
                          {folderOptions.map((folder) => (
                            <SelectItem key={folder} value={folder}>
                              {folder}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {action.type === "add_label" && (
                      <Select
                        value={action.value}
                        onValueChange={(value) =>
                          handleUpdateAction(action.id, { value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Odaberi oznaku" />
                        </SelectTrigger>
                        <SelectContent>
                          {labelOptions.map((label) => (
                            <SelectItem key={label} value={label}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {action.type === "mark_as" && (
                      <Select
                        value={action.value}
                        onValueChange={(value) =>
                          handleUpdateAction(action.id, { value })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Označi kao" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Pročitano</SelectItem>
                          <SelectItem value="important">Važno</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {(action.type === "archive" || action.type === "delete" || action.type === "star") && (
                      <div className="flex-1" />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveAction(action.id)}
                      disabled={(newRule.actions?.length || 0) <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAction}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj akciju
              </Button>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Aktiviraj pravilo odmah</Label>
              <Switch
                checked={newRule.enabled}
                onCheckedChange={(checked) =>
                  setNewRule({ ...newRule, enabled: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? "Spremi izmjene" : "Kreiraj pravilo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmailRulesManager;
