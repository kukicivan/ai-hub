import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Inbox,
  Star,
  Clock,
  AlertTriangle,
  Briefcase,
  Users,
  ShoppingCart,
  Newspaper,
  Archive,
  Trash2,
  Tag,
} from "lucide-react";

export interface EmailCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  color?: string;
}

const defaultCategories: EmailCategory[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" /> },
  { id: "starred", label: "Sa zvjezdicom", icon: <Star className="h-4 w-4" /> },
  { id: "urgent", label: "Hitno", icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-500" },
  { id: "pending", label: "Na čekanju", icon: <Clock className="h-4 w-4" />, color: "text-orange-500" },
];

const smartCategories: EmailCategory[] = [
  { id: "business", label: "Poslovno", icon: <Briefcase className="h-4 w-4" /> },
  { id: "personal", label: "Osobno", icon: <Users className="h-4 w-4" /> },
  { id: "promotions", label: "Promocije", icon: <ShoppingCart className="h-4 w-4" /> },
  { id: "newsletters", label: "Newsletteri", icon: <Newspaper className="h-4 w-4" /> },
];

const systemCategories: EmailCategory[] = [
  { id: "archived", label: "Arhiva", icon: <Archive className="h-4 w-4" /> },
  { id: "trash", label: "Smeće", icon: <Trash2 className="h-4 w-4" /> },
];

interface EmailCategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts?: Record<string, number>;
  showSmartCategories?: boolean;
  showSystemCategories?: boolean;
  customCategories?: EmailCategory[];
}

export function EmailCategoryTabs({
  selectedCategory,
  onCategoryChange,
  categoryCounts = {},
  showSmartCategories = true,
  showSystemCategories = true,
  customCategories = [],
}: EmailCategoryTabsProps) {
  const allCategories = [
    ...defaultCategories,
    ...(showSmartCategories ? smartCategories : []),
    ...customCategories,
    ...(showSystemCategories ? systemCategories : []),
  ];

  return (
    <div className="border-b">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-1 p-2">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id];

            return (
              <Button
                key={category.id}
                variant={isSelected ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-3 ${category.color || ""}`}
              >
                {category.icon}
                <span>{category.label}</span>
                {count !== undefined && count > 0 && (
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {count > 99 ? "99+" : count}
                  </Badge>
                )}
              </Button>
            );
          })}

          {/* Add Label Button */}
          <Button variant="ghost" size="sm" className="ml-2 text-muted-foreground">
            <Tag className="h-4 w-4 mr-1" />
            Dodaj oznaku
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// Compact variant for mobile
export function EmailCategorySelect({
  selectedCategory,
  onCategoryChange,
  categoryCounts = {},
}: Omit<EmailCategoryTabsProps, "showSmartCategories" | "showSystemCategories" | "customCategories">) {
  const categories = [...defaultCategories, ...smartCategories, ...systemCategories];

  return (
    <div className="flex items-center gap-2 p-2 overflow-x-auto">
      {defaultCategories.slice(0, 4).map((category) => {
        const isSelected = selectedCategory === category.id;
        const count = categoryCounts[category.id];

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 ${category.color || ""}`}
          >
            {category.icon}
            {count !== undefined && count > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

export default EmailCategoryTabs;
