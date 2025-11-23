import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import { EmailStats } from "@/redux/features/email/emailApi";
import { Sun, Moon, CloudSun } from "lucide-react";

interface WelcomeWidgetProps {
  stats?: EmailStats;
  isLoading?: boolean;
}

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: "Dobro jutro", icon: <Sun className="h-6 w-6 text-yellow-500" /> };
  } else if (hour >= 12 && hour < 18) {
    return { text: "Dobar dan", icon: <CloudSun className="h-6 w-6 text-orange-500" /> };
  } else {
    return { text: "Dobro veče", icon: <Moon className="h-6 w-6 text-blue-500" /> };
  }
}

function formatDate(): string {
  const now = new Date();
  const days = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];
  const months = [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun",
    "Jul", "August", "Septembar", "Oktobar", "Novembar", "Decembar"
  ];
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${dayName}, ${day}. ${month} ${year} • ${hours}:${minutes}`;
}

export function WelcomeWidget({ stats, isLoading }: WelcomeWidgetProps) {
  const user = useSelector(selectCurrentUser);
  const greeting = getGreeting();
  const firstName = user?.name?.split(" ")[0] || "Korisniče";

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-none shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {greeting.icon}
              <h1 className="text-2xl font-semibold text-foreground">
                {greeting.text}, {firstName}!
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate()}</p>

            {!isLoading && stats && (
              <div className="mt-4 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Dok ste bili odsutni:
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {stats.unread > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-medium">{stats.unread}</span> nepročitanih
                    </span>
                  )}
                  {stats.high_priority > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="font-medium">{stats.high_priority}</span> hitnih
                    </span>
                  )}
                  {stats.today > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium">{stats.today}</span> danas
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WelcomeWidget;
