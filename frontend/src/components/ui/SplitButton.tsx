import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface SplitButtonOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface SplitButtonProps {
  mainLabel: string;
  mainIcon?: React.ReactNode;
  onMainClick: () => void;
  options: SplitButtonOption[];
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SplitButton({
  mainLabel,
  mainIcon,
  onMainClick,
  options,
  variant = "default",
  size = "default",
  className = "",
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-flex ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <Button
        variant={variant}
        size={size}
        onClick={onMainClick}
        className="rounded-r-none border-r-0"
      >
        {mainIcon && <span className="mr-2">{mainIcon}</span>}
        {mainLabel}
      </Button>

      {/* Dropdown Button */}
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-l-none border-l border-l-white/20 px-2"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
