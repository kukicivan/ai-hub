import { baseApi } from "@/redux/api/baseApi";
import { setUser, logout, TUser } from "./authSlice";
import { clearSelectedMessage } from "../inbox/inboxSlice";

// Support both direct and { data: ... } wrapped Laravel responses
type AuthPayload = {
  user: TUser;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  message?: string;
};
type Wrapped<T> = { data: T; success?: boolean; message?: string };
type AuthResponse = AuthPayload | Wrapped<AuthPayload>;

function isWrapped<T>(res: T | Wrapped<T>): res is Wrapped<T> {
  return typeof res === "object" && res !== null && "data" in (res as Record<string, unknown>);
}

function unwrapAuthResponse(res: AuthResponse): AuthPayload {
  return isWrapped<AuthPayload>(res) ? res.data : res;
}

// /me endpoint returns user directly in data, not wrapped in { user: ... }
type MeApiResponse = TUser | Wrapped<TUser>;

function unwrapMeResponse(res: MeApiResponse): TUser {
  return isWrapped<TUser>(res) ? res.data : res;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login - POST /api/auth/login
    login: builder.mutation<AuthPayload, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse): AuthPayload => unwrapAuthResponse(response),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const payload = result.data;

          const access = payload.access_token ?? payload.token ?? "";
          const refresh = payload.refresh_token;

          if (access) localStorage.setItem("access_token", access);
          if (refresh) localStorage.setItem("refresh_token", refresh);

          // Reset API state first to clear any cached errors from previous /me attempts
          // This ensures isLoading will be true for the next getCurrentUser call
          dispatch(baseApi.util.resetApiState());

          dispatch(
            setUser({
              user: payload.user,
              token: access,
            })
          );
        } catch {
          dispatch(logout());
        }
      },
    }),

    // Logout - POST /api/auth/logout
    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          dispatch(logout());
          dispatch(clearSelectedMessage());
          dispatch(baseApi.util.resetApiState());
          dispatch(baseApi.util.invalidateTags(["User"]));
        }
      },
    }),

    // Get current user - GET /api/auth/me
    getCurrentUser: builder.query<MeApiResponse, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const user = unwrapMeResponse(result.data);
          const token = localStorage.getItem("access_token") || "";
          dispatch(
            setUser({
              user,
              token,
            })
          );
        } catch {
          // Do not force logout on bootstrap/auth check errors.
          // Let baseQueryWithReauth handle 401/refresh; RequireAuth will redirect if unauthenticated.
        }
      },
    }),

    // Register - POST /api/auth/register
    register: builder.mutation<
      AuthPayload,
      {
        name: string;
        email: string;
        password: string;
        c_password: string;
        address_line_1?: string;
        address_line_2?: string;
        address_line_3?: string;
        phone?: string;
      }
    >({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: AuthResponse): AuthPayload => unwrapAuthResponse(response),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const payload = result.data;

          const access = payload.access_token ?? payload.token ?? "";
          const refresh = payload.refresh_token;

          if (access) localStorage.setItem("access_token", access);
          if (refresh) localStorage.setItem("refresh_token", refresh);

          // Reset API state first to clear any cached errors from previous /me attempts
          dispatch(baseApi.util.resetApiState());

          dispatch(
            setUser({
              user: payload.user,
              token: access,
            })
          );
        } catch {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useRegisterMutation } =
  authApi;

export { authApi };
