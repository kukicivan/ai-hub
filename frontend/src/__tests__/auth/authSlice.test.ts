import authReducer, {
  setUser,
  logout,
  useCurrentUser,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import { baseApi } from "@/redux/api/baseApi";

describe("Auth Reducer", () => {
  it("should return initial state", () => {
    const initialState = {
      user: undefined,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should set user and token when setUser is called", () => {
    const user = { id: "1", role: "admin", iat: 123, exp: 456 };
    const token = "mock-token";
    const state = authReducer(undefined, setUser({ user, token }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
  });

  it("should clear user and token when logout is called", () => {
    const prevState = {
      user: { id: "1", role: "admin", iat: 123, exp: 456 },
      token: "mock-token",
      isAuthenticated: true,
      isLoading: false,
    };
    const state = authReducer(prevState, logout());
    expect(state.user).toBeUndefined();
    expect(state.token).toBeNull();
  });

  it("should return current user from selector", () => {
    const rootState: RootState = {
      [baseApi.reducerPath]: baseApi.reducer(undefined, { type: "@@INIT" }),
      auth: {
        user: { id: "1", role: "admin", iat: 123, exp: 456 },
        token: "mock-token",
        isAuthenticated: true,
        isLoading: false,
      },
    } as RootState;
    expect(useCurrentUser(rootState)).toEqual(rootState.auth.user);
  });

  it("should return current token from selector", () => {
    const rootState: RootState = {
      [baseApi.reducerPath]: baseApi.reducer(undefined, { type: "@@INIT" }),
      auth: {
        user: { id: "1", role: "admin", iat: 123, exp: 456 },
        token: "mock-token",
        isAuthenticated: true,
        isLoading: false,
      },
    } as RootState;
    expect(useCurrentToken(rootState)).toBe("mock-token");
  });
});
