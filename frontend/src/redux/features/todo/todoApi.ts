import { baseApi } from "@/redux/api/baseApi";

export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "normal" | "high";
  due_date?: string;
  email_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: "low" | "normal" | "high";
  due_date?: string;
  email_id?: number;
}

export interface UpdateTodoPayload {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "normal" | "high";
  due_date?: string;
}

interface TodoResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function unwrapResponse<T>(response: TodoResponse<T> | { data: TodoResponse<T> }): T {
  if ("success" in response) {
    return response.data;
  }
  return response.data.data;
}

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all todos - GET /api/v1/todos
    getTodos: builder.query<TodoItem[], void>({
      query: () => ({
        url: "/api/v1/todos",
        method: "GET",
      }),
      transformResponse: (response: TodoResponse<TodoItem[]>) => unwrapResponse(response),
      providesTags: ["Todos"],
    }),

    // Get single todo - GET /api/v1/todos/{id}
    getTodo: builder.query<TodoItem, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}`,
        method: "GET",
      }),
      transformResponse: (response: TodoResponse<TodoItem>) => unwrapResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Todos", id }],
    }),

    // Create todo - POST /api/v1/todos
    createTodo: builder.mutation<TodoItem, CreateTodoPayload>({
      query: (data) => ({
        url: "/api/v1/todos",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: TodoResponse<TodoItem>) => unwrapResponse(response),
      invalidatesTags: ["Todos"],
    }),

    // Update todo - PUT /api/v1/todos/{id}
    updateTodo: builder.mutation<TodoItem, UpdateTodoPayload>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/todos/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: TodoResponse<TodoItem>) => unwrapResponse(response),
      invalidatesTags: ["Todos"],
    }),

    // Toggle todo completion - PATCH /api/v1/todos/{id}/toggle
    toggleTodo: builder.mutation<TodoItem, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (response: TodoResponse<TodoItem>) => unwrapResponse(response),
      invalidatesTags: ["Todos"],
    }),

    // Delete todo - DELETE /api/v1/todos/{id}
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),

    // Create todo from email - POST /api/v1/todos/from-email
    createTodoFromEmail: builder.mutation<
      TodoItem,
      { email_id: number; title?: string; priority?: "low" | "normal" | "high" }
    >({
      query: (data) => ({
        url: "/api/v1/todos/from-email",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: TodoResponse<TodoItem>) => unwrapResponse(response),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useCreateTodoFromEmailMutation,
} = todoApi;
