import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  Tag,
  Clock,
  Printer,
  Download,
  MoreHorizontal,
  Flag,
  FolderInput,
  Mail,
  MailOpen,
  Ban,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  ListChecks,
} from "lucide-react";

interface EmailThreadActionsProps {
  emailId: string;
  isStarred?: boolean;
  isRead?: boolean;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  onToggleRead?: () => void;
  onSnooze?: (duration: string) => void;
  onLabel?: (label: string) => void;
  onMoveToFolder?: (folder: string) => void;
  onMarkSpam?: () => void;
  onBlock?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onAISummarize?: () => void;
  onAIExtractTasks?: () => void;
  onAIDraft?: () => void;
  compact?: boolean;
}

const labels = [
  { id: "work", name: "Posao", color: "bg-blue-500" },
  { id: "personal", name: "Osobno", color: "bg-green-500" },
  { id: "important", name: "Važno", color: "bg-red-500" },
  { id: "finance", name: "Financije", color: "bg-yellow-500" },
  { id: "travel", name: "Putovanja", color: "bg-purple-500" },
];

const folders = [
  { id: "inbox", name: "Inbox" },
  { id: "work", name: "Posao" },
  { id: "personal", name: "Osobno" },
  { id: "receipts", name: "Računi" },
  { id: "archive", name: "Arhiva" },
];

const snoozeDurations = [
  { id: "1h", label: "1 sat" },
  { id: "3h", label: "3 sata" },
  { id: "tomorrow", label: "Sutra ujutro" },
  { id: "weekend", label: "Ovaj vikend" },
  { id: "next_week", label: "Sljedeći tjedan" },
  { id: "custom", label: "Prilagođeno..." },
];

export function EmailThreadActions({
  emailId,
  isStarred = false,
  isRead = true,
  onReply,
  onReplyAll,
  onForward,
  onArchive,
  onDelete,
  onToggleStar,
  onToggleRead,
  onSnooze,
  onLabel,
  onMoveToFolder,
  onMarkSpam,
  onBlock,
  onPrint,
  onDownload,
  onAISummarize,
  onAIExtractTasks,
  onAIDraft,
  compact = false,
}: EmailThreadActionsProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    variant = "ghost",
    className = "",
    shortcut,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    variant?: "ghost" | "outline";
    className?: string;
    shortcut?: string;
  }) => (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={compact ? "sm" : "icon"}
            className={className}
            onClick={onClick}
          >
            <Icon className={compact ? "h-4 w-4" : "h-4 w-4"} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}
            {shortcut && (
              <span className="ml-2 text-muted-foreground">({shortcut})</span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex items-center gap-1">
      {/* Primary actions */}
      <ActionButton icon={Reply} label="Odgovori" onClick={onReply} shortcut="R" />
      <ActionButton
        icon={ReplyAll}
        label="Odgovori svima"
        onClick={onReplyAll}
        shortcut="Shift+R"
      />
      <ActionButton icon={Forward} label="Proslijedi" onClick={onForward} shortcut="F" />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Star */}
      <ActionButton
        icon={Star}
        label={isStarred ? "Ukloni zvjezdicu" : "Dodaj zvjezdicu"}
        onClick={onToggleStar}
        shortcut="S"
        className={isStarred ? "text-yellow-500" : ""}
      />

      {/* Archive & Delete */}
      <ActionButton icon={Archive} label="Arhiviraj" onClick={onArchive} shortcut="E" />
      <ActionButton
        icon={Trash2}
        label="Obriši"
        onClick={onDelete}
        shortcut="Delete"
        className="hover:text-red-500"
      />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Snooze menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Clock className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm font-semibold">Odgodi</div>
          {snoozeDurations.map((duration) => (
            <DropdownMenuItem
              key={duration.id}
              onClick={() => onSnooze?.(duration.id)}
            >
              {duration.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Labels menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Tag className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm font-semibold">Oznake</div>
          {labels.map((label) => (
            <DropdownMenuItem key={label.id} onClick={() => onLabel?.(label.id)}>
              <div className={`w-3 h-3 rounded-full ${label.color} mr-2`} />
              {label.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Tag className="h-4 w-4 mr-2" />
            Stvori novu oznaku...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* More menu */}
      <DropdownMenu open={showMoreMenu} onOpenChange={setShowMoreMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Read/Unread */}
          <DropdownMenuItem onClick={onToggleRead}>
            {isRead ? (
              <>
                <MailOpen className="h-4 w-4 mr-2" />
                Označi kao nepročitano
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Označi kao pročitano
              </>
            )}
          </DropdownMenuItem>

          {/* Move to folder */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="h-4 w-4 mr-2" />
              Premjesti u mapu
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => onMoveToFolder?.(folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* AI Actions */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            AI Akcije
          </div>
          <DropdownMenuItem onClick={onAISummarize}>
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            Sažmi email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAIExtractTasks}>
            <ListChecks className="h-4 w-4 mr-2 text-purple-500" />
            Izvuci zadatke
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAIDraft}>
            <FileText className="h-4 w-4 mr-2 text-purple-500" />
            AI nacrt odgovora
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Spam/Block */}
          <DropdownMenuItem onClick={onMarkSpam}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Prijavi kao spam
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBlock} className="text-red-500">
            <Ban className="h-4 w-4 mr-2" />
            Blokiraj pošiljatelja
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Print & Download */}
          <DropdownMenuItem onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Ispiši
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Preuzmi kao .eml
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Floating action bar for thread view
interface FloatingThreadActionsProps {
  visible: boolean;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onSnooze: () => void;
}

export function FloatingThreadActions({
  visible,
  onReply,
  onArchive,
  onDelete,
  onSnooze,
}: FloatingThreadActionsProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-800 text-white rounded-full px-4 py-2 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={onReply}
        >
          <Reply className="h-4 w-4 mr-1" />
          Odgovori
        </Button>
        <div className="w-px h-6 bg-zinc-700" />
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onArchive}
        >
          <Archive className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onSnooze}
        >
          <Clock className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 hover:text-red-400"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default EmailThreadActions;
