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
  service: "grok" | "openai" | "anthropic";
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
      providesTags: ["Goals"],
    }),

    updateGoals: builder.mutation<UserGoal[], { goals: GoalInput[] }>({
      query: (body) => ({
        url: "/api/v1/settings/goals",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<{ goals: UserGoal[] }>) =>
        response.data.goals,
      // Update cache directly from response - no refetch needed
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedGoals } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getGoals", undefined, () => updatedGoals)
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // Categories
    getCategories: builder.query<UserCategory[], void>({
      query: () => "/api/v1/settings/categories",
      transformResponse: (response: ApiResponse<{ categories: UserCategory[] }>) =>
        response.data.categories,
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<UserCategory, CategoryInput>({
      query: (body) => ({
        url: "/api/v1/settings/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ category: UserCategory }>) =>
        response.data.category,
      // Update cache directly from response - no refetch needed
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newCategory } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              draft.push(newCategory);
            })
          );
        } catch {
          // Error handled by component
        }
      },
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
      // Update cache directly from response - no refetch needed
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCategory } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              const index = draft.findIndex((cat) => cat.id === id);
              if (index !== -1) {
                draft[index] = updatedCategory;
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/settings/categories/${id}`,
        method: "DELETE",
      }),
      // Update cache directly - remove deleted category
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              const index = draft.findIndex((cat) => cat.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
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
      // Update cache directly - add subcategory to parent category
      async onQueryStarted({ categoryId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newSubcategory } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId);
              if (category) {
                category.subcategories.push(newSubcategory);
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    updateSubcategory: builder.mutation<
      UserSubcategory,
      { id: number; categoryId: number; data: Partial<SubcategoryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/settings/subcategories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<{ subcategory: UserSubcategory }>) =>
        response.data.subcategory,
      // Update cache directly - update subcategory in parent category
      async onQueryStarted({ id, categoryId }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedSubcategory } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId);
              if (category) {
                const subIndex = category.subcategories.findIndex((sub) => sub.id === id);
                if (subIndex !== -1) {
                  category.subcategories[subIndex] = updatedSubcategory;
                }
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    deleteSubcategory: builder.mutation<void, { id: number; categoryId: number }>({
      query: ({ id }) => ({
        url: `/api/v1/settings/subcategories/${id}`,
        method: "DELETE",
      }),
      // Update cache directly - remove subcategory from parent category
      async onQueryStarted({ id, categoryId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getCategories", undefined, (draft) => {
              const category = draft.find((cat) => cat.id === categoryId);
              if (category) {
                const subIndex = category.subcategories.findIndex((sub) => sub.id === id);
                if (subIndex !== -1) {
                  category.subcategories.splice(subIndex, 1);
                }
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // AI Services
    getAiServices: builder.query<UserAiServices, void>({
      query: () => "/api/v1/settings/ai-services",
      transformResponse: (response: ApiResponse<{ services: UserAiServices }>) =>
        response.data.services,
      providesTags: ["AiServices"],
    }),

    updateAiServices: builder.mutation<UserAiServices, AiServicesInput>({
      query: (body) => ({
        url: "/api/v1/settings/ai-services",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<{ services: UserAiServices }>) =>
        response.data.services,
      // Update cache directly from response - no refetch needed
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedServices } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getAiServices", undefined, () => updatedServices)
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // API Keys
    getApiKeys: builder.query<UserApiKey[], void>({
      query: () => "/api/v1/settings/api-keys",
      transformResponse: (response: ApiResponse<{ api_keys: UserApiKey[] }>) =>
        response.data.api_keys,
      providesTags: ["ApiKeys"],
    }),

    upsertApiKey: builder.mutation<UserApiKey, ApiKeyInput>({
      query: (body) => ({
        url: "/api/v1/settings/api-keys",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<{ api_key: UserApiKey }>) =>
        response.data.api_key,
      // Update cache directly - upsert (add or update) api key
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newApiKey } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getApiKeys", undefined, (draft) => {
              const index = draft.findIndex((key) => key.service === arg.service);
              if (index !== -1) {
                draft[index] = newApiKey;
              } else {
                draft.push(newApiKey);
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    deleteApiKey: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/settings/api-keys/${id}`,
        method: "DELETE",
      }),
      // Update cache directly - remove deleted api key
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData("getApiKeys", undefined, (draft) => {
              const index = draft.findIndex((key) => key.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // Gmail Apps Script Settings
    getGmailAppScriptSettings: builder.query<
      { app_script_url: string; api_key: string },
      void
    >({
      query: () => "/api/v1/settings/apps-script/settings",
      transformResponse: (
        response: ApiResponse<{ app_script_url: string; api_key: string }>
      ) => response.data,
      providesTags: ["Settings"],
    }),

    saveGmailAppScriptSettings: builder.mutation<
      { app_script_url: string; api_key: string },
      { app_script_url: string; api_key: string }
    >({
      query: (body) => ({
        url: "/api/v1/settings/apps-script/settings",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<{ app_script_url: string; api_key: string }>
      ) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: savedSettings } = await queryFulfilled;
          dispatch(
            settingsApi.util.updateQueryData(
              "getGmailAppScriptSettings",
              undefined,
              () => savedSettings
            )
          );
        } catch {
          // Error handled by component
        }
      },
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
  useGetGmailAppScriptSettingsQuery,
  useSaveGmailAppScriptSettingsMutation,
  useLazyDownloadAppsScriptQuery,
  useGetProcessingLogsQuery,
} = settingsApi;
