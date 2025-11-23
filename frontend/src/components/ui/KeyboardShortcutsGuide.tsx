import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Keyboard,
  Search,
  Mail,
  Navigation,
  FileEdit,
  Settings,
  Sparkles,
  Command,
} from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ["g", "i"], description: "Idi na inbox", category: "navigation" },
  { keys: ["g", "d"], description: "Idi na nadzornu ploču", category: "navigation" },
  { keys: ["g", "s"], description: "Idi na postavke", category: "navigation" },
  { keys: ["g", "c"], description: "Idi na kalendar", category: "navigation" },
  { keys: ["g", "k"], description: "Idi na kontakte", category: "navigation" },
  { keys: ["g", "t"], description: "Idi na zadatke", category: "navigation" },
  { keys: ["g", "a"], description: "Idi na analitiku", category: "navigation" },
  { keys: ["g", "h"], description: "Idi na pomoć", category: "navigation" },

  // Email Actions
  { keys: ["c"], description: "Novi email", category: "email" },
  { keys: ["r"], description: "Odgovori", category: "email" },
  { keys: ["a"], description: "Odgovori svima", category: "email" },
  { keys: ["f"], description: "Proslijedi", category: "email" },
  { keys: ["e"], description: "Arhiviraj", category: "email" },
  { keys: ["#"], description: "Obriši", category: "email" },
  { keys: ["s"], description: "Označi zvjezdicom", category: "email" },
  { keys: ["l"], description: "Dodaj oznaku", category: "email" },
  { keys: ["v"], description: "Premjesti u mapu", category: "email" },
  { keys: ["Shift", "i"], description: "Označi kao pročitano", category: "email" },
  { keys: ["Shift", "u"], description: "Označi kao nepročitano", category: "email" },
  { keys: ["!"], description: "Prijavi spam", category: "email" },
  { keys: ["b"], description: "Odgodi (snooze)", category: "email" },

  // Compose
  { keys: ["Ctrl", "Enter"], description: "Pošalji email", category: "compose" },
  { keys: ["Ctrl", "Shift", "c"], description: "Dodaj CC", category: "compose" },
  { keys: ["Ctrl", "Shift", "b"], description: "Dodaj BCC", category: "compose" },
  { keys: ["Ctrl", "k"], description: "Umetni link", category: "compose" },
  { keys: ["Ctrl", "b"], description: "Podebljano", category: "compose" },
  { keys: ["Ctrl", "i"], description: "Kurziv", category: "compose" },
  { keys: ["Ctrl", "u"], description: "Podcrtano", category: "compose" },
  { keys: ["Ctrl", "Shift", "7"], description: "Numerirani popis", category: "compose" },
  { keys: ["Ctrl", "Shift", "8"], description: "Točkasti popis", category: "compose" },
  { keys: ["Ctrl", "s"], description: "Spremi kao skicu", category: "compose" },
  { keys: ["Esc"], description: "Odbaci / Zatvori", category: "compose" },

  // Search & Selection
  { keys: ["/"], description: "Pretraživanje", category: "search" },
  { keys: ["Ctrl", "k"], description: "Brza naredba", category: "search" },
  { keys: ["j"], description: "Sljedeći email", category: "search" },
  { keys: ["k"], description: "Prethodni email", category: "search" },
  { keys: ["x"], description: "Odaberi/poništi odabir", category: "search" },
  { keys: ["*", "a"], description: "Odaberi sve", category: "search" },
  { keys: ["*", "n"], description: "Poništi sve odabire", category: "search" },
  { keys: ["*", "r"], description: "Odaberi pročitane", category: "search" },
  { keys: ["*", "u"], description: "Odaberi nepročitane", category: "search" },
  { keys: ["*", "s"], description: "Odaberi sa zvjezdicom", category: "search" },

  // AI Features
  { keys: ["Ctrl", "Shift", "a"], description: "AI sažetak", category: "ai" },
  { keys: ["Ctrl", "Shift", "r"], description: "AI odgovor", category: "ai" },
  { keys: ["Ctrl", "Shift", "t"], description: "AI prijevod", category: "ai" },
  { keys: ["Ctrl", "Shift", "p"], description: "AI prioritet", category: "ai" },
  { keys: ["Ctrl", "Shift", "s"], description: "AI stil", category: "ai" },

  // General
  { keys: ["?"], description: "Prikaži prečace", category: "general" },
  { keys: ["Esc"], description: "Zatvori modal/panel", category: "general" },
  { keys: ["Ctrl", "z"], description: "Poništi", category: "general" },
  { keys: ["Ctrl", "Shift", "z"], description: "Ponovi", category: "general" },
  { keys: ["F5"], description: "Osvježi", category: "general" },
  { keys: ["Ctrl", ","], description: "Otvori postavke", category: "general" },
];

const categories = [
  { id: "all", label: "Sve", icon: Keyboard },
  { id: "navigation", label: "Navigacija", icon: Navigation },
  { id: "email", label: "Email", icon: Mail },
  { id: "compose", label: "Pisanje", icon: FileEdit },
  { id: "search", label: "Pretraživanje", icon: Search },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "general", label: "Općenito", icon: Settings },
];

interface KeyboardShortcutsGuideProps {
  compact?: boolean;
}

export function KeyboardShortcutsGuide({ compact = false }: KeyboardShortcutsGuideProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesSearch =
      searchQuery === "" ||
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.some((key) => key.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      activeCategory === "all" || shortcut.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedShortcuts = filteredShortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label || categoryId;
  };

  const renderKey = (key: string) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    let displayKey = key;

    if (key === "Ctrl") displayKey = isMac ? "⌘" : "Ctrl";
    if (key === "Alt") displayKey = isMac ? "⌥" : "Alt";
    if (key === "Shift") displayKey = isMac ? "⇧" : "Shift";
    if (key === "Enter") displayKey = isMac ? "↵" : "Enter";
    if (key === "Esc") displayKey = "Esc";

    return (
      <kbd
        key={key}
        className="px-2 py-1 text-xs font-semibold bg-muted border rounded shadow-sm min-w-[24px] text-center"
      >
        {displayKey}
      </kbd>
    );
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          Prečaci tipkovnice
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {shortcuts.slice(0, 8).map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground truncate">{shortcut.description}</span>
              <div className="flex gap-0.5">
                {shortcut.keys.map((key, keyIdx) => (
                  <span key={keyIdx}>
                    {renderKey(key)}
                    {keyIdx < shortcut.keys.length - 1 && (
                      <span className="mx-0.5 text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Pritisnite <kbd className="px-1 bg-muted rounded">?</kbd> za sve prečace
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Keyboard className="h-5 w-5 text-primary" />
          Prečaci tipkovnice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži prečace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full flex-wrap h-auto gap-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-1 text-xs"
              >
                <category.icon className="h-3 w-3" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-4">
            <ScrollArea className="h-[350px]">
              {activeCategory === "all" ? (
                // Show grouped by category
                <div className="space-y-6">
                  {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        {getCategoryLabel(category)}
                        <Badge variant="secondary" className="text-xs">
                          {categoryShortcuts.length}
                        </Badge>
                      </h4>
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            <span className="text-sm">{shortcut.description}</span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, keyIdx) => (
                                <span key={keyIdx} className="flex items-center">
                                  {renderKey(key)}
                                  {keyIdx < shortcut.keys.length - 1 && (
                                    <span className="mx-1 text-muted-foreground text-xs">+</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Show flat list for specific category
                <div className="space-y-2">
                  {filteredShortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center">
                            {renderKey(key)}
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-muted-foreground text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredShortcuts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nema pronađenih prečaca</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{shortcuts.length} prečaca ukupno</span>
            <div className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>Pritisnite ? za brzi pristup</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default KeyboardShortcutsGuide;
