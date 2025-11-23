import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Star,
  Clock,
  Download,
  Printer,
  ExternalLink,
  Copy,
  Sparkles,
  FileText,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface EmailMessage {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: Array<{ name: string; email: string }>;
  cc?: Array<{ name: string; email: string }>;
  date: Date;
  subject: string;
  body: string;
  bodyHtml?: string;
  attachments?: Attachment[];
  isStarred?: boolean;
  aiSummary?: string;
}

interface EmailConversationThreadProps {
  messages: EmailMessage[];
  subject: string;
  onReply?: (messageId: string) => void;
  onReplyAll?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onStar?: (messageId: string) => void;
  onDownloadAttachment?: (attachment: Attachment) => void;
  className?: string;
}

const mockMessages: EmailMessage[] = [
  {
    id: "1",
    from: { name: "Marko Horvat", email: "marko@company.com" },
    to: [{ name: "Ja", email: "me@company.com" }],
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    subject: "Kvartalni izvještaj Q4 2024",
    body: `Poštovani,

U prilogu šaljem kvartalni izvještaj za Q4 2024. Molim vas da pregledate dokument i javite ako imate pitanja.

Ključne točke:
- Prihodi su porasli za 15% u odnosu na Q3
- Troškovi su ostali stabilni
- Nove inicijative pokazuju pozitivne rezultate

Očekujem vaše komentare do kraja tjedna.

Srdačan pozdrav,
Marko`,
    attachments: [
      { id: "a1", name: "Q4_Izvjestaj_2024.pdf", size: 2456789, type: "application/pdf" },
      { id: "a2", name: "Financije_Q4.xlsx", size: 345678, type: "application/vnd.ms-excel" },
    ],
  },
  {
    id: "2",
    from: { name: "Ja", email: "me@company.com" },
    to: [{ name: "Marko Horvat", email: "marko@company.com" }],
    cc: [{ name: "Ana Kovač", email: "ana@company.com" }],
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    subject: "Re: Kvartalni izvještaj Q4 2024",
    body: `Poštovani Marko,

Hvala na izvještaju! Pregledao sam dokument i imam par komentara:

1. Rast prihoda je impresivan - možemo li dobiti breakdown po regijama?
2. Za nove inicijative, bilo bi korisno vidjeti projekcije za Q1 2025
3. Trošak marketinga izgleda optimizirano - super posao!

Dodajem Anu u CC jer će ona voditi sljedeći kvartal.

Hvala,
[Ja]`,
  },
  {
    id: "3",
    from: { name: "Marko Horvat", email: "marko@company.com" },
    to: [{ name: "Ja", email: "me@company.com" }],
    cc: [{ name: "Ana Kovač", email: "ana@company.com" }],
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    subject: "Re: Kvartalni izvještaj Q4 2024",
    body: `Hvala na feedbacku!

Evo odgovora:

1. Breakdown po regijama:
   - Hrvatska: 45%
   - Slovenija: 25%
   - Srbija: 20%
   - Ostalo: 10%

2. Projekcije za Q1 pripremam i šaljem do petka.

3. Marketing tim je odradio sjajan posao s optimizacijom kampanja.

Ana, dobrodošla u tim! Javite ako trebate bilo što od mene.

Pozdrav,
Marko`,
    isStarred: true,
    aiSummary: "Marko dijeli regionalni breakdown prihoda i najavljuje projekcije za Q1. Pozitivne povratne informacije o marketing optimizaciji.",
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export function EmailConversationThread({
  messages = mockMessages,
  subject,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onDownloadAttachment,
  className,
}: EmailConversationThreadProps) {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set([messages[messages.length - 1]?.id])
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleMessage = (messageId: string) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedMessages(new Set(messages.map((m) => m.id)));
  };

  const collapseAll = () => {
    setExpandedMessages(new Set([messages[messages.length - 1]?.id]));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Thread header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{subject || messages[0]?.subject}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.length} {messages.length === 1 ? "poruka" : "poruke"} u razgovoru
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Proširi sve
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Sažmi sve
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.map((message, index) => {
            const isExpanded = expandedMessages.has(message.id);
            const isLast = index === messages.length - 1;
            const isFromMe = message.from.email === "me@company.com";

            return (
              <Card
                key={message.id}
                className={cn(
                  "overflow-hidden",
                  isFromMe && "border-l-4 border-l-primary"
                )}
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleMessage(message.id)}>
                  {/* Message header - always visible */}
                  <CollapsibleTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                        !isExpanded && "pb-4"
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={message.from.avatar} />
                        <AvatarFallback>{getInitials(message.from.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.from.name}</span>
                          {message.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground truncate">
                            {message.body.substring(0, 100)}...
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {message.attachments && message.attachments.length > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <Paperclip className="h-3 w-3" />
                            {message.attachments.length}
                          </Badge>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(message.date, {
                                  addSuffix: true,
                                  locale: hr,
                                })}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {format(message.date, "d. MMMM yyyy. HH:mm", { locale: hr })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Expanded content */}
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      {/* Recipients */}
                      <div className="text-sm text-muted-foreground mb-4 space-y-1">
                        <p>
                          <span className="font-medium">Prima:</span>{" "}
                          {message.to.map((r) => r.name || r.email).join(", ")}
                        </p>
                        {message.cc && message.cc.length > 0 && (
                          <p>
                            <span className="font-medium">Cc:</span>{" "}
                            {message.cc.map((r) => r.name || r.email).join(", ")}
                          </p>
                        )}
                      </div>

                      {/* AI Summary */}
                      {message.aiSummary && (
                        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                              AI Sažetak
                            </span>
                          </div>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            {message.aiSummary}
                          </p>
                        </div>
                      )}

                      {/* Message body */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.bodyHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: message.bodyHtml }} />
                        ) : (
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {message.body}
                          </pre>
                        )}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">
                            Privici ({message.attachments.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.attachments.map((attachment) => (
                              <button
                                key={attachment.id}
                                onClick={() => onDownloadAttachment?.(attachment)}
                                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                              >
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{attachment.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({formatFileSize(attachment.size)})
                                </span>
                                <Download className="h-3 w-3 ml-1" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 pt-4 border-t flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReply?.(message.id)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Odgovori
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReplyAll?.(message.id)}
                        >
                          <ReplyAll className="h-4 w-4 mr-1" />
                          Odgovori svima
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onForward?.(message.id)}
                        >
                          <Forward className="h-4 w-4 mr-1" />
                          Proslijedi
                        </Button>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onStar?.(message.id)}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              message.isStarred && "text-yellow-500 fill-yellow-500"
                            )}
                          />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default EmailConversationThread;
