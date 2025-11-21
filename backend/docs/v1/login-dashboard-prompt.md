# Step-by-Step Login & Dashboard Implementation

You are working with a React frontend starter pack that includes:
- **React** with TypeScript
- **Redux** for state management
- **Tailwind CSS** for styling
- **Shadcn/ui** components (available at https://ui.shadcn.com)
- **Zod** for validation

## Project Goal
Implement a complete authentication system with login, dashboard, and user profile pages in a step-by-step approach where each functionality can be implemented and tested independently.

## Implementation Steps

### Step 1: Authentication State Management (Redux Setup)
**Request**: "Create Redux slices for authentication state management including:
- User authentication state (isAuthenticated, user data, loading states)
- Login/logout actions
- Error handling for auth operations
- Type definitions for user and auth state using TypeScript
- Use Redux Toolkit for implementation"

**Deliverables Expected**:
- `authSlice.ts` with proper TypeScript types
- Actions for login, logout, and user data management
- Selectors for accessing auth state
- Integration with existing Redux store

### Step 2: Form Validation Schemas (Zod)
**Request**: "Create Zod validation schemas for:
- Login form (email/username and password validation)
- User profile form (name, email, phone, bio, etc.)
- Password change form
- Include proper error messages and validation rules
- Export TypeScript types from schemas"

**Deliverables Expected**:
- Validation schemas with appropriate field validations
- TypeScript types derived from Zod schemas
- Reusable validation functions

### Step 3: Login Page Component
**Request**: "Create a login page component using Shadcn/ui components:
- Use Card, Input, Button, and Form components from Shadcn
- Integrate with Redux for state management
- Use Zod schema for form validation
- Include loading states and error handling
- Responsive design with Tailwind CSS
- Include 'Remember Me' checkbox and 'Forgot Password' link"

**Deliverables Expected**:
- Complete login page component
- Form handling with validation
- Redux integration for auth actions
- Loading and error states
- Responsive design

### Step 4: Protected Route Component
**Request**: "Create a ProtectedRoute component that:
- Checks authentication status from Redux store
- Redirects unauthenticated users to login
- Shows loading spinner while checking auth status
- Allows authenticated users to access protected pages
- Use TypeScript for proper typing"

**Deliverables Expected**:
- ProtectedRoute wrapper component
- Proper TypeScript interfaces
- Integration with React Router (if used)
- Loading states during auth checks

### Step 5: Dashboard Layout Component
**Request**: "Create a dashboard layout component using Shadcn/ui:
- Sidebar navigation with menu items
- Header with user avatar and logout button
- Main content area for dashboard pages
- Use Shadcn components: Sheet, Avatar, Button, DropdownMenu
- Responsive design that collapses sidebar on mobile
- Include navigation items: Dashboard, Profile, Settings"

**Deliverables Expected**:
- Dashboard layout with sidebar and header
- Responsive navigation
- User menu with logout functionality
- Reusable layout component

### Step 6: Dashboard Home Page
**Request**: "Create a dashboard home page component:
- Welcome message with user's name
- Statistics cards showing user metrics
- Recent activity section
- Use Shadcn Card, Badge, and other UI components
- Mock data for demonstration
- Responsive grid layout with Tailwind CSS"

**Deliverables Expected**:
- Dashboard home page with cards and statistics
- Responsive layout
- Integration with user data from Redux

### Step 7: User Profile Page
**Request**: "Create a user profile page with:
- View mode showing user information in cards
- Edit mode with form for updating profile
- Avatar upload section (UI only for now)
- Use Shadcn Form, Input, Textarea, Button, Avatar components
- Zod validation for form fields
- Save/Cancel functionality with Redux integration"

**Deliverables Expected**:
- Profile page with view/edit modes
- Form validation using Zod schemas
- Redux integration for profile updates
- Avatar placeholder with upload UI

### Step 8: Password Change Component
**Request**: "Create a password change component:
- Current password field
- New password and confirm password fields
- Zod validation for password requirements
- Use Shadcn Form components
- Success/error feedback
- Integration with auth Redux slice"

**Deliverables Expected**:
- Password change form component
- Proper validation and confirmation
- User feedback for success/error states

### Step 9: Route Configuration
**Request**: "Create the complete routing configuration:
- Public routes (login)
- Protected routes (dashboard, profile)
- Route guards using ProtectedRoute component
- 404 page handling
- Proper TypeScript typing for routes"

**Deliverables Expected**:
- Complete routing setup
- Protected and public route separation
- 404 error handling

### Step 10: Integration & Testing Setup
**Request**: "Create a complete integration:
- App.tsx with proper routing and Redux provider
- Mock authentication service for testing
- Sample user data for development
- Instructions for testing each component
- Error boundary for better error handling"

**Deliverables Expected**:
- Complete app integration
- Mock data and services
- Testing instructions
- Error handling setup

## Implementation Guidelines

### For Each Step:
1. **Request one step at a time** - Implement and test each step before moving to the next
2. **Ask for specific components** - Be clear about which step you want implemented
3. **Test functionality** - Verify each step works before proceeding
4. **Request modifications** - Ask for adjustments if needed before moving forward

### Code Requirements:
- Use TypeScript throughout with proper typing
- Follow React best practices and hooks
- Use Shadcn/ui components consistently
- Implement responsive design with Tailwind CSS
- Include error handling and loading states
- Write clean, maintainable code with comments

### Example Request Format:
"Please implement Step [X]: [Step Name]. Focus on [specific requirements]. Make sure to include [specific features] and use [specific Shadcn components]."

## Additional Features (Optional)
After completing all steps, you can request:
- Email verification flow
- Password reset functionality
- User settings page
- Dark/light theme toggle
- Advanced form validation
- API integration setup
- Unit tests for components

## Notes
- Each step builds upon previous steps
- Test each component individually before integration
- Use mock data during development
- Focus on UI/UX and component structure first
- API integration can be added later

Start with Step 1 and proceed sequentially for best results!