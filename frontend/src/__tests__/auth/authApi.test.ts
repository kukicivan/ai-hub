// Polyfill must be first!
import { TextEncoder, TextDecoder } from "util";
import type { LoginRequest } from "@/types/auth.types";
import type { AppDispatch } from "@/redux/store";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Polyfill must be first!
Object.assign(global, { TextEncoder, TextDecoder });

import "whatwg-fetch";
import { setupServer } from "msw/node";
import { http } from "msw"; // Use http instead of rest for MSW v2+
import { createTestStore } from "../utils/test-utils";
import { authApi } from "@/redux/features/auth/authApi";

describe("Auth API", () => {
  const server = setupServer(
    http.post("http://localhost:9001/api/auth/login", async ({ request }) => {
      const body = (await request.json()) as LoginRequest;
      if (body.email === "test@test.com" && body.password === "password123") {
        return new Response(
          JSON.stringify({
            token: "mock-jwt-token",
            user: { id: "1", email: "test@test.com", name: "Test User", role: "user" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }),
    // Add handler for refresh-token to prevent network errors
    http.post("http://localhost:9001/api/refresh-token", async () => {
      return new Response(JSON.stringify({ message: "No refresh token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should make POST request to /login with credentials", async () => {
    const store = createTestStore();
    const dispatch = store.dispatch as AppDispatch;

    const result = await dispatch(
      authApi.endpoints.login.initiate({
        email: "test@test.com",
        password: "password123",
      })
    ).unwrap();

    expect(result.token).toBe("mock-jwt-token");
    expect(result.user).toEqual({
      id: "1",
      email: "test@test.com",
      name: "Test User",
      role: "user",
    });
  });

  it("should return user and token on successful login", async () => {
    const store = createTestStore();
    const dispatch = store.dispatch as AppDispatch;

    const result = await dispatch(
      authApi.endpoints.login.initiate({
        email: "test@test.com",
        password: "password123",
      })
    ).unwrap();

    expect(result.token).toBe("mock-jwt-token");
    expect(result.user.email).toBe("test@test.com");
  });

  it("should handle login errors properly", async () => {
    const store = createTestStore();
    const dispatch = store.dispatch as AppDispatch;

    try {
      await dispatch(
        authApi.endpoints.login.initiate({
          email: "wrong@test.com",
          password: "wrong",
        })
      ).unwrap();
      fail("Expected an error response");
    } catch (error) {
      const queryError = error as FetchBaseQueryError;
      expect(queryError.status).toBe(401);
      expect((queryError.data as { message: string }).message).toBe("Invalid credentials");
    }
  });
});
