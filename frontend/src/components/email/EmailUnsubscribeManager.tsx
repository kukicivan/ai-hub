import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MailX,
  Search,
  Trash2,
  MoreVertical,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  TrendingDown,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Subscription {
  id: string;
  sender: string;
  senderName: string;
  category: "newsletter" | "promotion" | "social" | "notification" | "other";
  frequency: "daily" | "weekly" | "monthly" | "irregular";
  emailCount: number;
  lastReceived: Date;
  status: "active" | "unsubscribed" | "pending";
  unsubscribeLink?: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    sender: "newsletter@techsite.com",
    senderName: "Tech Site Newsletter",
    category: "newsletter",
    frequency: "daily",
    emailCount: 156,
    lastReceived: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "active",
    unsubscribeLink: "#",
  },
  {
    id: "2",
    sender: "promo@shop.hr",
    senderName: "Web Shop Promocije",
    category: "promotion",
    frequency: "weekly",
    emailCount: 89,
    lastReceived: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "active",
    unsubscribeLink: "#",
  },
  {
    id: "3",
    sender: "updates@linkedin.com",
    senderName: "LinkedIn",
    category: "social",
    frequency: "daily",
    emailCount: 234,
    lastReceived: new Date(Date.now() - 1000 * 60 * 30),
    status: "active",
    unsubscribeLink: "#",
  },
  {
    id: "4",
    sender: "notifications@github.com",
    senderName: "GitHub",
    category: "notification",
    frequency: "irregular",
    emailCount: 456,
    lastReceived: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: "active",
  },
  {
    id: "5",
    sender: "deals@booking.com",
    senderName: "Booking.com",
    category: "promotion",
    frequency: "weekly",
    emailCount: 67,
    lastReceived: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: "unsubscribed",
  },
  {
    id: "6",
    sender: "news@medium.com",
    senderName: "Medium Daily Digest",
    category: "newsletter",
    frequency: "daily",
    emailCount: 120,
    lastReceived: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: "pending",
  },
];

export function EmailUnsubscribeManager() {
  const toast = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalEmails = subscriptions.reduce((sum, s) => sum + s.emailCount, 0);

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      const matchesSearch =
        sub.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.sender.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && sub.status === "active") ||
        (filter === "unsubscribed" && sub.status === "unsubscribed");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.emailCount - a.emailCount);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedSubs);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSubs(newSelection);
  };

  const handleUnsubscribe = (id: string) => {
    setUnsubscribingId(id);
    setShowUnsubscribeDialog(true);
  };

  const confirmUnsubscribe = async () => {
    if (unsubscribingId) {
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === unsubscribingId ? { ...s, status: "pending" as const } : s
        )
      );
      toast.info("Zahtjev za odjavu poslan");

      // Simulate async unsubscribe
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === unsubscribingId ? { ...s, status: "unsubscribed" as const } : s
        )
      );
      toast.success("Uspješno odjavljeni");
    }
    setShowUnsubscribeDialog(false);
    setUnsubscribingId(null);
  };

  const handleBulkUnsubscribe = async () => {
    const idsToUnsubscribe = Array.from(selectedSubs);
    setSubscriptions((prev) =>
      prev.map((s) =>
        idsToUnsubscribe.includes(s.id) ? { ...s, status: "pending" as const } : s
      )
    );
    toast.info(`Odjava od ${idsToUnsubscribe.length} pretplata u tijeku...`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setSubscriptions((prev) =>
      prev.map((s) =>
        idsToUnsubscribe.includes(s.id) ? { ...s, status: "unsubscribed" as const } : s
      )
    );
    setSelectedSubs(new Set());
    toast.success(`Odjavljeni od ${idsToUnsubscribe.length} pretplata`);
  };

  const handleScanInbox = async () => {
    setIsScanning(true);
    toast.info("Skeniranje inboxa za pretplate...");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsScanning(false);
    toast.success("Pronađeno 2 nove pretplate");
  };

  const getCategoryBadge = (category: Subscription["category"]) => {
    const colors: Record<string, string> = {
      newsletter: "bg-blue-500",
      promotion: "bg-orange-500",
      social: "bg-purple-500",
      notification: "bg-green-500",
      other: "bg-gray-500",
    };
    const labels: Record<string, string> = {
      newsletter: "Newsletter",
      promotion: "Promocija",
      social: "Društveno",
      notification: "Obavijest",
      other: "Ostalo",
    };
    return <Badge className={`text-xs ${colors[category]}`}>{labels[category]}</Badge>;
  };

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aktivno
          </Badge>
        );
      case "unsubscribed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <XCircle className="h-3 w-3 mr-1" />
            Odjavljeno
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            U tijeku
          </Badge>
        );
    }
  };

  const getFrequencyLabel = (frequency: Subscription["frequency"]) => {
    const labels: Record<string, string> = {
      daily: "Dnevno",
      weekly: "Tjedno",
      monthly: "Mjesečno",
      irregular: "Nepravilno",
    };
    return labels[frequency];
  };

  const subscription = unsubscribingId
    ? subscriptions.find((s) => s.id === unsubscribingId)
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MailX className="h-5 w-5 text-primary" />
            Upravljanje pretplatama
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleScanInbox} disabled={isScanning}>
            {isScanning ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            Skeniraj inbox
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <Mail className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Aktivnih pretplata</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <TrendingDown className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{totalEmails.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Ukupno emailova</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <Shield className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">
              {subscriptions.filter((s) => s.status === "unsubscribed").length}
            </p>
            <p className="text-xs text-muted-foreground">Odjavljeno</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži pretplate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Sve
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Aktivne
            </Button>
            <Button
              variant={filter === "unsubscribed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unsubscribed")}
            >
              Odjavljene
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSubs.size > 0 && (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
            <span className="text-sm">{selectedSubs.size} odabrano</span>
            <div className="flex-1" />
            <Button variant="destructive" size="sm" onClick={handleBulkUnsubscribe}>
              <MailX className="h-4 w-4 mr-1" />
              Odjavi sve
            </Button>
          </div>
        )}

        {/* Subscriptions List */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-2">
            {filteredSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`p-3 border rounded-lg transition-colors ${
                  sub.status === "unsubscribed" ? "opacity-60" : "hover:bg-muted/50"
                } ${selectedSubs.has(sub.id) ? "border-primary bg-primary/5" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {sub.status === "active" && (
                    <Checkbox
                      checked={selectedSubs.has(sub.id)}
                      onCheckedChange={() => toggleSelection(sub.id)}
                      className="mt-1"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{sub.senderName}</span>
                      {getCategoryBadge(sub.category)}
                      {getStatusBadge(sub.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{sub.sender}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{sub.emailCount} emailova</span>
                      <span>•</span>
                      <span>{getFrequencyLabel(sub.frequency)}</span>
                      <span>•</span>
                      <span>
                        Zadnji: {format(sub.lastReceived, "dd.MM.yyyy.", { locale: hr })}
                      </span>
                    </div>
                  </div>
                  {sub.status === "active" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUnsubscribe(sub.id)}>
                          <MailX className="h-4 w-4 mr-2" />
                          Odjavi se
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Blokiraj pošiljatelja
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Obriši sve emailove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MailX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nema pronađenih pretplata</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              AI savjet
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Odjava od newslettera koje rijetko čitate može smanjiti broj emailova za
            ~30%. Preporučujemo odjavu od pretplata s više od 50 nepročitanih emailova.
          </p>
        </div>

        {/* Unsubscribe Dialog */}
        <Dialog open={showUnsubscribeDialog} onOpenChange={setShowUnsubscribeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Odjava od pretplate</DialogTitle>
              <DialogDescription>
                Jeste li sigurni da se želite odjaviti od{" "}
                <strong>{subscription?.senderName}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> {subscription?.sender}
              </p>
              <p className="text-sm">
                <strong>Primljeno emailova:</strong> {subscription?.emailCount}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Neke pretplate mogu zahtijevati potvrdu putem emaila za potpunu odjavu.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUnsubscribeDialog(false)}>
                Odustani
              </Button>
              <Button variant="destructive" onClick={confirmUnsubscribe}>
                <MailX className="h-4 w-4 mr-1" />
                Odjavi se
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default EmailUnsubscribeManager;
