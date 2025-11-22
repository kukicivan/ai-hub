// V6: Kanban Board View - Visual board organized by user types
import { useState, useMemo } from "react";
import { MoreHorizontal, Pencil, Trash2, Key, CheckCircle, XCircle, Mail, Users as UsersIcon, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { UserManagementLayout } from "./UserManagementLayout";
import { UserModal } from "./UserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ManagedUser, useGetUsersQuery, useDeleteUserMutation, useExportUsersMutation, useGetUserTypesQuery } from "@/redux/features/userManagement/userManagementApi";

export default function UserManagementV6() {
  const [search, setSearch] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const [presetUserType, setPresetUserType] = useState<number | null>(null);

  const { data: userTypesData, isLoading: isLoadingTypes } = useGetUserTypesQuery();
  const { data, isLoading, refetch } = useGetUsersQuery({ per_page: 100, search });
  const [deleteUser] = useDeleteUserMutation();
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();

  // Group users by user type
  const groupedUsers = useMemo(() => {
    if (!data?.users || !userTypesData?.userTypes) return {};

    const groups: Record<number, ManagedUser[]> = {};
    userTypesData.userTypes.forEach((type) => { groups[type.id] = []; });
    groups[0] = []; // For users without type

    data.users.forEach((user) => {
      const typeId = user.user_type_id || 0;
      if (!groups[typeId]) groups[typeId] = [];
      groups[typeId].push(user);
    });

    return groups;
  }, [data?.users, userTypesData?.userTypes]);

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast.success("Korisnik obrisan");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch { toast.error("Greška"); }
    }
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

  const resetSettings = () => { setSearch(""); };

  const handleCreateForType = (typeId: number | null) => {
    setPresetUserType(typeId);
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const UserCard = ({ user }: { user: ManagedUser }) => (
    <Card className="group mb-2 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSelectedUser(user); setUserModalOpen(true); }}><Pencil className="mr-2 h-4 w-4" />Uredi</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedUser(user); setResetPasswordModalOpen(true); }}><Key className="mr-2 h-4 w-4" />Reset lozinke</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => { setUserToDelete(user); setDeleteDialogOpen(true); }}><Trash2 className="mr-2 h-4 w-4" />Obriši</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {user.email_verified_at ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-yellow-500" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {user.email_verified_at ? "Email verificiran" : "Email nije verificiran"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {user.city && <Badge variant="outline" className="text-xs py-0">{user.city}</Badge>}
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ typeId, typeName, users, color }: { typeId: number; typeName: string; users: ManagedUser[]; color: string }) => (
    <Card className="flex-shrink-0 w-[300px] h-full flex flex-col">
      <CardHeader className={`pb-2 ${color} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>{typeName}</span>
            <Badge variant="secondary" className="ml-1">{users.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCreateForType(typeId)}>
            <Plus className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-2">
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Nema korisnika
            </div>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );

  const columnColors = [
    "bg-blue-100 dark:bg-blue-900/30",
    "bg-green-100 dark:bg-green-900/30",
    "bg-purple-100 dark:bg-purple-900/30",
    "bg-orange-100 dark:bg-orange-900/30",
    "bg-pink-100 dark:bg-pink-900/30",
  ];

  return (
    <UserManagementLayout version="V6" versionLabel="Kanban Board View" description="Vizualni board prikaz organiziran po tipovima korisnika" onCreateUser={() => { setPresetUserType(null); setSelectedUser(null); setUserModalOpen(true); }} onExport={handleExport} onResetSettings={resetSettings} isExporting={isExporting}>
      {/* Toolbar */}
      <div className="flex items-center py-4 gap-4">
        <Input placeholder="Pretraži korisnike..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <div className="text-sm text-muted-foreground">
          Ukupno: {data?.pagination.total || 0} korisnika
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading || isLoadingTypes ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-shrink-0 w-[300px] h-[500px]">
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "500px" }}>
          {userTypesData?.userTypes.map((type, index) => (
            <KanbanColumn
              key={type.id}
              typeId={type.id}
              typeName={type.name}
              users={groupedUsers[type.id] || []}
              color={columnColors[index % columnColors.length]}
            />
          ))}
          {/* Unassigned column */}
          {(groupedUsers[0]?.length || 0) > 0 && (
            <KanbanColumn
              typeId={0}
              typeName="Bez tipa"
              users={groupedUsers[0] || []}
              color="bg-gray-100 dark:bg-gray-900/30"
            />
          )}
        </div>
      )}

      <UserModal open={userModalOpen} onOpenChange={setUserModalOpen} user={selectedUser} onSuccess={() => refetch()} />
      <ResetPasswordModal open={resetPasswordModalOpen} onOpenChange={setResetPasswordModalOpen} user={selectedUser} />
      <DeleteUserDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} user={userToDelete} onConfirm={handleConfirmDelete} />
    </UserManagementLayout>
  );
}
