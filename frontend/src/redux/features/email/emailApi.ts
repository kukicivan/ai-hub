import { baseApi } from "@/redux/api/baseApi";
import { PaginationMeta } from "@/redux/api/apiUtils";

// Message type matching API response
export interface EmailMessage {
  id: number; // Database ID
  email_id: string; // Gmail message ID
  sender: string;
  subject: string;
  summary: string;
  sentiment: {
    tone: string;
    urgency_score: number;
    business_potential: number;
  };
  gmail_link: string;
  action_steps: Array<{
    type: string;
    deadline: string | null;
    timeline: string;
    description: string;
    estimated_time: number;
    template_suggestion: string | null;
  }>;
  html_analysis: {
    cleaned_text: string;
    is_newsletter: boolean;
    urgency_markers: string[];
    structure_detected: string;
  };
  classification: {
    primary_category: string;
    subcategory: string;
    confidence_score: number;
    matched_keywords: string[];
  };
  recommendation: {
    text: string;
    reasoning: string;
    priority_level: string;
    roi_estimate: string;
  };
  unread: boolean;
  starred: boolean;
  important: boolean;
  priority: string;
  received_at: string;
  synced_at: string;
  ai_processed_at: string;
  ai_status: string;
}

export interface MessageFilters {
  page?: number;
  per_page?: number;
  q?: string;
  unread?: boolean;
  priority?: "low" | "normal" | "high";
  channel_id?: number;
  sort?: "created_at" | "message_timestamp" | "priority";
}

// Email-specific paginated response (uses centralized PaginationMeta)
export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: string;
}

// SRS 12.2 standardized response format for email endpoints
interface StandardizedEmailResponse<T> {
  success: boolean;
  data: {
    messages: T;
    meta?: PaginationMeta;
  };
  message: string;
}

// Helper to unwrap SRS 12.2 standardized email response
function unwrapEmailResponse<T>(
  response: StandardizedEmailResponse<T> | PaginatedResponse<T>
): PaginatedResponse<T> {
  // Handle new SRS 12.2 format: { success, data: { messages, meta }, message }
  if (
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null &&
    "messages" in response.data
  ) {
    const standardized = response as StandardizedEmailResponse<T>;
    return {
      success: standardized.success,
      data: standardized.data.messages,
      meta: standardized.data.meta,
    };
  }
  // Handle legacy format
  return response as PaginatedResponse<T>;
}

export const emailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get messages list - GET /api/v1/emails/messages
    getMessages: builder.query<PaginatedResponse<EmailMessage[]>, MessageFilters>({
      query: (filters) => ({
        url: "/api/v1/emails/messages",
        method: "GET",
        params: filters || undefined,
      }),
      transformResponse: (response: PaginatedResponse<EmailMessage[]>) =>
        unwrapEmailResponse(response),
      providesTags: ["EmailMessages"],
    }),

    // Get messages v5 (with AI analysis) - GET /api/v1/emails/messages/v5
    getMessagesV5: builder.query<PaginatedResponse<EmailMessage[]>, MessageFilters>({
      query: (filters) => ({
        url: "/api/v1/emails/messages/v5",
        method: "GET",
        params: filters || undefined,
      }),
      transformResponse: (response: PaginatedResponse<EmailMessage[]>) =>
        unwrapEmailResponse(response),
      providesTags: ["EmailMessages"],
    }),

    // Get a single message - GET /api/v1/emails/{id}
    // Updated to handle SRS 12.2 format: { success, data: { message: {...} }, message }
    getMessage: builder.query<EmailMessage, number>({
      query: (id) => ({
        url: `/api/v1/emails/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: { message: EmailMessage };
        message: string;
      }) => response.data.message,
      providesTags: (_result, _error, id) => [{ type: "EmailMessages", id }],
    }),

    // Analyze a message with AI - POST /api/v1/emails/{id}/analyze
    analyzeMessage: builder.mutation<EmailMessage, number>({
      query: (id) => ({
        url: `/api/v1/emails/${id}/analyze`,
        method: "POST",
      }),
      transformResponse: (response: PaginatedResponse<EmailMessage>) =>
        unwrapEmailResponse(response).data,
      invalidatesTags: ["EmailMessages"],
    }),

    // Mark as read - PATCH /api/v1/emails/{id}/read
    markAsRead: builder.mutation<EmailMessage, number>({
      query: (id) => ({
        url: `/api/v1/emails/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (response: PaginatedResponse<EmailMessage>) =>
        unwrapEmailResponse(response).data,
      invalidatesTags: ["EmailMessages"],
    }),

    // Mark as unread - PATCH /api/v1/emails/{id}/unread
    markAsUnread: builder.mutation<EmailMessage, number>({
      query: (id) => ({
        url: `/api/v1/emails/${id}/unread`,
        method: "PATCH",
      }),
      transformResponse: (response: PaginatedResponse<EmailMessage>) =>
        unwrapEmailResponse(response).data,
      invalidatesTags: ["EmailMessages"],
    }),

    // Bulk mark as read - POST /api/v1/emails/bulk-read
    bulkMarkAsRead: builder.mutation<{ updated: number }, number[]>({
      query: (ids) => ({
        url: "/api/v1/emails/bulk-read",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["EmailMessages"],
    }),

    // Bulk delete - POST /api/v1/emails/bulk-delete
    bulkDelete: builder.mutation<{ deleted: number }, number[]>({
      query: (ids) => ({
        url: "/api/v1/emails/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["EmailMessages"],
    }),

    // Respond to email - POST /api/v1/emails/respond
    // Updated payload to match EmailResponseController expectations
    respondToEmail: builder.mutation<
      { success: boolean; data: unknown; message: string },
      { from: string; to?: string; subject?: string; body: string }
    >({
      query: (data) => ({
        url: "/api/v1/emails/respond",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EmailMessages"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMessagesQuery,
  useGetMessagesV5Query,
  useGetMessageQuery,
  useAnalyzeMessageMutation,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useBulkMarkAsReadMutation,
  useBulkDeleteMutation,
  useRespondToEmailMutation,
} = emailApi;
