import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  X,
  Maximize2,
  Paperclip,
} from "lucide-react";
import { useRespondToEmailMutation } from "@/redux/features/email/emailApi";
import { useToast } from "@/hooks/useToast";

interface QuickReplyPanelProps {
  emailId: number;
  to: string;
  subject: string;
  onClose?: () => void;
  onExpandToFull?: () => void;
}

const quickResponses = [
  { label: "Hvala", text: "Hvala vam na poruci. Javit ću vam se uskoro." },
  { label: "Potvrđujem", text: "Potvrđujem primitak vaše poruke." },
  { label: "Trebam vrijeme", text: "Hvala na poruci. Trebam malo više vremena da vam odgovorim detaljnije." },
  { label: "Zakazujemo", text: "Zvuči odlično! Predlažem da zakažemo poziv. Koji termin vam odgovara?" },
];

export function QuickReplyPanel({
  emailId,
  to,
  subject,
  onClose,
  onExpandToFull,
}: QuickReplyPanelProps) {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const toast = useToast();
  const [respondToEmail, { isLoading }] = useRespondToEmailMutation();

  const handleQuickResponse = (text: string) => {
    setMessage(text);
    setIsExpanded(true);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Unesite poruku");
      return;
    }

    try {
      await respondToEmail({
        from: "", // Set by backend
        to,
        subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
        body: message,
      }).unwrap();

      toast.success("Odgovor je poslan");
      setMessage("");
      onClose?.();
    } catch {
      toast.error("Greška pri slanju odgovora");
    }
  };

  const handleGenerateAI = () => {
    toast.info("AI asistent generira odgovor...", {
      description: "Ova funkcionalnost će biti uskoro dostupna",
    });
  };

  return (
    <div className="border-t bg-muted/30 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Brzi odgovor</span>
          <Badge variant="outline" className="text-xs">
            {to}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onExpandToFull}
            title="Otvori u punom prozoru"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            title="Zatvori"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Response Buttons */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
          {quickResponses.map((response, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickResponse(response.text)}
              className="text-xs"
            >
              {response.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAI}
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3" />
            AI odgovor
          </Button>
        </div>
      )}

      {/* Message Input */}
      {isExpanded && (
        <div className="space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Napišite odgovor..."
            className="min-h-[100px] resize-none"
            autoFocus
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Priloži datoteku">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateAI}
                className="text-xs gap-1"
              >
                <Sparkles className="h-3 w-3" />
                AI
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Poništi
              </Button>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4 mr-1" />
                {isLoading ? "Slanje..." : "Pošalji"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Input */}
      {!isExpanded && (
        <div
          className="border rounded-lg p-3 bg-background cursor-text text-muted-foreground text-sm"
          onClick={() => setIsExpanded(true)}
        >
          Kliknite za pisanje odgovora...
        </div>
      )}
    </div>
  );
}

export default QuickReplyPanel;
