import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  User,
  Monitor,
  Smartphone,
  Globe,
  MapPin,
  Info,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ReadReceipt {
  id: string;
  emailId: number;
  recipient: string;
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced";
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  openCount: number;
  device?: string;
  location?: string;
  browser?: string;
}

interface EmailReadReceiptProps {
  emailId?: number;
  subject?: string;
  onRequestReceipt?: () => void;
}

const mockReceipts: ReadReceipt[] = [
  {
    id: "1",
    emailId: 101,
    recipient: "client@company.com",
    status: "opened",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    openedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    openCount: 3,
    device: "Desktop",
    location: "Zagreb, HR",
    browser: "Chrome 120",
  },
  {
    id: "2",
    emailId: 101,
    recipient: "team@partner.io",
    status: "delivered",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    openCount: 0,
  },
  {
    id: "3",
    emailId: 101,
    recipient: "info@vendor.com",
    status: "bounced",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    openCount: 0,
  },
];

const getStatusInfo = (status: ReadReceipt["status"]) => {
  switch (status) {
    case "sent":
      return {
        label: "Poslano",
        icon: Mail,
        color: "text-gray-500",
        bgColor: "bg-gray-100 dark:bg-gray-800",
      };
    case "delivered":
      return {
        label: "Dostavljeno",
        icon: CheckCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      };
    case "opened":
      return {
        label: "Otvoreno",
        icon: Eye,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };
    case "clicked":
      return {
        label: "Kliknuto",
        icon: CheckCircle,
        color: "text-purple-500",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      };
    case "bounced":
      return {
        label: "Odbijeno",
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      };
  }
};

export function EmailReadReceipt({ emailId, subject, onRequestReceipt }: EmailReadReceiptProps) {
  const [receipts, setReceipts] = useState<ReadReceipt[]>(mockReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<ReadReceipt | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const openedCount = receipts.filter((r) => r.status === "opened" || r.status === "clicked").length;
  const deliveredCount = receipts.filter((r) => r.status !== "bounced" && r.status !== "sent").length;
  const bouncedCount = receipts.filter((r) => r.status === "bounced").length;

  const handleRefresh = () => {
    // Would refresh tracking data from server
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Praćenje čitanja
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tracking" className="text-sm">Praćenje</Label>
                    <Switch
                      id="tracking"
                      checked={trackingEnabled}
                      onCheckedChange={setTrackingEnabled}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Uključi/isključi praćenje za buduće emailove</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-green-600">
              <Eye className="h-4 w-4" />
              {openedCount}
            </div>
            <p className="text-xs text-muted-foreground">Otvoreno</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-blue-600">
              <CheckCircle className="h-4 w-4" />
              {deliveredCount}
            </div>
            <p className="text-xs text-muted-foreground">Dostavljeno</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-red-600">
              <XCircle className="h-4 w-4" />
              {bouncedCount}
            </div>
            <p className="text-xs text-muted-foreground">Odbijeno</p>
          </div>
        </div>

        {/* Recipients List */}
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {receipts.map((receipt) => {
              const statusInfo = getStatusInfo(receipt.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={receipt.id}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    receipt.status === "bounced" && "border-red-200"
                  )}
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-full", statusInfo.bgColor)}>
                        <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{receipt.recipient}</p>
                        <p className="text-xs text-muted-foreground">
                          {statusInfo.label}
                          {receipt.openedAt && (
                            <> • {formatDistanceToNow(receipt.openedAt, { locale: hr, addSuffix: true })}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {receipt.openCount > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          {receipt.openCount}x
                        </Badge>
                      )}
                      {receipt.device && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {receipt.device === "Desktop" ? (
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{receipt.device}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Osvježi
          </Button>
          <Button variant="outline" size="sm">
            Prikaži sve
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Praćenje čitanja koristi nevidljivi piksel. Neki email klijenti
              blokiraju učitavanje slika što može utjecati na točnost praćenja.
            </p>
          </div>
        </div>
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalji praćenja</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedReceipt.recipient}</p>
                  <p className="text-sm text-muted-foreground">Primatelj</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 bg-gray-400 rounded-full" />
                  <div className="pl-4">
                    <p className="text-sm font-medium">Poslano</p>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedReceipt.sentAt, "d MMM yyyy, HH:mm", { locale: hr })}
                    </p>
                  </div>
                </div>

                {selectedReceipt.deliveredAt && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 bg-blue-500 rounded-full" />
                    <div className="pl-4">
                      <p className="text-sm font-medium">Dostavljeno</p>
                      <p className="text-xs text-muted-foreground">
                        {format(selectedReceipt.deliveredAt, "d MMM yyyy, HH:mm", { locale: hr })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReceipt.openedAt && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 bg-green-500 rounded-full" />
                    <div className="pl-4">
                      <p className="text-sm font-medium">Otvoreno</p>
                      <p className="text-xs text-muted-foreground">
                        {format(selectedReceipt.openedAt, "d MMM yyyy, HH:mm", { locale: hr })}
                        {selectedReceipt.openCount > 1 && (
                          <span className="ml-2">({selectedReceipt.openCount} puta)</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReceipt.status === "bounced" && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 bg-red-500 rounded-full" />
                    <div className="pl-4">
                      <p className="text-sm font-medium text-red-600">Odbijeno</p>
                      <p className="text-xs text-muted-foreground">
                        Email nije mogao biti dostavljen
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              {(selectedReceipt.device || selectedReceipt.location || selectedReceipt.browser) && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  {selectedReceipt.device && (
                    <div className="flex items-center gap-2 text-sm">
                      {selectedReceipt.device === "Desktop" ? (
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{selectedReceipt.device}</span>
                    </div>
                  )}
                  {selectedReceipt.browser && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedReceipt.browser}</span>
                    </div>
                  )}
                  {selectedReceipt.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedReceipt.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EmailReadReceipt;
