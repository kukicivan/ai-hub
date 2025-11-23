import { useState, useCallback } from "react";
import { EmailSearchFilters } from "./EmailSearchFilters";
import { EmailCategoryTabs } from "./EmailCategoryTabs";
import { EmailBulkActionsToolbar } from "./EmailBulkActionsToolbar";
import { EmailListItem } from "./EmailListItem";
import { EmailListSkeleton, EmailDetailSkeleton } from "./EmailListSkeleton";
import { EmailDetailPanel } from "./EmailDetailPanel";
import { EmailEmptyState } from "./EmailEmptyState";
import { EmailComposeModal } from "./EmailComposeModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenSquare, RefreshCw, ChevronLeft } from "lucide-react";
import {
  useGetMessagesV5Query,
  useMarkAsReadMutation,
  useStarEmailMutation,
  useUnstarEmailMutation,
  useArchiveEmailMutation,
  useTrashEmailMutation,
  useAnalyzeMessageMutation,
  EmailMessage,
  MessageFilters,
} from "@/redux/features/email/emailApi";
import { useToast } from "@/hooks/useToast";

interface InboxLayoutProps {
  initialCategory?: string;
  initialFilters?: MessageFilters;
}

export function InboxLayout({
  initialCategory = "inbox",
  initialFilters = {},
}: InboxLayoutProps) {
  const toast = useToast();

  // State
  const [category, setCategory] = useState(initialCategory);
  const [filters, setFilters] = useState<MessageFilters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ from: string; subject: string } | undefined>();

  // Queries and mutations
  const {
    data: emailsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMessagesV5Query({
    ...filters,
    in_inbox: category === "inbox" ? true : undefined,
    in_trash: category === "trash" ? true : undefined,
    starred: category === "starred" ? true : undefined,
    priority: category === "urgent" ? "high" : filters.priority,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [starEmail] = useStarEmailMutation();
  const [unstarEmail] = useUnstarEmailMutation();
  const [archiveEmail] = useArchiveEmailMutation();
  const [trashEmail] = useTrashEmailMutation();
  const [analyzeMessage] = useAnalyzeMessageMutation();

  const emails = emailsData?.data || [];

  // Handlers
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSelectedIds([]);
    setSelectedEmail(null);
  };

  const handleFiltersChange = (newFilters: MessageFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    refetch();
  };

  const handleSelectEmail = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(emails.map((e) => e.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleEmailClick = useCallback(async (email: EmailMessage) => {
    setSelectedEmail(email);
    if (email.unread) {
      try {
        await markAsRead(email.id).unwrap();
      } catch {
        // Silently fail
      }
    }
  }, [markAsRead]);

  const handleStar = async (id: number, starred: boolean) => {
    try {
      if (starred) {
        await starEmail(id).unwrap();
      } else {
        await unstarEmail(id).unwrap();
      }
    } catch {
      toast.error("Greška pri označavanju");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveEmail(id).unwrap();
      toast.success("Email arhiviran");
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
      }
    } catch {
      toast.error("Greška pri arhiviranju");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await trashEmail(id).unwrap();
      toast.success("Email obrisan");
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
      }
    } catch {
      toast.error("Greška pri brisanju");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedEmail) return;
    try {
      await analyzeMessage(selectedEmail.id).unwrap();
      toast.success("Email analiziran");
      refetch();
    } catch {
      toast.error("Greška pri analizi");
    }
  };

  const handleReply = () => {
    if (selectedEmail) {
      setReplyTo({ from: selectedEmail.sender, subject: selectedEmail.subject });
      setComposeOpen(true);
    }
  };

  const handleCompose = () => {
    setReplyTo(undefined);
    setComposeOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedEmail(null);
  };

  // Category counts (mock - would come from API)
  const categoryCounts = {
    inbox: emails.filter((e) => !e.starred).length,
    starred: emails.filter((e) => e.starred).length,
    urgent: emails.filter((e) => e.priority === "high").length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Osvježi
          </Button>
          <Button size="sm" onClick={handleCompose}>
            <PenSquare className="h-4 w-4 mr-2" />
            Novi email
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 border-b">
        <EmailSearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />
      </div>

      {/* Category Tabs */}
      <EmailCategoryTabs
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
        showSmartCategories={true}
        showSystemCategories={true}
      />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <EmailBulkActionsToolbar
          selectedIds={selectedIds}
          totalCount={emails.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onActionComplete={() => {
            handleClearSelection();
            refetch();
          }}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className={`${selectedEmail ? "hidden md:block md:w-2/5 lg:w-1/3" : "w-full"} border-r overflow-hidden`}>
          <ScrollArea className="h-full">
            {isLoading ? (
              <EmailListSkeleton count={8} />
            ) : emails.length === 0 ? (
              <EmailEmptyState
                type={filters.q ? "search" : category === "starred" ? "starred" : "inbox"}
                searchQuery={filters.q}
                onCompose={handleCompose}
                onClearFilters={() => {
                  setFilters({});
                  handleSearch();
                }}
              />
            ) : (
              <div>
                {emails.map((email) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    isSelected={selectedIds.includes(email.id)}
                    onSelect={handleSelectEmail}
                    onClick={handleEmailClick}
                    onStar={handleStar}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Email Detail */}
        {selectedEmail && (
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <EmailDetailSkeleton />
            ) : (
              <EmailDetailPanel
                email={selectedEmail}
                onClose={handleCloseDetail}
                onReply={handleReply}
                onReplyAll={handleReply}
                onForward={() => {
                  setReplyTo({ from: "", subject: `Fwd: ${selectedEmail.subject}` });
                  setComposeOpen(true);
                }}
                onStar={(starred) => handleStar(selectedEmail.id, starred)}
                onArchive={() => handleArchive(selectedEmail.id)}
                onDelete={() => handleDelete(selectedEmail.id)}
                onAnalyze={handleAnalyze}
              />
            )}
          </div>
        )}

        {/* Mobile back button when viewing detail */}
        {selectedEmail && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 left-4 md:hidden z-50 h-12 w-12 rounded-full bg-background shadow-lg border"
            onClick={handleCloseDetail}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Compose Modal */}
      <EmailComposeModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        replyTo={replyTo}
      />
    </div>
  );
}

export default InboxLayout;
