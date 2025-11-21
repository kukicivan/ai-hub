/**
 * @deprecated Ovaj fajl je zastareo. Koristite RTK Query API:
 * - @/redux/features/email/emailApi - za email operacije
 * - @/redux/features/auth/authApi - za autentifikaciju
 * - @/redux/features/user/userApi - za korisničke operacije
 *
 * Hook useMessages je migriran na RTK Query i više ne koristi ovaj klijent.
 */
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from "axios";

// Types - @deprecated koristite EmailMessage iz @/redux/features/email/emailApi
export interface ApiMessage {
  id: number;
  message_id: string;
  thread_id: string;
  from: string;
  from_name: string;
  to: Array<{ email: string; name: string }>;
  cc: Array<{ email: string; name: string }>;
  subject: string;
  body_preview: string;
  received_at: string;
  synced_at: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  priority: "low" | "normal" | "high";
  has_attachments: boolean;
  attachment_count: number;
  attachments: Array<{
    name: string;
    size_formatted: string;
  }>;
  ai: {
    status: "pending" | "processing" | "completed" | "failed";
    pending?: boolean;
    processing?: boolean;
    failed?: boolean;
    summary?: string | null;
    sentiment?: {
      tone: string;
      urgency_score: number;
      business_potential: number;
    } | null;
    intent?: "request" | "complaint" | "info" | "meeting" | "other";
    priority?: "low" | "normal" | "high";
    entities?: {
      dates: string[];
      people: string[];
      organizations: string[];
      locations: string[];
    };
    suggested_reply?: string | null;
    action_items?: string[];
    confidence?: number;
    model?: string;
    processed_at?: string | null;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  error?: string;
  details?: Record<string, string[]>;
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

// API Client Class
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, // For cookie-based auth (Sanctum)
    });

    // Request interceptor (add auth token)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor (error handling)
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          this.clearToken();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  private clearToken(): void {
    localStorage.removeItem("auth_token");
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ token: string }> {
    const response = await this.client.post("/api/login", { email, password });
    const token = response.data.token;
    this.setToken(token);
    return { token };
  }

  async logout(): Promise<void> {
    await this.client.post("/api/logout");
    this.clearToken();
  }

  // Email/Messages API
  async getMessages(filters: MessageFilters = {}): Promise<ApiResponse<ApiMessage[]>> {
    const response: AxiosResponse<ApiResponse<ApiMessage[]>> = await this.client.get(
      "/api/email/messages",
      { params: filters }
    );
    return response.data;
  }

  async getMessagesV5(filters: MessageFilters = {}): Promise<ApiResponse<ApiMessage[]>> {
    const response: AxiosResponse<ApiResponse<ApiMessage[]>> = await this.client.get(
      "/api/email/messages/v5",
      { params: filters }
    );
    return response.data;
  }

  async getMessage(id: number): Promise<ApiResponse<ApiMessage>> {
    const response: AxiosResponse<ApiResponse<ApiMessage>> = await this.client.get(
      `/api/email/messages/${id}`
    );
    return response.data;
  }

  async analyzeMessage(id: number): Promise<ApiResponse<ApiMessage>> {
    const response: AxiosResponse<ApiResponse<ApiMessage>> = await this.client.post(
      `/api/email/messages/${id}/analyze`
    );
    return response.data;
  }

  async markAsRead(id: number): Promise<ApiResponse<ApiMessage>> {
    const response: AxiosResponse<ApiResponse<ApiMessage>> = await this.client.patch(
      `/api/email/messages/${id}/read`
    );
    return response.data;
  }

  async markAsUnread(id: number): Promise<ApiResponse<ApiMessage>> {
    const response: AxiosResponse<ApiResponse<ApiMessage>> = await this.client.patch(
      `/api/email/messages/${id}/unread`
    );
    return response.data;
  }

  async bulkMarkAsRead(ids: number[]): Promise<ApiResponse<{ updated: number }>> {
    const response = await this.client.post("/api/email/messages/bulk-read", { ids });
    return response.data;
  }

  async bulkDelete(ids: number[]): Promise<ApiResponse<{ deleted: number }>> {
    const response = await this.client.post("/api/email/messages/bulk-delete", { ids });
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export for React hooks
export default api;
