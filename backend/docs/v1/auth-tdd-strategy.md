# Auth Testing Strategy - Test Driven Development

## 📋 Pregled trenutnog stanja

Analizom koda vidim da imate:
- Redux Toolkit sa RTK Query
- Auth slice sa setUser/logout actions
- Auth API endpoint
- Protected Route komponente
- Shadcn UI komponente

## 🎯 TDD Strategija za Auth

### 1. Setup Testing Environment

```bash
# Instalacija potrebnih paketa
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev msw jest-environment-jsdom
npm install --save-dev @reduxjs/toolkit-query-react/dist/testing
```

### 2. Test Struktura

```
src/
├── __tests__/
│   ├── setup.ts
│   ├── utils/
│   │   ├── test-utils.tsx
│   │   └── mock-server.ts
│   └── auth/
│       ├── authSlice.test.ts
│       ├── authApi.test.ts
│       ├── Login.test.tsx
│       ├── ProtectedRoute.test.tsx
│       └── integration/
│           └── auth-flow.test.tsx
```

## 🚀 TDD Implementacija Plan

### FAZA 1: Unit Testovi za Auth Logic

#### Test 1: Auth Slice Testovi
```typescript
// __tests__/auth/authSlice.test.ts
import authReducer, { setUser, logout, useCurrentUser, useCurrentToken } from '@/redux/features/auth/authSlice'

describe('Auth Reducer', () => {
  it('should set user and token when setUser is called', () => {/* implement */})
  it('should clear user and token when logout is called', () => {/* implement */})
  it('should return current user from selector', () => {/* implement */})
  it('should return current token from selector', () => {/* implement */})
})
```

#### Test 2: Auth API Testovi
```typescript
// __tests__/auth/authApi.test.ts
describe('Auth API', () => {
  it('should make POST request to /login with credentials')
  it('should return user and token on successful login')
  it('should handle login errors properly')
  it('should transform response data correctly')
})
```

### FAZA 2: Component Testovi

#### Test 3: Login Component Testovi
```typescript
// __tests__/auth/Login.test.tsx
describe('Login Component', () => {
  it('should render login form with email and password fields')
  it('should show validation errors for invalid inputs')
  it('should call login API when form is submitted')
  it('should redirect to dashboard on successful login')
  it('should show error message on failed login')
  it('should disable submit button while loading')
})
```

#### Test 4: Protected Route Testovi
```typescript
// __tests__/auth/ProtectedRoute.test.tsx
describe('Protected Route', () => {
  it('should render children when user is authenticated')
  it('should redirect to login when user is not authenticated')
  it('should redirect to login when token is expired')
  it('should handle token verification properly')
})
```

### FAZA 3: Integration Testovi

#### Test 5: Complete Auth Flow
```typescript
// __tests__/auth/integration/auth-flow.test.tsx
describe('Auth Integration', () => {
  it('should complete full login flow: form → API → redirect')
  it('should persist auth state after page refresh')
  it('should handle logout flow properly')
  it('should handle expired token scenario')
})
```

## 🛠️ Test Utilities & Setup

### Mock Server Worker Setup
```typescript
// __tests__/utils/mock-server.ts
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const mockServer = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body
    
    if (email === 'test@test.com' && password === 'password123') {
      return res(ctx.json({
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@test.com', name: 'Test User' }
      }))
    }
    
    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
  })
)
```

### Test Utils for Redux
```typescript
// __tests__/utils/test-utils.tsx
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import authReducer from '@/redux/features/auth/authSlice'
import { authApi } from '@/redux/features/auth/authApi'

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      authApi: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    preloadedState,
  })
}

export const renderWithProviders = (ui, options = {}) => {
  const store = createTestStore(options.preloadedState)
  
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )
  
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) }
}
```

## 📝 TDD Workflow

### Red-Green-Refactor Ciklus

1. **RED** - Napisati test koji ne prolazi
2. **GREEN** - Napisati minimum koda da test prođe
3. **REFACTOR** - Poboljšati kod zadržavajući testove

### Primer TDD ciklusa za Login

#### Korak 1: RED - Napisati failing test
```typescript
test('should render login form', () => {
  renderWithProviders(<Login />)
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
})
```

#### Korak 2: GREEN - Implementirati osnovnu komponentu
```typescript
const Login = () => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
      
      <button type="submit">Login</button>
    </form>
  )
}
```

#### Korak 3: REFACTOR - Dodati validaciju, UI komponente, itd.

## 🧪 Specifični Test Slučajevi

### Auth State Management
- ✅ Initial state je prazan
- ✅ setUser postavlja korisnika i token
- ✅ logout briše korisnika i token
- ✅ Selektori vraćaju ispravne vrednosti

### API Integration
- ✅ Uspešan login vraća korisnika i token
- ✅ Neuspešan login vraća error
- ✅ Network error se pravilno rukuje
- ✅ Loading state se pravilno upravlja

### UI Components
- ✅ Form validation radi ispravno
- ✅ Submit se poziva sa ispravnim podacima
- ✅ Error messages se prikazuju
- ✅ Loading stanja se prikazuju

### Route Protection
- ✅ Authenticated korisnik može pristupiti zaštićenim rutama
- ✅ Unauthenticated korisnik se redirectuje na login
- ✅ Expired token se rukuje pravilno

## 🎬 Početak implementacije

### Prvi test koji treba napisati:
```typescript
// __tests__/auth/authSlice.test.ts
import authReducer, { setUser, logout } from '@/redux/features/auth/authSlice'

describe('authReducer', () => {
  test('should return initial state', () => {
    const initialState = { user: null, token: null }
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })
})
```

Ovaj test će biti vaš prvi "RED" korak - test će pasti jer još uvek nema implementacije, a zatim ćete implementirati minimum potreban kod da prođe.

## 📊 Metrics i Coverage

- Cilj: 90%+ test coverage za auth functionality
- Integration testovi treba da pokrivaju kritične user journey-je
- Unit testovi za svu business logiku

## 🔄 TDD Workflow - Konkretni Koraci

### Dan 1: Auth Slice (RED-GREEN-REFACTOR)

#### 1. RED - Napisati failing test
```bash
yarn test __tests__/auth/authSlice.test.ts
```
Test će pasti jer authReducer još nije implementiran.

#### 2. GREEN - Minimalna implementacija
```typescript
// redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setUser, logout } = authSlice.actions
export const useCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const useCurrentToken = (state: { auth: AuthState }) => state.auth.token
export default authSlice.reducer
```

#### 3. REFACTOR - Poboljšati kada svi testovi prođu

### Dan 2: Auth API (RED-GREEN-REFACTOR)

#### 1. RED - API testovi
```bash
npm test -- __tests__/auth/authApi.test.ts
```

#### 2. GREEN - RTK Query implementacija
```typescript
// redux/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: {
      id: number
      email: string
      name: string
    }
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
```

### Dan 3: Login Component (RED-GREEN-REFACTOR)

#### 1. RED - Component testovi
```bash
npm test -- __tests__/auth/Login.test.tsx
```

#### 2. GREEN - Shadcn UI implementacija
```typescript
// pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLoginMutation } from '@/redux/features/auth/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setUser } from '@/redux/features/auth/authSlice'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      const result = await login(data).unwrap()
      dispatch(setUser(result.data))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        setError(null)
                      }}
                    />
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
                    <Input 
                      type="password" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setError(null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
```

### Dan 4: Protected Route (RED-GREEN-REFACTOR)

#### 1. RED - Protected Route testovi
```bash
npm test -- __tests__/auth/ProtectedRoute.test.tsx
```

#### 2. GREEN - Implementacija
```typescript
// components/ProtectedRoute.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import { useCurrentToken, useCurrentUser } from '@/redux/features/auth/authSlice'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const token = useAppSelector(useCurrentToken)
  const user = useAppSelector(useCurrentUser)

  useEffect(() => {
    if (!token || !user) {
      navigate('/login')
    }
  }, [token, user, navigate])

  if (!token || !user) {
    return null
  }

  return <>{children}</>
}
```

### Dan 5: Integration Tests

#### Complete Auth Flow Test
```typescript
// __tests__/auth/integration/auth-flow.test.tsx
import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/test-utils'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'

describe('Auth Integration Flow', () => {
  it('should complete full authentication flow', async () => {
    const user = userEvent.setup()
    
    // 1. Start with login page
    const { store } = renderWithProviders(<Login />)
    
    // 2. Fill and submit login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    // 3. Verify store is updated
    await waitFor(() => {
      const state = store.getState()
      expect(state.auth.user).toBeTruthy()
      expect(state.auth.token).toBeTruthy()
    })
    
    // 4. Test protected route access
    const { rerender } = renderWithProviders(
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>,
      { store }
    )
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
  })
})
```

## 🎯 Checklist za Kompletnu Implementaciju

### ✅ Setup Phase
- [ ] Instaliraj test dependencies
- [ ] Konfiguriši Vitest
- [ ] Setup MSW mock server
- [ ] Kreiraj test utilities
- [ ] Konfiguriši coverage reporting

### ✅ Unit Tests
- [ ] Auth slice reducers
- [ ] Auth slice selectors
- [ ] Auth API endpoints
- [ ] Error handling
- [ ] Loading states

### ✅ Component Tests
- [ ] Login form validation
- [ ] Login form submission
- [ ] Error message display
- [ ] Loading stanja
- [ ] Protected route logic

### ✅ Integration Tests
- [ ] Complete auth flow
- [ ] Token persistence
- [ ] Logout functionality
- [ ] Route protection
- [ ] Error scenarios

### ✅ E2E Scenarios
- [ ] Happy path: Login → Dashboard → Logout
- [ ] Error path: Invalid credentials
- [ ] Session expiry handling
- [ ] Refresh token flow (ako postoji)

## 🚀 Pokretanje TDD Workflow-a

### Korak 1: Setup
```bash
# Instaliraj dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom msw

# Kreiraj test struktura
mkdir -p src/__tests__/{auth,utils,integration}

# Kopiraj setup fajlove
# (kopiraj kod iz prethodnih artifakta)
```

### Korak 2: Prvi test
```bash
# Pokreni prvi test
npm test -- __tests__/auth/authSlice.test.ts

# Očekivani rezultat: TEST FAILED ❌
# Razlog: authSlice ne postoji
```

### Korak 3: Implementiraj minimum
```bash
# Kreiraj authSlice.ts sa minimum kodom
# Pokreni test ponovo
npm test -- __tests__/auth/authSlice.test.ts

# Očekivani rezultat: TEST PASSED ✅
```

### Korak 4: Refaktor i nastavi
```bash
# Dodaj sledeći test
# Ponovi RED-GREEN-REFACTOR ciklus
```

## 📈 Praćenje Progress-a

### Daily TDD Goals
- **Dan 1**: Auth slice + testovi (3-4 sata)
- **Dan 2**: Auth API + testovi (3-4 sata)  
- **Dan 3**: Login komponenta + testovi (4-5 sati)
- **Dan 4**: Protected route + testovi (2-3 sata)
- **Dan 5**: Integration testovi (3-4 sata)

### Coverage Goals
- **Dan 1**: 100% coverage za auth slice
- **Dan 2**: 90%+ coverage za API layer
- **Dan 3**: 85%+ coverage za UI komponente
- **Dan 4**: 90%+ coverage za route protection
- **Dan 5**: 90%+ overall auth coverage

## 🛠️ Tools i Commands

### Test Commands
```bash
# Pokretanje svih testova
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- authSlice.test.ts

# Debug mode
npm test -- --inspect-brk
```

### Development Workflow
```bash
# 1. Napisi test (RED)
npm test -- --watch authSlice.test.ts

# 2. Implementiraj kod (GREEN)
# Edituj source fajl

# 3. Refaktor (REFACTOR)
# Poboljšaj kod dok testovi prolaze

# 4. Commit
git add .
git commit -m "feat: implement auth slice with tests"
```

## 📝 Best Practices za TDD

### Test Naming Convention
```typescript
// ✅ Dobro
it('should set user and token when setUser is called')
it('should redirect to login when user is not authenticated')
it('should show validation error for invalid email')

// ❌ Loše  
it('test setUser')
it('protected route test')
it('validation')
```

### Test Organization
```typescript
describe('Auth Slice', () => {
  describe('reducers', () => {
    // reducer testovi
  })
  
  describe('selectors', () => {
    // selector testovi
  })
})
```

### Assertion Patterns
```typescript
// State assertions
expect(newState.user).toEqual(expectedUser)
expect(newState.token).toBe('expected-token')

// DOM assertions
expect(screen.getByText('Login')).toBeInTheDocument()
expect(screen.getByLabelText(/email/i)).toBeInTheDocument()

// Async assertions
await waitFor(() => {
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
})
```

Ovaj dokument vam pruža kompletnu strategiju za TDD implementaciju auth funkcionalnosti. Počnite sa prvim testom i sledite RED-GREEN-REFACTOR ciklus!