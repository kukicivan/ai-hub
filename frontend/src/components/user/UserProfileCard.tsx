import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Calendar,
  Award,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSlice";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

interface UserStats {
  emailsProcessed: number;
  timeSaved: number;
  aiAccuracy: number;
  streak: number;
}

interface UserProfileCardProps {
  stats?: UserStats;
  onEditProfile?: () => void;
  onViewSettings?: () => void;
}

export function UserProfileCard({
  stats = {
    emailsProcessed: 1234,
    timeSaved: 48,
    aiAccuracy: 94,
    streak: 12,
  },
  onEditProfile,
  onViewSettings,
}: UserProfileCardProps) {
  const user = useAppSelector(selectUser);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = user?.created_at
    ? format(new Date(user.created_at), "MMMM yyyy", { locale: hr })
    : "N/A";

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Profil</CardTitle>
          <Button variant="ghost" size="icon" onClick={onViewSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user?.name || "Korisnik"}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Pro
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Član od {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.emailsProcessed.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Emailova obrađeno</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.timeSaved}h</div>
            <div className="text-xs text-muted-foreground">Sati uštede</div>
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              AI preciznost
            </span>
            <span className="font-medium">{stats.aiAccuracy}%</span>
          </div>
          <Progress value={stats.aiAccuracy} className="h-2" />
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            <div>
              <div className="font-medium">Streak</div>
              <div className="text-xs text-muted-foreground">Uzastopni dani korištenja</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onEditProfile}>
            <User className="h-4 w-4 mr-2" />
            Uredi profil
          </Button>
          <Button variant="outline" className="flex-1" onClick={onViewSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Podešavanja
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserProfileCard;
