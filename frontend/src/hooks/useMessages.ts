import { useMemo, useCallback, useState } from "react";
import {
  useGetMessagesQuery,
  useGetMessagesV5Query,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useAnalyzeMessageMutation,
  useBulkMarkAsReadMutation,
  useBulkDeleteMutation,
  EmailMessage,
  MessageFilters,
} from "@/redux/features/email/emailApi";

interface UseMessagesResult {
  messages: EmailMessage[];
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null;
  fetchMessages: (filters?: MessageFilters) => void;
  refreshMessages: () => void;
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  analyzeMessage: (id: number) => Promise<void>;
  bulkMarkAsRead: (ids: number[]) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
}

export function useMessages(
  initialFilters: MessageFilters = {},
  apiVersion?: "v5"
): UseMessagesResult {
  const [filters, setFilters] = useState<MessageFilters>(initialFilters);

  // Call both hooks unconditionally (React rules of hooks)
  // Use skip option to prevent unnecessary API calls
  const v5Result = useGetMessagesV5Query(filters, { skip: apiVersion !== "v5" });
  const v1Result = useGetMessagesQuery(filters, { skip: apiVersion === "v5" });

  // Select the appropriate result based on API version
  const queryResult = apiVersion === "v5" ? v5Result : v1Result;
  const { data, isLoading, error, refetch } = queryResult;

  // Mutations
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAsUnreadMutation] = useMarkAsUnreadMutation();
  const [analyzeMessageMutation] = useAnalyzeMessageMutation();
  const [bulkMarkAsReadMutation] = useBulkMarkAsReadMutation();
  const [bulkDeleteMutation] = useBulkDeleteMutation();

  // Extract messages and meta from response
  const messages = useMemo(() => data?.data || [], [data]);
  const meta = useMemo(() => data?.meta || null, [data]);

  // Error handling
  const errorMessage = useMemo(() => {
    if (error) {
      if ("status" in error) {
        return `Greška: ${error.status}`;
      }
      return error.message || "Nepoznata greška";
    }
    return null;
  }, [error]);

  // Fetch with new filters
  const fetchMessages = useCallback((newFilters?: MessageFilters) => {
    if (newFilters) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  }, []);

  // Refresh current data
  const refreshMessages = useCallback(() => {
    refetch();
  }, [refetch]);

  // Mark single message as read
  const markAsRead = useCallback(
    async (id: number) => {
      try {
        await markAsReadMutation(id).unwrap();
      } catch (err) {
        console.error("Greška pri označavanju kao pročitano:", err);
        throw err;
      }
    },
    [markAsReadMutation]
  );

  // Mark single message as unread
  const markAsUnread = useCallback(
    async (id: number) => {
      try {
        await markAsUnreadMutation(id).unwrap();
      } catch (err) {
        console.error("Greška pri označavanju kao nepročitano:", err);
        throw err;
      }
    },
    [markAsUnreadMutation]
  );

  // Analyze message with AI
  const analyzeMessage = useCallback(
    async (id: number) => {
      try {
        await analyzeMessageMutation(id).unwrap();
      } catch (err) {
        console.error("Greška pri AI analizi:", err);
        throw err;
      }
    },
    [analyzeMessageMutation]
  );

  // Bulk mark as read
  const bulkMarkAsRead = useCallback(
    async (ids: number[]) => {
      try {
        await bulkMarkAsReadMutation(ids).unwrap();
      } catch (err) {
        console.error("Greška pri masovnom označavanju:", err);
        throw err;
      }
    },
    [bulkMarkAsReadMutation]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    async (ids: number[]) => {
      try {
        await bulkDeleteMutation(ids).unwrap();
      } catch (err) {
        console.error("Greška pri brisanju:", err);
        throw err;
      }
    },
    [bulkDeleteMutation]
  );

  return {
    messages,
    loading: isLoading,
    error: errorMessage,
    meta,
    fetchMessages,
    refreshMessages,
    markAsRead,
    markAsUnread,
    analyzeMessage,
    bulkMarkAsRead,
    bulkDelete,
  };
}

export default useMessages;
