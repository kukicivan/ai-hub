import { baseApi } from "@/redux/api/baseApi";

export type EmailMessage = {
  id: string;
  subject: string;
  from: string;
  to: string;
  content: string;
  date: string;
  unread?: boolean;
  important?: boolean;
  hasAttachments?: boolean;
  priority?: "high" | "medium" | "low";
  aiAnalysis?: {
    sentiment: "positive" | "negative" | "neutral";
    summary: string;
    actionItems: string[];
    priority: "high" | "medium" | "low";
    confidence?: number;
  };
};

export const emailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<EmailMessage[], void>({
      query: () => ({
        url: "/api/email/messages",
        method: "GET",
      }),
      providesTags: ["EmailMessages"],
    }),
    analyzeEmail: builder.mutation<EmailMessage, string>({
      query: (messageId) => ({
        url: `/api/email/${messageId}/analyze`,
        method: "POST",
      }),
      // Invalidate the cache for the specific message
      invalidatesTags: ["EmailMessages"],
    }),
  }),
  overrideExisting: false,
});
