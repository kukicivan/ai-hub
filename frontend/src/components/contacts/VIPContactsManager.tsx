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
import {
  Star,
  Search,
  Plus,
  Trash2,
  Mail,
  Phone,
  Building2,
  Crown,
  Bell,
  BellOff,
  MoreVertical,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";

interface VIPContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  priority: "high" | "medium";
  notificationsEnabled: boolean;
  emailCount: number;
  lastEmailDate?: Date;
}

const mockVIPContacts: VIPContact[] = [
  {
    id: "1",
    name: "Marko Horvat",
    email: "marko.horvat@ceo.com",
    phone: "+385 91 234 5678",
    company: "Tech Corp",
    priority: "high",
    notificationsEnabled: true,
    emailCount: 45,
    lastEmailDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "2",
    name: "Ana Kovač",
    email: "ana.kovac@partner.hr",
    company: "Partner d.o.o.",
    priority: "high",
    notificationsEnabled: true,
    emailCount: 32,
    lastEmailDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "3",
    name: "Ivan Babić",
    email: "ivan@client.com",
    company: "Client Inc",
    priority: "medium",
    notificationsEnabled: false,
    emailCount: 18,
    lastEmailDate: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "4",
    name: "Petra Novak",
    email: "petra.novak@investor.com",
    priority: "high",
    notificationsEnabled: true,
    emailCount: 8,
    lastEmailDate: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

interface VIPContactsManagerProps {
  compact?: boolean;
}

export function VIPContactsManager({ compact = false }: VIPContactsManagerProps) {
  const toast = useToast();
  const [contacts, setContacts] = useState<VIPContact[]>(mockVIPContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState("");

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContactEmail.trim()) {
      toast.error("Unesite email adresu");
      return;
    }

    const newContact: VIPContact = {
      id: Date.now().toString(),
      name: newContactEmail.split("@")[0],
      email: newContactEmail.trim(),
      priority: "medium",
      notificationsEnabled: true,
      emailCount: 0,
    };

    setContacts([newContact, ...contacts]);
    setShowAddDialog(false);
    setNewContactEmail("");
    toast.success("VIP kontakt dodan");
  };

  const handleRemoveContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success("VIP kontakt uklonjen");
  };

  const handleToggleNotifications = (id: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, notificationsEnabled: !c.notificationsEnabled } : c
      )
    );
  };

  const handleTogglePriority = (id: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, priority: c.priority === "high" ? "medium" : "high" }
          : c
      )
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              VIP kontakti
              <Badge variant="secondary" className="text-xs">
                {contacts.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Dodaj
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {contacts.slice(0, 4).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-2 py-1"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{contact.name}</p>
                </div>
                {contact.priority === "high" && (
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-yellow-500" />
            VIP kontakti
            <Badge variant="secondary">{contacts.length}</Badge>
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Dodaj VIP
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži VIP kontakte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Info */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              VIP emailovi uvijek imaju visok prioritet i posebne obavijesti
            </p>
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="h-[350px]">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nema VIP kontakata</p>
              <p className="text-sm">Dodajte kontakte koje želite pratiti</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contact.name}</span>
                      {contact.priority === "high" && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {contact.notificationsEnabled ? (
                        <Bell className="h-3 w-3 text-green-500" />
                      ) : (
                        <BellOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {contact.company}
                        </span>
                      )}
                      <span>{contact.emailCount} emailova</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Pošalji email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePriority(contact.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {contact.priority === "high"
                          ? "Smanji prioritet"
                          : "Povećaj prioritet"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleNotifications(contact.id)}
                      >
                        {contact.notificationsEnabled ? (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            Isključi obavijesti
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            Uključi obavijesti
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Ukloni iz VIP
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj VIP kontakt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Email adresa kontakta"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Emailovi od VIP kontakata će uvijek imati visok prioritet i
                posebne obavijesti.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Odustani
              </Button>
              <Button onClick={handleAddContact}>
                <Crown className="h-4 w-4 mr-1" />
                Dodaj VIP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default VIPContactsManager;
