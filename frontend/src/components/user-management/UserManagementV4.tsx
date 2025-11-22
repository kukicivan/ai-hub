// V4: Server-Side Table - Full server-side pagination, sorting, filtering
import { useState, useCallback } from "react";
import { MoreHorizontal, Pencil, Trash2, Key, CheckCircle, XCircle, ArrowUp, ArrowDown, ArrowUpDown, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { UserManagementLayout } from "./UserManagementLayout";
import { UserModal } from "./UserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ManagedUser, useGetUsersQuery, useDeleteUserMutation, useBulkDeleteUsersMutation, useExportUsersMutation, useGetUserTypesQuery, UsersListParams } from "@/redux/features/userManagement/userManagementApi";

type SortConfig = { column: string; order: "asc" | "desc" } | null;

export default function UserManagementV4() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "created_at", order: "desc" });
  const [filters, setFilters] = useState<{ user_type_id?: number; status?: string; created_from?: string; created_to?: string }>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const queryParams: UsersListParams = {
    page,
    per_page: perPage,
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

  const handleSort = useCallback((column: string) => {
    setSortConfig((prev) => {
      if (prev?.column === column) {
        return prev.order === "asc" ? { column, order: "desc" } : null;
      }
      return { column, order: "asc" };
    });
    setPage(1);
  }, []);

  const getSortIcon = (column: string) => {
    if (sortConfig?.column !== column) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    return sortConfig.order === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const toggleSelect = (id: number) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleSelectAll = () => {
    if (data?.users) {
      const allIds = data.users.map((u) => u.id);
      setSelectedIds((prev) => prev.length === allIds.length ? [] : allIds);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast.success("Korisnik obrisan");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        setSelectedIds((prev) => prev.filter((id) => id !== userToDelete.id));
      } catch { toast.error("Greška"); }
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    try {
      await bulkDeleteUsers({ ids: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} korisnik(a) obrisano`);
      setSelectedIds([]);
    } catch { toast.error("Greška"); }
  };

  const handleExport = async () => {
    try {
      const result = await exportUsers().unwrap();
      const csv = [result.columns.join(","), ...result.data.map((row) => result.columns.map((col) => `"${row[col] || ""}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `korisnici-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("Izvoz uspješan");
    } catch { toast.error("Greška"); }
  };

  const resetSettings = () => {
    setPage(1);
    setPerPage(10);
    setSearch("");
    setSortConfig({ column: "created_at", order: "desc" });
    setFilters({});
    setSelectedIds([]);
    localStorage.removeItem("user-management-v4");
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <UserManagementLayout version="V4" versionLabel="Server-Side Table" description="Potpuna server-side paginacija, sortiranje i filtriranje" onCreateUser={() => { setSelectedUser(null); setUserModalOpen(true); }} onExport={handleExport} onResetSettings={resetSettings} onBulkDelete={selectedIds.length > 0 ? handleBulkDelete : undefined} selectedCount={selectedIds.length} isExporting={isExporting}>
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Input placeholder="Pretraži (server-side)..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />

          {/* Advanced Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />Filteri{activeFiltersCount > 0 && <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Tip korisnika</Label>
                  <Select value={filters.user_type_id?.toString() || ""} onValueChange={(v) => setFilters((f) => ({ ...f, user_type_id: v ? parseInt(v) : undefined }))}>
                    <SelectTrigger><SelectValue placeholder="Svi tipovi" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Svi tipovi</SelectItem>
                      {userTypesData?.userTypes.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filters.status || ""} onValueChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))}>
                    <SelectTrigger><SelectValue placeholder="Svi statusi" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Svi</SelectItem>
                      <SelectItem value="verified">Verificiran</SelectItem>
                      <SelectItem value="unverified">Neverificiran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Od datuma</Label>
                    <Input type="date" value={filters.created_from || ""} onChange={(e) => setFilters((f) => ({ ...f, created_from: e.target.value || undefined }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Do datuma</Label>
                    <Input type="date" value={filters.created_to || ""} onChange={(e) => setFilters((f) => ({ ...f, created_to: e.target.value || undefined }))} />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFilters({})} className="w-full"><X className="mr-2 h-4 w-4" />Očisti filtere</Button>
              </div>
            </PopoverContent>
          </Popover>

          {isFetching && !isLoading && <span className="text-sm text-muted-foreground animate-pulse">Učitavanje...</span>}
        </div>

        <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1); }}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>{[10, 20, 30, 50, 100].map((n) => <SelectItem key={n} value={n.toString()}>{n} redova</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox checked={data?.users && selectedIds.length === data.users.length && data.users.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">Korisnik{getSortIcon("name")}</Button></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("email")} className="-ml-4">Email{getSortIcon("email")}</Button></TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("city")} className="-ml-4">Grad{getSortIcon("city")}</Button></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("created_at")} className="-ml-4">Kreiran{getSortIcon("created_at")}</Button></TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: perPage }).map((_, i) => (<TableRow key={i}><TableCell colSpan={8}><Skeleton className="h-12 w-full" /></TableCell></TableRow>)) : data?.users.length ? data.users.map((user) => (
              <TableRow key={user.id} data-state={selectedIds.includes(user.id) && "selected"}>
                <TableCell><Checkbox checked={selectedIds.includes(user.id)} onCheckedChange={() => toggleSelect(user.id)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={user.avatar_url || undefined} /><AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell><Badge variant="outline">{user.user_type?.name || "N/A"}</Badge></TableCell>
                <TableCell>{user.email_verified_at ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" />Verificiran</span> : <span className="flex items-center gap-1 text-yellow-600"><XCircle className="h-4 w-4" />Pending</span>}</TableCell>
                <TableCell>{user.city || "-"}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString("bs-BA")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setUserModalOpen(true); }}><Pencil className="mr-2 h-4 w-4" />Uredi</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setResetPasswordModalOpen(true); }}><Key className="mr-2 h-4 w-4" />Reset lozinke</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { setUserToDelete(user); setDeleteDialogOpen(true); }}><Trash2 className="mr-2 h-4 w-4" />Obriši</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={8} className="h-24 text-center">Nema rezultata.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">Prikazano {data?.pagination.from || 0}-{data?.pagination.to || 0} od {data?.pagination.total || 0}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>Prva</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prethodna</Button>
          <span className="px-2 text-sm">Stranica {page} od {data?.pagination.last_page || 1}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.pagination.last_page || 1)}>Sljedeća</Button>
          <Button variant="outline" size="sm" onClick={() => setPage(data?.pagination.last_page || 1)} disabled={page >= (data?.pagination.last_page || 1)}>Zadnja</Button>
        </div>
      </div>

      <UserModal open={userModalOpen} onOpenChange={setUserModalOpen} user={selectedUser} onSuccess={() => refetch()} />
      <ResetPasswordModal open={resetPasswordModalOpen} onOpenChange={setResetPasswordModalOpen} user={selectedUser} />
      <DeleteUserDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} user={userToDelete} onConfirm={handleConfirmDelete} />
    </UserManagementLayout>
  );
}
