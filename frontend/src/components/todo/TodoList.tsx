import React, { useState } from "react";
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
  TodoItem,
} from "@/redux/features/todo/todoApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, MoreVertical, Calendar, Flag, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoListProps {
  className?: string;
}

export const TodoList: React.FC<TodoListProps> = ({ className }) => {
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "normal" | "high">("normal");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo({
        title: newTodoTitle.trim(),
        priority: newTodoPriority,
      }).unwrap();
      setNewTodoTitle("");
      setNewTodoPriority("normal");
    } catch (err) {
      console.error("Greška pri kreiranju zadatka:", err);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTodo(id).unwrap();
    } catch (err) {
      console.error("Greška pri označavanju zadatka:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id).unwrap();
    } catch (err) {
      console.error("Greška pri brisanju zadatka:", err);
    }
  };

  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingTitle.trim()) return;

    try {
      await updateTodo({
        id: editingId,
        title: editingTitle.trim(),
      }).unwrap();
      setEditingId(null);
      setEditingTitle("");
    } catch (err) {
      console.error("Greška pri ažuriranju zadatka:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "normal":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6 space-y-4", className)}>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
        <div className="text-red-500 text-center">
          Greška pri učitavanju zadataka. Pokušajte ponovo.
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Zadaci</h2>
        <p className="text-sm text-gray-500 mt-1">
          {activeCount} aktivnih, {completedCount} završenih
        </p>
      </div>

      {/* Create Todo Form */}
      <form onSubmit={handleCreateTodo} className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Dodaj novi zadatak..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            disabled={isCreating}
            className="flex-1"
          />
          <Select
            value={newTodoPriority}
            onValueChange={(value: "low" | "normal" | "high") => setNewTodoPriority(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Nizak</SelectItem>
              <SelectItem value="normal">Srednji</SelectItem>
              <SelectItem value="high">Visok</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isCreating || !newTodoTitle.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            filter === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Svi ({todos.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            filter === "active"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Aktivni ({activeCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            filter === "completed"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Završeni ({completedCount})
        </button>
      </div>

      {/* Todo List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === "all"
              ? "Nema zadataka. Dodajte prvi zadatak!"
              : filter === "active"
                ? "Nema aktivnih zadataka."
                : "Nema završenih zadataka."}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors",
                todo.completed && "bg-gray-50"
              )}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggle(todo.id)}
                className="h-5 w-5"
              />

              {editingId === todo.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 h-8"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        todo.completed && "line-through text-gray-400"
                      )}
                    >
                      {todo.title}
                    </p>
                    {todo.due_date && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(todo.due_date).toLocaleDateString("sr-RS")}
                      </p>
                    )}
                  </div>

                  <Flag className={cn("h-4 w-4", getPriorityColor(todo.priority))} />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStartEdit(todo)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Izmeni
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Obriši
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
