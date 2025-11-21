import { renderWithProviders } from "../../utils/test-utils";
import { screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RootState } from "@/redux/store";

// Mock CSRF protection
jest.mock("@/redux/api/baseApi", () => ({
  ...jest.requireActual("@/redux/api/baseApi"),
  initializeCsrfProtection: jest.fn().mockResolvedValue(undefined),
}));

describe("Auth Integration", () => {
  it("should persist auth state after page refresh", async () => {
    // Authenticated state
    const preloadedState: Partial<RootState> = {
      auth: {
        user: { id: "1", role: "admin", iat: 123, exp: 456 },
        token: "mock-token",
        isAuthenticated: true,
        isLoading: false,
        _persist: { version: 1, rehydrated: true },
      },
    };
    renderWithProviders(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
      { preloadedState }
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
