// V4: Server-Side Table - Full server-side pagination, sorting, filtering with TanStack Table
import { useState, useMemo, useRef } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
  X,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { UserManagementLayout } from "./UserManagementLayout";
import { UserModal } from "./UserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useTableState } from "@/hooks/useTableState";
import {
  ManagedUser,
  useGetUsersQuery,
  useDeleteUserMutation,
  useBulkDeleteUsersMutation,
  useExportUsersMutation,
  useGetUserTypesQuery,
  UsersListParams,
} from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV4() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  // Advanced filters state (not part of TanStack Table)
  const [filters, setFilters] = useState<{
    user_type_id?: number;
    status?: "verified" | "unverified" | "all";
    created_from?: string;
    created_to?: string;
  }>({});

  // Track the source of the last change for showing appropriate loader
  const loadingSourceRef = useRef<"filter" | "table">("table");

  const {
    state,
    setSorting,
    setColumnVisibility,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    resetToDefault,
  } = useTableState({
    storageKey: "user-management-v4",
    defaultState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
    },
  });

  const debouncedSearch = useDebounce(state.globalFilter || "", 300);

  // Convert TanStack sorting to API format
  const sortConfig =
    state.sorting.length > 0
      ? {
          column: state.sorting[0].id,
          order: state.sorting[0].desc ? ("desc" as const) : ("asc" as const),
        }
      : undefined;

  const queryParams: UsersListParams = {
    page: state.pagination.pageIndex + 1,
    per_page: state.pagination.pageSize,
    search: debouncedSearch,
    sort_by: sortConfig?.column,
    sort_order: sortConfig?.order,
    ...filters,
  };

  const { data: userTypesData } = useGetUserTypesQuery();
  const { data, isLoading, isFetching, refetch } = useGetUsersQuery(queryParams);
  const [deleteUser] = useDeleteUserMutation();
  const [bulkDeleteUsers] = useBulkDeleteUsersMutation();
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();

  const columns: ColumnDef<ManagedUser>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              loadingSourceRef.current = "table";
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4"
          >
            Korisnik
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar_url || undefined} />
              <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              loadingSourceRef.current = "table";
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4"
          >
            Email
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      },
      {
        accessorKey: "user_type",
        header: "Tip",
        cell: ({ row }) => <Badge variant="outline">{row.original.user_type?.name || "N/A"}</Badge>,
        enableSorting: false,
      },
      {
        accessorKey: "email_verified_at",
        header: "Status",
        cell: ({ row }) =>
          row.original.email_verified_at ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Verificiran
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-600">
              <XCircle className="h-4 w-4" />
              Pending
            </span>
          ),
        enableSorting: false,
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              loadingSourceRef.current = "table";
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4"
          >
            Grad
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => row.original.city || "-",
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              loadingSourceRef.current = "table";
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4"
          >
            Kreiran
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("bs-BA"),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setUserModalOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Uredi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setResetPasswordModalOpen(true);
                }}
              >
                <Key className="mr-2 h-4 w-4" />
                Reset lozinke
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setUserToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.users || [],
    columns,
    pageCount: data?.pagination.last_page || 1,
    state: {
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
    },
    onSortingChange: (updater) => {
      loadingSourceRef.current = "table";
      setSorting(updater);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getRowId: (row) => row.id.toString(),
  });

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast.success("Korisnik obrisan");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch {
        toast.error("Greška");
      }
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(state.rowSelection)
      .filter((key) => state.rowSelection[key])
      .map((key) => parseInt(key));

    if (selectedIds.length === 0) return;

    try {
      await bulkDeleteUsers({ ids: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} korisnik(a) obrisano`);
      setRowSelection({});
    } catch {
      toast.error("Greška");
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportUsers().unwrap();
      console.log("Export result:", result);

      const exportData = result.data || result;
      const exportColumns =
        result.columns ||
        (Array.isArray(exportData) && exportData.length > 0 ? Object.keys(exportData[0]) : []);
      const rows = Array.isArray(exportData) ? exportData : [];

      if (exportColumns.length === 0 || rows.length === 0) {
        toast.error("Nema podataka za izvoz");
        return;
      }

      const csv = [
        exportColumns.join(","),
        ...rows.map((row: Record<string, unknown>) =>
          exportColumns.map((col: string) => `"${row[col] ?? ""}"`).join(",")
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `korisnici-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("Izvoz uspješan");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Greška pri izvozu");
    }
  };

  const handleResetSettings = () => {
    resetToDefault();
    setFilters({});
  };

  const selectedCount = Object.values(state.rowSelection).filter(Boolean).length;
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <UserManagementLayout
      versionLabel="Server-Side Table"
      description="Potpuna server-side paginacija, sortiranje i filtriranje sa TanStack Table"
      onCreateUser={() => {
        setSelectedUser(null);
        setUserModalOpen(true);
      }}
      onExport={handleExport}
      onResetSettings={handleResetSettings}
      onBulkDelete={selectedCount > 0 ? handleBulkDelete : undefined}
      selectedCount={selectedCount}
      isExporting={isExporting}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative max-w-sm w-full">
            <Input
              placeholder="Pretraži (server-side)..."
              value={state.globalFilter ?? ""}
              onChange={(e) => {
                loadingSourceRef.current = "table";
                setGlobalFilter(e.target.value);
              }}
              className="pr-8 w-full"
            />
            {state.globalFilter && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8 hover:bg-transparent"
                onClick={() => setGlobalFilter("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          {/* Advanced Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filteri
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Tip korisnika</Label>
                  <Select
                    value={filters.user_type_id?.toString() || "all"}
                    onValueChange={(v) => {
                      loadingSourceRef.current = "filter";
                      setFilters((f) => ({
                        ...f,
                        user_type_id: v === "all" ? undefined : parseInt(v),
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Svi tipovi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Svi tipovi</SelectItem>
                      {userTypesData?.userTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(v: "verified" | "unverified" | "all") => {
                      loadingSourceRef.current = "filter";
                      setFilters((f) => ({ ...f, status: v === "all" ? undefined : v }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Svi statusi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Svi</SelectItem>
                      <SelectItem value="verified">Verificiran</SelectItem>
                      <SelectItem value="unverified">Neverificiran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Od datuma</Label>
                    <Input
                      type="date"
                      value={filters.created_from || ""}
                      onChange={(e) => {
                        loadingSourceRef.current = "filter";
                        setFilters((f) => ({ ...f, created_from: e.target.value || undefined }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Do datuma</Label>
                    <Input
                      type="date"
                      value={filters.created_to || ""}
                      onChange={(e) => {
                        loadingSourceRef.current = "filter";
                        setFilters((f) => ({ ...f, created_to: e.target.value || undefined }));
                      }}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Očisti filtere
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {isFetching && !isLoading && loadingSourceRef.current === "filter" && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Kolone
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "email"
                      ? "Email"
                      : column.id === "user_type"
                        ? "Tip"
                        : column.id === "email_verified_at"
                          ? "Status"
                          : column.id === "city"
                            ? "Grad"
                            : column.id === "created_at"
                              ? "Kreiran"
                              : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={state.pagination.pageSize.toString()}
            onValueChange={(v) => setPagination({ pageIndex: 0, pageSize: parseInt(v) })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} redova
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="relative rounded-md border">
        {/* Loading overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-md">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: state.pagination.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nema rezultata.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Prikazano {data?.pagination.from || 0}-{data?.pagination.to || 0} od{" "}
          {data?.pagination.total || 0}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Prva
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prethodna
          </Button>
          <span className="px-2 text-sm">
            Stranica {state.pagination.pageIndex + 1} od {data?.pagination.last_page || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sljedeća
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex((data?.pagination.last_page || 1) - 1)}
            disabled={!table.getCanNextPage()}
          >
            Zadnja
          </Button>
        </div>
      </div>

      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        user={selectedUser}
        onSuccess={() => refetch()}
      />
      <ResetPasswordModal
        open={resetPasswordModalOpen}
        onOpenChange={setResetPasswordModalOpen}
        user={selectedUser}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </UserManagementLayout>
  );
}
