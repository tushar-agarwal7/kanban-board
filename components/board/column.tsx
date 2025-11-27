"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const columnConfig = {
  todo: {
    icon: Circle,
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
    borderLight: "border-blue-200 dark:border-blue-800/50",
    badge: "bg-blue-500 hover:bg-blue-600",
    glow: "shadow-blue-500/20",
  },
  in_progress: {
    icon: Clock,
    gradient: "from-yellow-500 to-orange-500",
    bgLight: "bg-yellow-50 dark:bg-yellow-950/20",
    borderLight: "border-yellow-200 dark:border-yellow-800/50",
    badge: "bg-yellow-500 hover:bg-yellow-600",
    glow: "shadow-yellow-500/20",
  },
  done: {
    icon: CheckCircle2,
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50 dark:bg-green-950/20",
    borderLight: "border-green-200 dark:border-green-800/50",
    badge: "bg-green-500 hover:bg-green-600",
    glow: "shadow-green-500/20",
  },
};

export function Column({ id, title, tasks, onEditTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];
  const Icon = config.icon;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className={cn(
          "relative overflow-hidden rounded-xl p-4 border backdrop-blur-sm",
          "bg-white/80 dark:bg-gray-900/80",
          "transition-all duration-300",
          isOver && "scale-[1.02] shadow-lg"
        )}>
          <div className={cn(
            "absolute inset-0 opacity-10",
            `bg-gradient-to-br ${config.gradient}`
          )} />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                config.bgLight,
                "border",
                config.borderLight
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-xs text-muted-foreground">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
            </div>
            <Badge
              className={cn(
                "text-white shadow-md transition-all",
                config.badge
              )}
            >
              {tasks.length}
            </Badge>
          </div>

          
        </div>
      </div>

      <Card
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 transition-all duration-300 min-h-[400px]",
          "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
          "border-2 border-dashed",
          config.borderLight,
          isOver && cn(
            "border-solid scale-[1.01]",
            "shadow-2xl",
            config.glow,
            `ring-2 ring-offset-2 ring-${id === 'todo' ? 'blue' : id === 'in_progress' ? 'yellow' : 'green'}-500/50`
          )
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                config.bgLight,
                "border-2 border-dashed",
                config.borderLight
              )}>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No tasks yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag tasks here or create a new one
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </Card>
    </div>
  );
}