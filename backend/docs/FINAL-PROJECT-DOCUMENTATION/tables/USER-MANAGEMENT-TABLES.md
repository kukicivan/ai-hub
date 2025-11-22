# User Management Tables Documentation

This document describes the six different table implementations for user management in the AI Hub application.

## Overview

The User Management module provides six different table layouts (V1-V6) to demonstrate various approaches to building data tables in React applications. Each version showcases different features, complexity levels, and use cases.

## Navigation

The User Management module is accessible via the **"Upravljanje korisnicima"** link in the sidebar under the **Administracija** section. A version selector dropdown in the header allows switching between V1-V6 implementations. The selected version is persisted in localStorage.

## Table Versions Comparison

| Feature | V1 | V2 | V3 | V4 | V5 | V6 |
|---------|----|----|----|----|----|----|
| TanStack Table | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Server-side Pagination | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Server-side Sorting | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Server-side Filtering | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Column Visibility | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Row Selection | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Bulk Actions | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| State Persistence | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Grid/List View | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Kanban View | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## V1 - Existing DataTable Pattern

**Route:** `/users/v1`

### Description
Uses the existing datatable pattern from the application with TanStack Table for headless table logic.

### Features
- TanStack React Table integration
- Row selection with checkboxes
- Column sorting (client-side)
- Global search filter
- Pagination with page size selection
- Column visibility toggle
- Row actions dropdown menu
- State persistence to localStorage
- Bulk delete functionality
- Export to CSV

### Technical Implementation
```typescript
import { useReactTable, getCoreRowModel, ... } from "@tanstack/react-table";
import { useTableState } from "@/hooks/useTableState";
```

### Use Cases
- Standard CRUD operations
- Medium-sized datasets (< 1000 rows)
- When you need row selection and bulk actions

---

## V2 - Basic Shadcn Table

**Route:** `/users/v2`

### Description
Simple table using pure shadcn/ui components without TanStack Table. Ideal for simple use cases.

### Features
- Pure shadcn/ui Table components
- Simple pagination
- Search filter
- Row actions menu
- No state persistence

### Technical Implementation
```typescript
import { Table, TableBody, TableCell, ... } from "@/components/ui/table";
```

### Use Cases
- Simple lists without complex requirements
- Quick prototyping
- Learning shadcn/ui components

---

## V3 - Advanced Data Table

**Route:** `/users/v3`

### Description
Based on shadcn/ui examples/tasks pattern. Advanced table with faceted filters and comprehensive features.

### Features
- TanStack React Table
- Faceted filters (user type, status)
- Column visibility controls
- Global search
- Row selection with count display
- Bulk operations
- Column sorting
- State persistence
- Filter reset button

### Technical Implementation
```typescript
import { getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/react-table";
```

### Use Cases
- Complex data management
- When multiple filter types are needed
- Admin dashboards

---

## V4 - Server-Side Table

**Route:** `/users/v4`

### Description
Full server-side pagination, sorting, and filtering using TanStack Table. Best for large datasets where operations must be handled by the server.

### Features
- TanStack React Table with `manualPagination`, `manualSorting`, `manualFiltering`
- Server-side pagination with page size selection
- Server-side sorting with visual column indicators
- Advanced filter popover (type, status, date range)
- Column visibility toggle with localStorage persistence
- Debounced search input with clear button
- Row selection with bulk delete
- Loading overlay during data fetching
- Active filter count badge
- State persistence via `useTableState` hook

### Technical Implementation
```typescript
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { useTableState } from "@/hooks/useTableState";
import { useDebounce } from "@/hooks/useDebounce";

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  pageCount: Math.ceil((data?.pagination.total ?? 0) / pageSize),
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
  state: { sorting, columnVisibility, rowSelection, pagination },
  onSortingChange: setSorting,
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getRowId: (row) => row.id.toString(),
});
```

### API Parameters
- `page`: Current page number
- `per_page`: Items per page
- `search`: Search query
- `sort_by`: Column to sort by (id, name, email, created_at, city, country)
- `sort_order`: 'asc' or 'desc'
- `user_type_id`: Filter by user type
- `status`: 'verified' | 'unverified' | 'all'
- `created_from`: Start date filter
- `created_to`: End date filter

### Use Cases
- Large datasets (1000+ rows)
- When data must stay on server
- Performance-critical applications

---

## V5 - Card/Grid View

**Route:** `/users/v5`

### Description
Modern card-based layout with grid/list toggle option. Great for visual presentation.

### Features
- Grid view (responsive columns)
- List view toggle
- User cards with avatar, contact info
- Hover effects
- Search filter
- User type filter
- Page size options (6, 12, 24, 48)
- Row actions on hover

### Technical Implementation
```typescript
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
```

### Card Layout
- Avatar with fallback initials
- Name and user type badge
- Email, phone, location icons
- Created date
- Verification status badge

### Use Cases
- User directories
- Profile galleries
- Visual-first interfaces
- Mobile-friendly views

---

## V6 - Kanban Board View

**Route:** `/users/v6`

### Description
Visual board organized by user types. Inspired by project management tools like Trello/Linear.

### Features
- Kanban columns by user type
- Scrollable columns
- Color-coded headers
- Quick add button per column
- User cards with hover actions
- Tooltips for status icons
- Horizontal scroll for all columns
- User count badges per column

### Technical Implementation
```typescript
const groupedUsers = useMemo(() => {
  const groups: Record<number, ManagedUser[]> = {};
  userTypesData.userTypes.forEach((type) => { groups[type.id] = []; });
  data.users.forEach((user) => {
    const typeId = user.user_type_id || 0;
    groups[typeId].push(user);
  });
  return groups;
}, [data?.users, userTypesData?.userTypes]);
```

### Column Features
- Dynamic colors based on index
- ScrollArea for overflow
- Empty state message
- Add user button with preset type

### Use Cases
- Visual user organization
- Team management
- Role-based user views
- Onboarding workflows

---

## Shared Components

### UserModal
Create/Edit user dialog with tabbed form:
- **Basic Tab:** Name, email, password (create only), user type, phone
- **Address Tab:** Address lines, city, state, postal code, country
- **Additional Tab:** Bio, account info (edit only)

### ResetPasswordModal
Password reset dialog for admin use.

### DeleteUserDialog
Confirmation dialog with warning icon.

### UserManagementLayout
Shared layout wrapper with:
- Header with title and version selector dropdown
- Version selector dropdown for switching between V1-V6
- Stats cards (total, verified, unverified, monthly growth)
- Action buttons (create, export, reset settings, bulk delete)
- Loading states with skeleton components

---

## State Persistence

Tables V1, V3, and V4 use the `useTableState` hook for localStorage persistence:

```typescript
const { state, setSorting, setColumnFilters, ... } = useTableState({
  storageKey: "user-management-v1", // or v3, v4
  defaultState: { pagination: { pageIndex: 0, pageSize: 10 } },
});
```

### Persisted State
- Sorting configuration
- Column filters
- Column visibility
- Pagination settings
- Global filter (search)

### Not Persisted
- Row selection (reset on load)

### Version Preference

The selected table version (V1-V6) is persisted in localStorage under the key `user-management-version`. When navigating to `/users`, the application automatically redirects to the last used version.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users` | GET | List users with pagination/filters |
| `/api/v1/users` | POST | Create new user |
| `/api/v1/users/{id}` | GET | Get single user |
| `/api/v1/users/{id}` | PUT | Update user |
| `/api/v1/users/{id}` | DELETE | Delete user |
| `/api/v1/users/{id}/reset-password` | POST | Reset user password |
| `/api/v1/users/{id}/avatar` | POST | Upload avatar |
| `/api/v1/users/{id}/avatar` | DELETE | Delete avatar |
| `/api/v1/users/bulk-delete` | POST | Bulk delete users |
| `/api/v1/users/bulk-update-type` | POST | Bulk update user types |
| `/api/v1/users/stats` | GET | Get user statistics |
| `/api/v1/users/export` | POST | Export users to CSV |
| `/api/v1/user-types` | GET | Get all user types |
| `/api/v1/roles` | GET | Get all roles |

---

## Best Practices

1. **Choose the right version:**
   - Small datasets with simple needs: V2
   - Medium datasets with client-side operations: V1 or V3
   - Large datasets (1000+ rows): V4 (server-side operations)
   - Visual/card-based interfaces: V5
   - Role-based organization: V6

2. **State Management:**
   - Use localStorage persistence for user preferences (V1, V3, V4)
   - Reset row selection on navigation
   - Use `useTableState` hook for consistent state handling

3. **Performance:**
   - Use server-side operations for large datasets (V4)
   - Debounce search inputs (300ms recommended)
   - Implement loading overlays during data fetching
   - Use TanStack Table with `manual*` flags for server-side control

4. **UX:**
   - Show skeleton loaders during initial fetch
   - Show overlay loaders during pagination/sorting
   - Provide feedback on actions (toast notifications)
   - Confirm destructive actions (delete dialogs)
   - Include clear buttons on search inputs
