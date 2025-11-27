"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const columnColors = {
  todo: "bg-blue-500/10 border-blue-500/20",
  in_progress: "bg-yellow-500/10 border-yellow-500/20",
  done: "bg-green-500/10 border-green-500/20",
};

const badgeColors = {
  todo: "bg-blue-500",
  in_progress: "bg-yellow-500",
  done: "bg-green-500",
};

export function Column({ id, title, tasks, onEditTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg">{title}</h2>
          <Badge
            variant="secondary"
            className={cn("text-white", badgeColors[id])}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      <Card
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 transition-colors min-h-[200px]",
          columnColors[id],
          isOver && "ring-2 ring-primary"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              No tasks yet
            </div>
          ) : (
            <div className="space-y-0">
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