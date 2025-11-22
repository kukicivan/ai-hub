import React, { useState, useEffect } from "react";
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
  useGetAiServicesQuery,
  useUpdateAiServicesMutation,
  useGetApiKeysQuery,
  useUpsertApiKeyMutation,
  useDeleteApiKeyMutation,
  useInitializeSettingsMutation,
  GoalInput,
  UserCategory,
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
} from "lucide-react";

const Settings: React.FC = () => {
  const [initializeSettings] = useInitializeSettingsMutation();

  // Initialize settings on mount
  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

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

  const handleGoalChange = (key: string, value: string) => {
    setLocalGoals((prev) =>
      prev.map((g) => (g.key === key ? { ...g, value } : g))
    );
  };

  const handleSave = async () => {
    try {
      await updateGoals({ goals: localGoals }).unwrap();
      toast.success("Ciljevi su uspješno sačuvani");
    } catch {
      toast.error("Greška pri čuvanju ciljeva");
    }
  };

  const goalLabels: Record<string, { label: string; description: string }> = {
    main_focus: { label: "Glavni fokus", description: "Vaš primarni poslovni fokus" },
    key_goal: { label: "Ključni cilj", description: "Najvažniji cilj koji želite postići" },
    strategy: { label: "Strategija", description: "Vaša poslovna strategija" },
    target_clients: { label: "Ciljni klijenti", description: "Opis vaših idealnih klijenata" },
    expertise: { label: "Ekspertiza", description: "Vaše oblasti ekspertize" },
    secondary_project: { label: "Sekundarni projekat", description: "Dodatni projekat na kojem radite" },
    situation: { label: "Trenutna situacija", description: "Opis vaše trenutne poslovne situacije" },
  };

  if (isLoading) {
    return <div className="p-4 text-center">Učitavanje...</div>;
  }

  const primaryGoals = localGoals.filter((g) => g.type === "primary");
  const secondaryGoals = localGoals.filter((g) => g.type === "secondary");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Primarni ciljevi</CardTitle>
          <CardDescription>
            Definišite vaše glavne poslovne ciljeve koji će biti korišteni za AI analizu emailova
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {primaryGoals.map((goal) => (
            <div key={goal.key} className="space-y-2">
              <Label htmlFor={goal.key}>
                {goalLabels[goal.key]?.label || goal.key}
              </Label>
              <Textarea
                id={goal.key}
                value={goal.value}
                onChange={(e) => handleGoalChange(goal.key, e.target.value)}
                placeholder={goalLabels[goal.key]?.description}
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sekundarni ciljevi</CardTitle>
          <CardDescription>Dodatni ciljevi i kontekst</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {secondaryGoals.map((goal) => (
            <div key={goal.key} className="space-y-2">
              <Label htmlFor={goal.key}>
                {goalLabels[goal.key]?.label || goal.key}
              </Label>
              <Textarea
                id={goal.key}
                value={goal.value}
                onChange={(e) => handleGoalChange(goal.key, e.target.value)}
                placeholder={goalLabels[goal.key]?.description}
                rows={2}
              />
            </div>
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

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    display_name: "",
    description: "",
    priority: "medium" as const,
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

  if (isLoading) {
    return <div className="p-4 text-center">Učitavanje...</div>;
  }

  return (
    <div className="space-y-4">
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
                <div className="flex items-center gap-4">
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

              {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                <div className="border-t px-4 py-3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">Podkategorije:</div>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className={`px-3 py-1 rounded-full text-sm ${
                          sub.is_active
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {sub.display_name}
                      </span>
                    ))}
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
    return <div className="p-4 text-center">Učitavanje...</div>;
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
  const [upsertApiKey, { isLoading: isUpsertingKey }] = useUpsertApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();

  const [newKey, setNewKey] = useState({ service: "grok" as const, key: "" });

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

  const handleDownloadScript = async () => {
    try {
      const response = await fetch("/api/v1/settings/apps-script/download", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
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
    return <div className="p-4 text-center">Učitavanje...</div>;
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
                onValueChange={(v) => setNewKey({ ...newKey, service: v as "grok" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grok">Grok</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
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
            Preuzmite personalizovanu skriptu za sinhronizaciju Gmail-a sa vašim API ključem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDownloadScript}>
            <Download className="h-4 w-4 mr-2" />
            Preuzmi Apps Script
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
