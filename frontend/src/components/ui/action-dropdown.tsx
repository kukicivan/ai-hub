import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Bookmark, CheckSquare } from "lucide-react";

interface ActionDropdownProps {
  onReply?: () => void;
  onSchedule?: () => void;
  onSnooze?: () => void;
  onAddToTodo?: () => void;
  onMarkAsDone?: () => void;
}

export function ActionDropdown({
  onReply,
  onSchedule,
  onSnooze,
  onAddToTodo,
  onMarkAsDone,
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">
          <span>Click</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-lg p-3 bg-white shadow-lg">
        <DropdownMenuItem
          className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-green-600 text-white"
          onClick={onReply}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
          <span className="text-base">Reply</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-blue-500 text-white"
          onClick={onSchedule}
        >
          <Clock className="h-5 w-5 text-white" />
          <span className="text-base">Schedule</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-violet-600 text-white"
          onClick={onSnooze}
        >
          <Clock className="h-5 w-5 text-white" />
          <span className="text-base">Snooze</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-emerald-500 text-white"
          onClick={onAddToTodo}
        >
          <Bookmark className="h-5 w-5 text-white" />
          <span className="text-base">Add to TODO</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full rounded-md px-4 py-3 flex items-center gap-3 bg-yellow-400 text-white"
          onClick={onMarkAsDone}
        >
          <CheckSquare className="h-5 w-5 text-white" />
          <span className="text-base">Mark as done</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionDropdown;
