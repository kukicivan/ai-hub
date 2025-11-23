import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetGoalsQuery,
  useUpdateGoalsMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetAiServicesQuery,
  useUpdateAiServicesMutation,
  useGetApiKeysQuery,
  useUpsertApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetGmailAppScriptSettingsQuery,
  useSaveGmailAppScriptSettingsMutation,
  GoalInput,
  UserCategory,
  UserSubcategory,
} from "@/redux/features/settings/settingsApi";
import { toast } from "sonner";
import {
  Target,
  FolderTree,
  Zap,
  Key,
  Download,
  Trash2,
  Plus,
  Save,
  ChevronDown,
  ChevronRight,
  Settings as SettingsIcon,
  Edit2,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Animated placeholder examples for goals
const goalPlaceholderExamples: Record<string, string[]> = {
  main_focus: [
    "Automatizacija poslovnih procesa i pronalaženje B2B partnera",
    "Razvoj SaaS proizvoda za mala i srednja preduzeća",
    "Konsalting usluge za digitalizaciju kompanija",
    "E-commerce rješenja za retail sektor",
    "AI integracije za automatizaciju workflow-a",
  ],
  key_goal: [
    "Pronalaženje 3-5 projekata automatizacije u Q4 2025",
    "Lansiranje MVP produkta do kraja kvartala",
    "Ugovaranje 10 novih klijenata sa budgetom $5K+",
    "Povećanje MRR-a za 50% u naredna 3 mjeseca",
    "Izgradnja tima od 5 developera do kraja godine",
  ],
  strategy: [
    "Pozicioniranje kao ekspert za workflow automatizaciju",
    "Content marketing kroz tehničke blog postove",
    "Networking na tech konferencijama i meetupima",
    "Partnership sa komplementarnim agencijama",
    "Fokus na inbound marketing kroz SEO i edukativni sadržaj",
  ],
  target_clients: [
    "B2B kompanije sa $5K+ budgetom za automatizaciju",
    "Startups u growth fazi sa product-market fit",
    "Enterprise kompanije koje traže custom rješenja",
    "Agencije koje traže white-label partnera",
    "SaaS kompanije koje trebaju integracije",
  ],
  expertise: [
    "Laravel, React, AI integracije, workflow automatizacija",
    "Full-stack development, DevOps, cloud arhitektura",
    "API development, microservices, event-driven arhitektura",
    "Machine Learning, NLP, computer vision",
    "Mobile development, cross-platform, React Native",
  ],
  secondary_project: [
    "Razvoj nacionalne turističke platforme",
    "Open-source library za email processing",
    "YouTube kanal za programersku edukaciju",
    "Pisanje tehničke knjige o automatizaciji",
    "Mentorstvo junior developera",
  ],
  situation: [
    "Aktivna potraga za novim projektima kroz mrežu kontakata",
    "Tranzicija iz freelance u agency model",
    "Skaliranje postojećeg biznisa sa novim timom",
    "Pivot iz servisa u produkt-bazirani model",
    "Kombinacija konsaltinga i razvoja vlastitog proizvoda",
  ],
};

// Custom hook for animated placeholders
const useAnimatedPlaceholder = (key: string, isActive: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const examples = goalPlaceholderExamples[key] || [];

  useEffect(() => {
    if (!isActive || examples.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % examples.length);
        setIsTransitioning(false);
      }, 300); // Half of transition time for fade out/in effect
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, examples.length]);

  return {
    placeholder: examples[currentIndex] || "",
    isTransitioning,
  };
};

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Podešavanja
        </h1>
        <p className="text-gray-600 mt-1">
          Upravljajte vašim ciljevima, kategorijama i AI servisima
        </p>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ciljevi
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Kategorije
          </TabsTrigger>
          <TabsTrigger value="ai-services" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Servisi
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Ključevi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <GoalsTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="ai-services">
          <AiServicesTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Goal Textarea with animated placeholder
interface AnimatedGoalTextareaProps {
  goalKey: string;
  value: string;
  onChange: (key: string, value: string) => void;
  label: string;
}

const AnimatedGoalTextarea: React.FC<AnimatedGoalTextareaProps> = ({
  goalKey,
  value,
  onChange,
  label,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { placeholder, isTransitioning } = useAnimatedPlaceholder(goalKey, !value && !isFocused);

  return (
    <div className="space-y-2">
      <Label htmlFor={goalKey}>{label}</Label>
      <div className="relative">
        <Textarea
          id={goalKey}
          value={value}
          onChange={(e) => onChange(goalKey, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          rows={2}
          className="transition-all"
        />
        {!value && !isFocused && (
          <div
            className={`absolute top-2 left-3 right-3 pointer-events-none text-muted-foreground text-sm transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-60"
            }`}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

// Goals Tab Component
const GoalsTab: React.FC = () => {
  const { data: goals, isLoading } = useGetGoalsQuery();
  const [updateGoals, { isLoading: isUpdating }] = useUpdateGoalsMutation();
  const [localGoals, setLocalGoals] = useState<GoalInput[]>([]);

  useEffect(() => {
    if (goals) {
      setLocalGoals(
        goals.map((g) => ({
          key: g.key,
          value: g.value,
          type: g.type,
          is_active: g.is_active,
        }))
      );
    }
  }, [goals]);

  const handleGoalChange = useCallback((key: string, value: string) => {
    setLocalGoals((prev) =>
      prev.map((g) => (g.key === key ? { ...g, value } : g))
    );
  }, []);

  const handleSave = async () => {
    try {
      await updateGoals({ goals: localGoals }).unwrap();
      toast.success("Ciljevi su uspješno sačuvani");
    } catch {
      toast.error("Greška pri čuvanju ciljeva");
    }
  };

  const goalLabels: Record<string, string> = {
    main_focus: "Glavni fokus",
    key_goal: "Ključni cilj",
    strategy: "Strategija",
    target_clients: "Ciljni klijenti",
    expertise: "Ekspertiza",
    secondary_project: "Sekundarni projekat",
    situation: "Trenutna situacija",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryGoals = localGoals.filter((g) => g.type === "primary");
  const secondaryGoals = localGoals.filter((g) => g.type === "secondary");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Primarni ciljevi</CardTitle>
          <CardDescription>
            Definišite vaše glavne poslovne ciljeve koji će biti korišteni za AI analizu emailova.
            Primjeri se automatski prikazuju kao inspiracija.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {primaryGoals.map((goal) => (
            <AnimatedGoalTextarea
              key={goal.key}
              goalKey={goal.key}
              value={goal.value}
              onChange={handleGoalChange}
              label={goalLabels[goal.key] || goal.key}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sekundarni ciljevi</CardTitle>
          <CardDescription>Dodatni ciljevi i kontekst za precizniju AI analizu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {secondaryGoals.map((goal) => (
            <AnimatedGoalTextarea
              key={goal.key}
              goalKey={goal.key}
              value={goal.value}
              onChange={handleGoalChange}
              label={goalLabels[goal.key] || goal.key}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isUpdating}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Čuvanje..." : "Sačuvaj ciljeve"}
        </Button>
      </div>
    </div>
  );
};

// Categories Tab Component
const CategoriesTab: React.FC = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<UserCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ sub: UserSubcategory; categoryId: number } | null>(null);
  const [showNewSubcategory, setShowNewSubcategory] = useState<number | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    display_name: "",
    description: "",
    priority: "medium" as const,
  });

  const [editCategoryForm, setEditCategoryForm] = useState({
    name: "",
    display_name: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    display_name: "",
    description: "",
  });

  const [editSubcategoryForm, setEditSubcategoryForm] = useState({
    name: "",
    display_name: "",
    description: "",
  });

  const toggleExpanded = (id: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.display_name) {
      toast.error("Naziv i prikazni naziv su obavezni");
      return;
    }
    try {
      await createCategory(newCategory).unwrap();
      toast.success("Kategorija je kreirana");
      setShowNewCategory(false);
      setNewCategory({ name: "", display_name: "", description: "", priority: "medium" });
    } catch {
      toast.error("Greška pri kreiranju kategorije");
    }
  };

  const handleEditCategory = (category: UserCategory) => {
    setEditingCategory(category);
    setEditCategoryForm({
      name: category.name,
      display_name: category.display_name,
      description: category.description || "",
      priority: category.priority,
    });
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        id: editingCategory.id,
        data: editCategoryForm,
      }).unwrap();
      toast.success("Kategorija je ažurirana");
      setEditingCategory(null);
    } catch {
      toast.error("Greška pri ažuriranju kategorije");
    }
  };

  const handleToggleActive = async (category: UserCategory) => {
    try {
      await updateCategory({
        id: category.id,
        data: { is_active: !category.is_active },
      }).unwrap();
      toast.success(`Kategorija ${category.is_active ? "deaktivirana" : "aktivirana"}`);
    } catch {
      toast.error("Greška pri ažuriranju");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovu kategoriju?")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Kategorija je obrisana");
    } catch {
      toast.error("Greška pri brisanju");
    }
  };

  // Subcategory handlers
  const handleCreateSubcategory = async (categoryId: number) => {
    if (!newSubcategory.name || !newSubcategory.display_name) {
      toast.error("Naziv i prikazni naziv su obavezni");
      return;
    }
    try {
      await createSubcategory({ categoryId, data: newSubcategory }).unwrap();
      toast.success("Podkategorija je kreirana");
      setShowNewSubcategory(null);
      setNewSubcategory({ name: "", display_name: "", description: "" });
    } catch {
      toast.error("Greška pri kreiranju podkategorije");
    }
  };

  const handleEditSubcategory = (sub: UserSubcategory, categoryId: number) => {
    setEditingSubcategory({ sub, categoryId });
    setEditSubcategoryForm({
      name: sub.name,
      display_name: sub.display_name,
      description: sub.description || "",
    });
  };

  const handleSaveEditSubcategory = async () => {
    if (!editingSubcategory) return;
    try {
      await updateSubcategory({
        id: editingSubcategory.sub.id,
        categoryId: editingSubcategory.categoryId,
        data: editSubcategoryForm,
      }).unwrap();
      toast.success("Podkategorija je ažurirana");
      setEditingSubcategory(null);
    } catch {
      toast.error("Greška pri ažuriranju podkategorije");
    }
  };

  const handleDeleteSubcategory = async (subId: number, categoryId: number) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovu podkategoriju?")) return;
    try {
      await deleteSubcategory({ id: subId, categoryId }).unwrap();
      toast.success("Podkategorija je obrisana");
    } catch {
      toast.error("Greška pri brisanju podkategorije");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Izmijeni kategoriju</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingCategory(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sistemski naziv</Label>
                <Input
                  value={editCategoryForm.name}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Prikazni naziv</Label>
                <Input
                  value={editCategoryForm.display_name}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, display_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Opis</Label>
                <Input
                  value={editCategoryForm.description}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Prioritet</Label>
                <Select
                  value={editCategoryForm.priority}
                  onValueChange={(v) => setEditCategoryForm({ ...editCategoryForm, priority: v as "high" | "medium" | "low" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Visok</SelectItem>
                    <SelectItem value="medium">Srednji</SelectItem>
                    <SelectItem value="low">Nizak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>Otkaži</Button>
                <Button onClick={handleSaveEditCategory}>
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {editingSubcategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Izmijeni podkategoriju</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingSubcategory(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sistemski naziv</Label>
                <Input
                  value={editSubcategoryForm.name}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Prikazni naziv</Label>
                <Input
                  value={editSubcategoryForm.display_name}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, display_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Opis</Label>
                <Input
                  value={editSubcategoryForm.description}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSubcategory(null)}>Otkaži</Button>
                <Button onClick={handleSaveEditSubcategory}>
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Kategorije emailova</CardTitle>
            <CardDescription>
              Kategorije koje AI koristi za klasifikaciju emailova
            </CardDescription>
          </div>
          <Button onClick={() => setShowNewCategory(!showNewCategory)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova kategorija
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewCategory && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cat-name">Sistemski naziv</Label>
                  <Input
                    id="cat-name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="npr. new_category"
                  />
                </div>
                <div>
                  <Label htmlFor="cat-display">Prikazni naziv</Label>
                  <Input
                    id="cat-display"
                    value={newCategory.display_name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, display_name: e.target.value })
                    }
                    placeholder="npr. Nova Kategorija"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cat-desc">Opis</Label>
                <Input
                  id="cat-desc"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  placeholder="Opis kategorije za AI"
                />
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Label>Prioritet</Label>
                  <Select
                    value={newCategory.priority}
                    onValueChange={(v) =>
                      setNewCategory({ ...newCategory, priority: v as "high" | "medium" | "low" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Visok</SelectItem>
                      <SelectItem value="medium">Srednji</SelectItem>
                      <SelectItem value="low">Nizak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateCategory} className="mt-6">
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj
                </Button>
              </div>
            </div>
          )}

          {categories?.map((category) => (
            <div key={category.id} className="border rounded-lg">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(category.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <div>
                    <div className="font-medium">{category.display_name}</div>
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      category.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : category.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.priority}
                  </span>
                  <Switch
                    checked={category.is_active}
                    onCheckedChange={() => handleToggleActive(category)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                  >
                    <Edit2 className="h-4 w-4 text-blue-500" />
                  </Button>
                  {!category.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>

              {expandedCategories.has(category.id) && (
                <div className="border-t px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">Podkategorije:</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewSubcategory(showNewSubcategory === category.id ? null : category.id);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Dodaj
                    </Button>
                  </div>

                  {showNewSubcategory === category.id && (
                    <div className="p-3 mb-3 border rounded bg-white space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Sistemski naziv"
                          value={newSubcategory.name}
                          onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                        />
                        <Input
                          placeholder="Prikazni naziv"
                          value={newSubcategory.display_name}
                          onChange={(e) => setNewSubcategory({ ...newSubcategory, display_name: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Opis (opciono)"
                          value={newSubcategory.description}
                          onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleCreateSubcategory(category.id)}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowNewSubcategory(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.length === 0 ? (
                      <span className="text-sm text-gray-400">Nema podkategorija</span>
                    ) : (
                      category.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className={`group flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            sub.is_active
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <span>{sub.display_name}</span>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSubcategory(sub, category.id);
                            }}
                          >
                            <Edit2 className="h-3 w-3 text-blue-600" />
                          </button>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubcategory(sub.id, category.id);
                            }}
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// AI Services Tab Component
const AiServicesTab: React.FC = () => {
  const { data: services, isLoading } = useGetAiServicesQuery();
  const [updateServices, { isLoading: isUpdating }] = useUpdateAiServicesMutation();

  const servicesList = [
    { key: "gmail_active" as const, name: "Gmail", description: "Sinhronizacija i analiza emailova", icon: "📧" },
    { key: "viber_active" as const, name: "Viber", description: "Analiza Viber poruka", icon: "💬" },
    { key: "whatsapp_active" as const, name: "WhatsApp", description: "Analiza WhatsApp poruka", icon: "📱" },
    { key: "telegram_active" as const, name: "Telegram", description: "Analiza Telegram poruka", icon: "✈️" },
    { key: "social_active" as const, name: "Social Media", description: "Facebook, Instagram, LinkedIn", icon: "🌐" },
    { key: "slack_active" as const, name: "Slack", description: "Analiza Slack poruka", icon: "💼" },
  ];

  const handleToggle = async (key: string, value: boolean) => {
    try {
      await updateServices({ [key]: value }).unwrap();
      toast.success(`Servis ${value ? "aktiviran" : "deaktiviran"}`);
    } catch {
      toast.error("Greška pri ažuriranju");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Servisi</CardTitle>
        <CardDescription>
          Aktivirajte servise za sinhronizaciju i AI analizu vaših komunikacija
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {servicesList.map((service) => (
            <div
              key={service.key}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.description}</div>
                </div>
              </div>
              <Switch
                checked={services?.[service.key] ?? false}
                onCheckedChange={(checked) => handleToggle(service.key, checked)}
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// API Keys Tab Component
const ApiKeysTab: React.FC = () => {
  const { data: apiKeys, isLoading } = useGetApiKeysQuery();
  const { data: gmailSettings, isLoading: isLoadingGmailSettings } = useGetGmailAppScriptSettingsQuery();
  const [upsertApiKey, { isLoading: isUpsertingKey }] = useUpsertApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [saveGmailSettings, { isLoading: isSavingGmailSettings }] = useSaveGmailAppScriptSettingsMutation();

  const [newKey, setNewKey] = useState<{ service: "grok" | "openai" | "anthropic"; key: string }>({ service: "grok", key: "" });
  const [appScriptUrl, setAppScriptUrl] = useState("");
  const [appScriptApiKey, setAppScriptApiKey] = useState("");

  // Sync local state with API data
  useEffect(() => {
    if (gmailSettings) {
      setAppScriptUrl(gmailSettings.app_script_url || "");
      setAppScriptApiKey(gmailSettings.api_key || "");
    }
  }, [gmailSettings]);

  // Button enable conditions
  const canSaveGmailSettings = appScriptUrl.trim().length > 0 && appScriptApiKey.trim().length >= 10;
  const canDownloadScript = gmailSettings?.app_script_url && gmailSettings?.api_key;

  const handleSaveKey = async () => {
    if (!newKey.key || newKey.key.length < 10) {
      toast.error("API ključ mora imati najmanje 10 karaktera");
      return;
    }
    try {
      await upsertApiKey(newKey).unwrap();
      toast.success("API ključ je sačuvan");
      setNewKey({ service: "grok", key: "" });
    } catch {
      toast.error("Greška pri čuvanju ključa");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovaj ključ?")) return;
    try {
      await deleteApiKey(id).unwrap();
      toast.success("API ključ je obrisan");
    } catch {
      toast.error("Greška pri brisanju");
    }
  };

  const handleSaveGmailSettings = async () => {
    try {
      await saveGmailSettings({
        app_script_url: appScriptUrl.trim(),
        api_key: appScriptApiKey.trim(),
      }).unwrap();
      toast.success("Gmail Apps Script podešavanja su sačuvana");
    } catch {
      toast.error("Greška pri čuvanju podešavanja");
    }
  };

  const handleDownloadScript = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/api/v1/settings/apps-script/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gmail_sync_script.gs";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Skripta je preuzeta");
    } catch {
      toast.error("Greška pri preuzimanju skripte");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-9 w-full" />
              <div className="col-span-2 flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dodaj API ključ</CardTitle>
          <CardDescription>
            Unesite API ključ za AI servise (npr. Grok, OpenAI)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Servis</Label>
              <Select
                value={newKey.service}
                onValueChange={(v) => setNewKey({ ...newKey, service: v as typeof newKey.service })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grok">Grok</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>API Ključ</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="Unesite vaš API ključ"
                />
                <Button onClick={handleSaveKey} disabled={isUpsertingKey}>
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sačuvani ključevi</CardTitle>
        </CardHeader>
        <CardContent>
          {apiKeys && apiKeys.length > 0 ? (
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium uppercase">{key.service}</span>
                    <span className="font-mono text-gray-500">{key.masked_key}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        key.is_valid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {key.is_valid ? "Aktivan" : "Neaktivan"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(key.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nema sačuvanih ključeva</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gmail Apps Script</CardTitle>
          <CardDescription>
            Konfigurisite i preuzmite skriptu za sinhronizaciju Gmail-a
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appScriptUrl">Apps Script URL</Label>
            <Input
              id="appScriptUrl"
              value={appScriptUrl}
              onChange={(e) => setAppScriptUrl(e.target.value)}
              placeholder="https://script.google.com/..."
            />
          </div>
          <div>
            <Label htmlFor="appScriptApiKey">API Key za Apps Script</Label>
            <Input
              id="appScriptApiKey"
              type="password"
              value={appScriptApiKey}
              onChange={(e) => setAppScriptApiKey(e.target.value)}
              placeholder="Unesite API key"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveGmailSettings}
              disabled={!canSaveGmailSettings || isSavingGmailSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSavingGmailSettings ? "Čuvanje..." : "Sačuvaj"}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadScript}
              disabled={!canDownloadScript}
            >
              <Download className="h-4 w-4 mr-2" />
              Preuzmi Script
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
