import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  X,
  Calendar as CalendarIcon,
  User,
  Tag,
  Paperclip,
  Star,
  Mail,
  ChevronDown,
  Clock,
  Sparkles,
  Filter,
  Save,
  History,
  Trash2,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface SearchFilter {
  query: string;
  from: string;
  to: string;
  subject: string;
  hasAttachment: boolean;
  isStarred: boolean;
  isUnread: boolean;
  dateRange: "any" | "today" | "week" | "month" | "custom";
  startDate?: Date;
  endDate?: Date;
  folder: string;
  labels: string[];
  size: "any" | "small" | "medium" | "large";
}

interface SavedSearch {
  id: string;
  name: string;
  filter: SearchFilter;
  createdAt: Date;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

const defaultFilter: SearchFilter = {
  query: "",
  from: "",
  to: "",
  subject: "",
  hasAttachment: false,
  isStarred: false,
  isUnread: false,
  dateRange: "any",
  folder: "all",
  labels: [],
  size: "any",
};

const availableLabels = [
  { value: "important", label: "Važno", color: "bg-red-500" },
  { value: "work", label: "Posao", color: "bg-blue-500" },
  { value: "personal", label: "Osobno", color: "bg-green-500" },
  { value: "finance", label: "Financije", color: "bg-yellow-500" },
  { value: "newsletter", label: "Newsletter", color: "bg-purple-500" },
];

const folders = [
  { value: "all", label: "Sve mape" },
  { value: "inbox", label: "Inbox" },
  { value: "sent", label: "Poslano" },
  { value: "drafts", label: "Skice" },
  { value: "archive", label: "Arhiva" },
  { value: "trash", label: "Smeće" },
];

export function AdvancedSearch() {
  const toast = useToast();
  const [filter, setFilter] = useState<SearchFilter>(defaultFilter);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState("");

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Nepročitane važne",
      filter: { ...defaultFilter, isUnread: true, labels: ["important"] },
      createdAt: subDays(new Date(), 5),
    },
    {
      id: "2",
      name: "S privicima ovaj mjesec",
      filter: { ...defaultFilter, hasAttachment: true, dateRange: "month" },
      createdAt: subDays(new Date(), 10),
    },
  ]);

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: "1", query: "faktura 2024", timestamp: subDays(new Date(), 1), resultsCount: 12 },
    { id: "2", query: "from:partner@company.com", timestamp: subDays(new Date(), 2), resultsCount: 45 },
    { id: "3", query: "projekt deadline", timestamp: subDays(new Date(), 3), resultsCount: 8 },
  ]);

  const hasActiveFilters =
    filter.from ||
    filter.to ||
    filter.subject ||
    filter.hasAttachment ||
    filter.isStarred ||
    filter.isUnread ||
    filter.dateRange !== "any" ||
    filter.folder !== "all" ||
    filter.labels.length > 0 ||
    filter.size !== "any";

  const handleSearch = async () => {
    if (!filter.query && !hasActiveFilters) {
      toast.error("Unesite pojam za pretraživanje ili odaberite filtre");
      return;
    }

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSearching(false);

    // Add to recent searches
    if (filter.query) {
      setRecentSearches((prev) => [
        {
          id: Date.now().toString(),
          query: filter.query,
          timestamp: new Date(),
          resultsCount: Math.floor(Math.random() * 50) + 1,
        },
        ...prev.slice(0, 4),
      ]);
    }

    toast.success("Pretraživanje završeno");
  };

  const handleClearFilters = () => {
    setFilter(defaultFilter);
  };

  const handleSaveSearch = () => {
    if (!savedSearchName) {
      toast.error("Unesite naziv pretrage");
      return;
    }

    setSavedSearches((prev) => [
      {
        id: Date.now().toString(),
        name: savedSearchName,
        filter: { ...filter },
        createdAt: new Date(),
      },
      ...prev,
    ]);

    setSavedSearchName("");
    setShowSaveDialog(false);
    toast.success("Pretraga spremljena");
  };

  const handleLoadSavedSearch = (search: SavedSearch) => {
    setFilter(search.filter);
    toast.info(`Učitana pretraga: ${search.name}`);
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Spremljena pretraga obrisana");
  };

  const handleLoadRecentSearch = (search: RecentSearch) => {
    setFilter({ ...defaultFilter, query: search.query });
  };

  const toggleLabel = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      labels: prev.labels.includes(value)
        ? prev.labels.filter((l) => l !== value)
        : [...prev.labels, value],
    }));
  };

  const getDateRangeLabel = () => {
    switch (filter.dateRange) {
      case "today":
        return "Danas";
      case "week":
        return "Zadnjih 7 dana";
      case "month":
        return "Zadnjih 30 dana";
      case "custom":
        if (filter.startDate && filter.endDate) {
          return `${format(filter.startDate, "d MMM", { locale: hr })} - ${format(filter.endDate, "d MMM", { locale: hr })}`;
        }
        return "Prilagođeno";
      default:
        return "Bilo kada";
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Napredna pretraga
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={filter.query}
              onChange={(e) => setFilter({ ...filter, query: e.target.value })}
              placeholder="Pretraži emailove..."
              className="pl-10 pr-20 h-12 text-lg"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {filter.query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setFilter({ ...filter, query: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Tražim..." : "Traži"}
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filter.hasAttachment ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, hasAttachment: !filter.hasAttachment })}
            >
              <Paperclip className="h-4 w-4 mr-1" />
              S privitkom
            </Button>
            <Button
              variant={filter.isStarred ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, isStarred: !filter.isStarred })}
            >
              <Star className="h-4 w-4 mr-1" />
              Označeni
            </Button>
            <Button
              variant={filter.isUnread ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, isUnread: !filter.isUnread })}
            >
              <Mail className="h-4 w-4 mr-1" />
              Nepročitani
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {getDateRangeLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2 space-y-1">
                  {[
                    { value: "any", label: "Bilo kada" },
                    { value: "today", label: "Danas" },
                    { value: "week", label: "Zadnjih 7 dana" },
                    { value: "month", label: "Zadnjih 30 dana" },
                    { value: "custom", label: "Prilagođeno..." },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={filter.dateRange === option.value ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setFilter({ ...filter, dateRange: option.value as SearchFilter["dateRange"] })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {filter.dateRange === "custom" && (
                  <div className="p-2 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Calendar
                        mode="single"
                        selected={filter.startDate}
                        onSelect={(date) => setFilter({ ...filter, startDate: date })}
                      />
                      <Calendar
                        mode="single"
                        selected={filter.endDate}
                        onSelect={(date) => setFilter({ ...filter, endDate: date })}
                      />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Više filtera
              <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", isAdvancedOpen && "rotate-180")} />
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Očisti filtre
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleContent>
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Od</Label>
                    <Input
                      value={filter.from}
                      onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Prima</Label>
                    <Input
                      value={filter.to}
                      onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Predmet sadrži</Label>
                    <Input
                      value={filter.subject}
                      onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                      placeholder="Ključne riječi..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Mapa</Label>
                    <Select
                      value={filter.folder}
                      onValueChange={(value) => setFilter({ ...filter, folder: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.value} value={folder.value}>
                            {folder.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Veličina</Label>
                    <Select
                      value={filter.size}
                      onValueChange={(value) => setFilter({ ...filter, size: value as SearchFilter["size"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Bilo koja</SelectItem>
                        <SelectItem value="small">Mala (&lt; 100KB)</SelectItem>
                        <SelectItem value="medium">Srednja (100KB - 1MB)</SelectItem>
                        <SelectItem value="large">Velika (&gt; 1MB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Oznake</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {availableLabels.map((label) => (
                        <Badge
                          key={label.value}
                          variant={filter.labels.includes(label.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLabel(label.value)}
                        >
                          <div className={cn("w-2 h-2 rounded-full mr-1", label.color)} />
                          {label.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Aktivni filteri: {[
                        filter.from && "Od",
                        filter.to && "Prima",
                        filter.subject && "Predmet",
                        filter.hasAttachment && "Privici",
                        filter.isStarred && "Označeni",
                        filter.isUnread && "Nepročitani",
                        filter.dateRange !== "any" && "Datum",
                        filter.folder !== "all" && "Mapa",
                        filter.labels.length > 0 && "Oznake",
                        filter.size !== "any" && "Veličina",
                      ].filter(Boolean).join(", ") || "Nema"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={!hasActiveFilters && !filter.query}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Spremi pretragu
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Saved and Recent Searches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Saved Searches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Save className="h-4 w-4" />
              Spremljene pretrage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedSearches.length > 0 ? (
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleLoadSavedSearch(search)}
                  >
                    <div>
                      <p className="font-medium text-sm">{search.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(search.createdAt, "d MMM yyyy", { locale: hr })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavedSearch(search.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nema spremljenih pretraga
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Nedavne pretrage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleLoadRecentSearch(search)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{search.query}</p>
                        <p className="text-xs text-muted-foreground">
                          {search.resultsCount} rezultata
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(search.timestamp, "d MMM", { locale: hr })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nema nedavnih pretraga
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Search Tips */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">AI savjeti za pretraživanje</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Koristite <code className="bg-muted px-1 rounded">from:email</code> za pretragu po pošiljatelju</li>
                <li>• Koristite <code className="bg-muted px-1 rounded">subject:tekst</code> za pretragu po predmetu</li>
                <li>• Koristite <code className="bg-muted px-1 rounded">has:attachment</code> za emailove s privicima</li>
                <li>• Kombinirajte pojmove s <code className="bg-muted px-1 rounded">AND</code> ili <code className="bg-muted px-1 rounded">OR</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spremi pretragu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
              placeholder="Naziv pretrage..."
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                Odustani
              </Button>
              <Button size="sm" onClick={handleSaveSearch}>
                Spremi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdvancedSearch;
