import { baseApi } from "@/redux/api/baseApi";
import { setUser, TUser } from "../auth/authSlice";
import {
  hasDataProperty,
  extractMessage as extractMessageUtil,
  ApiResponse,
} from "@/redux/api/apiUtils";

// Profile update payload
export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  bio?: string;
  avatar?: File | string;
}

// Password change payload
export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// API Response types
type ProfileResponse =
  | { user: TUser; message?: string }
  | { data: { user: TUser }; success?: boolean; message?: string };

// SRS 12.2 standardized response for password operations
type PasswordResponse = ApiResponse<unknown[]> | { message: string };

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile - GET /api/v1/users/me
    getProfile: builder.query<{ user: TUser }, void>({
      query: () => ({
        url: "/api/v1/users/me",
        method: "GET",
      }),
      transformResponse: (response: ProfileResponse) => {
        if (hasDataProperty(response)) {
          return response.data;
        }
        return response;
      },
      providesTags: ["User"],
    }),

    // Update user profile - PUT /api/v1/users/me
    updateProfile: builder.mutation<{ user: TUser; message?: string }, UpdateProfilePayload>({
      query: (profileData) => {
        // Handle file upload with FormData
        const hasFile = profileData.avatar instanceof File;

        if (hasFile) {
          const formData = new FormData();
          Object.entries(profileData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (value instanceof File) {
                formData.append(key, value);
              } else {
                formData.append(key, String(value));
              }
            }
          });

          return {
            url: "/api/v1/users/me",
            method: "PUT",
            body: formData,
            formData: true,
          };
        }

        return {
          url: "/api/v1/users/me",
          method: "PUT",
          body: profileData,
        };
      },
      transformResponse: (response: ProfileResponse) => {
        if (hasDataProperty(response)) {
          return response.data;
        }
        return response;
      },
      // No need for invalidatesTags - we update Redux directly from response
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const token = localStorage.getItem("access_token") || "";

          // Update user in Redux store directly from mutation response
          dispatch(
            setUser({
              user: result.data.user,
              token,
            })
          );
        } catch {
          // Handle error silently - component will show error from mutation
        }
      },
    }),

    // Upload avatar - POST /api/v1/users/me/avatar
    uploadAvatar: builder.mutation<{ user: TUser; message?: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: "/api/v1/users/me/avatar",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response: ProfileResponse) => {
        if (hasDataProperty(response)) {
          return response.data;
        }
        return response;
      },
      // No need for invalidatesTags - we update Redux directly from response
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const token = localStorage.getItem("access_token") || "";

          // Update user in Redux store directly from mutation response
          dispatch(
            setUser({
              user: result.data.user,
              token,
            })
          );
        } catch {
          // Handle error silently - component will show error from mutation
        }
      },
    }),

    // Delete avatar - DELETE /api/v1/users/me/avatar
    deleteAvatar: builder.mutation<{ user: TUser; message?: string }, void>({
      query: () => ({
        url: "/api/v1/users/me/avatar",
        method: "DELETE",
      }),
      transformResponse: (response: ProfileResponse) => {
        if (hasDataProperty(response)) {
          return response.data;
        }
        return response;
      },
      // No need for invalidatesTags - we update Redux directly from response
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const token = localStorage.getItem("access_token") || "";

          // Update user in Redux store directly from mutation response
          dispatch(
            setUser({
              user: result.data.user,
              token,
            })
          );
        } catch {
          // Handle error silently - component will show error from mutation
        }
      },
    }),

    // Change password - POST /api/auth/change-password (auth routes have no versioning)
    // Updated to handle SRS 12.2 standardized format
    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (passwordData) => ({
        url: "/api/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
      transformResponse: (response: PasswordResponse) => extractMessageUtil(response),
    }),

    // Delete account - DELETE /api/v1/users/me (TODO: implement backend)
    // Updated to handle SRS 12.2 standardized format
    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: "/api/v1/users/me",
        method: "DELETE",
        body: data,
      }),
      transformResponse: (response: PasswordResponse) => extractMessageUtil(response),
    }),

    // Forgot password - POST /api/auth/forgot-password (auth routes have no versioning)
    // Updated to handle SRS 12.2 standardized format
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: PasswordResponse) => extractMessageUtil(response),
    }),

    // Reset password - POST /api/auth/reset-password (auth routes have no versioning)
    // Updated to handle SRS 12.2 standardized format
    resetPassword: builder.mutation<
      { message: string },
      { token: string; email: string; password: string; password_confirmation: string }
    >({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: PasswordResponse) => extractMessageUtil(response),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;

export { userApi };
