import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import inboxReducer from "./features/inbox/inboxSlice";

// For session-based authentication, we don't need to persist auth state
// The authentication is maintained via HTTP-only cookies
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer, // No persistence wrapper
    inbox: inboxReducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({
      serializableCheck: {
        // Ignore baseApi actions for serialization checks
        ignoredActions: ["baseApi/executeQuery/pending", "baseApi/executeQuery/fulfilled"],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// No persistor needed for session-based auth
// export const persistor = persistStore(store);
