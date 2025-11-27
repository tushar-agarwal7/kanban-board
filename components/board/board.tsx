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
  closestCorners,
} from "@dnd-kit/core";
import { Column } from "./column";
import { Task, TaskStatus } from "@/types";
import { toast } from "sonner";
import { AddTaskModal } from "../modals/add-task-modal";
import { EditTaskModal } from "../modals/edit-task-modal";
import { DeleteConfirmDialog } from "../modals/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Filter, LayoutGrid } from "lucide-react";
import { TaskCard } from "./task-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

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
      fetchTasks();
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
          <div className="container py-8  mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
               

                <div className="flex gap-4 flex-wrap">
                  <div className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalTasks}
                    </div>
                    <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      Total Tasks
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {completedTasks}
                    </div>
                    <div className="text-xs text-green-600/80 dark:text-green-400/80">
                      Completed
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {completionRate}%
                    </div>
                    <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
                      Completion
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFilterPriority(filterPriority === "all" ? "high" : "all")}
                    className={filterPriority !== "all" ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Task</span>
                  </Button>
                </div>
              </div>
            </div>

            {filterPriority !== "all" && (
              <div className="mt-4 flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setFilterPriority("all")}
                >
                  {filterPriority} priority ✕
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="container py-8  mx-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="rotate-3 scale-105 opacity-90">
                  <TaskCard
                    task={activeTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {filteredTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <LayoutGrid className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No tasks found" : "No tasks yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          )}
        </div>
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