import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetTodosQuery,
  useToggleTodoMutation,
  TodoItem,
} from "@/redux/features/todo/todoApi";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ChevronRight,
  AlertTriangle,
  Target,
  Sparkles,
} from "lucide-react";

const priorityConfig = {
  high: {
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    badge: "destructive",
  },
  normal: {
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-200 dark:border-yellow-800",
    badge: "warning",
  },
  low: {
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    badge: "secondary",
  },
} as const;

interface TodoItemCardProps {
  todo: TodoItem;
  onToggle: (id: number) => void;
}

function TodoItemCard({ todo, onToggle }: TodoItemCardProps) {
  const priority = todo.priority || "normal";
  const config = priorityConfig[priority];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
        todo.completed
          ? "bg-muted/50 opacity-60"
          : `${config.bg} ${config.border}`
      }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-sm font-medium ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </span>
          {priority === "high" && !todo.completed && (
            <AlertTriangle className="h-3 w-3 text-red-500" />
          )}
        </div>
        {todo.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {todo.description}
          </p>
        )}
        {todo.due_date && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(todo.due_date).toLocaleDateString("bs")}
          </div>
        )}
      </div>
    </div>
  );
}

function TodoItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

interface TodayActionsPanelProps {
  onAddNew?: () => void;
}

export function TodayActionsPanel({ onAddNew }: TodayActionsPanelProps) {
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [toggleTodo] = useToggleTodoMutation();

  // Filter today's todos and incomplete ones
  const today = new Date().toISOString().split("T")[0];
  const todaysTodos = todos.filter((todo) => {
    if (!todo.due_date) return !todo.completed; // Include todos without due date if incomplete
    return todo.due_date.startsWith(today) || !todo.completed;
  });

  // Sort by priority and completion status
  const sortedTodos = [...todaysTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Calculate progress
  const total = sortedTodos.length;
  const completed = sortedTodos.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleToggle = async (id: number) => {
    try {
      await toggleTodo(id).unwrap();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Današnje Akcije
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-1" />
          Nova
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Napredak</span>
            <span className="font-medium">
              {completed}/{total} ({progress}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress === 100 && total > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Sparkles className="h-4 w-4" />
              Svaka čast! Sve akcije su završene!
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <TodoItemSkeleton key={i} />
              ))}
            </>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Greška pri učitavanju
            </div>
          ) : sortedTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mb-2 opacity-50" />
              <p>Nema akcija za danas</p>
              <Button variant="link" size="sm" onClick={onAddNew}>
                Dodaj prvu akciju
              </Button>
            </div>
          ) : (
            sortedTodos.slice(0, 10).map((todo) => (
              <TodoItemCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>

        {/* View All Link */}
        {sortedTodos.length > 10 && (
          <Button variant="ghost" className="w-full" size="sm">
            Vidi sve ({sortedTodos.length - 10} više)
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default TodayActionsPanel;
