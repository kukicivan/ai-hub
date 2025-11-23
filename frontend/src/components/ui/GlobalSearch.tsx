import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Search,
  Mail,
  User,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  ArrowRight,
  Clock,
  Hash,
  Command,
  Sparkles,
} from "lucide-react";

type SearchResultType = "email" | "contact" | "event" | "task" | "file" | "setting" | "action";

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: () => void;
  shortcut?: string;
}

const quickActions: SearchResult[] = [
  {
    id: "compose",
    type: "action",
    title: "Novi email",
    subtitle: "Otvori prozor za pisanje",
    shortcut: "C",
  },
  {
    id: "calendar",
    type: "action",
    title: "Idi na kalendar",
    subtitle: "Pregled događaja",
    shortcut: "G C",
  },
  {
    id: "settings",
    type: "action",
    title: "Otvori postavke",
    subtitle: "Konfiguriraj aplikaciju",
    shortcut: "G S",
  },
  {
    id: "ai-summary",
    type: "action",
    title: "AI sažetak inboxa",
    subtitle: "Generiraj pregled dana",
    shortcut: "Ctrl+Shift+A",
  },
];

const mockResults: SearchResult[] = [
  {
    id: "e1",
    type: "email",
    title: "Prijedlog suradnje - Tech Solutions",
    subtitle: "marko@example.com • prije 2 sata",
  },
  {
    id: "e2",
    type: "email",
    title: "Re: Sastanak u ponedjeljak",
    subtitle: "ana@company.hr • jučer",
  },
  {
    id: "c1",
    type: "contact",
    title: "Marko Horvat",
    subtitle: "marko.horvat@example.com",
  },
  {
    id: "c2",
    type: "contact",
    title: "Ana Kovač",
    subtitle: "ana.kovac@company.hr",
  },
  {
    id: "ev1",
    type: "event",
    title: "Review projekta",
    subtitle: "Danas u 14:00",
  },
  {
    id: "t1",
    type: "task",
    title: "Pripremiti prezentaciju",
    subtitle: "Rok: sutra",
  },
  {
    id: "f1",
    type: "file",
    title: "ponuda_2024.pdf",
    subtitle: "Privitci • 2.3 MB",
  },
];

const getTypeIcon = (type: SearchResultType) => {
  const icons: Record<SearchResultType, React.ReactNode> = {
    email: <Mail className="h-4 w-4" />,
    contact: <User className="h-4 w-4" />,
    event: <Calendar className="h-4 w-4" />,
    task: <CheckSquare className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
    setting: <Settings className="h-4 w-4" />,
    action: <Command className="h-4 w-4" />,
  };
  return icons[type];
};

const getTypeLabel = (type: SearchResultType) => {
  const labels: Record<SearchResultType, string> = {
    email: "Email",
    contact: "Kontakt",
    event: "Događaj",
    task: "Zadatak",
    file: "Datoteka",
    setting: "Postavka",
    action: "Radnja",
  };
  return labels[type];
};

const getTypeColor = (type: SearchResultType) => {
  const colors: Record<SearchResultType, string> = {
    email: "text-blue-500",
    contact: "text-green-500",
    event: "text-orange-500",
    task: "text-purple-500",
    file: "text-yellow-500",
    setting: "text-gray-500",
    action: "text-primary",
  };
  return colors[type];
};

interface GlobalSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GlobalSearch({ open = false, onOpenChange }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches] = useState(["invoice", "from:marko", "has:attachment"]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Keyboard shortcut to open search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        onOpenChange?.(true);
      }
      if (e.key === "/" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        onOpenChange?.(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (query.length >= 2) {
      // Simulate search - filter mock results
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
    setSelectedIndex(0);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    onOpenChange?.(false);
  };

  const handleSelect = (result: SearchResult) => {
    console.log("Selected:", result);
    result.action?.();
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = query.length >= 2 ? results : quickActions;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  const displayItems = query.length >= 2 ? results : quickActions;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-xl gap-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Pretraži emailove, kontakte, zadatke..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Badge variant="outline" className="text-xs shrink-0">
            ESC
          </Badge>
        </div>

        {/* AI Suggestion */}
        {query.length >= 2 && (
          <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-700 dark:text-purple-300">
              AI prijedlog: Prikaži emailove od "{query}" ovaj tjedan
            </span>
            <ArrowRight className="h-4 w-4 text-purple-500 ml-auto" />
          </div>
        )}

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          {/* Quick Actions / Results */}
          <div className="py-2">
            {query.length < 2 && (
              <div className="px-4 py-1 text-xs font-medium text-muted-foreground">
                Brze radnje
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nema rezultata za "{query}"</p>
                <p className="text-xs mt-1">Pokušajte s drugim pojmom</p>
              </div>
            )}

            {displayItems.map((item, index) => (
              <button
                key={item.id}
                className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                  index === selectedIndex ? "bg-muted" : ""
                }`}
                onClick={() => handleSelect(item)}
              >
                <div className={`${getTypeColor(item.type)}`}>
                  {item.icon || getTypeIcon(item.type)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                {item.shortcut && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {item.shortcut}
                  </Badge>
                )}
                {query.length >= 2 && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {getTypeLabel(item.type)}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <>
              <div className="border-t my-2" />
              <div className="py-2">
                <div className="px-4 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Nedavne pretrage
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                    onClick={() => setQuery(search)}
                  >
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">↑↓</kbd>
              navigacija
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">↵</kbd>
              odabir
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-background border rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-background border rounded">K</kbd>
            za otvaranje
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GlobalSearch;
