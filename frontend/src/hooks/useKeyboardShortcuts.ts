import { useEffect, useCallback, useState } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean; // Cmd on Mac
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
  category?: string;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

/**
 * Global keyboard shortcuts hook
 * Implements SRS Appendix 12.3 keyboard shortcuts
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInputElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow Escape to work even in inputs
      if (isInputElement && event.key !== "Escape") return;

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        // Handle Cmd/Ctrl cross-platform (meta on Mac, ctrl on Windows/Linux)
        const cmdOrCtrl = shortcut.meta || shortcut.ctrl;
        const cmdOrCtrlPressed = event.metaKey || event.ctrlKey;
        const cmdOrCtrlMatches = cmdOrCtrl ? cmdOrCtrlPressed : !cmdOrCtrlPressed;

        if (keyMatches && (cmdOrCtrl ? cmdOrCtrlMatches : ctrlMatches && metaMatches) && shiftMatches && altMatches) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Default application shortcuts per SRS Appendix 12.3
 */
export function useAppKeyboardShortcuts({
  onQuickSearch,
  onReply,
  onArchive,
  onSnooze,
  onCloseModal,
  onToggleRead,
  onStar,
  onDelete,
}: {
  onQuickSearch?: () => void;
  onReply?: () => void;
  onArchive?: () => void;
  onSnooze?: () => void;
  onCloseModal?: () => void;
  onToggleRead?: () => void;
  onStar?: () => void;
  onDelete?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    // SRS 12.3 - Quick search (Cmd/Ctrl + K)
    {
      key: "k",
      meta: true,
      description: "Quick search",
      category: "Navigation",
      action: () => onQuickSearch?.(),
    },
    // SRS 12.3 - Reply to email (R)
    {
      key: "r",
      description: "Reply to email",
      category: "Email",
      action: () => onReply?.(),
    },
    // SRS 12.3 - Archive (A)
    {
      key: "a",
      description: "Archive",
      category: "Email",
      action: () => onArchive?.(),
    },
    // SRS 12.3 - Snooze (S)
    {
      key: "s",
      description: "Snooze",
      category: "Email",
      action: () => onSnooze?.(),
    },
    // SRS 12.3 - Close modal (Escape)
    {
      key: "Escape",
      description: "Close modal",
      category: "Navigation",
      action: () => onCloseModal?.(),
    },
    // Additional useful shortcuts
    {
      key: "u",
      description: "Toggle read/unread",
      category: "Email",
      action: () => onToggleRead?.(),
    },
    {
      key: "x",
      description: "Star email",
      category: "Email",
      action: () => onStar?.(),
    },
    {
      key: "#",
      shift: true,
      description: "Delete",
      category: "Email",
      action: () => onDelete?.(),
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return shortcuts;
}

/**
 * Hook to show keyboard shortcuts help modal
 */
export function useKeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "?",
      shift: true,
      description: "Show keyboard shortcuts",
      action: () => setIsOpen(true),
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}

export default useKeyboardShortcuts;
