// jest.mock must come first!
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock("@/redux/api/baseApi", () => ({
  initializeCsrfProtection: jest.fn().mockResolvedValue(true),
  baseApi: {
    reducerPath: "api",
    reducer: (state = {}) => state,
    middleware: () => () => () => {},
  },
}));

jest.mock("@/redux/features/auth/authApi", () => ({
  useLoginMutation: jest
    .fn()
    .mockReturnValue([
      jest.fn().mockResolvedValue({ data: { token: "fake-token" } }),
      { isLoading: false },
    ]),
}));

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import Login from "@/pages/Login";
import * as ReactRouterDom from "react-router-dom";
import { initializeCsrfProtection } from "@/redux/api/baseApi";
import { useLoginMutation } from "@/redux/features/auth/authApi";

describe("Login Component", () => {
  let mockNavigate: jest.Mock;
  beforeEach(() => {
    mockNavigate = jest.fn();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("should render login form with email and password fields", () => {
    renderWithProviders(<Login />, { withRouter: true });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lozinka/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toHaveTextContent(/Prijavite se|Prijava/i);
  });

  it("should show validation errors for invalid inputs", async () => {
    renderWithProviders(<Login />, { withRouter: true });

    // Submit empty form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Wait for validation messages to appear (Serbian)
    expect(await screen.findByText("Unesite validnu email adresu")).toBeInTheDocument();
    expect(await screen.findByText("Lozinka mora imati najmanje 6 karaktera")).toBeInTheDocument();
  });

  it("should call login API when form is submitted", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ data: { token: "fake-token" } });
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { isLoading: false }]);

    renderWithProviders(<Login />, { withRouter: true });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/lozinka/i);

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(initializeCsrfProtection).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  it("should redirect to dashboard on successful login", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ data: { token: "fake-token" } });
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { isLoading: false }]);

    renderWithProviders(<Login />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          token: "fake-token",
          user: undefined,
          isLoading: false,
        },
      },
      withRouter: true,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("should show loading state while submitting", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ data: { token: "fake-token" } });
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { isLoading: true }]);

    renderWithProviders(<Login />, { withRouter: true });

    // With isLoading=true, verify disabled state
    const submitButton = screen.getByRole("button", { name: /submit/i });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/lozinka/i);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Prijava u toku/i);
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });
});
