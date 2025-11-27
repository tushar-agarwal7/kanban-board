"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, Calendar, Flag } from "lucide-react";
import { Task } from "@/types";
import { cn, formatDate, getPriorityColor } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityIcons = {
  high: "🔥",
  medium: "⚡",
  low: "📌",
};

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
          "group relative overflow-hidden",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
          "transition-all duration-300 ease-out",
          "cursor-pointer",
          isDragging && "opacity-40 rotate-2 scale-105 shadow-2xl z-50"
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 w-1 h-full transition-all",
            task.priority === "high" && "bg-red-500",
            task.priority === "medium" && "bg-yellow-500",
            task.priority === "low" && "bg-green-500"
          )}
        />

        <div className="p-4 pl-5">
          <div className="flex items-start gap-3 mb-3">
            <button
              className={cn(
                "mt-0.5 cursor-grab active:cursor-grabbing touch-none",
                "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                "transition-colors p-1 -ml-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
                  {task.title}
                </h3>
                <span className="text-lg shrink-0">{priorityIcons[task.priority]}</span>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium px-2 py-0.5",
                      getPriorityColor(task.priority)
                    )}
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none",
            task.priority === "high" && "bg-gradient-to-br from-red-500 to-pink-500",
            task.priority === "medium" && "bg-gradient-to-br from-yellow-500 to-orange-500",
            task.priority === "low" && "bg-gradient-to-br from-green-500 to-emerald-500"
          )}
        />
      </Card>
    </div>
  );
}