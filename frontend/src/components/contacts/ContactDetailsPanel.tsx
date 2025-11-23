import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Star,
  StarOff,
  Edit,
  Trash2,
  Send,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  Globe,
  Linkedin,
  Twitter,
  Plus,
  Tag,
  MoreVertical,
  History,
  FileText,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  notes?: string;
  tags: string[];
  favorite: boolean;
  createdAt: Date;
  lastContactedAt?: Date;
  avatar?: string;
}

interface EmailHistory {
  id: string;
  subject: string;
  date: Date;
  direction: "sent" | "received";
}

interface ContactDetailsPanelProps {
  contact?: Contact;
  onClose?: () => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

const mockContact: Contact = {
  id: "1",
  firstName: "Marko",
  lastName: "Horvat",
  email: "marko.horvat@example.com",
  phone: "+385 91 234 5678",
  company: "Tech Solutions d.o.o.",
  jobTitle: "Direktor razvoja",
  address: "Ilica 123, 10000 Zagreb",
  website: "https://example.com",
  linkedin: "marko-horvat",
  twitter: "markohorvat",
  notes: "Ključni kontakt za projekt X. Preferira komunikaciju emailom.",
  tags: ["klijent", "prioritet", "IT"],
  favorite: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  lastContactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
};

const mockEmailHistory: EmailHistory[] = [
  {
    id: "1",
    subject: "Re: Ponuda za usluge",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    direction: "received",
  },
  {
    id: "2",
    subject: "Ponuda za usluge",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    direction: "sent",
  },
  {
    id: "3",
    subject: "Sastanak - potvrda",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    direction: "received",
  },
  {
    id: "4",
    subject: "Poziv na sastanak",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    direction: "sent",
  },
  {
    id: "5",
    subject: "Re: Upit za suradnju",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    direction: "received",
  },
];

export function ContactDetailsPanel({
  contact = mockContact,
  onClose,
  onEdit,
  onDelete,
}: ContactDetailsPanelProps) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);
  const [isFavorite, setIsFavorite] = useState(contact.favorite);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Kontakt spremljen");
    onEdit?.(editedContact);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Uklonjeno iz favorita" : "Dodano u favorite");
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    toast.success("Kontakt obrisan");
    onDelete?.(contact.id);
  };

  const handleCompose = () => {
    toast.info(`Novi email za: ${contact.email}`);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedContact.tags.includes(newTag.trim())) {
      setEditedContact({
        ...editedContact,
        tags: [...editedContact.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedContact({
      ...editedContact,
      tags: editedContact.tags.filter((t) => t !== tag),
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Detalji kontakta</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="h-8 w-8"
            >
              {isFavorite ? (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              <User className="h-4 w-4 mr-1" />
              Info
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <History className="h-4 w-4 mr-1" />
              Povijest
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              <FileText className="h-4 w-4 mr-1" />
              Bilješke
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {/* Avatar and Name */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(contact.firstName, contact.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={editedContact.firstName}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, firstName: e.target.value })
                        }
                        placeholder="Ime"
                        className="w-24"
                      />
                      <Input
                        value={editedContact.lastName}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, lastName: e.target.value })
                        }
                        placeholder="Prezime"
                        className="w-24"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.jobTitle && (
                        <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-6">
                <Button size="sm" onClick={handleCompose}>
                  <Send className="h-4 w-4 mr-1" />
                  Pošalji email
                </Button>
                {contact.phone && (
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Pozovi
                  </Button>
                )}
              </div>

              <Separator className="my-4" />

              {/* Contact Info */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    {isEditing ? (
                      <Input
                        value={editedContact.email}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, email: e.target.value })
                        }
                        type="email"
                      />
                    ) : (
                      <p className="text-sm">{contact.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Telefon</Label>
                    {isEditing ? (
                      <Input
                        value={editedContact.phone || ""}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm">{contact.phone || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Tvrtka</Label>
                    {isEditing ? (
                      <Input
                        value={editedContact.company || ""}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, company: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm">{contact.company || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Adresa</Label>
                    {isEditing ? (
                      <Input
                        value={editedContact.address || ""}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, address: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm">{contact.address || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Web stranica</Label>
                    {isEditing ? (
                      <Input
                        value={editedContact.website || ""}
                        onChange={(e) =>
                          setEditedContact({ ...editedContact, website: e.target.value })
                        }
                      />
                    ) : contact.website ? (
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {contact.website}
                      </a>
                    ) : (
                      <p className="text-sm">-</p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-start gap-3">
                  <LinkIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Društvene mreže</Label>
                    <div className="flex gap-2 mt-1">
                      {contact.linkedin && (
                        <Button variant="outline" size="sm" className="h-7">
                          <Linkedin className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Button>
                      )}
                      {contact.twitter && (
                        <Button variant="outline" size="sm" className="h-7">
                          <Twitter className="h-3 w-3 mr-1" />
                          Twitter
                        </Button>
                      )}
                      {!contact.linkedin && !contact.twitter && <span className="text-sm">-</span>}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Tags */}
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Oznake</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(isEditing ? editedContact.tags : contact.tags).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => isEditing && handleRemoveTag(tag)}
                        >
                          {tag}
                          {isEditing && <span className="ml-1">×</span>}
                        </Badge>
                      ))}
                      {isEditing && (
                        <div className="flex gap-1">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Nova oznaka"
                            className="h-6 w-24 text-xs"
                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                          />
                          <Button size="sm" className="h-6" onClick={handleAddTag}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <Separator className="my-4" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Dodan: {format(contact.createdAt, "dd.MM.yyyy.", { locale: hr })}
                    </span>
                  </div>
                  {contact.lastContactedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        Zadnji kontakt:{" "}
                        {format(contact.lastContactedAt, "dd.MM.yyyy.", { locale: hr })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleSave}>Spremi</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Odustani
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {mockEmailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-full ${
                          email.direction === "sent"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {email.direction === "sent" ? (
                          <Send className="h-3 w-3" />
                        ) : (
                          <Mail className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{email.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {email.direction === "sent" ? "Poslano" : "Primljeno"} •{" "}
                          {format(email.date, "dd.MM.yyyy. HH:mm", { locale: hr })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-4">
              <Textarea
                value={isEditing ? editedContact.notes : contact.notes}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, notes: e.target.value })
                }
                placeholder="Dodajte bilješke o kontaktu..."
                rows={10}
                readOnly={!isEditing}
              />
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Uredi bilješke
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Obriši kontakt</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Jeste li sigurni da želite obrisati kontakt{" "}
              <strong>
                {contact.firstName} {contact.lastName}
              </strong>
              ? Ova radnja se ne može poništiti.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Odustani
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Obriši
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ContactDetailsPanel;
