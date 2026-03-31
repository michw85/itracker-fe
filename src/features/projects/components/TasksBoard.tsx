// TODO Temporary solution with mock data until backend integration
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Plus, MoreVertical, Calendar } from "lucide-react";

// Mock data for demonstration
interface MockTask {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  labels: string[];
}

interface MockColumn {
  id: string;
  name: string;
  tasks: MockTask[];
}

const mockColumns: MockColumn[] = [
  {
    id: "col-1",
    name: "📋 To Do",
    tasks: [
      {
        id: "task-1",
        title: "Implement login page",
        description: "Create login form with email and password validation",
        assignee: "Jon Snow",
        priority: "High",
        dueDate: "2024-03-25",
        labels: ["frontend", "auth"],
      },
      {
        id: "task-2",
        title: "Design database schema",
        description: "Create ER diagram for the task management system",
        assignee: "Daenerys Targaryen",
        priority: "Medium",
        dueDate: "2024-03-28",
        labels: ["backend", "database"],
      },
      {
        id: "task-3",
        title: "Setup project structure",
        description: "Initialize React + TypeScript project with Tailwind",
        priority: "Low",
        labels: ["setup"],
      },
    ],
  },
  {
    id: "col-2",
    name: "⚡ In Progress",
    tasks: [
      {
        id: "task-4",
        title: "Create API endpoints",
        description: "Implement REST API for tasks and projects",
        assignee: "Tyrion Lannister",
        priority: "High",
        dueDate: "2024-03-26",
        labels: ["backend", "api"],
      },
      {
        id: "task-5",
        title: "Design UI components",
        description: "Create reusable components with shadcn/ui",
        assignee: "Arya Stark",
        priority: "Medium",
        labels: ["frontend", "ui"],
      },
    ],
  },
  {
    id: "col-3",
    name: "✅ Review",
    tasks: [
      {
        id: "task-6",
        title: "Write documentation",
        description: "Create README and API documentation",
        assignee: "Sansa Stark",
        priority: "Low",
        dueDate: "2024-03-27",
        labels: ["docs"],
      },
    ],
  },
  {
    id: "col-4",
    name: "🎉 Done",
    tasks: [
      {
        id: "task-7",
        title: "Project kickoff meeting",
        description: "Initial meeting with stakeholders",
        assignee: "Team Lead",
        priority: "High",
        dueDate: "2024-03-20",
        labels: ["meeting"],
      },
      {
        id: "task-8",
        title: "Setup development environment",
        description: "Configure VS Code, Git, and dependencies",
        assignee: "All developers",
        priority: "High",
        labels: ["setup"],
      },
    ],
  },
];

const TasksBoard: React.FC = () => {
  const [columns] = useState<MockColumn[]>(mockColumns);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAvatarFallback = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Adding a task for demonstration purposes (to demonstrate functionality)
  const handleAddTask = (columnName: string) => {
    setSelectedColumn(columnName);
    setIsAddTaskOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Demo warning header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-center gap-2">
        <span className="text-lg">ℹ️</span>
        <span>
          <strong>Demo Preview</strong>— This is a demonstration of how the task board will look.
          Full functionality will be available after backend integration.
        </span>
      </div>

      {/* Board with columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg w-80 shrink-0 flex flex-col max-h-[70vh]"
          >
            {/* Column header */}
            <div className="p-3 border-b flex justify-between items-center sticky top-0 bg-gray-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-700">{column.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleAddTask(column.id)}
                title="Add task (demo)"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Tasks list */}
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {column.tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks yet
                </div>
              ) : (
                column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Task title */}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {task.title}
                      </h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Labels */}
                    {task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.labels.map((label) => (
                          <span
                            key={label}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Task metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-1 border-t">
                      <div className="flex items-center gap-3">
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {getAvatarFallback(task.assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate max-w-[80px]">
                              {task.assignee.split(" ")[0]}
                            </span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add task button at bottom */}
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                className="w-full text-gray-500 text-sm"
                onClick={() => handleAddTask(column.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add task
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo add task dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task (Demo)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
              <strong>Demo Mode</strong><br />
              This is a preview of the task creation form. Full functionality will be available after backend integration.
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                placeholder="Enter task title"
                value="Example: Implement feature X"
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Input
                id="taskDescription"
                placeholder="Enter description"
                value="This is a demo task to show the UI"
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskColumn">Column</Label>
              <Input
                id="taskColumn"
                value={selectedColumn || ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button disabled className="bg-gray-400">
                Create (Demo)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Demo mode footer */}
      <div className="text-center text-xs text-gray-400 mt-4 pt-4 border-t">
        🚧 This is a <strong>demo preview</strong> of the task board. Full functionality will be available after backend integration.
      </div>
    </div>
  );
};

export default TasksBoard;