import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  Keyboard,
  Sparkles,
  Settings,
  Shield,
  Zap,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  readTime: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "Početak rada s AI Hub",
    description: "Naučite osnove korištenja aplikacije i postavite svoj račun",
    category: "Početak",
    icon: <Book className="h-5 w-5" />,
    readTime: "5 min",
  },
  {
    id: "2",
    title: "AI analiza emailova",
    description: "Kako AI analizira vaše emailove i daje preporuke",
    category: "AI značajke",
    icon: <Sparkles className="h-5 w-5" />,
    readTime: "8 min",
  },
  {
    id: "3",
    title: "Tipkovničke prečice",
    description: "Ubrzajte rad pomoću tipkovničkih prečica",
    category: "Produktivnost",
    icon: <Keyboard className="h-5 w-5" />,
    readTime: "3 min",
  },
  {
    id: "4",
    title: "Postavke privatnosti",
    description: "Upravljajte privatnošću i sigurnošću podataka",
    category: "Sigurnost",
    icon: <Shield className="h-5 w-5" />,
    readTime: "6 min",
  },
  {
    id: "5",
    title: "Automatski odgovori",
    description: "Postavite automatske odgovore za vrijeme odsutnosti",
    category: "Email",
    icon: <Mail className="h-5 w-5" />,
    readTime: "4 min",
  },
  {
    id: "6",
    title: "Integracije",
    description: "Povežite vanjske servise poput Google Calendar, Slack...",
    category: "Integracije",
    icon: <Zap className="h-5 w-5" />,
    readTime: "7 min",
  },
];

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Kako AI analizira moje emailove?",
    answer: "AI koristi napredne jezične modele za analizu sadržaja emailova. Analizira ton, sentiment, hitnost i identificira akcijske stavke. Svi podaci se obrađuju sigurno i u skladu s vašim postavkama privatnosti. AI ne dijeli vaše podatke s trećim stranama.",
    category: "AI",
  },
  {
    id: "2",
    question: "Jesu li moji podaci sigurni?",
    answer: "Da, sigurnost vaših podataka nam je prioritet. Koristimo enkripciju podataka u prijenosu i mirovanju (TLS 1.3, AES-256). Možete omogućiti lokalnu obradu podataka u postavkama privatnosti. Redovito provodimo sigurnosne revizije.",
    category: "Sigurnost",
  },
  {
    id: "3",
    question: "Kako postaviti automatske odgovore?",
    answer: "Idite na Postavke > Auto-odgovori. Možete kreirati više pravila za različite scenarije (godišnji odmor, izvan radnog vremena). Definirajte vrijeme aktivnosti, predmet i sadržaj poruke. AI može generirati prijedlog odgovora.",
    category: "Email",
  },
  {
    id: "4",
    question: "Mogu li koristiti aplikaciju offline?",
    answer: "Djelomično. Možete pregledavati prethodno učitane emailove offline. Nove poruke i AI značajke zahtijevaju internetsku vezu. Kada se ponovno povežete, sve promjene se sinkroniziraju.",
    category: "Općenito",
  },
  {
    id: "5",
    question: "Kako funkcionira pametno filtriranje?",
    answer: "Pametni filteri koriste AI za kategorizaciju emailova prema prioritetu, sentimentu i sadržaju. Možete prilagoditi pragove osjetljivosti i kreirati vlastita pravila filtriranja. Filteri uče iz vaših interakcija.",
    category: "AI",
  },
  {
    id: "6",
    question: "Koje integracije su podržane?",
    answer: "Podržavamo Gmail, Outlook, Google Calendar, Slack, Notion, Google Drive, Dropbox i Trello. Nove integracije se redovito dodaju. Za prijedloge novih integracija, kontaktirajte nas.",
    category: "Integracije",
  },
  {
    id: "7",
    question: "Kako promjeniti jezik sučelja?",
    answer: "Idite na Postavke > Općenito > Jezik. Aplikacija je dostupna na hrvatskom i engleskom jeziku. AI odgovori mogu se generirati na više jezika.",
    category: "Općenito",
  },
  {
    id: "8",
    question: "Što je dnevni AI sažetak?",
    answer: "Dnevni AI sažetak je pregled vaših emailova koji AI generira svako jutro. Sadrži prioritetne emailove, akcijske stavke, nadolazeće rokove i prijedloge. Možete prilagoditi vrijeme i sadržaj sažetka.",
    category: "AI",
  },
];

const quickLinks = [
  { label: "Video tutoriali", icon: Video, href: "#videos" },
  { label: "Dokumentacija", icon: Book, href: "#docs" },
  { label: "Kontakt podrška", icon: MessageCircle, href: "#support" },
  { label: "Status sustava", icon: CheckCircle, href: "#status" },
];

export function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(faqs.map((f) => f.category))];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = helpArticles.filter((article) =>
    searchQuery === "" ||
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">Centar za pomoć</h1>
        <p className="text-muted-foreground">
          Pronađite odgovore na pitanja i naučite kako koristiti AI Hub
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretražite pomoć..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2 text-center"
          >
            <link.icon className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Help Articles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Popularni članci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={`#article-${article.id}`}
                className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {article.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {article.title}
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Često postavljena pitanja
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
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
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nema rezultata za vašu pretragu</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trebate dodatnu pomoć?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium mb-1">Email podrška</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pošaljite nam email i odgovorit ćemo u roku od 24 sata.
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                support@aihub.hr
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-medium mb-1">Live chat</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Razgovarajte s našim timom u stvarnom vremenu.
              </p>
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Započni chat
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Svi sustavi operativni
                </span>
              </div>
              <a
                href="#status"
                className="text-sm text-green-600 hover:underline flex items-center gap-1"
              >
                Vidi status
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Brze tipkovničke prečice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { keys: "⌘ + K", description: "Otvori paletu naredbi" },
              { keys: "C", description: "Novi email" },
              { keys: "R", description: "Odgovori na email" },
              { keys: "E", description: "Arhiviraj" },
              { keys: "J / K", description: "Prethodni / Sljedeći email" },
              { keys: "?", description: "Prikaži sve prečice" },
            ].map((shortcut) => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between p-2 bg-muted/50 rounded"
              >
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="outline" className="font-mono">
                  {shortcut.keys}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Help;
