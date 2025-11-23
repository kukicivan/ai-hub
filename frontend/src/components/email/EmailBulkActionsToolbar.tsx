import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Trash2,
  Mail,
  MailOpen,
  Star,
  StarOff,
  Tag,
  MoreHorizontal,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  useBulkMarkAsReadMutation,
  useBulkMarkAsUnreadMutation,
  useBulkTrashMutation,
  useBulkArchiveMutation,
} from "@/redux/features/email/emailApi";
import { useToast } from "@/hooks/useToast";

interface EmailBulkActionsToolbarProps {
  selectedIds: number[];
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onActionComplete?: () => void;
}

export function EmailBulkActionsToolbar({
  selectedIds,
  totalCount,
  onSelectAll,
  onClearSelection,
  onActionComplete,
}: EmailBulkActionsToolbarProps) {
  const toast = useToast();
  const [bulkMarkAsRead, { isLoading: isMarkingRead }] = useBulkMarkAsReadMutation();
  const [bulkMarkAsUnread, { isLoading: isMarkingUnread }] = useBulkMarkAsUnreadMutation();
  const [bulkTrash, { isLoading: isTrashing }] = useBulkTrashMutation();
  const [bulkArchive, { isLoading: isArchiving }] = useBulkArchiveMutation();

  const isLoading = isMarkingRead || isMarkingUnread || isTrashing || isArchiving;
  const selectedCount = selectedIds.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleMarkAsRead = async () => {
    try {
      await bulkMarkAsRead(selectedIds).unwrap();
      toast.success(`${selectedCount} emailova označeno kao pročitano`);
      onClearSelection();
      onActionComplete?.();
    } catch {
      toast.error("Greška pri označavanju emailova");
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      await bulkMarkAsUnread(selectedIds).unwrap();
      toast.success(`${selectedCount} emailova označeno kao nepročitano`);
      onClearSelection();
      onActionComplete?.();
    } catch {
      toast.error("Greška pri označavanju emailova");
    }
  };

  const handleArchive = async () => {
    try {
      await bulkArchive(selectedIds).unwrap();
      toast.success(`${selectedCount} emailova arhivirano`);
      onClearSelection();
      onActionComplete?.();
    } catch {
      toast.error("Greška pri arhiviranju emailova");
    }
  };

  const handleTrash = async () => {
    try {
      await bulkTrash(selectedIds).unwrap();
      toast.success(`${selectedCount} emailova premješteno u smeće`);
      onClearSelection();
      onActionComplete?.();
    } catch {
      toast.error("Greška pri brisanju emailova");
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/50 border-b animate-in slide-in-from-top-2">
      {/* Selection Info */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onClearSelection : onSelectAll}
          className="h-8 px-2"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <Badge variant="secondary" className="font-medium">
          {selectedCount} odabrano
        </Badge>
        {!allSelected && totalCount > selectedCount && (
          <Button
            variant="link"
            size="sm"
            onClick={onSelectAll}
            className="h-auto p-0 text-xs"
          >
            Odaberi sve ({totalCount})
          </Button>
        )}
      </div>

      <div className="h-4 w-px bg-border mx-2" />

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAsRead}
          disabled={isLoading}
          className="h-8"
          title="Označi kao pročitano"
        >
          <MailOpen className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Pročitano</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAsUnread}
          disabled={isLoading}
          className="h-8"
          title="Označi kao nepročitano"
        >
          <Mail className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Nepročitano</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleArchive}
          disabled={isLoading}
          className="h-8"
          title="Arhiviraj"
        >
          <Archive className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Arhiviraj</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleTrash}
          disabled={isLoading}
          className="h-8 text-destructive hover:text-destructive"
          title="Obriši"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Obriši</span>
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8" disabled={isLoading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkAsRead}>
              <MailOpen className="h-4 w-4 mr-2" />
              Označi kao pročitano
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkAsUnread}>
              <Mail className="h-4 w-4 mr-2" />
              Označi kao nepročitano
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Dodaj zvjezdicu
            </DropdownMenuItem>
            <DropdownMenuItem>
              <StarOff className="h-4 w-4 mr-2" />
              Ukloni zvjezdicu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Tag className="h-4 w-4 mr-2" />
              Dodaj oznaku
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Arhiviraj
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTrash} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Premjesti u smeće
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clear Selection */}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8"
        >
          <X className="h-4 w-4 mr-1" />
          Poništi
        </Button>
      </div>
    </div>
  );
}

export default EmailBulkActionsToolbar;
