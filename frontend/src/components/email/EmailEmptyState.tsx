import { Button } from "@/components/ui/button";
import {
  Inbox,
  Mail,
  Search,
  Star,
  Archive,
  Trash2,
  Filter,
  RefreshCw,
} from "lucide-react";

type EmptyStateType =
  | "inbox"
  | "search"
  | "starred"
  | "archived"
  | "trash"
  | "filtered"
  | "error";

interface EmailEmptyStateProps {
  type?: EmptyStateType;
  searchQuery?: string;
  onCompose?: () => void;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

const emptyStateConfig: Record<
  EmptyStateType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
> = {
  inbox: {
    icon: <Inbox className="h-12 w-12 text-muted-foreground" />,
    title: "Inbox je prazan",
    description: "Nemate novih emailova. Vrijeme je za pauzu!",
  },
  search: {
    icon: <Search className="h-12 w-12 text-muted-foreground" />,
    title: "Nema rezultata pretrage",
    description: "Nismo pronašli emailove koji odgovaraju vašoj pretrazi.",
  },
  starred: {
    icon: <Star className="h-12 w-12 text-muted-foreground" />,
    title: "Nema emailova sa zvjezdicom",
    description: "Dodajte zvjezdicu emailovima koje želite pratiti.",
  },
  archived: {
    icon: <Archive className="h-12 w-12 text-muted-foreground" />,
    title: "Arhiva je prazna",
    description: "Arhivirani emailovi će se pojaviti ovdje.",
  },
  trash: {
    icon: <Trash2 className="h-12 w-12 text-muted-foreground" />,
    title: "Smeće je prazno",
    description: "Obrisani emailovi će se pojaviti ovdje.",
  },
  filtered: {
    icon: <Filter className="h-12 w-12 text-muted-foreground" />,
    title: "Nema emailova koji odgovaraju filterima",
    description: "Pokušajte prilagoditi filtere za više rezultata.",
  },
  error: {
    icon: <RefreshCw className="h-12 w-12 text-destructive" />,
    title: "Greška pri učitavanju",
    description: "Došlo je do greške. Molimo pokušajte ponovo.",
  },
};

export function EmailEmptyState({
  type = "inbox",
  searchQuery,
  onCompose,
  onClearFilters,
  onRetry,
}: EmailEmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-muted/50">{config.icon}</div>

      <h3 className="text-lg font-medium mb-2">{config.title}</h3>

      <p className="text-muted-foreground max-w-md mb-6">
        {type === "search" && searchQuery ? (
          <>
            Nismo pronašli emailove za: <strong>"{searchQuery}"</strong>
          </>
        ) : (
          config.description
        )}
      </p>

      <div className="flex items-center gap-3">
        {type === "inbox" && onCompose && (
          <Button onClick={onCompose}>
            <Mail className="h-4 w-4 mr-2" />
            Napiši email
          </Button>
        )}

        {(type === "search" || type === "filtered") && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Očisti filtere
          </Button>
        )}

        {type === "error" && onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Pokušaj ponovo
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmailEmptyState;
