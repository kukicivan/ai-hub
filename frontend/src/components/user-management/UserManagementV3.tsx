// V3: Advanced Data Table - Based on shadcn/ui examples/tasks pattern
import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
} from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV3() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const {
    state,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    resetToDefault,
    resetFilters,
  } = useTableState({
    storageKey: "user-management-v3",
  });

  const { data: userTypesData } = useGetUserTypesQuery();
  const { data, isLoading, refetch } = useGetUsersQuery({
    page: state.pagination.pageIndex + 1,
    per_page: state.pagination.pageSize,
    search: state.globalFilter,
  });

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
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Korisnik",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar_url || undefined} />
              <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">{row.original.email}</div>
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "user_type.name",
        header: "Tip",
        cell: ({ row }) => <Badge variant="outline">{row.original.user_type?.name || "N/A"}</Badge>,
        filterFn: (row, _id, value) => value.includes(row.original.user_type?.id?.toString()),
      },
      {
        accessorKey: "email_verified_at",
        header: "Status",
        cell: ({ row }) =>
          row.original.email_verified_at ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" /> Verificiran
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600">
              <XCircle className="h-4 w-4" /> Pending
            </div>
          ),
        filterFn: (row, _id, value) => {
          if (value === "verified") return !!row.original.email_verified_at;
          if (value === "unverified") return !row.original.email_verified_at;
          return true;
        },
      },
      { accessorKey: "phone", header: "Telefon", cell: ({ row }) => row.original.phone || "-" },
      { accessorKey: "city", header: "Grad", cell: ({ row }) => row.original.city || "-" },
      { accessorKey: "country", header: "Država", cell: ({ row }) => row.original.country || "-" },
      {
        accessorKey: "created_at",
        header: "Kreiran",
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
              <DropdownMenuLabel>Akcije</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setUserModalOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Uredi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setResetPasswordModalOpen(true);
                }}
              >
                <Key className="mr-2 h-4 w-4" /> Reset lozinke
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setUserToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Obriši
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
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
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
      globalFilter: state.globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
  });

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast.success("Korisnik uspješno obrisan");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch {
        toast.error("Greška pri brisanju");
      }
    }
  };

  const handleBulkDelete = async () => {
    const ids = Object.keys(state.rowSelection)
      .filter((k) => state.rowSelection[k])
      .map((k) => parseInt(k));
    if (!ids.length) return;
    try {
      await bulkDeleteUsers({ ids }).unwrap();
      toast.success(`${ids.length} korisnik(a) obrisano`);
      setRowSelection({});
    } catch {
      toast.error("Greška pri brisanju");
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportUsers().unwrap();
      const csv = [
        result.columns.join(","),
        ...result.data.map((row) => result.columns.map((col) => `"${row[col] || ""}"`).join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `korisnici-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("Izvoz uspješan");
    } catch {
      toast.error("Greška pri izvozu");
    }
  };

  const selectedCount = Object.values(state.rowSelection).filter(Boolean).length;
  const isFiltered = state.columnFilters.length > 0 || state.globalFilter;

  return (
    <UserManagementLayout
      versionLabel="Advanced Data Table"
      description="Napredna tabela sa faceted filterima, column visibility i više"
      onCreateUser={() => {
        setSelectedUser(null);
        setUserModalOpen(true);
      }}
      onExport={handleExport}
      onResetSettings={resetToDefault}
      onBulkDelete={selectedCount > 0 ? handleBulkDelete : undefined}
      selectedCount={selectedCount}
      isExporting={isExporting}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Input
              placeholder="Pretraži..."
              value={state.globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-8 pr-8 w-full"
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

          {/* User Type Filter */}
          <Select
            value={
              (state.columnFilters.find((f) => f.id === "user_type.name")?.value as string) || ""
            }
            onValueChange={(value) =>
              setColumnFilters(value ? [{ id: "user_type.name", value: [value] }] : [])
            }
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Tip korisnika" />
            </SelectTrigger>
            <SelectContent>
              {userTypesData?.userTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={
              (state.columnFilters.find((f) => f.id === "email_verified_at")?.value as string) || ""
            }
            onValueChange={(value) =>
              setColumnFilters((prev) => [
                ...prev.filter((f) => f.id !== "email_verified_at"),
                ...(value ? [{ id: "email_verified_at", value }] : []),
              ])
            }
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verificiran</SelectItem>
              <SelectItem value="unverified">Neverificiran</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
              Resetuj
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Kolone
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
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
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedCount > 0
            ? `${selectedCount} od ${data?.pagination.total || 0} odabrano`
            : `${data?.pagination.from || 0}-${data?.pagination.to || 0} od ${data?.pagination.total || 0}`}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prethodna
          </Button>
          <span className="text-sm">
            Str. {state.pagination.pageIndex + 1}/{data?.pagination.last_page || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sljedeća
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
