import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  Star,
  Paperclip,
  AlertTriangle,
  Mail,
  Archive,
  Trash,
} from "lucide-react";
import { MessageFilters } from "@/redux/features/email/emailApi";

interface EmailSearchFiltersProps {
  filters: MessageFilters;
  onFiltersChange: (filters: MessageFilters) => void;
  onSearch: () => void;
}

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 pl-2">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-muted rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export function EmailSearchFilters({
  filters,
  onFiltersChange,
  onSearch,
}: EmailSearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.q || "");

  const updateFilter = <K extends keyof MessageFilters>(
    key: K,
    value: MessageFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof MessageFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("q", searchQuery || undefined);
    onSearch();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    onFiltersChange({});
    onSearch();
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== "page" && key !== "per_page" && filters[key as keyof MessageFilters] !== undefined
  ).length;

  // Get active filter badges
  const getActiveFilterBadges = () => {
    const badges: React.ReactNode[] = [];

    if (filters.q) {
      badges.push(
        <FilterBadge
          key="search"
          label={`Pretraga: "${filters.q}"`}
          onRemove={() => {
            setSearchQuery("");
            clearFilter("q");
            onSearch();
          }}
        />
      );
    }

    if (filters.unread !== undefined) {
      badges.push(
        <FilterBadge
          key="unread"
          label={filters.unread ? "Nepročitano" : "Pročitano"}
          onRemove={() => {
            clearFilter("unread");
            onSearch();
          }}
        />
      );
    }

    if (filters.starred) {
      badges.push(
        <FilterBadge
          key="starred"
          label="Sa zvjezdicom"
          onRemove={() => {
            clearFilter("starred");
            onSearch();
          }}
        />
      );
    }

    if (filters.priority) {
      const priorityLabels = { high: "Hitno", normal: "Važno", low: "Normalno" };
      badges.push(
        <FilterBadge
          key="priority"
          label={`Prioritet: ${priorityLabels[filters.priority]}`}
          onRemove={() => {
            clearFilter("priority");
            onSearch();
          }}
        />
      );
    }

    if (filters.has_attachments) {
      badges.push(
        <FilterBadge
          key="attachments"
          label="Sa prilozima"
          onRemove={() => {
            clearFilter("has_attachments");
            onSearch();
          }}
        />
      );
    }

    if (filters.category) {
      badges.push(
        <FilterBadge
          key="category"
          label={`Kategorija: ${filters.category}`}
          onRemove={() => {
            clearFilter("category");
            onSearch();
          }}
        />
      );
    }

    if (filters.ai_status) {
      const statusLabels = {
        pending: "Na čekanju",
        processing: "U obradi",
        completed: "Obrađeno",
        failed: "Neuspjelo",
      };
      badges.push(
        <FilterBadge
          key="ai_status"
          label={`AI: ${statusLabels[filters.ai_status]}`}
          onRemove={() => {
            clearFilter("ai_status");
            onSearch();
          }}
        />
      );
    }

    if (filters.in_inbox !== undefined) {
      badges.push(
        <FilterBadge
          key="in_inbox"
          label="U inboxu"
          onRemove={() => {
            clearFilter("in_inbox");
            onSearch();
          }}
        />
      );
    }

    if (filters.in_trash) {
      badges.push(
        <FilterBadge
          key="in_trash"
          label="U smeću"
          onRemove={() => {
            clearFilter("in_trash");
            onSearch();
          }}
        />
      );
    }

    return badges;
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži emailove..."
            className="pl-10 pr-4"
          />
        </div>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filteri
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filteri</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Očisti sve
                  </Button>
                )}
              </div>

              {/* Status Filters */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="unread"
                      checked={filters.unread === true}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter("unread", true);
                        } else {
                          clearFilter("unread");
                        }
                      }}
                    />
                    <Label htmlFor="unread" className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Nepročitano
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="starred"
                      checked={filters.starred === true}
                      onCheckedChange={(checked) => {
                        updateFilter("starred", checked ? true : undefined);
                      }}
                    />
                    <Label htmlFor="starred" className="text-sm flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Sa zvjezdicom
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="attachments"
                      checked={filters.has_attachments === true}
                      onCheckedChange={(checked) => {
                        updateFilter("has_attachments", checked ? true : undefined);
                      }}
                    />
                    <Label htmlFor="attachments" className="text-sm flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      Sa prilozima
                    </Label>
                  </div>
                </div>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Prioritet</Label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      clearFilter("priority");
                    } else {
                      updateFilter("priority", value as "low" | "normal" | "high");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Svi prioriteti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi prioriteti</SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        Hitno
                      </span>
                    </SelectItem>
                    <SelectItem value="normal">
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        Važno
                      </span>
                    </SelectItem>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Normalno
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">AI Status</Label>
                <Select
                  value={filters.ai_status || "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      clearFilter("ai_status");
                    } else {
                      updateFilter("ai_status", value as "pending" | "processing" | "completed" | "failed");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Svi statusi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="completed">Obrađeno</SelectItem>
                    <SelectItem value="pending">Na čekanju</SelectItem>
                    <SelectItem value="processing">U obradi</SelectItem>
                    <SelectItem value="failed">Neuspjelo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filters */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Lokacija</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="inbox"
                      checked={filters.in_inbox === true}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter("in_inbox", true);
                          clearFilter("in_trash");
                        } else {
                          clearFilter("in_inbox");
                        }
                      }}
                    />
                    <Label htmlFor="inbox" className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Inbox
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="trash"
                      checked={filters.in_trash === true}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter("in_trash", true);
                          clearFilter("in_inbox");
                        } else {
                          clearFilter("in_trash");
                        }
                      }}
                    />
                    <Label htmlFor="trash" className="text-sm flex items-center gap-1">
                      <Trash className="h-3 w-3" />
                      Smeće
                    </Label>
                  </div>
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Sortiraj po</Label>
                <Select
                  value={`${filters.sort || "message_timestamp"}-${filters.sort_order || "desc"}`}
                  onValueChange={(value) => {
                    const [sort, order] = value.split("-") as [MessageFilters["sort"], MessageFilters["sort_order"]];
                    updateFilter("sort", sort);
                    updateFilter("sort_order", order);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message_timestamp-desc">Datum (najnovije)</SelectItem>
                    <SelectItem value="message_timestamp-asc">Datum (najstarije)</SelectItem>
                    <SelectItem value="priority-desc">Prioritet (najviši)</SelectItem>
                    <SelectItem value="priority-asc">Prioritet (najniži)</SelectItem>
                    <SelectItem value="ai_processed_at-desc">AI obrada (najnovije)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Button */}
              <Button onClick={onSearch} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Primijeni filtere
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Traži
        </Button>
      </form>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Aktivni filteri:</span>
          {getActiveFilterBadges()}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Očisti sve
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmailSearchFilters;
