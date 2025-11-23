import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Film,
  Music,
  File,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Share,
  Maximize2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  previewUrl?: string;
}

interface EmailAttachmentPreviewProps {
  attachments: Attachment[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (attachment: Attachment) => void;
  onShare?: (attachment: Attachment) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Film;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("pdf")) return FileText;
  if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
  if (type.includes("zip") || type.includes("rar") || type.includes("archive"))
    return FileArchive;
  if (
    type.includes("javascript") ||
    type.includes("json") ||
    type.includes("html") ||
    type.includes("css")
  )
    return FileCode;
  if (type.includes("text") || type.includes("document")) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toUpperCase() || "";
};

export function EmailAttachmentPreview({
  attachments,
  initialIndex = 0,
  open,
  onOpenChange,
  onDownload,
  onShare,
}: EmailAttachmentPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentAttachment = attachments[currentIndex];
  const isImage = currentAttachment?.type.startsWith("image/");
  const isPdf = currentAttachment?.type.includes("pdf");
  const isVideo = currentAttachment?.type.startsWith("video/");
  const isAudio = currentAttachment?.type.startsWith("audio/");
  const isPreviewable = isImage || isPdf || isVideo || isAudio;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : attachments.length - 1));
    resetView();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < attachments.length - 1 ? prev + 1 : 0));
    resetView();
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const Icon = getFileIcon(currentAttachment?.type || "");

  const renderPreview = () => {
    if (!currentAttachment) return null;

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto p-4">
          <img
            src={currentAttachment.previewUrl || currentAttachment.url}
            alt={currentAttachment.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      );
    }

    if (isPdf && currentAttachment.url) {
      return (
        <iframe
          src={currentAttachment.url}
          className="w-full h-full border-0"
          title={currentAttachment.name}
        />
      );
    }

    if (isVideo && currentAttachment.url) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <video
            src={currentAttachment.url}
            controls
            className="max-w-full max-h-full"
          >
            Vaš preglednik ne podržava video oznaku.
          </video>
        </div>
      );
    }

    if (isAudio && currentAttachment.url) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
          <div className="p-8 rounded-full bg-muted">
            <Music className="h-16 w-16 text-muted-foreground" />
          </div>
          <audio src={currentAttachment.url} controls className="w-full max-w-md">
            Vaš preglednik ne podržava audio oznaku.
          </audio>
        </div>
      );
    }

    // Non-previewable file
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
        <div className="p-8 rounded-2xl bg-muted">
          <Icon className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg">{currentAttachment.name}</h3>
          <p className="text-muted-foreground">
            {formatFileSize(currentAttachment.size)} •{" "}
            {getFileExtension(currentAttachment.name)}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Pregled nije dostupan za ovaj tip datoteke
        </p>
        <Button onClick={() => onDownload?.(currentAttachment)}>
          <Download className="h-4 w-4 mr-2" />
          Preuzmi za pregled
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <DialogTitle className="text-base">
                  {currentAttachment?.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentAttachment?.size || 0)}
                  {attachments.length > 1 && (
                    <> • {currentIndex + 1} od {attachments.length}</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Image controls */}
              {isImage && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-2" />
                </>
              )}

              {/* Action buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentAttachment && onDownload?.(currentAttachment)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentAttachment && onShare?.(currentAttachment)}
              >
                <Share className="h-4 w-4" />
              </Button>
              {currentAttachment?.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(currentAttachment.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Preview area */}
        <div className="flex-1 relative bg-muted/30 overflow-hidden">
          {renderPreview()}

          {/* Navigation arrows */}
          {attachments.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {attachments.length > 1 && (
          <div className="p-3 border-t bg-muted/30">
            <ScrollArea className="w-full">
              <div className="flex gap-2">
                {attachments.map((attachment, index) => {
                  const AttachmentIcon = getFileIcon(attachment.type);
                  const isActive = index === currentIndex;
                  const isImageThumbnail = attachment.type.startsWith("image/");

                  return (
                    <button
                      key={attachment.id}
                      onClick={() => {
                        setCurrentIndex(index);
                        resetView();
                      }}
                      className={cn(
                        "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                        isActive
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                    >
                      {isImageThumbnail && attachment.previewUrl ? (
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <AttachmentIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <Badge
                        variant="secondary"
                        className="absolute bottom-1 left-1 right-1 text-[8px] px-1 py-0 truncate"
                      >
                        {getFileExtension(attachment.name)}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Attachment card component for displaying in email view
interface AttachmentCardProps {
  attachment: Attachment;
  onPreview?: () => void;
  onDownload?: () => void;
  compact?: boolean;
  className?: string;
}

export function AttachmentCard({
  attachment,
  onPreview,
  onDownload,
  compact = false,
  className,
}: AttachmentCardProps) {
  const Icon = getFileIcon(attachment.type);
  const isImage = attachment.type.startsWith("image/");

  if (compact) {
    return (
      <button
        onClick={onPreview}
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors",
          className
        )}
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm truncate max-w-[120px]">{attachment.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatFileSize(attachment.size)}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group relative rounded-lg border overflow-hidden hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* Preview area */}
      <div
        className="h-24 bg-muted flex items-center justify-center cursor-pointer"
        onClick={onPreview}
      >
        {isImage && attachment.previewUrl ? (
          <img
            src={attachment.previewUrl}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="h-10 w-10 text-muted-foreground" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-sm font-medium truncate" title={attachment.name}>
          {attachment.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(attachment.size)}
        </p>
      </div>

      {/* Download button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 bg-white/80 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.();
        }}
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default EmailAttachmentPreview;
