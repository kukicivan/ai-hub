import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Focus,
  Clock,
  Bell,
  BellOff,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Zap,
  Mail,
  CheckCircle,
  Settings,
  Trophy,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface FocusSession {
  id: string;
  duration: number;
  completed: boolean;
  startedAt: Date;
  emailsProcessed: number;
  tasksCompleted: number;
}

interface FocusSettings {
  workDuration: number; // minutes
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  muteNotifications: boolean;
  blockNewEmails: boolean;
  autoStartBreaks: boolean;
}

export function FocusModeWidget() {
  const toast = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // seconds
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<FocusSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    muteNotifications: true,
    blockNewEmails: false,
    autoStartBreaks: true,
  });

  const [currentSessionStats, setCurrentSessionStats] = useState({
    emailsProcessed: 0,
    tasksCompleted: 0,
  });

  const [todayStats, setTodayStats] = useState({
    totalFocusTime: 75, // minutes
    sessionsCompleted: 3,
    emailsProcessed: 24,
    tasksCompleted: 8,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setTimeRemaining(settings.workDuration * 60);
    toast.success("Focus sesija započeta", {
      description: settings.muteNotifications
        ? "Obavijesti su utišane"
        : undefined,
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsBreak(false);
    setTimeRemaining(settings.workDuration * 60);
  };

  const handleSessionComplete = () => {
    if (!isBreak) {
      setSessionsCompleted((prev) => prev + 1);
      setTodayStats((prev) => ({
        ...prev,
        totalFocusTime: prev.totalFocusTime + settings.workDuration,
        sessionsCompleted: prev.sessionsCompleted + 1,
      }));

      toast.success("Focus sesija završena!", {
        description: "Vrijeme za pauzu",
      });

      if (settings.autoStartBreaks) {
        const isLongBreak =
          (sessionsCompleted + 1) % settings.sessionsBeforeLongBreak === 0;
        setIsBreak(true);
        setTimeRemaining(
          (isLongBreak ? settings.longBreakDuration : settings.breakDuration) *
            60
        );
      } else {
        setIsActive(false);
      }
    } else {
      toast.success("Pauza završena!", {
        description: "Spreman za novu sesiju",
      });
      setIsBreak(false);
      if (settings.autoStartBreaks) {
        setTimeRemaining(settings.workDuration * 60);
      } else {
        setIsActive(false);
        setTimeRemaining(settings.workDuration * 60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    const totalTime = isBreak
      ? (sessionsCompleted % settings.sessionsBeforeLongBreak === 0
          ? settings.longBreakDuration
          : settings.breakDuration) * 60
      : settings.workDuration * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Focus className="h-5 w-5 text-primary" />
            Focus Mode
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center py-4">
          <div
            className={`relative inline-flex items-center justify-center w-40 h-40 rounded-full ${
              isBreak
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-primary/10"
            }`}
          >
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * getProgress()) / 100}
                className={isBreak ? "text-green-500" : "text-primary"}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-4xl font-bold font-mono">
                {formatTime(timeRemaining)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                {isBreak ? (
                  <span className="flex items-center gap-1 justify-center">
                    <Coffee className="h-3 w-3" />
                    Pauza
                  </span>
                ) : isActive ? (
                  isPaused ? (
                    "Pauzirano"
                  ) : (
                    "U tijeku"
                  )
                ) : (
                  "Spremno"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isActive ? (
            <Button onClick={handleStart} className="gap-2">
              <Play className="h-4 w-4" />
              Započni
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handlePause}>
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" onClick={handleStop}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Session Counter */}
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
            (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < sessionsCompleted % settings.sessionsBeforeLongBreak
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            )
          )}
        </div>

        {/* Status Badges */}
        {isActive && (
          <div className="flex items-center justify-center gap-2">
            {settings.muteNotifications && (
              <Badge variant="secondary" className="gap-1">
                <BellOff className="h-3 w-3" />
                Utišano
              </Badge>
            )}
            {settings.blockNewEmails && (
              <Badge variant="secondary" className="gap-1">
                <Mail className="h-3 w-3" />
                Blokirano
              </Badge>
            )}
          </div>
        )}

        {/* Today's Stats */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Danas</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Clock className="h-4 w-4 text-primary" />
                {todayStats.totalFocusTime}m
              </div>
              <p className="text-xs text-muted-foreground">Focus vrijeme</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Target className="h-4 w-4 text-green-500" />
                {todayStats.sessionsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Sesija</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Mail className="h-4 w-4 text-blue-500" />
                {todayStats.emailsProcessed}
              </div>
              <p className="text-xs text-muted-foreground">Emailova</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {todayStats.tasksCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Zadataka</p>
            </div>
          </div>
        </div>

        {/* Achievement */}
        {todayStats.sessionsCompleted >= 4 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Produktivan dan!
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Završili ste {todayStats.sessionsCompleted} focus sesija
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Mode postavke</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-2 block">
                Trajanje sesije: {settings.workDuration} min
              </Label>
              <Slider
                value={[settings.workDuration]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, workDuration: value })
                }
                min={15}
                max={60}
                step={5}
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Kratka pauza: {settings.breakDuration} min
              </Label>
              <Slider
                value={[settings.breakDuration]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, breakDuration: value })
                }
                min={3}
                max={15}
                step={1}
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Duga pauza: {settings.longBreakDuration} min
              </Label>
              <Slider
                value={[settings.longBreakDuration]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, longBreakDuration: value })
                }
                min={10}
                max={30}
                step={5}
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Sesija prije duge pauze: {settings.sessionsBeforeLongBreak}
              </Label>
              <Slider
                value={[settings.sessionsBeforeLongBreak]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, sessionsBeforeLongBreak: value })
                }
                min={2}
                max={6}
                step={1}
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label>Utišaj obavijesti</Label>
                <Switch
                  checked={settings.muteNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, muteNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Blokiraj nove emailove</Label>
                <Switch
                  checked={settings.blockNewEmails}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, blockNewEmails: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Automatski započni pauze</Label>
                <Switch
                  checked={settings.autoStartBreaks}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoStartBreaks: checked })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Spremi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default FocusModeWidget;
