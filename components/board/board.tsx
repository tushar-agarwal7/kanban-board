"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Column } from "./column";
import { Task, TaskStatus } from "@/types";
import { toast } from "sonner";
import { AddTaskModal } from "../modals/add-task-modal";
import { EditTaskModal } from "../modals/edit-task-modal";
import { DeleteConfirmDialog } from "../modals/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { TaskCard } from "./task-card";

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      toast.success("Task moved successfully");
    } catch (error) {
      toast.error("Failed to move task");
      fetchTasks(); // Revert on error
    }
  };

  const handleAddTask = async (data: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully");
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleEditTask = async (data: any) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      toast.success("Task updated successfully");
      setEditingTask(null);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      const response = await fetch(`/api/tasks/${deletingTaskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
      toast.success("Task deleted successfully");
      setDeletingTaskId(null);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks efficiently
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column
              id="todo"
              title="To Do"
              tasks={getTasksByStatus("todo")}
              onEditTask={setEditingTask}
              onDeleteTask={setDeletingTaskId}
            />
            <Column
              id="in_progress"
              title="In Progress"
              tasks={getTasksByStatus("in_progress")}
              onEditTask={setEditingTask}
              onDeleteTask={setDeletingTaskId}
            />
            <Column
              id="done"
              title="Done"
              tasks={getTasksByStatus("done")}
              onEditTask={setEditingTask}
              onDeleteTask={setDeletingTaskId}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <EditTaskModal
        task={editingTask}
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
      />

      <DeleteConfirmDialog
        open={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
      />
    </>
  );
}