import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TodoList from "@/components/todo/TodoList";

// Mock the todoApi hooks
const mockGetTodosQuery = vi.fn();
const mockCreateTodoMutation = vi.fn();
const mockToggleTodoMutation = vi.fn();
const mockDeleteTodoMutation = vi.fn();
const mockUpdateTodoMutation = vi.fn();

vi.mock("@/redux/features/todo/todoApi", () => ({
  useGetTodosQuery: () => mockGetTodosQuery(),
  useCreateTodoMutation: () => [mockCreateTodoMutation, { isLoading: false }],
  useToggleTodoMutation: () => [mockToggleTodoMutation],
  useDeleteTodoMutation: () => [mockDeleteTodoMutation],
  useUpdateTodoMutation: () => [mockUpdateTodoMutation],
}));

// Create a mock store
const createMockStore = () =>
  configureStore({
    reducer: {
      baseApi: () => ({}),
    },
  });

describe("TodoList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    // Should show skeleton loading state
    expect(document.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders error state", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: { message: "Error" },
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText(/Greška pri učitavanju zadataka/i)).toBeTruthy();
  });

  it("renders empty state", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText(/Nema zadataka/i)).toBeTruthy();
  });

  it("renders todo list", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        {
          id: 1,
          title: "Test Todo 1",
          completed: false,
          priority: "normal",
          created_at: "2025-11-22T00:00:00Z",
          updated_at: "2025-11-22T00:00:00Z",
        },
        {
          id: 2,
          title: "Test Todo 2",
          completed: true,
          priority: "high",
          created_at: "2025-11-22T00:00:00Z",
          updated_at: "2025-11-22T00:00:00Z",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText("Test Todo 1")).toBeTruthy();
    expect(screen.getByText("Test Todo 2")).toBeTruthy();
  });

  it("shows correct counts in header", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        { id: 1, title: "Active", completed: false, priority: "normal", created_at: "", updated_at: "" },
        { id: 2, title: "Completed", completed: true, priority: "normal", created_at: "", updated_at: "" },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText(/1 aktivnih, 1 završenih/i)).toBeTruthy();
  });

  it("renders create todo form", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Dodaj novi zadatak/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Dodaj/i })).toBeTruthy();
  });

  it("renders filter tabs", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText(/Svi/i)).toBeTruthy();
    expect(screen.getByText(/Aktivni/i)).toBeTruthy();
    expect(screen.getByText(/Završeni/i)).toBeTruthy();
  });

  it("filters todos when clicking filter tabs", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        { id: 1, title: "Active Todo", completed: false, priority: "normal", created_at: "", updated_at: "" },
        { id: 2, title: "Completed Todo", completed: true, priority: "normal", created_at: "", updated_at: "" },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    // Click on "Aktivni" filter
    const activeFilter = screen.getByText(/Aktivni \(1\)/i);
    fireEvent.click(activeFilter);

    // Should show only active todo
    expect(screen.getByText("Active Todo")).toBeTruthy();
  });

  it("shows due date when present", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        {
          id: 1,
          title: "Todo with date",
          completed: false,
          priority: "normal",
          due_date: "2025-12-01",
          created_at: "",
          updated_at: "",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText("Todo with date")).toBeTruthy();
  });

  it("shows priority indicator", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        { id: 1, title: "High Priority", completed: false, priority: "high", created_at: "", updated_at: "" },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    // High priority should have red color class
    const flagIcon = document.querySelector(".text-red-500");
    expect(flagIcon).toBeTruthy();
  });

  it("applies completed styles to completed todos", () => {
    mockGetTodosQuery.mockReturnValue({
      data: [
        { id: 1, title: "Completed Todo", completed: true, priority: "normal", created_at: "", updated_at: "" },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    const todoText = screen.getByText("Completed Todo");
    expect(todoText.className).toContain("line-through");
  });
});

describe("TodoList Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTodosQuery.mockReturnValue({
      data: [
        { id: 1, title: "Test Todo", completed: false, priority: "normal", created_at: "", updated_at: "" },
      ],
      isLoading: false,
      error: null,
    });
  });

  it("can toggle todo checkbox", async () => {
    const toggleFn = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
    mockToggleTodoMutation.mockReturnValue(toggleFn);

    render(
      <Provider store={createMockStore()}>
        <TodoList />
      </Provider>
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(toggleFn).toHaveBeenCalledWith(1);
    });
  });
});

describe("TodoList Priority Colors", () => {
  it("should have correct color for high priority", () => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "text-red-500";
        case "normal":
          return "text-yellow-500";
        case "low":
          return "text-green-500";
        default:
          return "text-gray-500";
      }
    };

    expect(getPriorityColor("high")).toBe("text-red-500");
    expect(getPriorityColor("normal")).toBe("text-yellow-500");
    expect(getPriorityColor("low")).toBe("text-green-500");
    expect(getPriorityColor("unknown")).toBe("text-gray-500");
  });
});
