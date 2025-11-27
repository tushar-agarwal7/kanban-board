"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { Task } from "@/types";
import { cn, formatDate, getPriorityColor } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "p-4 mb-3 cursor-pointer hover:shadow-md transition-all border-l-4",
          isDragging && "opacity-50 rotate-2",
          task.status === "todo" && "border-l-blue-500",
          task.status === "in_progress" && "border-l-yellow-500",
          task.status === "done" && "border-l-green-500"
        )}
      >
        <div className="flex items-start gap-3">
          <button
            className="mt-1 cursor-grab active:cursor-grabbing touch-none"
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
              <Badge
                variant="secondary"
                className={cn("text-xs", getPriorityColor(task.priority))}
              >
                {task.priority}
              </Badge>
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(task.createdAt)}
              </span>

              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}