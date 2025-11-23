import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HardDrive,
  Mail,
  Paperclip,
  Users,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

interface QuotaItem {
  id: string;
  label: string;
  used: number;
  total: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const quotaData: QuotaItem[] = [
  {
    id: "storage",
    label: "Prostor za pohranu",
    used: 12.4,
    total: 15,
    unit: "GB",
    icon: <HardDrive className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    id: "emails",
    label: "Dnevni emailovi",
    used: 342,
    total: 500,
    unit: "",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-green-500",
  },
  {
    id: "attachments",
    label: "Veličina privitaka",
    used: 18,
    total: 25,
    unit: "MB",
    icon: <Paperclip className="h-4 w-4" />,
    color: "bg-orange-500",
  },
  {
    id: "contacts",
    label: "Kontakti",
    used: 847,
    total: 2000,
    unit: "",
    icon: <Users className="h-4 w-4" />,
    color: "bg-purple-500",
  },
  {
    id: "ai",
    label: "AI zahtjevi (mjesečno)",
    used: 1250,
    total: 5000,
    unit: "",
    icon: <Sparkles className="h-4 w-4" />,
    color: "bg-pink-500",
  },
];

interface QuotaUsageWidgetProps {
  compact?: boolean;
}

export function QuotaUsageWidget({ compact = false }: QuotaUsageWidgetProps) {
  const getPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (percentage >= 75) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "GB") return `${value.toFixed(1)} ${unit}`;
    if (unit === "MB") return `${value} ${unit}`;
    return value.toLocaleString();
  };

  // Primary storage quota for compact view
  const storageQuota = quotaData[0];
  const storagePercentage = getPercentage(storageQuota.used, storageQuota.total);

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Kvota
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Prostor</span>
              <span className={getStatusColor(storagePercentage)}>
                {storagePercentage}%
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatValue(storageQuota.used, storageQuota.unit)} od{" "}
              {formatValue(storageQuota.total, storageQuota.unit)}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI zahtjevi</span>
            <span>1.250 / 5.000</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5 text-primary" />
            Korištenje kvote
          </CardTitle>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Nadogradi plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotaData.map((quota) => {
          const percentage = getPercentage(quota.used, quota.total);
          return (
            <div key={quota.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${quota.color} text-white`}>
                    {quota.icon}
                  </div>
                  <span className="text-sm font-medium">{quota.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(percentage)}
                  <Badge
                    variant={percentage >= 90 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {percentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Korišteno: {formatValue(quota.used, quota.unit)}
                </span>
                <span>
                  Ukupno: {formatValue(quota.total, quota.unit)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Warning for high usage */}
        {storagePercentage >= 75 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Približavate se limitu prostora. Razmislite o nadogradnji plana ili
                brisanju starih emailova.
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Savjet: Arhivirajte stare emailove ili izbrišite velike privitke za
            oslobađanje prostora.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuotaUsageWidget;
