import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  Filter,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star,
  Mail,
  UserCheck,
  Briefcase,
  DollarSign,
  Calendar,
} from "lucide-react";

interface SmartFilter {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  enabled: boolean;
}

interface SmartFiltersPanelProps {
  onFiltersChange?: (filters: {
    priorityThreshold: number;
    sentimentFilter: string | null;
    showActionRequired: boolean;
    showHighROI: boolean;
    showUrgent: boolean;
    showFromVIP: boolean;
    showUnread: boolean;
    showScheduled: boolean;
  }) => void;
}

export function SmartFiltersPanel({ onFiltersChange }: SmartFiltersPanelProps) {
  const [priorityThreshold, setPriorityThreshold] = useState(5);
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);
  const [showActionRequired, setShowActionRequired] = useState(false);
  const [showHighROI, setShowHighROI] = useState(false);
  const [showUrgent, setShowUrgent] = useState(false);
  const [showFromVIP, setShowFromVIP] = useState(false);
  const [showUnread, setShowUnread] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);

  const smartFilters: SmartFilter[] = [
    {
      id: "action-required",
      name: "Zahtijeva akciju",
      description: "Emailovi koji zahtijevaju vašu reakciju",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      count: 8,
      enabled: showActionRequired,
    },
    {
      id: "high-roi",
      name: "Visoki ROI",
      description: "Emailovi s visokim poslovnim potencijalom",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      count: 5,
      enabled: showHighROI,
    },
    {
      id: "urgent",
      name: "Hitno",
      description: "Emailovi s visokom hitnošću",
      icon: <Clock className="h-4 w-4 text-red-500" />,
      count: 3,
      enabled: showUrgent,
    },
    {
      id: "vip",
      name: "Od VIP kontakata",
      description: "Emailovi od važnih kontakata",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      count: 12,
      enabled: showFromVIP,
    },
    {
      id: "unread",
      name: "Nepročitano",
      description: "Svi nepročitani emailovi",
      icon: <Mail className="h-4 w-4 text-blue-500" />,
      count: 24,
      enabled: showUnread,
    },
    {
      id: "scheduled",
      name: "Zakazano praćenje",
      description: "Emailovi s zakazanim follow-upom",
      icon: <Calendar className="h-4 w-4 text-purple-500" />,
      count: 6,
      enabled: showScheduled,
    },
  ];

  const handleFilterToggle = (filterId: string) => {
    switch (filterId) {
      case "action-required":
        setShowActionRequired(!showActionRequired);
        break;
      case "high-roi":
        setShowHighROI(!showHighROI);
        break;
      case "urgent":
        setShowUrgent(!showUrgent);
        break;
      case "vip":
        setShowFromVIP(!showFromVIP);
        break;
      case "unread":
        setShowUnread(!showUnread);
        break;
      case "scheduled":
        setShowScheduled(!showScheduled);
        break;
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange?.({
      priorityThreshold,
      sentimentFilter,
      showActionRequired,
      showHighROI,
      showUrgent,
      showFromVIP,
      showUnread,
      showScheduled,
    });
  };

  const handleClearFilters = () => {
    setPriorityThreshold(5);
    setSentimentFilter(null);
    setShowActionRequired(false);
    setShowHighROI(false);
    setShowUrgent(false);
    setShowFromVIP(false);
    setShowUnread(false);
    setShowScheduled(false);
    onFiltersChange?.({
      priorityThreshold: 5,
      sentimentFilter: null,
      showActionRequired: false,
      showHighROI: false,
      showUrgent: false,
      showFromVIP: false,
      showUnread: false,
      showScheduled: false,
    });
  };

  const activeFiltersCount = smartFilters.filter((f) => f.enabled).length +
    (sentimentFilter ? 1 : 0) +
    (priorityThreshold !== 5 ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Pametni filteri
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} aktivno</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Priority Threshold */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Prag prioriteta</Label>
            <span className="text-sm text-muted-foreground">{priorityThreshold}/10</span>
          </div>
          <Slider
            value={[priorityThreshold]}
            onValueChange={([value]) => setPriorityThreshold(value)}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Prikaži emailove s prioritetom {priorityThreshold} i više
          </p>
        </div>

        {/* Sentiment Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filter po sentimentu</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: null, label: "Svi", color: "bg-gray-500" },
              { value: "positive", label: "Pozitivni", color: "bg-green-500" },
              { value: "neutral", label: "Neutralni", color: "bg-blue-500" },
              { value: "negative", label: "Negativni", color: "bg-red-500" },
            ].map((option) => (
              <Button
                key={option.value ?? "all"}
                variant={sentimentFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSentimentFilter(option.value)}
                className="h-8"
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${option.color}`}
                />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Smart Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Brzi filteri</Label>
          <div className="space-y-2">
            {smartFilters.map((filter) => (
              <div
                key={filter.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  filter.enabled
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  {filter.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{filter.name}</span>
                      {filter.count !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          {filter.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {filter.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={filter.enabled}
                  onCheckedChange={() => handleFilterToggle(filter.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
              AI preporuka
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Na temelju vaše aktivnosti, preporučujemo da se fokusirate na{" "}
            <strong>8 emailova koji zahtijevaju akciju</strong> i{" "}
            <strong>3 hitna emaila</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Primijeni filtere
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Obriši sve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SmartFiltersPanel;
