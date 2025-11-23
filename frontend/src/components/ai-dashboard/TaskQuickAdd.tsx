import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckSquare,
  Plus,
  Calendar as CalendarIcon,
  Flag,
  Tag,
  X,
  Clock,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { hr } from "date-fns/locale";
import { useToast } from "@/hooks/useToast";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: "high" | "medium" | "low" | "none";
  tags: string[];
  createdAt: Date;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Odgovoriti na email od klijenta",
    completed: false,
    dueDate: new Date(),
    priority: "high",
    tags: ["email", "klijent"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "2",
    title: "Pripremiti prezentaciju za sastanak",
    completed: false,
    dueDate: addDays(new Date(), 1),
    priority: "medium",
    tags: ["prezentacija"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    title: "Pregledati izvještaj prodaje",
    completed: true,
    priority: "low",
    tags: ["izvještaj"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "4",
    title: "Poslati ponudu za projekt X",
    completed: false,
    dueDate: addDays(new Date(), 2),
    priority: "high",
    tags: ["prodaja", "projekt"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

interface TaskQuickAddProps {
  compact?: boolean;
}

export function TaskQuickAdd({ compact = false }: TaskQuickAddProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState<Date | undefined>();
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("none");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDue,
      priority: newTaskPriority,
      tags: [],
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDue(undefined);
    setNewTaskPriority("none");
    toast.success("Zadatak dodan");
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Zadatak obrisan");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "Visok";
      case "medium":
        return "Srednji";
      case "low":
        return "Nizak";
      default:
        return "Bez";
    }
  };

  const getDueDateLabel = (date?: Date) => {
    if (!date) return null;
    if (isToday(date)) return "Danas";
    if (isTomorrow(date)) return "Sutra";
    return format(date, "d. MMM", { locale: hr });
  };

  const isDueOverdue = (date?: Date) => {
    if (!date) return false;
    return date < new Date() && !isToday(date);
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Zadaci
              <Badge variant="secondary" className="text-xs">
                {activeTasks.length}
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Novi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {activeTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 py-1"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm truncate flex-1">{task.title}</span>
                {task.priority === "high" && (
                  <Flag className="h-3 w-3 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="h-5 w-5 text-primary" />
            Zadaci
            <Badge variant="secondary">{activeTasks.length} aktivnih</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Dodaj novi zadatak..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Options */}
          <div className="flex gap-2">
            {/* Due Date */}
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {newTaskDue ? getDueDateLabel(newTaskDue) : "Rok"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newTaskDue}
                  onSelect={(date) => {
                    setNewTaskDue(date);
                    setShowDatePicker(false);
                  }}
                  locale={hr}
                />
              </PopoverContent>
            </Popover>

            {/* Priority */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(newTaskPriority)}`} />
                  {getPriorityLabel(newTaskPriority)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-36 p-1" align="start">
                {(["high", "medium", "low", "none"] as const).map((priority) => (
                  <Button
                    key={priority}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8"
                    onClick={() => setNewTaskPriority(priority)}
                  >
                    <Flag className={`h-3 w-3 mr-2 ${getPriorityColor(priority)}`} />
                    {getPriorityLabel(priority)}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {/* AI Suggestion */}
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
              AI prijedlog
            </Button>
          </div>
        </div>

        {/* Active Tasks */}
        <ScrollArea className="h-[250px]">
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 group"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.dueDate && (
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          isDueOverdue(task.dueDate)
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {getDueDateLabel(task.dueDate)}
                      </span>
                    )}
                    {task.priority !== "none" && (
                      <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                    )}
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Completed Tasks Toggle */}
        {completedTasks.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <ChevronDown
                className={`h-4 w-4 mr-1 transition-transform ${
                  showCompleted ? "rotate-180" : ""
                }`}
              />
              Završeni zadaci ({completedTasks.length})
            </Button>

            {showCompleted && (
              <div className="space-y-1 mt-2 pl-2 border-l-2 border-muted">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 py-1 opacity-60"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm line-through">{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TaskQuickAdd;
