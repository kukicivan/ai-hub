import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

// Simple in-memory refresh lock and waiters
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const notifyPending = (token: string | null) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");

    // Attach access token if present
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap baseQuery to attempt a token refresh once on 401
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (isRefreshing) {
      const token = await new Promise<string | null>((resolve) => {
        pendingRequests.push(resolve);
      });
      if (!token) return result;
      result = await baseQuery(args, api, extraOptions);
      return result;
    }

    isRefreshing = true;
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        notifyPending(null);
        return result;
      }

      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!refreshResponse.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        notifyPending(null);
        return result;
      }

      const data = await refreshResponse.json();

      // SRS 12.2 format: { success: true, data: { access_token, refresh_token }, message }
      // Extract tokens from the standardized response format
      const responseData = data?.data ?? data;
      const newAccess: string | undefined = responseData?.access_token;
      const newRefresh: string | undefined = responseData?.refresh_token;

      if (newAccess) {
        localStorage.setItem("access_token", newAccess);
      }
      if (newRefresh) {
        localStorage.setItem("refresh_token", newRefresh);
      }

      notifyPending(newAccess ?? null);
      result = await baseQuery(args, api, extraOptions);
    } catch {
      notifyPending(null);
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "EmailMessages", "Todos", "UserTypes", "Roles", "Settings", "Goals", "Categories", "AiServices", "ApiKeys"],
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: () => ({}),
});

// With JWT we don't need CSRF initialization; keep as a no-op to minimize changes elsewhere
export const initializeCsrfProtection = async () => {
  return true;
};
