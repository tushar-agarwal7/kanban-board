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
import { Plus, Loader2, Search, Filter, LayoutGrid, Sparkles, Target, TrendingUp } from "lucide-react";
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute top-0 right-0 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading your workspace...</p>
          <p className="text-sm text-muted-foreground mt-1">Preparing something awesome</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
        {/* Hero Stats Section */}
        <div className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <Target className="h-8 w-8 text-white/80 mb-3" />
                <div className="relative">
                  <div className="text-4xl font-bold text-white mb-1">{totalTasks}</div>
                  <div className="text-blue-100 text-sm font-medium">Total Tasks</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <Sparkles className="h-8 w-8 text-white/80 mb-3" />
                <div className="relative">
                  <div className="text-4xl font-bold text-white mb-1">{completedTasks}</div>
                  <div className="text-green-100 text-sm font-medium">Completed</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <TrendingUp className="h-8 w-8 text-white/80 mb-3" />
                <div className="relative">
                  <div className="text-4xl font-bold text-white mb-1">{completionRate}%</div>
                  <div className="text-purple-100 text-sm font-medium">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant={filterPriority !== "all" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setFilterPriority(filterPriority === "all" ? "high" : "all")}
                  className="h-12 px-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </Button>
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  size="lg"
                  className="h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Task
                </Button>
              </div>
            </div>

            {filterPriority !== "all" && (
              <div className="mt-4 flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                <span className="text-sm text-muted-foreground font-medium">Active Filter:</span>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors rounded-full"
                  onClick={() => setFilterPriority("all")}
                >
                  {filterPriority} priority ✕
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
                <LayoutGrid className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {searchQuery ? "No tasks found" : "Your board is empty"}
              </h3>
              <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search or filters to find what you're looking for"
                  : "Start organizing your work by creating your first task"}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  size="lg"
                  className="rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Task
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