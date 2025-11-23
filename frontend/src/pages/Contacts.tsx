import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Star,
  StarOff,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  Calendar,
  Sparkles,
  Tag,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  avatar?: string;
  tags: string[];
  isFavorite: boolean;
  lastContact?: Date;
  emailCount?: number;
  notes?: string;
  aiInsight?: string;
}

// Mock contacts - would come from API
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Marko Horvat",
    email: "marko.horvat@company.hr",
    phone: "+385 91 234 5678",
    company: "Tech Solutions d.o.o.",
    role: "CEO",
    tags: ["klijent", "VIP"],
    isFavorite: true,
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2),
    emailCount: 45,
    aiInsight: "Važan klijent - uvijek odgovara brzo. Preferira kratke poruke.",
  },
  {
    id: "2",
    name: "Ana Novak",
    email: "ana.novak@startup.io",
    company: "Startup IO",
    role: "Product Manager",
    tags: ["partner"],
    isFavorite: true,
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24),
    emailCount: 32,
  },
  {
    id: "3",
    name: "Ivan Petrović",
    email: "ivan.petrovic@enterprise.com",
    phone: "+385 99 876 5432",
    company: "Enterprise Corp",
    role: "CTO",
    tags: ["lead", "enterprise"],
    isFavorite: false,
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    emailCount: 12,
    aiInsight: "Pokazuje interes za AI rješenja. Zahtijeva tehničke detalje.",
  },
  {
    id: "4",
    name: "Petra Babić",
    email: "petra@design.studio",
    company: "Design Studio",
    role: "Designer",
    tags: ["suradnik"],
    isFavorite: false,
    emailCount: 8,
  },
  {
    id: "5",
    name: "Luka Matić",
    email: "luka.matic@fintech.hr",
    phone: "+385 98 111 2233",
    company: "FinTech HR",
    role: "CFO",
    tags: ["klijent", "fintech"],
    isFavorite: false,
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    emailCount: 23,
  },
];

const tagColors: Record<string, string> = {
  klijent: "bg-blue-500",
  VIP: "bg-yellow-500",
  partner: "bg-green-500",
  lead: "bg-purple-500",
  enterprise: "bg-indigo-500",
  suradnik: "bg-cyan-500",
  fintech: "bg-orange-500",
};

export function Contacts() {
  const toast = useToast();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    notes: "",
  });

  // Get all unique tags
  const allTags = [...new Set(contacts.flatMap((c) => c.tags))];

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || contact.tags.includes(selectedTag);
    const matchesFavorites = !showFavoritesOnly || contact.isFavorite;
    return matchesSearch && matchesTag && matchesFavorites;
  });

  const handleToggleFavorite = (id: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
    toast.success("Kontakt obrisan");
  };

  const handleCreateContact = () => {
    if (!newContact.name || !newContact.email) {
      toast.error("Unesite ime i email");
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || undefined,
      company: newContact.company || undefined,
      role: newContact.role || undefined,
      notes: newContact.notes || undefined,
      tags: [],
      isFavorite: false,
      emailCount: 0,
    };

    setContacts((prev) => [contact, ...prev]);
    setNewContact({ name: "", email: "", phone: "", company: "", role: "", notes: "" });
    setIsCreateDialogOpen(false);
    toast.success("Kontakt kreiran");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastContact = (date?: Date) => {
    if (!date) return "Nikada";
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `Prije ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Jučer";
    return `Prije ${days} dana`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Kontakti
          </h1>
          <p className="text-muted-foreground mt-1">
            Upravljajte kontaktima i vezama
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novi kontakt
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži kontakte..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="h-4 w-4 mr-1" />
            Favoriti
          </Button>
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Svi
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {filteredContacts.length} kontakata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedContact?.id === contact.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {contact.name}
                            </span>
                            {contact.isFavorite && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.email}
                          </p>
                          {contact.company && (
                            <p className="text-xs text-muted-foreground">
                              {contact.role} @ {contact.company}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            {contact.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className={`text-xs ${tagColors[tag] || "bg-gray-500"}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatLastContact(contact.lastContact)}
                          </p>
                          {contact.emailCount && contact.emailCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {contact.emailCount} emailova
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback>
                        {getInitials(selectedContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                      {selectedContact.company && (
                        <p className="text-sm text-muted-foreground">
                          {selectedContact.role} @ {selectedContact.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Uredi
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleFavorite(selectedContact.id)}
                      >
                        {selectedContact.isFavorite ? (
                          <>
                            <StarOff className="h-4 w-4 mr-2" />
                            Ukloni iz favorita
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Dodaj u favorite
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteContact(selectedContact.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Obriši
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  {selectedContact.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {selectedContact.company}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedContact.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Oznake</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedContact.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`${tagColors[tag] || "bg-gray-500"}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insight */}
                {selectedContact.aiInsight && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        AI Uvid
                      </span>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      {selectedContact.aiInsight}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {selectedContact.emailCount || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Emailova</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm font-medium">
                      {formatLastContact(selectedContact.lastContact)}
                    </p>
                    <p className="text-xs text-muted-foreground">Zadnji kontakt</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Pošalji email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Zakaži
                  </Button>
                </div>

                {/* Notes */}
                {selectedContact.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Bilješke</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Odaberite kontakt za prikaz detalja
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Contact Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novi kontakt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Ime i prezime *</Label>
                <Input
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Marko Horvat"
                />
              </div>
              <div className="col-span-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="marko@company.com"
                />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="+385 91 234 5678"
                />
              </div>
              <div>
                <Label>Uloga</Label>
                <Input
                  value={newContact.role}
                  onChange={(e) =>
                    setNewContact({ ...newContact, role: e.target.value })
                  }
                  placeholder="CEO, Manager..."
                />
              </div>
              <div className="col-span-2">
                <Label>Tvrtka</Label>
                <Input
                  value={newContact.company}
                  onChange={(e) =>
                    setNewContact({ ...newContact, company: e.target.value })
                  }
                  placeholder="Naziv tvrtke"
                />
              </div>
              <div className="col-span-2">
                <Label>Bilješke</Label>
                <Textarea
                  value={newContact.notes}
                  onChange={(e) =>
                    setNewContact({ ...newContact, notes: e.target.value })
                  }
                  placeholder="Dodatne informacije..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleCreateContact}>Kreiraj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Contacts;
