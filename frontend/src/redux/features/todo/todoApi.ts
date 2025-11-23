import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse, unwrapResponse } from "@/redux/api/apiUtils";

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

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all todos - GET /api/v1/todos
    getTodos: builder.query<TodoItem[], void>({
      query: () => ({
        url: "/api/v1/todos",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TodoItem[]>) => unwrapResponse(response),
      providesTags: ["Todos"],
    }),

    // Get single todo - GET /api/v1/todos/{id}
    getTodo: builder.query<TodoItem, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<TodoItem>) => unwrapResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Todos", id }],
    }),

    // Create todo - POST /api/v1/todos
    createTodo: builder.mutation<TodoItem, CreateTodoPayload>({
      query: (data) => ({
        url: "/api/v1/todos",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<TodoItem>) => unwrapResponse(response),
      // Update cache directly from response - no refetch needed
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newTodo } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              draft.unshift(newTodo); // Add to beginning of list
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // Update todo - PUT /api/v1/todos/{id}
    updateTodo: builder.mutation<TodoItem, UpdateTodoPayload>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/todos/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<TodoItem>) => unwrapResponse(response),
      // Update cache directly from response - no refetch needed
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTodo } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((todo) => todo.id === id);
              if (index !== -1) {
                draft[index] = updatedTodo;
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // Toggle todo completion - PATCH /api/v1/todos/{id}/toggle
    toggleTodo: builder.mutation<TodoItem, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<TodoItem>) => unwrapResponse(response),
      // Update cache directly from response - no refetch needed
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTodo } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((todo) => todo.id === id);
              if (index !== -1) {
                draft[index] = updatedTodo;
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),

    // Delete todo - DELETE /api/v1/todos/{id}
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/todos/${id}`,
        method: "DELETE",
      }),
      // Update cache directly - remove deleted item
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((todo) => todo.id === id);
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

    // Create todo from email - POST /api/v1/todos/from-email
    createTodoFromEmail: builder.mutation<
      TodoItem,
      { email_id?: number; title?: string; priority?: "low" | "normal" | "high" }
    >({
      query: (data) => ({
        url: "/api/v1/todos/from-email",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<TodoItem>) => unwrapResponse(response),
      // Update cache directly from response - no refetch needed
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newTodo } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              draft.unshift(newTodo); // Add to beginning of list
            })
          );
        } catch {
          // Error handled by component
        }
      },
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
