import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Clock,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Coffee,
  Briefcase,
} from "lucide-react";
import { format, addHours, addDays, setHours, setMinutes, nextMonday, isBefore } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface EmailSnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnooze: (snoozeUntil: Date) => void;
  emailSubject?: string;
}

type SnoozePreset = "1hour" | "3hours" | "tomorrow_morning" | "tomorrow_evening" | "weekend" | "next_week" | "custom";

const presets: { id: SnoozePreset; label: string; icon: React.ReactNode; getDate: () => Date }[] = [
  {
    id: "1hour",
    label: "Za 1 sat",
    icon: <Clock className="h-4 w-4" />,
    getDate: () => addHours(new Date(), 1),
  },
  {
    id: "3hours",
    label: "Za 3 sata",
    icon: <Coffee className="h-4 w-4" />,
    getDate: () => addHours(new Date(), 3),
  },
  {
    id: "tomorrow_morning",
    label: "Sutra ujutro (9:00)",
    icon: <Sun className="h-4 w-4" />,
    getDate: () => setMinutes(setHours(addDays(new Date(), 1), 9), 0),
  },
  {
    id: "tomorrow_evening",
    label: "Sutra navečer (18:00)",
    icon: <Moon className="h-4 w-4" />,
    getDate: () => setMinutes(setHours(addDays(new Date(), 1), 18), 0),
  },
  {
    id: "weekend",
    label: "Ovaj vikend",
    icon: <Coffee className="h-4 w-4" />,
    getDate: () => {
      const saturday = addDays(new Date(), (6 - new Date().getDay() + 7) % 7 || 7);
      return setMinutes(setHours(saturday, 10), 0);
    },
  },
  {
    id: "next_week",
    label: "Sljedeći ponedjeljak (9:00)",
    icon: <Briefcase className="h-4 w-4" />,
    getDate: () => setMinutes(setHours(nextMonday(new Date()), 9), 0),
  },
];

export function EmailSnoozeDialog({
  open,
  onOpenChange,
  onSnooze,
  emailSubject,
}: EmailSnoozeDialogProps) {
  const toast = useToast();
  const [selectedPreset, setSelectedPreset] = useState<SnoozePreset>("tomorrow_morning");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [customTime, setCustomTime] = useState("09:00");

  const handleSnooze = () => {
    let snoozeUntil: Date;

    if (selectedPreset === "custom") {
      if (!customDate) {
        toast.error("Odaberite datum");
        return;
      }
      const [hours, minutes] = customTime.split(":").map(Number);
      snoozeUntil = setMinutes(setHours(customDate, hours), minutes);

      if (isBefore(snoozeUntil, new Date())) {
        toast.error("Datum mora biti u budućnosti");
        return;
      }
    } else {
      const preset = presets.find((p) => p.id === selectedPreset);
      if (!preset) return;
      snoozeUntil = preset.getDate();
    }

    onSnooze(snoozeUntil);
    toast.success(
      `Email odgođen do ${format(snoozeUntil, "d MMMM, HH:mm", { locale: hr })}`
    );
    onOpenChange(false);
  };

  const getSelectedDateTime = (): Date | null => {
    if (selectedPreset === "custom") {
      if (!customDate) return null;
      const [hours, minutes] = customTime.split(":").map(Number);
      return setMinutes(setHours(customDate, hours), minutes);
    }
    const preset = presets.find((p) => p.id === selectedPreset);
    return preset ? preset.getDate() : null;
  };

  const selectedDateTime = getSelectedDateTime();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Odgodi email
          </DialogTitle>
          {emailSubject && (
            <p className="text-sm text-muted-foreground truncate">
              {emailSubject}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={selectedPreset}
            onValueChange={(value: SnoozePreset) => setSelectedPreset(value)}
            className="grid grid-cols-2 gap-2"
          >
            {presets.map((preset) => (
              <Label
                key={preset.id}
                htmlFor={preset.id}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedPreset === preset.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={preset.id} id={preset.id} className="sr-only" />
                {preset.icon}
                <span className="text-sm">{preset.label}</span>
              </Label>
            ))}
            <Label
              htmlFor="custom"
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors col-span-2",
                selectedPreset === "custom"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <RadioGroupItem value="custom" id="custom" className="sr-only" />
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">Prilagođeno vrijeme</span>
            </Label>
          </RadioGroup>

          {/* Custom Date/Time Picker */}
          {selectedPreset === "custom" && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Datum
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDate
                          ? format(customDate, "d MMMM yyyy", { locale: hr })
                          : "Odaberi datum"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        disabled={(date) => isBefore(date, new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-24">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Vrijeme
                  </Label>
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedDateTime && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                Email će se vratiti u inbox:
              </p>
              <p className="text-sm font-medium">
                {format(selectedDateTime, "EEEE, d MMMM yyyy", { locale: hr })}
                <span className="text-primary ml-2">
                  {format(selectedDateTime, "HH:mm", { locale: hr })}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Odustani
          </Button>
          <Button onClick={handleSnooze}>
            <Clock className="h-4 w-4 mr-2" />
            Odgodi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmailSnoozeDialog;
