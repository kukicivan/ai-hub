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
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useRespondToEmailMutation } from "@/redux/features/email/emailApi";
import { useToast } from "@/hooks/useToast";

interface EmailComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: {
    from: string;
    subject: string;
    emailId?: number;
  };
  forwardFrom?: {
    subject: string;
    body: string;
  };
}

export function EmailComposeModal({
  open,
  onOpenChange,
  replyTo,
  forwardFrom,
}: EmailComposeModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [to, setTo] = useState(replyTo?.from || "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(() => {
    if (replyTo?.subject) {
      return replyTo.subject.startsWith("Re:") ? replyTo.subject : `Re: ${replyTo.subject}`;
    }
    if (forwardFrom?.subject) {
      return forwardFrom.subject.startsWith("Fwd:") ? forwardFrom.subject : `Fwd: ${forwardFrom.subject}`;
    }
    return "";
  });
  const [body, setBody] = useState(forwardFrom?.body || "");
  const [showCcBcc, setShowCcBcc] = useState(false);

  const [respondToEmail, { isLoading: isSending }] = useRespondToEmailMutation();
  const toast = useToast();

  const handleSend = async () => {
    if (!to.trim()) {
      toast.error("Unesite primatelja");
      return;
    }
    if (!subject.trim()) {
      toast.error("Unesite predmet");
      return;
    }
    if (!body.trim()) {
      toast.error("Unesite sadržaj poruke");
      return;
    }

    try {
      await respondToEmail({
        from: "", // Will be set by backend based on user's connected account
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
      }).unwrap();

      toast.success("Email uspješno poslan");
      handleClose();
    } catch {
      toast.error("Greška pri slanju emaila");
    }
  };

  const handleClose = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setBody("");
    setShowCcBcc(false);
    onOpenChange(false);
  };

  const handleDiscard = () => {
    if (to || subject || body) {
      if (window.confirm("Jeste li sigurni da želite odbaciti poruku?")) {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  const handleGenerateAIResponse = () => {
    toast.info("AI asistent generira odgovor...", {
      description: "Ova funkcionalnost će biti uskoro dostupna",
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-background border rounded-t-lg shadow-lg z-50">
        <div
          className="flex items-center justify-between p-3 border-b cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <span className="font-medium truncate">
            {subject || "Nova poruka"}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-row items-center justify-between border-b pb-3">
          <DialogTitle>
            {replyTo ? "Odgovori" : forwardFrom ? "Proslijedi" : "Nova poruka"}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {/* To Field */}
          <div className="flex items-center gap-3">
            <Label htmlFor="to" className="w-16 text-sm text-muted-foreground">
              Prima:
            </Label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="primatelj@email.com"
                className="flex-1"
              />
              {!showCcBcc && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCcBcc(true)}
                  className="text-xs"
                >
                  Cc/Bcc
                </Button>
              )}
            </div>
          </div>

          {/* Cc/Bcc Fields */}
          {showCcBcc && (
            <>
              <div className="flex items-center gap-3">
                <Label htmlFor="cc" className="w-16 text-sm text-muted-foreground">
                  Cc:
                </Label>
                <Input
                  id="cc"
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@email.com"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="bcc" className="w-16 text-sm text-muted-foreground">
                  Bcc:
                </Label>
                <Input
                  id="bcc"
                  type="email"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@email.com"
                />
              </div>
            </>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3">
            <Label htmlFor="subject" className="w-16 text-sm text-muted-foreground">
              Predmet:
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Predmet emaila"
            />
          </div>

          {/* Body Field */}
          <div className="flex-1">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Napišite poruku..."
              className="min-h-[200px] resize-none"
            />
          </div>

          {/* AI Suggestion Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAIResponse}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generiraj AI odgovor
          </Button>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Priloži datoteku">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive"
                onClick={handleDiscard}
                title="Odbaci"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleSend} disabled={isSending}>
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Slanje..." : "Pošalji"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmailComposeModal;
