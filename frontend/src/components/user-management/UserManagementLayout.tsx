import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Plus,
  Download,
  RotateCcw,
  Trash2,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserStatsQuery } from "@/redux/features/userManagement/userManagementApi";
import { Skeleton } from "@/components/ui/skeleton";

const USERS_VERSION_KEY = "user-management-version";

const VERSION_OPTIONS = [
  { value: "v1", label: "V1 - DataTable Pattern" },
  { value: "v2", label: "V2 - Virtualized List" },
  { value: "v3", label: "V3 - Column Toggle" },
  { value: "v4", label: "V4 - Server-Side Table" },
  { value: "v5", label: "V5 - Advanced Filters" },
  { value: "v6", label: "V6 - Inline Edit" },
] as const;

interface UserManagementLayoutProps {
  versionLabel: string;
  description: string;
  children: ReactNode;
  onCreateUser?: () => void;
  onExport?: () => void;
  onResetSettings?: () => void;
  onBulkDelete?: () => void;
  selectedCount?: number;
  isExporting?: boolean;
}

export function UserManagementLayout({
  versionLabel,
  description,
  children,
  onCreateUser,
  onExport,
  onResetSettings,
  onBulkDelete,
  selectedCount = 0,
  isExporting = false,
}: UserManagementLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: statsData, isLoading: isLoadingStats } = useGetUserStatsQuery();

  // Extract current version from URL (e.g., /users/v4 -> v4)
  const currentVersion = location.pathname.split("/").pop() || "v4";

  const handleVersionChange = (newVersion: string) => {
    localStorage.setItem(USERS_VERSION_KEY, newVersion);
    navigate(`/users/${newVersion}`);
  };

  const currentVersionOption = VERSION_OPTIONS.find((v) => v.value === currentVersion);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Upravljanje korisnicima</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 gap-1">
                {currentVersionOption?.label || versionLabel}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {VERSION_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleVersionChange(option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {currentVersion === option.value && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && onBulkDelete && (
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši ({selectedCount})
            </Button>
          )}
          {onResetSettings && (
            <Button variant="outline" size="sm" onClick={onResetSettings}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetuj postavke
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Izvoz..." : "Izvoz"}
            </Button>
          )}
          {onCreateUser && (
            <Button size="sm" onClick={onCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              Novi korisnik
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno korisnika</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{statsData?.stats.total_users ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificirani</CardTitle>
            <Badge variant="secondary" className="text-green-600">
              Aktivni
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {statsData?.stats.verified_users ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neverificirani</CardTitle>
            <Badge variant="secondary" className="text-yellow-600">
              Pending
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {statsData?.stats.unverified_users ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ovaj mjesec</CardTitle>
            <Badge
              variant="secondary"
              className={
                statsData?.stats.growth_percentage && statsData.stats.growth_percentage >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {statsData?.stats.growth_percentage && statsData.stats.growth_percentage >= 0
                ? "+"
                : ""}
              {statsData?.stats.growth_percentage ?? 0}%
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{statsData?.stats.users_this_month ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista korisnika</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
