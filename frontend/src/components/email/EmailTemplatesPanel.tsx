import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  isAIGenerated?: boolean;
}

// Mock templates - would come from API
const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Zahvala",
    subject: "Hvala na vašoj poruci",
    body: "Poštovani,\n\nHvala vam na poruci. Primili smo vaš upit i javit ćemo vam se u najkraćem mogućem roku.\n\nSrdačan pozdrav",
    category: "Općenito",
  },
  {
    id: "2",
    name: "Potvrda sastanka",
    subject: "Potvrda sastanka - [DATUM]",
    body: "Poštovani,\n\nPotvrđujem naš sastanak zakazan za [DATUM] u [VRIJEME].\n\nMolim vas da potvrdite svoj dolazak.\n\nSrdačan pozdrav",
    category: "Sastanci",
  },
  {
    id: "3",
    name: "Ponuda",
    subject: "Ponuda za [PROJEKT]",
    body: "Poštovani,\n\nU prilogu vam šaljemo ponudu za [PROJEKT].\n\nMolimo vas da pregledate detalje i javite nam ako imate pitanja.\n\nSrdačan pozdrav",
    category: "Prodaja",
  },
  {
    id: "4",
    name: "Follow-up",
    subject: "Praćenje - [TEMA]",
    body: "Poštovani,\n\nŽelio bih se nadovezati na naš prethodni razgovor o [TEMA].\n\nImate li kakvih novosti ili pitanja?\n\nSrdačan pozdrav",
    category: "Prodaja",
    isAIGenerated: true,
  },
  {
    id: "5",
    name: "Nedostupnost",
    subject: "Automatski odgovor - Nedostupan",
    body: "Poštovani,\n\nTrenutno nisam dostupan. Vaša poruka je primljena i odgovorit ću vam čim budem u mogućnosti.\n\nHvala na razumijevanju.\n\nSrdačan pozdrav",
    category: "Općenito",
  },
];

interface EmailTemplatesPanelProps {
  onSelectTemplate?: (template: EmailTemplate) => void;
}

export function EmailTemplatesPanel({ onSelectTemplate }: EmailTemplatesPanelProps) {
  const toast = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    category: "Općenito",
  });

  const categories = [...new Set(templates.map((t) => t.category))];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.body);
    toast.success("Predložak kopiran u međuspremnik");
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    onSelectTemplate?.(template);
    toast.success(`Predložak "${template.name}" odabran`);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Predložak obrisan");
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.body) {
      toast.error("Unesite naziv i sadržaj predloška");
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
    };
    setTemplates((prev) => [...prev, template]);
    setNewTemplate({ name: "", subject: "", body: "", category: "Općenito" });
    setIsCreateDialogOpen(false);
    toast.success("Predložak kreiran");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Predlošci emailova
          </CardTitle>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Novi
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži predloške..."
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Sve
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{template.name}</span>
                      {template.isAIGenerated && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{template.subject}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {template.body}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="h-7 text-xs"
                  >
                    Koristi
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopyTemplate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novi predložak</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Naziv</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Naziv predloška"
              />
            </div>
            <div>
              <Label>Predmet</Label>
              <Input
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder="Predmet emaila"
              />
            </div>
            <div>
              <Label>Sadržaj</Label>
              <Textarea
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder="Sadržaj predloška..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleCreateTemplate}>Kreiraj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default EmailTemplatesPanel;
