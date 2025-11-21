# Authentication Documentation

This document explains how the authentication system is implemented and how to use it in the application.

## System Overview

The authentication system uses:
- Redux for authentication state management (`authSlice.ts`)
- RTK Query for API calls (`authApi.ts`)
- TypeScript for type safety
- Shadcn UI for components
- Zod for form validation

Main components:
- `authSlice.ts` - Redux slice that stores user state and token
- `authApi.ts` - API endpoint for login
- `ProtectedRoute.tsx` - Component for route protection
- `verifyToken.ts` - Token verification utility

## Implementation Guide

### 1. Create Zod Schema for Validation

```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

### 2. Login Form Implementation

Here's a complete example of a login form using Shadcn UI components:

```tsx
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type TLogin = z.infer<typeof loginSchema>;

const Login = () => {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLogin) => {
    try {
      const res = await login(data).unwrap();
      const { token, user } = res;
      dispatch(setUser({ token, user }));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
```

## Authentication Functions and Methods

### 1. Making Login API Call

```typescript
const [login] = useLoginMutation();
// Usage:
const result = await login({ email, password }).unwrap();
```

### 2. Storing User in Redux Store

```typescript
const dispatch = useAppDispatch();
dispatch(setUser({ token, user }));
```

### 3. Accessing Current User

```typescript
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";

const user = useAppSelector(useCurrentUser);
const token = useAppSelector(useCurrentToken);
```

### 4. Logout

```typescript
import { logout } from "@/redux/features/auth/authSlice";
dispatch(logout());
```

## How it Works

The authentication system follows this flow:
1. When a user successfully logs in, their token and user data are stored in the Redux store
2. Protected routes check for the existence and validity of the token
3. When the token expires or the user logs out, the data is cleared from the store

To use protected routes, they must be wrapped with the `ProtectedRoute` component in `routes.tsx`.

## Types

```typescript
// User type
export type TUser = {
  id: string;
  role: string;
  iat: number;
  exp: number;
};

// Auth state type
export type TAuthState = {
  user: null | TUser;
  token: null | string;
};
```
