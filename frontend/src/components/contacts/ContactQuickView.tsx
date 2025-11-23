import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  UserPlus,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Clock,
  TrendingUp,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  isVIP?: boolean;
  isContact?: boolean;
  lastInteraction?: Date;
  emailCount?: number;
  tags?: string[];
}

interface ContactQuickViewProps {
  contact: Contact;
  children: React.ReactNode;
  mode?: "hover" | "click";
  onCompose?: (email: string) => void;
  onViewProfile?: (contactId: string) => void;
  onAddContact?: (contact: Contact) => void;
}

export function ContactQuickView({
  contact,
  children,
  mode = "hover",
  onCompose,
  onViewProfile,
  onAddContact,
}: ContactQuickViewProps) {
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopirano",
      description: `${label} kopiran u međuspremnik`,
    });
  };

  const content = (
    <div className="w-72">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold truncate">{contact.name}</h4>
            {contact.isVIP && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          {contact.title && (
            <p className="text-sm text-muted-foreground truncate">
              {contact.title}
            </p>
          )}
          {contact.company && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" />
              {contact.company}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {contact.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Contact Info */}
      <div className="p-4 space-y-2">
        <div
          className="flex items-center gap-2 text-sm group cursor-pointer"
          onClick={() => copyToClipboard(contact.email, "Email")}
        >
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate flex-1">{contact.email}</span>
          <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {contact.phone && (
          <div
            className="flex items-center gap-2 text-sm group cursor-pointer"
            onClick={() => copyToClipboard(contact.phone!, "Telefon")}
          >
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">{contact.phone}</span>
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {contact.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{contact.location}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {(contact.lastInteraction || contact.emailCount) && (
        <>
          <Separator />
          <div className="p-4 grid grid-cols-2 gap-3">
            {contact.emailCount !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  {contact.emailCount}
                </div>
                <p className="text-xs text-muted-foreground">Emailova</p>
              </div>
            )}
            {contact.lastInteraction && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {format(contact.lastInteraction, "d.M.", { locale: hr })}
                </div>
                <p className="text-xs text-muted-foreground">Zadnja interakcija</p>
              </div>
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Actions */}
      <div className="p-2 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onCompose?.(contact.email)}
        >
          <Send className="h-4 w-4 mr-1" />
          Email
        </Button>
        {!contact.isContact && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onAddContact?.(contact)}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onViewProfile?.(contact.id)}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Profil
        </Button>
      </div>
    </div>
  );

  if (mode === "hover") {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent className="p-0 w-auto" align="start">
          {content}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        {content}
      </PopoverContent>
    </Popover>
  );
}

// Inline contact display with quick view
interface ContactInlineProps {
  contact: Contact;
  showAvatar?: boolean;
  className?: string;
  onCompose?: (email: string) => void;
}

export function ContactInline({
  contact,
  showAvatar = true,
  className,
  onCompose,
}: ContactInlineProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ContactQuickView contact={contact} onCompose={onCompose}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 cursor-pointer hover:underline",
          className
        )}
      >
        {showAvatar && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="text-[10px] bg-primary/10">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm">{contact.name}</span>
        {contact.isVIP && (
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        )}
      </span>
    </ContactQuickView>
  );
}

// Contact chip for recipients
interface ContactChipProps {
  contact: Contact;
  onRemove?: () => void;
  className?: string;
}

export function ContactChip({ contact, onRemove, className }: ContactChipProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ContactQuickView contact={contact} mode="click">
      <Badge
        variant="secondary"
        className={cn(
          "pl-1 pr-2 py-1 flex items-center gap-1.5 cursor-pointer",
          className
        )}
      >
        <Avatar className="h-4 w-4">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback className="text-[8px]">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs">{contact.name}</span>
        {contact.isVIP && (
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        )}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 hover:text-destructive"
          >
            ×
          </button>
        )}
      </Badge>
    </ContactQuickView>
  );
}

export default ContactQuickView;
