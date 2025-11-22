import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/redux/api/baseApi";
import authReducer from "@/redux/features/auth/authSlice";
import { userManagementApi } from "@/redux/features/userManagement/userManagementApi";

const API_URL = "http://localhost:9001";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+387 61 123 456",
    user_type_id: 1,
    user_type: { id: 1, name: "admin" },
    roles: [{ id: 1, name: "admin" }],
    email_verified_at: "2024-01-01T00:00:00.000Z",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: null,
    user_type_id: 2,
    user_type: { id: 2, name: "user" },
    roles: [{ id: 2, name: "user" }],
    email_verified_at: null,
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
  },
];

const mockUserTypes = [
  { id: 1, name: "admin" },
  { id: 2, name: "user" },
];

const mockStats = {
  total_users: 10,
  verified_users: 8,
  unverified_users: 2,
  users_this_month: 3,
  users_last_month: 2,
  growth_percentage: 50,
  users_by_type: [
    { user_type_id: 1, user_type_name: "admin", count: 2 },
    { user_type_id: 2, user_type_name: "user", count: 8 },
  ],
};

const server = setupServer(
  // Get users list
  http.get(`${API_URL}/api/v1/users`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("per_page") || "10");

    let filteredUsers = [...mockUsers];
    if (search) {
      filteredUsers = filteredUsers.filter(
        (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json({
      users: filteredUsers,
      pagination: {
        total: filteredUsers.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(filteredUsers.length / perPage),
        from: 1,
        to: filteredUsers.length,
      },
    });
  }),

  // Get single user
  http.get(`${API_URL}/api/v1/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u.id === parseInt(params.id as string));
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    return HttpResponse.json({ user });
  }),

  // Create user
  http.post(`${API_URL}/api/v1/users`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newUser = {
      id: 3,
      ...body,
      user_type: mockUserTypes.find((t) => t.id === body.user_type_id),
      roles: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 });
  }),

  // Update user
  http.put(`${API_URL}/api/v1/users/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const user = mockUsers.find((u) => u.id === parseInt(params.id as string));
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    const updatedUser = { ...user, ...body };
    return HttpResponse.json({ user: updatedUser, message: "User updated successfully" });
  }),

  // Delete user
  http.delete(`${API_URL}/api/v1/users/:id`, () => {
    return HttpResponse.json({ message: "User deleted successfully" });
  }),

  // Get user types
  http.get(`${API_URL}/api/v1/user-types`, () => {
    return HttpResponse.json({ userTypes: mockUserTypes });
  }),

  // Get roles
  http.get(`${API_URL}/api/v1/roles`, () => {
    return HttpResponse.json({
      roles: [
        { id: 1, name: "admin", guard_name: "api" },
        { id: 2, name: "user", guard_name: "api" },
      ],
    });
  }),

  // Get stats
  http.get(`${API_URL}/api/v1/users/stats`, () => {
    return HttpResponse.json({ stats: mockStats });
  }),

  // Bulk delete
  http.post(`${API_URL}/api/v1/users/bulk-delete`, async ({ request }) => {
    const body = (await request.json()) as { ids: number[] };
    return HttpResponse.json({
      message: `${body.ids.length} user(s) deleted successfully`,
      deleted_count: body.ids.length,
    });
  }),

  // Export
  http.post(`${API_URL}/api/v1/users/export`, () => {
    return HttpResponse.json({
      data: mockUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        user_type: u.user_type?.name,
      })),
      columns: ["id", "name", "email", "phone", "user_type"],
    });
  })
);

function createTestStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
}

describe("User Management API", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "bypass" });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    localStorage.setItem("access_token", "test-token");
  });

  it("should fetch users list with pagination", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      userManagementApi.endpoints.getUsers.initiate({ page: 1, per_page: 10 })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.users).toHaveLength(2);
    expect(result.data?.pagination.total).toBe(2);
  });

  it("should search users by name", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      userManagementApi.endpoints.getUsers.initiate({ search: "John" })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.users).toHaveLength(1);
    expect(result.data?.users[0].name).toBe("John Doe");
  });

  it("should fetch a single user by ID", async () => {
    const store = createTestStore();

    const result = await store.dispatch(userManagementApi.endpoints.getUser.initiate(1));

    expect(result.data).toBeDefined();
    expect(result.data?.user.name).toBe("John Doe");
    expect(result.data?.user.email).toBe("john@example.com");
  });

  it("should create a new user", async () => {
    const store = createTestStore();

    const newUserData = {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      password_confirmation: "password123",
      user_type_id: 2,
    };

    const result = await store.dispatch(
      userManagementApi.endpoints.createUser.initiate(newUserData)
    );

    expect(result.data).toBeDefined();
    expect(result.data?.user.name).toBe("New User");
    expect(result.data?.message).toBe("User created successfully");
  });

  it("should update an existing user", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      userManagementApi.endpoints.updateUser.initiate({
        id: 1,
        data: { name: "Updated Name" },
      })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.user.name).toBe("Updated Name");
  });

  it("should delete a user", async () => {
    const store = createTestStore();

    const result = await store.dispatch(userManagementApi.endpoints.deleteUser.initiate(1));

    expect(result.data).toBeDefined();
    expect(result.data?.message).toBe("User deleted successfully");
  });

  it("should fetch user types", async () => {
    const store = createTestStore();

    const result = await store.dispatch(userManagementApi.endpoints.getUserTypes.initiate());

    expect(result.data).toBeDefined();
    expect(result.data?.userTypes).toHaveLength(2);
    expect(result.data?.userTypes[0].name).toBe("admin");
  });

  it("should fetch user statistics", async () => {
    const store = createTestStore();

    const result = await store.dispatch(userManagementApi.endpoints.getUserStats.initiate());

    expect(result.data).toBeDefined();
    expect(result.data?.stats.total_users).toBe(10);
    expect(result.data?.stats.verified_users).toBe(8);
  });

  it("should bulk delete users", async () => {
    const store = createTestStore();

    const result = await store.dispatch(
      userManagementApi.endpoints.bulkDeleteUsers.initiate({ ids: [1, 2] })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.deleted_count).toBe(2);
  });

  it("should export users", async () => {
    const store = createTestStore();

    const result = await store.dispatch(userManagementApi.endpoints.exportUsers.initiate());

    expect(result.data).toBeDefined();
    expect(result.data?.data).toHaveLength(2);
    expect(result.data?.columns).toContain("name");
    expect(result.data?.columns).toContain("email");
  });
});
