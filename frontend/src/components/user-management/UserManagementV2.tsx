// V2: Basic Shadcn Table - Simple table without TanStack, pure shadcn/ui
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Key, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { UserManagementLayout } from "./UserManagementLayout";
import { UserModal } from "./UserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import {
  ManagedUser,
  useGetUsersQuery,
  useDeleteUserMutation,
  useExportUsersMutation,
} from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV2() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const { data, isLoading, refetch } = useGetUsersQuery({ page, per_page: 10, search });
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();

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

  const resetSettings = () => {
    setPage(1);
    setSearch("");
  };

  return (
    <UserManagementLayout
      version="V2"
      versionLabel="Basic Shadcn Table"
      description="Jednostavna tabela korištenjem čistih shadcn/ui komponenti bez TanStack"
      onCreateUser={() => { setSelectedUser(null); setUserModalOpen(true); }}
      onExport={handleExport}
      onResetSettings={resetSettings}
      isExporting={isExporting}
    >
      <div className="flex items-center py-4">
        <Input
          placeholder="Pretraži korisnike..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Korisnik</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.users.length ? (
              data.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{user.user_type?.name || "N/A"}</Badge></TableCell>
                  <TableCell>
                    {user.email_verified_at ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" /> Verificiran
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <XCircle className="h-4 w-4" /> Pending
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.city || "-"}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("bs-BA")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" /> Uredi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <Key className="mr-2 h-4 w-4" /> Reset lozinke
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Nema rezultata.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Stranica {page} od {data?.pagination.last_page || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.pagination.last_page || 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <UserModal open={userModalOpen} onOpenChange={setUserModalOpen} user={selectedUser} onSuccess={() => refetch()} />
      <ResetPasswordModal open={resetPasswordModalOpen} onOpenChange={setResetPasswordModalOpen} user={selectedUser} />
      <DeleteUserDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} user={userToDelete} onConfirm={handleConfirmDelete} />
    </UserManagementLayout>
  );
}
