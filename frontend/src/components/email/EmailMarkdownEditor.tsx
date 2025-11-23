import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Maximize2,
  Eye,
  Edit3,
  Sparkles,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  showAIAssist?: boolean;
  onAIAssist?: () => void;
  className?: string;
}

interface ToolbarButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: string;
  shortcut?: string;
}

const toolbarButtons: ToolbarButton[][] = [
  [
    { icon: Bold, label: "Podebljano", action: "bold", shortcut: "Ctrl+B" },
    { icon: Italic, label: "Kurziv", action: "italic", shortcut: "Ctrl+I" },
    { icon: Underline, label: "Podcrtano", action: "underline", shortcut: "Ctrl+U" },
    { icon: Strikethrough, label: "Precrtano", action: "strikethrough" },
  ],
  [
    { icon: Heading1, label: "Naslov 1", action: "h1" },
    { icon: Heading2, label: "Naslov 2", action: "h2" },
    { icon: Type, label: "Paragraf", action: "paragraph" },
  ],
  [
    { icon: List, label: "Lista", action: "ul" },
    { icon: ListOrdered, label: "Numerirana lista", action: "ol" },
    { icon: Quote, label: "Citat", action: "quote" },
    { icon: Code, label: "Kod", action: "code" },
  ],
  [
    { icon: Link, label: "Poveznica", action: "link", shortcut: "Ctrl+K" },
    { icon: Image, label: "Slika", action: "image" },
  ],
  [
    { icon: AlignLeft, label: "Lijevo", action: "align-left" },
    { icon: AlignCenter, label: "Centar", action: "align-center" },
    { icon: AlignRight, label: "Desno", action: "align-right" },
  ],
];

export function EmailMarkdownEditor({
  value,
  onChange,
  placeholder = "Započnite pisati...",
  minHeight = 200,
  maxHeight = 500,
  showAIAssist = true,
  onAIAssist,
  className,
}: EmailMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addToHistory = useCallback(
    (newValue: string) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Debounced history
    const timeoutId = setTimeout(() => {
      addToHistory(newValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  const applyFormat = (action: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = value;
    let newCursorPos = start;

    switch (action) {
      case "bold":
        newText = `${value.substring(0, start)}**${selectedText}**${value.substring(end)}`;
        newCursorPos = end + 4;
        break;
      case "italic":
        newText = `${value.substring(0, start)}_${selectedText}_${value.substring(end)}`;
        newCursorPos = end + 2;
        break;
      case "underline":
        newText = `${value.substring(0, start)}<u>${selectedText}</u>${value.substring(end)}`;
        newCursorPos = end + 7;
        break;
      case "strikethrough":
        newText = `${value.substring(0, start)}~~${selectedText}~~${value.substring(end)}`;
        newCursorPos = end + 4;
        break;
      case "h1":
        newText = `${value.substring(0, start)}# ${selectedText}${value.substring(end)}`;
        newCursorPos = end + 2;
        break;
      case "h2":
        newText = `${value.substring(0, start)}## ${selectedText}${value.substring(end)}`;
        newCursorPos = end + 3;
        break;
      case "ul":
        newText = `${value.substring(0, start)}- ${selectedText}${value.substring(end)}`;
        newCursorPos = end + 2;
        break;
      case "ol":
        newText = `${value.substring(0, start)}1. ${selectedText}${value.substring(end)}`;
        newCursorPos = end + 3;
        break;
      case "quote":
        newText = `${value.substring(0, start)}> ${selectedText}${value.substring(end)}`;
        newCursorPos = end + 2;
        break;
      case "code":
        if (selectedText.includes("\n")) {
          newText = `${value.substring(0, start)}\`\`\`\n${selectedText}\n\`\`\`${value.substring(end)}`;
          newCursorPos = end + 8;
        } else {
          newText = `${value.substring(0, start)}\`${selectedText}\`${value.substring(end)}`;
          newCursorPos = end + 2;
        }
        break;
      case "link":
        newText = `${value.substring(0, start)}[${selectedText || "tekst"}](url)${value.substring(end)}`;
        newCursorPos = selectedText ? end + 7 : start + 7;
        break;
      case "image":
        newText = `${value.substring(0, start)}![${selectedText || "alt tekst"}](url)${value.substring(end)}`;
        newCursorPos = selectedText ? end + 8 : start + 8;
        break;
      default:
        break;
    }

    onChange(newText);
    addToHistory(newText);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderMarkdown = (text: string): string => {
    // Basic markdown to HTML conversion
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/_(.*?)_/gim, "<em>$1</em>")
      // Strikethrough
      .replace(/~~(.*?)~~/gim, "<del>$1</del>")
      // Underline
      .replace(/<u>(.*?)<\/u>/gim, "<u>$1</u>")
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-500 underline">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" class="max-w-full" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, "<blockquote class='border-l-4 border-gray-300 pl-4 italic'>$1</blockquote>")
      // Unordered lists
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      // Line breaks
      .replace(/\n/gim, "<br />");

    return html;
  };

  const ToolbarButtonComponent = ({
    button,
    size = "default",
  }: {
    button: ToolbarButton;
    size?: "default" | "sm";
  }) => {
    const Icon = button.icon;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(size === "sm" ? "h-7 w-7" : "h-8 w-8")}
              onClick={() => applyFormat(button.action)}
            >
              <Icon className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {button.label}
              {button.shortcut && (
                <span className="ml-2 text-muted-foreground">
                  ({button.shortcut})
                </span>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card
      className={cn(
        "flex flex-col",
        isFullscreen && "fixed inset-4 z-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={undo}
                  disabled={historyIndex === 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Poništi (Ctrl+Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={redo}
                  disabled={historyIndex === history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ponovi (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Formatting buttons */}
        {toolbarButtons.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex items-center gap-0.5 border-r pr-2 mr-2 last:border-0"
          >
            {group.map((button) => (
              <ToolbarButtonComponent key={button.action} button={button} />
            ))}
          </div>
        ))}

        {/* AI Assist */}
        {showAIAssist && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={onAIAssist}
                >
                  <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                  AI pomoć
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI asistent za pisanje</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* View toggle */}
        <div className="flex items-center gap-1 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={activeTab === "edit" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveTab("edit")}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Uredi</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={activeTab === "preview" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pregled</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Izađi iz cijelog ekrana" : "Cijeli ekran"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "edit" ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="h-full min-h-0 border-0 rounded-none resize-none focus-visible:ring-0"
            style={{
              minHeight: isFullscreen ? "100%" : minHeight,
              maxHeight: isFullscreen ? "100%" : maxHeight,
            }}
          />
        ) : (
          <div
            className="p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none"
            style={{
              minHeight: isFullscreen ? "100%" : minHeight,
              maxHeight: isFullscreen ? "100%" : maxHeight,
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <span>{value.length} znakova</span>
        <span>Markdown podržan</span>
      </div>
    </Card>
  );
}

export default EmailMarkdownEditor;
