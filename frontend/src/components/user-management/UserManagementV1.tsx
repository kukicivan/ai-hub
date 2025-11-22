import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV1() {
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
  } = useTableState({
    storageKey: "user-management-v1",
    defaultState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

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
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Ime <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar_url || undefined} alt={row.original.name} />
              <AvatarFallback>{row.original.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "user_type",
        header: "Tip",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.user_type?.name || "N/A"}</Badge>
        ),
      },
      {
        accessorKey: "email_verified_at",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.email_verified_at ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Verificiran</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-600">Pending</span>
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: "city",
        header: "Grad",
        cell: ({ row }) => row.original.city || "-",
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Kreiran <ArrowUpDown className="ml-2 h-4 w-4" />
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
              <DropdownMenuItem onClick={() => handleEditUser(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Uredi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResetPassword(row.original)}>
                <Key className="mr-2 h-4 w-4" /> Reset lozinke
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(row.original)}>
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
    manualPagination: true,
  });

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleResetPassword = (user: ManagedUser) => {
    setSelectedUser(user);
    setResetPasswordModalOpen(true);
  };

  const handleDeleteUser = (user: ManagedUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast.success("Korisnik uspješno obrisan");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch {
        toast.error("Greška pri brisanju korisnika");
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
      toast.success(`${selectedIds.length} korisnik(a) uspješno obrisano`);
      setRowSelection({});
    } catch {
      toast.error("Greška pri brisanju korisnika");
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
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `korisnici-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("Izvoz uspješan");
    } catch {
      toast.error("Greška pri izvozu");
    }
  };

  const selectedCount = Object.values(state.rowSelection).filter(Boolean).length;

  return (
    <UserManagementLayout
      version="V1"
      versionLabel="Existing DataTable Pattern"
      description="Koristi postojeći uzorak tabele iz aplikacije sa TanStack Table"
      onCreateUser={() => { setSelectedUser(null); setUserModalOpen(true); }}
      onExport={handleExport}
      onResetSettings={resetToDefault}
      onBulkDelete={selectedCount > 0 ? handleBulkDelete : undefined}
      selectedCount={selectedCount}
      isExporting={isExporting}
    >
      {/* Search */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Pretraži korisnike..."
          value={state.globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={j}><Skeleton className="h-8 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
          {data?.pagination.from || 0} - {data?.pagination.to || 0} od {data?.pagination.total || 0} korisnika
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={state.pagination.pageSize.toString()}
            onValueChange={(value) => setPagination({ pageIndex: 0, pageSize: parseInt(value) })}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Stranica {state.pagination.pageIndex + 1} od {data?.pagination.last_page || 1}
          </span>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.setPageIndex((data?.pagination.last_page || 1) - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
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
