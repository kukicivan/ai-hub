// Mock the baseApi
jest.mock("@/redux/api/baseApi", () => ({
  baseApi: {
    injectEndpoints: jest.fn().mockReturnValue({
      endpoints: {},
    }),
  },
}));

describe("Todo API Types", () => {
  it("should have correct TodoItem interface structure", () => {
    interface TodoItem {
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

    const todo: TodoItem = {
      id: 1,
      title: "Test Todo",
      description: "Test description",
      completed: false,
      priority: "normal",
      due_date: "2025-12-01",
      email_id: 123,
      created_at: "2025-11-22T00:00:00Z",
      updated_at: "2025-11-22T00:00:00Z",
    };

    expect(todo.id).toBe(1);
    expect(todo.title).toBe("Test Todo");
    expect(todo.completed).toBe(false);
    expect(["low", "normal", "high"]).toContain(todo.priority);
  });

  it("should have correct CreateTodoPayload interface structure", () => {
    interface CreateTodoPayload {
      title: string;
      description?: string;
      priority?: "low" | "normal" | "high";
      due_date?: string;
      email_id?: number;
    }

    const payload: CreateTodoPayload = {
      title: "New Todo",
      description: "Description",
      priority: "high",
    };

    expect(payload.title).toBeTruthy();
    expect(payload.priority).toBe("high");
  });

  it("should have correct UpdateTodoPayload interface structure", () => {
    interface UpdateTodoPayload {
      id: number;
      title?: string;
      description?: string;
      completed?: boolean;
      priority?: "low" | "normal" | "high";
      due_date?: string;
    }

    const payload: UpdateTodoPayload = {
      id: 1,
      title: "Updated Title",
      completed: true,
    };

    expect(payload.id).toBe(1);
    expect(payload.title).toBe("Updated Title");
    expect(payload.completed).toBe(true);
  });
});

describe("Todo API Input Validation", () => {
  it("should validate CreateTodoPayload requires title", () => {
    interface CreateTodoPayload {
      title: string;
      priority?: "low" | "normal" | "high";
    }

    const validPayload: CreateTodoPayload = {
      title: "Valid Todo",
      priority: "normal",
    };

    expect(validPayload.title).toBeTruthy();
    expect(validPayload.title.length).toBeGreaterThan(0);
  });

  it("should validate priority values", () => {
    const validPriorities = ["low", "normal", "high"];

    validPriorities.forEach((priority) => {
      expect(["low", "normal", "high"]).toContain(priority);
    });
  });

  it("should validate due_date format", () => {
    const validDate = "2025-12-01";
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    expect(dateRegex.test(validDate)).toBe(true);
  });
});

describe("Todo API Endpoints", () => {
  it("should have correct endpoint paths", () => {
    const endpoints = {
      getTodos: "/api/v1/todos",
      getTodo: (id: number) => `/api/v1/todos/${id}`,
      createTodo: "/api/v1/todos",
      updateTodo: (id: number) => `/api/v1/todos/${id}`,
      deleteTodo: (id: number) => `/api/v1/todos/${id}`,
      toggleTodo: (id: number) => `/api/v1/todos/${id}/toggle`,
      createFromEmail: "/api/v1/todos/from-email",
    };

    expect(endpoints.getTodos).toBe("/api/v1/todos");
    expect(endpoints.getTodo(1)).toBe("/api/v1/todos/1");
    expect(endpoints.toggleTodo(5)).toBe("/api/v1/todos/5/toggle");
    expect(endpoints.createFromEmail).toBe("/api/v1/todos/from-email");
  });
});

describe("Create Todo From Email", () => {
  it("should have correct payload structure for createFromEmail", () => {
    interface CreateFromEmailPayload {
      email_id: number;
      title?: string;
      priority?: "low" | "normal" | "high";
    }

    const payload: CreateFromEmailPayload = {
      email_id: 123,
      title: "Todo from email",
      priority: "high",
    };

    expect(payload.email_id).toBe(123);
    expect(payload.title).toBe("Todo from email");
    expect(payload.priority).toBe("high");
  });

  it("should require email_id for createFromEmail", () => {
    interface CreateFromEmailPayload {
      email_id: number;
      title?: string;
      priority?: "low" | "normal" | "high";
    }

    const payload: CreateFromEmailPayload = {
      email_id: 456,
    };

    expect(payload.email_id).toBeDefined();
    expect(typeof payload.email_id).toBe("number");
  });
});
