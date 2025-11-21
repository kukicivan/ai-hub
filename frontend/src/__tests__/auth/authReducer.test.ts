import authReducer from "@/redux/features/auth/authSlice";

// ...existing code...
describe("authReducer", () => {
  test("should return initial state", () => {
    const initialState = authReducer(undefined, { type: "unknown" });
    expect(initialState).toEqual({
      user: undefined,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });
});
// ...existing code...
