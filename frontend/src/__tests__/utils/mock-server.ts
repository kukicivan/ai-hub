import { setupServer } from "msw/node";
import { http } from "msw";

async function parseRequestBody(request: Request) {
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      return await request.json();
    } catch {
      // fallback for ReadableStream
      const text = await request.text();
      return JSON.parse(text);
    }
  }
  return {};
}

export const mockServer = setupServer(
  http.get("*/api/api/profile", () => {
    return new Response(JSON.stringify({ id: "1", email: "test@test.com", name: "Test User" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
  http.post("*/api/api/login", async ({ request }) => {
    const body = await parseRequestBody(request);
    const { email, password } = body;
    if (email === "test@test.com" && password === "password123") {
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
  http.post("*/api/v1/auth/refresh-token", async () => {
    return new Response(JSON.stringify({ message: "No refresh token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  })
);

describe("dummy", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
