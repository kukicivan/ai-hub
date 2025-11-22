// V5: Card/Grid View - Modern card-based layout for user management
import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  Grid,
  List,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { UserManagementLayout } from "./UserManagementLayout";
import { UserModal } from "./UserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import {
  ManagedUser,
  useGetUsersQuery,
  useDeleteUserMutation,
  useExportUsersMutation,
  useGetUserTypesQuery,
} from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV5() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const { data: userTypesData } = useGetUserTypesQuery();
  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    per_page: perPage,
    search,
    user_type_id: userTypeFilter ? parseInt(userTypeFilter) : undefined,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();

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
      toast.error("Greška");
    }
  };

  const resetSettings = () => {
    setPage(1);
    setPerPage(12);
    setSearch("");
    setViewMode("grid");
    setUserTypeFilter("");
  };

  const UserCard = ({ user }: { user: ManagedUser }) => (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <Badge variant="outline" className="mt-1">
                {user.user_type?.name || "N/A"}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setUserModalOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Uredi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
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
                  setUserToDelete(user);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Obriši
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{user.phone}</span>
          </div>
        )}
        {(user.city || user.country) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{[user.city, user.country].filter(Boolean).join(", ")}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(user.created_at).toLocaleDateString("bs-BA")}
        </div>
        {user.email_verified_at ? (
          <Badge variant="secondary" className="text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verificiran
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-yellow-600">
            <XCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )}
      </CardFooter>
    </Card>
  );

  const UserListItem = ({ user }: { user: ManagedUser }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="outline">{user.user_type?.name || "N/A"}</Badge>
        {user.email_verified_at ? (
          <Badge variant="secondary" className="text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verificiran
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-yellow-600">
            <XCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setUserModalOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Uredi
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
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
                setUserToDelete(user);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <UserManagementLayout
      versionLabel="Card/Grid View"
      description="Moderni card-based prikaz sa grid/list toggle opcijom"
      onCreateUser={() => {
        setSelectedUser(null);
        setUserModalOpen(true);
      }}
      onExport={handleExport}
      onResetSettings={resetSettings}
      isExporting={isExporting}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Input
              placeholder="Pretraži korisnike..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pr-8 w-full"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8 hover:bg-transparent"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          <Select
            value={userTypeFilter || "all"}
            onValueChange={(v) => {
              setUserTypeFilter(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
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
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={perPage.toString()}
            onValueChange={(v) => {
              setPerPage(parseInt(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[6, 12, 24, 48].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2"
          }
        >
          {Array.from({ length: perPage }).map((_, i) =>
            viewMode === "grid" ? (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ) : (
              <Skeleton key={i} className="h-16 w-full" />
            )
          )}
        </div>
      ) : data?.users.length ? (
        viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {data.users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </div>
        )
      ) : (
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          Nema rezultata.
        </div>
      )}

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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prethodna
          </Button>
          <span className="px-2 text-sm">
            Stranica {page} od {data?.pagination.last_page || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.pagination.last_page || 1)}
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
