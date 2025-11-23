import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Undo2, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UndoToastProps {
  message: string;
  duration?: number;
  onUndo: () => void;
  onDismiss: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function UndoToast({
  message,
  duration = 5000,
  onUndo,
  onDismiss,
  actionLabel = "Poništi",
  icon,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  }, [onDismiss]);

  const handleUndo = useCallback(() => {
    onUndo();
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  }, [onUndo, onDismiss]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        if (newProgress <= 0) {
          clearInterval(interval);
          handleDismiss();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, isPaused, handleDismiss]);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        "bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg shadow-lg",
        "min-w-[320px] max-w-[480px] overflow-hidden",
        "transform transition-all duration-200",
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="text-zinc-400">
          {icon || <CheckCircle className="h-5 w-5" />}
        </div>
        <span className="flex-1 text-sm">{message}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950"
            onClick={handleUndo}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            {actionLabel}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-zinc-700">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isPaused && (
        <div className="absolute top-1 right-12 flex items-center gap-1 text-xs text-zinc-400">
          <Clock className="h-3 w-3" />
          Pauzirano
        </div>
      )}
    </div>
  );
}

// Hook for managing undo toasts
interface UndoAction {
  id: string;
  message: string;
  onUndo: () => void;
  duration?: number;
}

export function useUndoToast() {
  const [activeToast, setActiveToast] = useState<UndoAction | null>(null);

  const showUndo = useCallback(
    (message: string, onUndo: () => void, duration = 5000) => {
      const id = Date.now().toString();
      setActiveToast({ id, message, onUndo, duration });
      return id;
    },
    []
  );

  const dismiss = useCallback(() => {
    setActiveToast(null);
  }, []);

  const UndoToastComponent = activeToast ? (
    <UndoToast
      key={activeToast.id}
      message={activeToast.message}
      duration={activeToast.duration}
      onUndo={activeToast.onUndo}
      onDismiss={dismiss}
    />
  ) : null;

  return { showUndo, dismiss, UndoToastComponent };
}

// Batch undo component for multiple items
interface BatchUndoToastProps {
  count: number;
  itemType: string;
  action: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function BatchUndoToast({
  count,
  itemType,
  action,
  onUndo,
  onDismiss,
  duration = 7000,
}: BatchUndoToastProps) {
  const getMessage = () => {
    const plural = count > 1 ? `${count} ${itemType}` : `1 ${itemType}`;
    return `${plural} - ${action}`;
  };

  return (
    <UndoToast
      message={getMessage()}
      duration={duration}
      onUndo={onUndo}
      onDismiss={onDismiss}
      actionLabel="Poništi sve"
    />
  );
}

export default UndoToast;
