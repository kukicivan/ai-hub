import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigacija",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Otvori command palette" },
      { keys: ["G"], description: "Idi na dashboard" },
      { keys: ["I"], description: "Idi na inbox" },
      { keys: ["T"], description: "Idi na zadatke" },
      { keys: ["S"], description: "Idi na podešavanja" },
    ],
  },
  {
    title: "Email akcije",
    shortcuts: [
      { keys: ["C"], description: "Napiši novi email" },
      { keys: ["R"], description: "Odgovori na email" },
      { keys: ["A"], description: "Odgovori svima" },
      { keys: ["F"], description: "Proslijedi email" },
      { keys: ["E"], description: "Arhiviraj email" },
      { keys: ["#"], description: "Obriši email" },
      { keys: ["U"], description: "Označi kao nepročitano" },
      { keys: ["L"], description: "Dodaj oznaku" },
    ],
  },
  {
    title: "Lista emailova",
    shortcuts: [
      { keys: ["J"], description: "Sljedeći email" },
      { keys: ["K"], description: "Prethodni email" },
      { keys: ["X"], description: "Odaberi/poništi odabir" },
      { keys: ["⌘", "A"], description: "Odaberi sve" },
      { keys: ["Enter"], description: "Otvori email" },
    ],
  },
  {
    title: "Općenito",
    shortcuts: [
      { keys: ["Esc"], description: "Zatvori modal/meni" },
      { keys: ["?"], description: "Prikaži prečice" },
      { keys: ["/"], description: "Fokusiraj pretragu" },
      { keys: ["⌘", "Z"], description: "Poništi akciju" },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function KeyBadge({ children }: { children: string }) {
  return (
    <kbd className="px-2 py-1 text-xs font-semibold bg-muted border rounded shadow-sm min-w-[24px] text-center">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Prečice na tastaturi
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <KeyBadge key={keyIdx}>{key}</KeyBadge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Pritisnite <KeyBadge>?</KeyBadge> bilo kada za prikaz ovih prečica
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsModal;
