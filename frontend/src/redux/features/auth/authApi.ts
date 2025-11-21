import { baseApi } from "@/redux/api/baseApi";
import { setUser, logout, TUser } from "./authSlice";

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

type MeDirect = { user: TUser };
type MeResponse = MeDirect | Wrapped<MeDirect>;

function unwrapMeResponse(res: MeResponse): MeDirect {
  return isWrapped<MeDirect>(res) ? res.data : res;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
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

          dispatch(
            setUser({
              user: payload.user,
              token: access,
            })
          );
          dispatch(baseApi.util.invalidateTags(["User"]));
        } catch {
          dispatch(logout());
        }
      },
    }),
    // Logout
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
          // Clear RTK Query cache to avoid stale user data affecting guards
          dispatch(baseApi.util.resetApiState());
          dispatch(baseApi.util.invalidateTags(["User"]));
        }
      },
    }),
    // Get current user
    getCurrentUser: builder.query<MeResponse, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const me = unwrapMeResponse(result.data);
          const token = localStorage.getItem("access_token") || "";
          dispatch(
            setUser({
              user: me.user,
              token,
            })
          );
        } catch (err) {
          // Do not force logout on bootstrap/auth check errors.
          // Let baseQueryWithReauth handle 401/refresh; RequireAuth will redirect if unauthenticated.
          // Ignore aborted or transient errors here to avoid race-triggered logouts.
        }
      },
    }),
    // Register
    register: builder.mutation<
      AuthPayload,
      {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        user_type: string;
        address_line_1?: string;
        address_line_2?: string;
        address_line_3?: string;
        description?: string;
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

          dispatch(
            setUser({
              user: payload.user,
              token: access,
            })
          );
          dispatch(baseApi.util.invalidateTags(["User"]));
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
