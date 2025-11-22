import { baseApi } from "@/redux/api/baseApi";

// Types
export interface UserType {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  address_line_3?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  user_type_id?: number | null;
  user_type?: UserType | null;
  roles?: Role[];
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from?: number | null;
  to?: number | null;
}

export interface UsersListResponse {
  users: ManagedUser[];
  pagination: Pagination;
}

export interface UserResponse {
  user: ManagedUser;
  message?: string;
}

export interface UserStats {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  users_this_month: number;
  users_last_month: number;
  growth_percentage: number;
  users_by_type: Array<{
    user_type_id: number | null;
    user_type_name: string;
    count: number;
  }>;
}

export interface UsersListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  user_type_id?: number;
  status?: "verified" | "unverified" | "all";
  created_from?: string;
  created_to?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type_id: number;
  phone?: string;
  bio?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  user_type_id?: number;
  phone?: string | null;
  bio?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  address_line_3?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
}

export interface BulkDeletePayload {
  ids: number[];
}

export interface BulkUpdateTypePayload {
  ids: number[];
  user_type_id: number;
}

export interface ExportResponse {
  data: Array<Record<string, unknown>>;
  columns: string[];
}

// Helper function to check wrapped response
function isWrapped<T>(res: T | { data: T }): res is { data: T } {
  return typeof res === "object" && res !== null && "data" in (res as Record<string, unknown>);
}

const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get a user's list with pagination and filters
    getUsers: builder.query<UsersListResponse, UsersListParams>({
      query: (params) => ({
        url: "/api/v1/users",
        method: "GET",
        params,
      }),
      transformResponse: (response: UsersListResponse | { data: UsersListResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // Get a single user by ID
    getUser: builder.query<UserResponse, number>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response: UserResponse | { data: UserResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    // Create a new user
    createUser: builder.mutation<UserResponse, CreateUserPayload>({
      query: (userData) => ({
        url: "/api/v1/users",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: UserResponse | { data: UserResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Update user
    updateUser: builder.mutation<UserResponse, { id: number; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: UserResponse | { data: UserResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Reset user password
    resetUserPassword: builder.mutation<
      { message: string },
      { id: number; data: ResetPasswordPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/users/${id}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),

    // Upload user avatar
    uploadUserAvatar: builder.mutation<UserResponse, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: `/api/v1/users/${id}/avatar`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response: UserResponse | { data: UserResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Delete user avatar
    deleteUserAvatar: builder.mutation<UserResponse, number>({
      query: (id) => ({
        url: `/api/v1/users/${id}/avatar`,
        method: "DELETE",
      }),
      transformResponse: (response: UserResponse | { data: UserResponse }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Bulk delete users
    bulkDeleteUsers: builder.mutation<
      { message: string; deleted_count: number },
      BulkDeletePayload
    >({
      query: (data) => ({
        url: "/api/v1/users/bulk-delete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Bulk update user types
    bulkUpdateUserType: builder.mutation<
      { message: string; updated_count: number },
      BulkUpdateTypePayload
    >({
      query: (data) => ({
        url: "/api/v1/users/bulk-update-type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Get user statistics
    getUserStats: builder.query<{ stats: UserStats }, void>({
      query: () => ({
        url: "/api/v1/users/stats",
        method: "GET",
      }),
      transformResponse: (response: { stats: UserStats } | { data: { stats: UserStats } }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
    }),

    // Export users
    exportUsers: builder.mutation<ExportResponse, void>({
      query: () => ({
        url: "/api/v1/users/export",
        method: "POST",
      }),
      transformResponse: (response: unknown): ExportResponse => {
        const res = response as ExportResponse | { data: ExportResponse };
        if (typeof res === "object" && res !== null && "data" in res) {
          const wrapped = res as { data: ExportResponse };
          if (
            typeof wrapped.data === "object" &&
            wrapped.data !== null &&
            "columns" in wrapped.data
          ) {
            return wrapped.data;
          }
        }
        return res as ExportResponse;
      },
    }),

    // Get user types
    getUserTypes: builder.query<{ userTypes: UserType[] }, void>({
      query: () => ({
        url: "/api/v1/user-types",
        method: "GET",
      }),
      transformResponse: (
        response: { userTypes: UserType[] } | { data: { userTypes: UserType[] } }
      ) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
    }),

    // Get roles
    getRoles: builder.query<{ roles: Role[] }, void>({
      query: () => ({
        url: "/api/v1/roles",
        method: "GET",
      }),
      transformResponse: (response: { roles: Role[] } | { data: { roles: Role[] } }) => {
        if (isWrapped(response)) {
          return response.data;
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useUploadUserAvatarMutation,
  useDeleteUserAvatarMutation,
  useBulkDeleteUsersMutation,
  useBulkUpdateUserTypeMutation,
  useGetUserStatsQuery,
  useExportUsersMutation,
  useGetUserTypesQuery,
  useGetRolesQuery,
  useLazyGetUsersQuery,
} = userManagementApi;

export { userManagementApi };
