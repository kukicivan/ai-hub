import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse, PaginationMeta } from "@/redux/api/apiUtils";

// Types
export interface UserGoal {
  id: number;
  user_id: number;
  type: "primary" | "secondary";
  key: string;
  value: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubcategory {
  id: number;
  category_id: number;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserCategory {
  id: number;
  user_id: number;
  name: string;
  display_name: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  subcategories: UserSubcategory[];
  created_at: string;
  updated_at: string;
}

export interface UserAiServices {
  id: number;
  user_id: number;
  gmail_active: boolean;
  viber_active: boolean;
  whatsapp_active: boolean;
  telegram_active: boolean;
  social_active: boolean;
  slack_active: boolean;
  gmail_settings: Record<string, unknown> | null;
  viber_settings: Record<string, unknown> | null;
  whatsapp_settings: Record<string, unknown> | null;
  telegram_settings: Record<string, unknown> | null;
  social_settings: Record<string, unknown> | null;
  slack_settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UserApiKey {
  id: number;
  service: string;
  masked_key: string;
  is_active: boolean;
  is_valid: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ProcessingLog {
  id: number;
  user_id: number;
  message_id: number | null;
  status: "success" | "skipped" | "failed";
  skip_reason: string | null;
  estimated_tokens: number | null;
  token_limit: number | null;
  error_message: string | null;
  created_at: string;
  message: {
    id: number;
    message_id: string;
    thread_id: string;
  } | null;
}

// Paginated logs response (uses shared PaginationMeta from apiUtils)
interface PaginatedLogsResponse<T> {
  success: boolean;
  data: {
    logs: T[];
    meta: PaginationMeta;
  };
  message: string;
}

// Input types
export interface GoalInput {
  key: string;
  value: string;
  type: "primary" | "secondary";
  is_active?: boolean;
}

export interface CategoryInput {
  name: string;
  display_name: string;
  description?: string;
  priority: "high" | "medium" | "low";
  subcategories?: { name: string; display_name: string; description?: string }[];
}

export interface SubcategoryInput {
  name: string;
  display_name: string;
  description?: string;
}

export interface ApiKeyInput {
  service: "grok" | "openai" | "github" | "slack";
  key: string;
  expires_at?: string;
}

export interface AiServicesInput {
  gmail_active?: boolean;
  viber_active?: boolean;
  whatsapp_active?: boolean;
  telegram_active?: boolean;
  social_active?: boolean;
  slack_active?: boolean;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initialize default settings
    initializeSettings: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/api/v1/settings/initialize",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Goals
    getGoals: builder.query<UserGoal[], void>({
      query: () => "/api/v1/settings/goals",
      transformResponse: (response: ApiResponse<{ goals: UserGoal[] }>) =>
        response.data.goals,
      providesTags: ["Settings"],
    }),

    updateGoals: builder.mutation<UserGoal[], { goals: GoalInput[] }>({
      query: (body) => ({
        url: "/api/v1/settings/goals",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<{ goals: UserGoal[] }>) =>
        response.data.goals,
      invalidatesTags: ["Settings"],
    }),

    // Categories
    getCategories: builder.query<UserCategory[], void>({
      query: () => "/api/v1/settings/categories",
      transformResponse: (response: ApiResponse<{ categories: UserCategory[] }>) =>
        response.data.categories,
      providesTags: ["Settings"],
    }),

    createCategory: builder.mutation<UserCategory, CategoryInput>({
      query: (body) => ({
        url: "/api/v1/settings/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ category: UserCategory }>) =>
        response.data.category,
      invalidatesTags: ["Settings"],
    }),

    updateCategory: builder.mutation<
      UserCategory,
      { id: number; data: Partial<CategoryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/settings/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ category: UserCategory }>) =>
        response.data.category,
      invalidatesTags: ["Settings"],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/settings/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Subcategories
    createSubcategory: builder.mutation<
      UserSubcategory,
      { categoryId: number; data: SubcategoryInput }
    >({
      query: ({ categoryId, data }) => ({
        url: `/api/v1/settings/categories/${categoryId}/subcategories`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ subcategory: UserSubcategory }>) =>
        response.data.subcategory,
      invalidatesTags: ["Settings"],
    }),

    updateSubcategory: builder.mutation<
      UserSubcategory,
      { id: number; data: Partial<SubcategoryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/settings/subcategories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ subcategory: UserSubcategory }>) =>
        response.data.subcategory,
      invalidatesTags: ["Settings"],
    }),

    deleteSubcategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/settings/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // AI Services
    getAiServices: builder.query<UserAiServices, void>({
      query: () => "/api/v1/settings/ai-services",
      transformResponse: (response: ApiResponse<{ services: UserAiServices }>) =>
        response.data.services,
      providesTags: ["Settings"],
    }),

    updateAiServices: builder.mutation<UserAiServices, AiServicesInput>({
      query: (body) => ({
        url: "/api/v1/settings/ai-services",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<{ services: UserAiServices }>) =>
        response.data.services,
      invalidatesTags: ["Settings"],
    }),

    // API Keys
    getApiKeys: builder.query<UserApiKey[], void>({
      query: () => "/api/v1/settings/api-keys",
      transformResponse: (response: ApiResponse<{ api_keys: UserApiKey[] }>) =>
        response.data.api_keys,
      providesTags: ["Settings"],
    }),

    upsertApiKey: builder.mutation<UserApiKey, ApiKeyInput>({
      query: (body) => ({
        url: "/api/v1/settings/api-keys",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ api_key: UserApiKey }>) =>
        response.data.api_key,
      invalidatesTags: ["Settings"],
    }),

    deleteApiKey: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/settings/api-keys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Apps Script Download
    downloadAppsScript: builder.query<Blob, void>({
      query: () => ({
        url: "/api/v1/settings/apps-script/download",
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Processing Logs
    getProcessingLogs: builder.query<
      PaginatedLogsResponse<ProcessingLog>["data"],
      { page?: number; per_page?: number; status?: string }
    >({
      query: (params) => ({
        url: "/api/v1/settings/processing-logs",
        params,
      }),
      transformResponse: (response: PaginatedLogsResponse<ProcessingLog>) =>
        response.data,
      providesTags: ["Settings"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitializeSettingsMutation,
  useGetGoalsQuery,
  useUpdateGoalsMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetAiServicesQuery,
  useUpdateAiServicesMutation,
  useGetApiKeysQuery,
  useUpsertApiKeyMutation,
  useDeleteApiKeyMutation,
  useLazyDownloadAppsScriptQuery,
  useGetProcessingLogsQuery,
} = settingsApi;
