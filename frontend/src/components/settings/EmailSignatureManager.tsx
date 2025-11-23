import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Star,
  Copy,
  Eye,
  Sparkles,
  RefreshCw,
  Image,
  Link,
  Bold,
  Italic,
  Type,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Signature {
  id: string;
  name: string;
  content: string;
  htmlContent: string;
  isDefault: boolean;
  useFor: "all" | "new" | "reply" | "internal" | "external";
  includeImage: boolean;
  imageUrl?: string;
}

const defaultSignatures: Signature[] = [
  {
    id: "1",
    name: "Poslovna potpis",
    content: `S poštovanjem,

Ivan Horvat
Product Manager
Tech Startup d.o.o.
Tel: +385 91 234 5678
Email: ivan.horvat@company.hr
www.company.hr`,
    htmlContent: `<p>S poštovanjem,</p>
<p><strong>Ivan Horvat</strong><br/>
Product Manager<br/>
Tech Startup d.o.o.<br/>
Tel: +385 91 234 5678<br/>
Email: ivan.horvat@company.hr<br/>
<a href="https://www.company.hr">www.company.hr</a></p>`,
    isDefault: true,
    useFor: "all",
    includeImage: false,
  },
  {
    id: "2",
    name: "Kratka potpis",
    content: `Pozdrav,
Ivan

Poslano s AI Hub`,
    htmlContent: `<p>Pozdrav,<br/>Ivan</p><p><em>Poslano s AI Hub</em></p>`,
    isDefault: false,
    useFor: "reply",
    includeImage: false,
  },
  {
    id: "3",
    name: "S logom",
    content: `S poštovanjem,

Ivan Horvat
Product Manager`,
    htmlContent: `<p>S poštovanjem,</p><p><strong>Ivan Horvat</strong><br/>Product Manager</p>`,
    isDefault: false,
    useFor: "external",
    includeImage: true,
    imageUrl: "/logo.png",
  },
];

export function EmailSignatureManager() {
  const toast = useToast();
  const [signatures, setSignatures] = useState<Signature[]>(defaultSignatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [previewSignature, setPreviewSignature] = useState<Signature | null>(null);

  const [newSignature, setNewSignature] = useState<Partial<Signature>>({
    name: "",
    content: "",
    htmlContent: "",
    isDefault: false,
    useFor: "all",
    includeImage: false,
  });

  const handleSetDefault = (id: string) => {
    setSignatures((prev) =>
      prev.map((s) => ({
        ...s,
        isDefault: s.id === id,
      }))
    );
    toast.success("Zadana potpis postavljena");
  };

  const handleDelete = (id: string) => {
    const signature = signatures.find((s) => s.id === id);
    if (signature?.isDefault) {
      toast.error("Ne možete obrisati zadanu potpis");
      return;
    }
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    toast.success("Potpis obrisana");
  };

  const handleDuplicate = (signature: Signature) => {
    const newSig: Signature = {
      ...signature,
      id: Date.now().toString(),
      name: `${signature.name} (kopija)`,
      isDefault: false,
    };
    setSignatures((prev) => [...prev, newSig]);
    toast.success("Potpis duplicirana");
  };

  const handleEdit = (signature: Signature) => {
    setEditingSignature(signature);
    setNewSignature(signature);
    setIsDialogOpen(true);
  };

  const handlePreview = (signature: Signature) => {
    setPreviewSignature(signature);
    setIsPreviewOpen(true);
  };

  const handleSave = () => {
    if (!newSignature.name || !newSignature.content) {
      toast.error("Unesite naziv i sadržaj potpisa");
      return;
    }

    if (editingSignature) {
      setSignatures((prev) =>
        prev.map((s) =>
          s.id === editingSignature.id
            ? { ...s, ...newSignature as Signature }
            : s
        )
      );
      toast.success("Potpis ažurirana");
    } else {
      const signature: Signature = {
        id: Date.now().toString(),
        name: newSignature.name!,
        content: newSignature.content!,
        htmlContent: newSignature.htmlContent || convertToHtml(newSignature.content!),
        isDefault: newSignature.isDefault || false,
        useFor: newSignature.useFor || "all",
        includeImage: newSignature.includeImage || false,
        imageUrl: newSignature.imageUrl,
      };

      if (signature.isDefault) {
        setSignatures((prev) =>
          prev.map((s) => ({ ...s, isDefault: false }))
        );
      }

      setSignatures((prev) => [...prev, signature]);
      toast.success("Potpis kreirana");
    }

    setIsDialogOpen(false);
    setEditingSignature(null);
    setNewSignature({
      name: "",
      content: "",
      htmlContent: "",
      isDefault: false,
      useFor: "all",
      includeImage: false,
    });
  };

  const generateAISignature = () => {
    setNewSignature({
      ...newSignature,
      name: "AI generirana potpis",
      content: `S poštovanjem,

[Vaše ime]
[Vaša pozicija]
[Naziv tvrtke]

📧 [Email]
📱 [Telefon]
🌐 [Web]`,
      htmlContent: `<p>S poštovanjem,</p>
<p><strong>[Vaše ime]</strong><br/>
[Vaša pozicija]<br/>
[Naziv tvrtke]</p>
<p>📧 [Email]<br/>
📱 [Telefon]<br/>
🌐 [Web]</p>`,
    });
    toast.success("AI je generirao predložak potpisa");
  };

  const convertToHtml = (text: string): string => {
    return text
      .split("\n\n")
      .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  };

  const getUseForLabel = (useFor: Signature["useFor"]) => {
    switch (useFor) {
      case "all":
        return "Sve poruke";
      case "new":
        return "Nove poruke";
      case "reply":
        return "Odgovori";
      case "internal":
        return "Interne";
      case "external":
        return "Vanjske";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pen className="h-5 w-5 text-primary" />
              Potpisi emailova
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingSignature(null);
                setNewSignature({
                  name: "",
                  content: "",
                  htmlContent: "",
                  isDefault: false,
                  useFor: "all",
                  includeImage: false,
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova potpis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upravljajte potpisima za vaše emailove. Možete kreirati više potpisa
            za različite prilike.
          </p>
        </CardContent>
      </Card>

      {/* Signatures List */}
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {signatures.map((signature) => (
                <div
                  key={signature.id}
                  className={`p-4 border rounded-lg ${
                    signature.isDefault
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{signature.name}</span>
                      {signature.isDefault && (
                        <Badge className="text-xs bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Zadana
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {getUseForLabel(signature.useFor)}
                      </Badge>
                      {signature.includeImage && (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          S logom
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePreview(signature)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!signature.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleSetDefault(signature.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicate(signature)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(signature)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {!signature.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(signature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans bg-muted/50 p-3 rounded-lg max-h-32 overflow-hidden">
                    {signature.content}
                  </pre>
                </div>
              ))}

              {signatures.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Pen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nema kreiranih potpisa</p>
                  <p className="text-xs mt-1">
                    Kreirajte potpis za profesionalniji izgled emailova
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSignature ? "Uredi potpis" : "Nova potpis"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Label>Naziv potpisa</Label>
                <Input
                  value={newSignature.name}
                  onChange={(e) =>
                    setNewSignature({ ...newSignature, name: e.target.value })
                  }
                  placeholder="Npr. Poslovna potpis"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAISignature}
                className="mt-6"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI predložak
              </Button>
            </div>

            <div>
              <Label>Sadržaj potpisa</Label>
              <div className="flex items-center gap-1 mb-2 p-1 bg-muted rounded">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Bold className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Italic className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Link className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Image className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={newSignature.content}
                onChange={(e) =>
                  setNewSignature({
                    ...newSignature,
                    content: e.target.value,
                    htmlContent: convertToHtml(e.target.value),
                  })
                }
                placeholder="Unesite sadržaj potpisa..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Koristi za</Label>
                <Select
                  value={newSignature.useFor}
                  onValueChange={(value: Signature["useFor"]) =>
                    setNewSignature({ ...newSignature, useFor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve poruke</SelectItem>
                    <SelectItem value="new">Nove poruke</SelectItem>
                    <SelectItem value="reply">Odgovori</SelectItem>
                    <SelectItem value="internal">Interne poruke</SelectItem>
                    <SelectItem value="external">Vanjske poruke</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Label>Postavi kao zadanu</Label>
                <Switch
                  checked={newSignature.isDefault}
                  onCheckedChange={(checked) =>
                    setNewSignature({ ...newSignature, isDefault: checked })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Uključi logo/sliku</p>
                <p className="text-xs text-muted-foreground">
                  Dodaj logo tvrtke u potpis
                </p>
              </div>
              <Switch
                checked={newSignature.includeImage}
                onCheckedChange={(checked) =>
                  setNewSignature({ ...newSignature, includeImage: checked })
                }
              />
            </div>

            {newSignature.includeImage && (
              <div>
                <Label>URL slike/loga</Label>
                <Input
                  value={newSignature.imageUrl || ""}
                  onChange={(e) =>
                    setNewSignature({ ...newSignature, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Odustani
            </Button>
            <Button onClick={handleSave}>
              {editingSignature ? "Spremi izmjene" : "Kreiraj potpis"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pregled potpisa: {previewSignature?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 border rounded-lg bg-white">
              <div
                dangerouslySetInnerHTML={{
                  __html: previewSignature?.htmlContent || "",
                }}
                className="prose prose-sm"
              />
              {previewSignature?.includeImage && previewSignature.imageUrl && (
                <div className="mt-3 pt-3 border-t">
                  <img
                    src={previewSignature.imageUrl}
                    alt="Signature logo"
                    className="max-h-12"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Zatvori</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmailSignatureManager;
