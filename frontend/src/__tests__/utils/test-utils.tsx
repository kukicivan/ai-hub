import { configureStore, type ConfigureStoreOptions } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import authReducer from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

import { baseApi } from "@/redux/api/baseApi";

export const createTestStore = (preloadedState = {}) => {
  const middlewares: ConfigureStoreOptions["middleware"] = (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware);

  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: middlewares,
    preloadedState,
  });
};

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Partial<RootState>;
  withRouter?: boolean;
};

interface ExtendedRenderResult extends RenderResult {
  store: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState = {}, withRouter = false, ...renderOptions }: ExtendedRenderOptions = {}
): ExtendedRenderResult {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        {withRouter ? <BrowserRouter>{children}</BrowserRouter> : children}
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  } as ExtendedRenderResult;
}

describe("dummy", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
