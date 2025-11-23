import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailStats } from "@/redux/features/email/emailApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  MailOpen,
  Star,
  AlertTriangle,
  Paperclip,
  Brain,
  Clock,
  Inbox,
} from "lucide-react";

interface StatsWidgetProps {
  stats?: EmailStats;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendUp ? "text-green-600" : "text-muted-foreground"}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export function StatsWidget({ stats, isLoading }: StatsWidgetProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Inbox",
      value: stats?.inbox || 0,
      icon: <Inbox className="h-4 w-4 text-blue-500" />,
      trend: stats?.today ? `+${stats.today} danas` : undefined,
      trendUp: true,
    },
    {
      title: "Nepročitano",
      value: stats?.unread || 0,
      icon: <MailOpen className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "Hitno",
      value: stats?.high_priority || 0,
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    },
    {
      title: "AI Obrađeno",
      value: stats?.ai_processed || 0,
      icon: <Brain className="h-4 w-4 text-purple-500" />,
      trend: stats?.ai_pending ? `${stats.ai_pending} na čekanju` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export function ExtendedStatsWidget({ stats, isLoading }: StatsWidgetProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Ukupno",
      value: stats?.total || 0,
      icon: <Mail className="h-4 w-4 text-gray-500" />,
    },
    {
      title: "Inbox",
      value: stats?.inbox || 0,
      icon: <Inbox className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Nepročitano",
      value: stats?.unread || 0,
      icon: <MailOpen className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "Sa zvjezdicom",
      value: stats?.starred || 0,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Hitno",
      value: stats?.high_priority || 0,
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    },
    {
      title: "Sa prilogom",
      value: stats?.with_attachments || 0,
      icon: <Paperclip className="h-4 w-4 text-green-500" />,
    },
    {
      title: "AI Obrađeno",
      value: stats?.ai_processed || 0,
      icon: <Brain className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Ova sedmica",
      value: stats?.this_week || 0,
      icon: <Clock className="h-4 w-4 text-cyan-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export default StatsWidget;
