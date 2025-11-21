import { useState, useEffect, useCallback } from "react";
import api, { ApiMessage, MessageFilters } from "../services/api";

interface UseMessagesResult {
  messages: ApiMessage[];
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null;
  fetchMessages: (filters?: MessageFilters) => Promise<void>;
  refreshMessages: () => Promise<void>;
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
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MessageFilters>(initialFilters);
  const [meta, setMeta] = useState<UseMessagesResult["meta"]>(null);

  const fetchMessages = useCallback(
    async (newFilters?: MessageFilters) => {
      try {
        setLoading(true);
        setError(null);

        const filterParams = newFilters || filters;
        const response =
          apiVersion === "v5"
            ? await api.getMessagesV5(filterParams)
            : await api.getMessages(filterParams);

        if (response.success) {
          setMessages(response.data);
          setMeta(response.meta || null);
          if (newFilters) {
            setFilters(filterParams);
          }
        } else {
          setError(response.error || "Failed to fetch messages");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, apiVersion]
  );

  const refreshMessages = useCallback(async () => {
    await fetchMessages(filters);
  }, [filters, fetchMessages]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await api.markAsRead(id);

      if (response.success) {
        // Update local state
        setMessages((prev) => prev.map((msg) => (msg.id === id ? response.data : msg)));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
      throw err;
    }
  }, []);

  const markAsUnread = useCallback(async (id: number) => {
    try {
      const response = await api.markAsUnread(id);

      if (response.success) {
        // Update local state
        setMessages((prev) => prev.map((msg) => (msg.id === id ? response.data : msg)));
      }
    } catch (err) {
      console.error("Failed to mark as unread:", err);
      throw err;
    }
  }, []);

  const analyzeMessage = useCallback(async (id: number) => {
    try {
      const response = await api.analyzeMessage(id);

      if (response.success) {
        // Update local state with new message data including AI analysis
        setMessages((prev) => prev.map((msg) => (msg.id === id ? response.data : msg)));
      }
    } catch (err) {
      console.error("Failed to analyze message:", err);
      throw err;
    }
  }, []);

  const bulkMarkAsRead = useCallback(async (ids: number[]) => {
    try {
      const response = await api.bulkMarkAsRead(ids);

      if (response.success) {
        // Update local state for all affected messages
        setMessages((prev) =>
          prev.map((msg) => (ids.includes(msg.id) ? { ...msg, unread: false } : msg))
        );
      }
    } catch (err) {
      console.error("Failed to bulk mark as read:", err);
      throw err;
    }
  }, []);

  const bulkDelete = useCallback(async (ids: number[]) => {
    try {
      const response = await api.bulkDelete(ids);

      if (response.success) {
        // Remove deleted messages from local state
        setMessages((prev) => prev.filter((msg) => !ids.includes(msg.id)));
      }
    } catch (err) {
      console.error("Failed to bulk delete:", err);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
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
