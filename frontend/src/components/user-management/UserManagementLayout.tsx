import { ReactNode } from "react";
import { Users, Plus, Download, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetUserStatsQuery } from "@/redux/features/userManagement/userManagementApi";
import { Skeleton } from "@/components/ui/skeleton";

interface UserManagementLayoutProps {
  version: string;
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
  version,
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
  const { data: statsData, isLoading: isLoadingStats } = useGetUserStatsQuery();

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
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {versionLabel}
          </Badge>
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
              <Download className="mr-2 h-4 w-4" />
              Izvoz
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
            <Badge variant="secondary" className="text-green-600">Aktivni</Badge>
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
            <Badge variant="secondary" className="text-yellow-600">Pending</Badge>
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
              className={statsData?.stats.growth_percentage && statsData.stats.growth_percentage >= 0 ? "text-green-600" : "text-red-600"}
            >
              {statsData?.stats.growth_percentage && statsData.stats.growth_percentage >= 0 ? "+" : ""}
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
          <CardDescription>
            Verzija tabele: {version} - {versionLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
