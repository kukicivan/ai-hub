import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  History,
  Search,
  Star,
  StarOff,
  X,
  Clock,
  ArrowRight,
  Sparkles,
  Trash2,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface SearchItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  saved: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters?: {
    from?: string;
    to?: string;
    hasAttachment?: boolean;
    dateRange?: string;
  };
  createdAt: Date;
}

const mockRecentSearches: SearchItem[] = [
  {
    id: "1",
    query: "invoice 2024",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    resultCount: 24,
    saved: false,
  },
  {
    id: "2",
    query: "from:marko@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    resultCount: 156,
    saved: true,
  },
  {
    id: "3",
    query: "project proposal",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    resultCount: 8,
    saved: false,
  },
  {
    id: "4",
    query: "has:attachment pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    resultCount: 45,
    saved: true,
  },
  {
    id: "5",
    query: "meeting agenda",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    resultCount: 12,
    saved: false,
  },
];

const mockSavedSearches: SavedSearch[] = [
  {
    id: "1",
    name: "Emailovi od Marka",
    query: "from:marko@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "2",
    name: "PDF prilozi",
    query: "has:attachment pdf",
    filters: { hasAttachment: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: "3",
    name: "Hitni emailovi",
    query: "is:important OR subject:urgent",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

const aiSuggestions = [
  "Emailovi od ovog tjedna bez odgovora",
  "Svi prilozi veći od 5MB",
  "Emailovi s neodgovorenim pitanjima",
  "Newsletteri za odjavu",
];

interface SearchHistoryProps {
  onSearch?: (query: string) => void;
  compact?: boolean;
}

export function SearchHistory({ onSearch, compact = false }: SearchHistoryProps) {
  const toast = useToast();
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>(mockRecentSearches);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [newSavedName, setNewSavedName] = useState("");
  const [savingSearch, setSavingSearch] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const handleToggleSave = (searchId: string) => {
    setRecentSearches((prev) =>
      prev.map((s) =>
        s.id === searchId ? { ...s, saved: !s.saved } : s
      )
    );

    const search = recentSearches.find((s) => s.id === searchId);
    if (search) {
      if (!search.saved) {
        setSavingSearch(searchId);
      } else {
        toast.success("Uklonjen iz spremljenih");
      }
    }
  };

  const handleSaveWithName = () => {
    const search = recentSearches.find((s) => s.id === savingSearch);
    if (search && newSavedName) {
      const newSaved: SavedSearch = {
        id: Date.now().toString(),
        name: newSavedName,
        query: search.query,
        createdAt: new Date(),
      };
      setSavedSearches([newSaved, ...savedSearches]);
      toast.success("Pretraga spremljena");
    }
    setSavingSearch(null);
    setNewSavedName("");
  };

  const handleRemoveRecent = (id: string) => {
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRemoveSaved = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Spremljena pretraga obrisana");
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    toast.success("Povijest pretraživanja obrisana");
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Recent */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Nedavne pretrage
          </h4>
          <div className="space-y-1">
            {recentSearches.slice(0, 4).map((search) => (
              <button
                key={search.id}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-sm flex items-center gap-2"
                onClick={() => handleSearch(search.query)}
              >
                <Search className="h-3 w-3 text-muted-foreground" />
                <span className="truncate flex-1">{search.query}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Saved */}
        {savedSearches.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Spremljene pretrage
            </h4>
            <div className="space-y-1">
              {savedSearches.slice(0, 3).map((search) => (
                <button
                  key={search.id}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-sm flex items-center gap-2"
                  onClick={() => handleSearch(search.query)}
                >
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="truncate flex-1">{search.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Povijest pretraživanja
          </CardTitle>
          {recentSearches.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Obriši sve
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Suggestions */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI prijedlozi
          </h4>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Spremljene pretrage
            </h4>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                  onClick={() => handleSearch(search.query)}
                >
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{search.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {search.query}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSaved(search.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedSearches.length > 0 && <Separator />}

        {/* Recent Searches */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Nedavne pretrage
          </h4>
          <ScrollArea className="h-[200px]">
            {recentSearches.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nema nedavnih pretraga</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <div key={search.id}>
                    {savingSearch === search.id ? (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <Input
                          placeholder="Naziv pretrage..."
                          value={newSavedName}
                          onChange={(e) => setNewSavedName(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button size="sm" onClick={handleSaveWithName}>
                          Spremi
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSavingSearch(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                        onClick={() => handleSearch(search.query)}
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{search.query}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {formatDistanceToNow(search.timestamp, {
                                addSuffix: true,
                                locale: hr,
                              })}
                            </span>
                            <span>•</span>
                            <span>{search.resultCount} rezultata</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(search.id);
                          }}
                        >
                          {search.saved ? (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRecent(search.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

export default SearchHistory;
