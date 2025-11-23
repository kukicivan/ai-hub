import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  Users,
  Mail,
  Shield,
  Crown,
  UserPlus,
  Settings,
  Trash2,
  Edit,
  Copy,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  status: "active" | "pending";
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Marko Horvat",
    email: "marko@company.hr",
    role: "owner",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    lastActive: new Date(),
    status: "active",
  },
  {
    id: "2",
    name: "Ana Kovač",
    email: "ana@company.hr",
    role: "admin",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    status: "active",
  },
  {
    id: "3",
    name: "Ivan Babić",
    email: "ivan@company.hr",
    role: "member",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "active",
  },
  {
    id: "4",
    name: "Pending User",
    email: "pending@company.hr",
    role: "member",
    joinedAt: new Date(),
    lastActive: new Date(),
    status: "pending",
  },
];

interface WorkspaceInfo {
  name: string;
  domain: string;
  plan: "free" | "pro" | "enterprise";
  seats: { used: number; total: number };
  createdAt: Date;
}

export function WorkspaceSettings() {
  const toast = useToast();
  const [workspace, setWorkspace] = useState<WorkspaceInfo>({
    name: "Moja Tvrtka",
    domain: "company.hr",
    plan: "pro",
    seats: { used: 4, total: 10 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  });
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkspace, setEditedWorkspace] = useState(workspace);

  // Settings
  const [allowDomainJoin, setAllowDomainJoin] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [allowExternalSharing, setAllowExternalSharing] = useState(false);

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return (
          <Badge className="bg-yellow-500">
            <Crown className="h-3 w-3 mr-1" />
            Vlasnik
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-500">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return <Badge variant="secondary">Član</Badge>;
    }
  };

  const getStatusBadge = (status: TeamMember["status"]) => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="text-yellow-600">
          <Clock className="h-3 w-3 mr-1" />
          Na čekanju
        </Badge>
      );
    }
    return null;
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error("Unesite email adresu");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date(),
      lastActive: new Date(),
      status: "pending",
    };

    setMembers([...members, newMember]);
    setShowInviteDialog(false);
    setInviteEmail("");
    toast.success(`Pozivnica poslana na ${inviteEmail}`);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Član uklonjen");
  };

  const handleChangeRole = (id: string, newRole: "admin" | "member") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    toast.success("Uloga promijenjena");
  };

  const handleSaveWorkspace = () => {
    setWorkspace(editedWorkspace);
    setIsEditing(false);
    toast.success("Postavke radnog prostora spremljene");
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://app.example.com/invite/${workspace.domain}`);
    toast.success("Link kopiran");
  };

  const getPlanLabel = (plan: WorkspaceInfo["plan"]) => {
    switch (plan) {
      case "free":
        return "Besplatno";
      case "pro":
        return "Pro";
      case "enterprise":
        return "Enterprise";
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Radni prostor
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? "Odustani" : "Uredi"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Naziv radnog prostora</Label>
                <Input
                  value={editedWorkspace.name}
                  onChange={(e) =>
                    setEditedWorkspace({ ...editedWorkspace, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Domena</Label>
                <Input
                  value={editedWorkspace.domain}
                  onChange={(e) =>
                    setEditedWorkspace({ ...editedWorkspace, domain: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSaveWorkspace}>Spremi promjene</Button>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs">Naziv</Label>
                <p className="font-medium">{workspace.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Domena</Label>
                <p className="font-medium">{workspace.domain}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Plan</Label>
                <div className="flex items-center gap-2">
                  <Badge className={workspace.plan === "pro" ? "bg-purple-500" : ""}>
                    {getPlanLabel(workspace.plan)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Mjesta</Label>
                <p className="font-medium">
                  {workspace.seats.used} / {workspace.seats.total} korišteno
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Članovi tima ({members.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
                <LinkIcon className="h-4 w-4 mr-1" />
                Kopiraj link
              </Button>
              <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Pozovi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleChangeRole(
                            member.id,
                            member.role === "admin" ? "member" : "admin"
                          )
                        }
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {member.role === "admin" ? "Ukloni admin" : "Postavi kao admin"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Ukloni
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Postavke radnog prostora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatsko pridruživanje s domenom</Label>
              <p className="text-xs text-muted-foreground">
                Korisnici s @{workspace.domain} se mogu automatski pridružiti
              </p>
            </div>
            <Switch checked={allowDomainJoin} onCheckedChange={setAllowDomainJoin} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Zahtijevaj odobrenje</Label>
              <p className="text-xs text-muted-foreground">
                Novi članovi moraju biti odobreni od admina
              </p>
            </div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Vanjsko dijeljenje</Label>
              <p className="text-xs text-muted-foreground">
                Dopusti dijeljenje s korisnicima izvan radnog prostora
              </p>
            </div>
            <Switch
              checked={allowExternalSharing}
              onCheckedChange={setAllowExternalSharing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive">Opasna zona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Prenesi vlasništvo</p>
              <p className="text-sm text-muted-foreground">
                Prenesi vlasništvo radnog prostora na drugog člana
              </p>
            </div>
            <Button variant="outline">Prenesi</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Obriši radni prostor</p>
              <p className="text-sm text-muted-foreground">
                Trajno obriši radni prostor i sve podatke
              </p>
            </div>
            <Button variant="destructive">Obriši</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pozovi člana tima</DialogTitle>
            <DialogDescription>
              Pošaljite pozivnicu za pridruživanje radnom prostoru.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email adresa</Label>
              <Input
                type="email"
                placeholder="ime@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Uloga</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as "admin" | "member")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Član</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Odustani
            </Button>
            <Button onClick={handleInvite}>
              <Mail className="h-4 w-4 mr-2" />
              Pošalji pozivnicu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WorkspaceSettings;
