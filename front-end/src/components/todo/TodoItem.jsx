import { useState } from "react";
import { useTodo } from "./../../contexts/TodoContext";

function TodoItem({ todo, onEdit }) {
  const todoId = todo.id ?? todo._id;
  const isCompleted = todo.completed ?? todo.isCompleted ?? false;
  const isArchived = todo.archived ?? todo.isArchieved ?? false;
  const label = todo.label || "General";
  const content = todo.content ?? todo.todo ?? "";

  const [isLoading, setIsLoading] = useState(false);

  const { deleteTodo, toggleCompleted, toggleArchived } = useTodo();

  const handleToggleComplete = async () => {
    setIsLoading(true);
    await toggleCompleted(todoId);
    setIsLoading(false);
  };

  const handleToggleArchive = async () => {
    setIsLoading(true);
    await toggleArchived(todoId);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setIsLoading(true);
      await deleteTodo(todoId);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isOverdue =
    todo.dueDate &&
    new Date(todo.dueDate) < new Date() &&
    !isCompleted &&
    !isArchived;

  return (
    <div
      className={`rounded-lg px-4 py-3 transition-all duration-300 shadow-md border ${
        isCompleted
          ? "bg-green-900/30 border-green-600"
          : isArchived
          ? "bg-gray-700/40 border-gray-600"
          : "bg-purple-900/30 border-purple-700"
      } ${isOverdue ? "border-red-500" : "border-white/10"}`}
    >
      <div className="flex items-start md:items-center gap-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          className="mt-1 md:mt-0 w-5 h-5 text-green-500 accent-green-600 cursor-pointer"
          checked={isCompleted}
          onChange={handleToggleComplete}
          disabled={isLoading}
        />

        {/* Content */}
        <div className="flex-1">
          <p
            className={`text-white ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {content}
          </p>

          {/* Tags: Label, Due Date, Archived */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            {label && (
              <span className="bg-blue-700/40 text-blue-300 px-2 py-1 rounded-full">
                #{label}
              </span>
            )}
            {todo.dueDate && (
              <span
                className={`px-2 py-1 rounded-full ${
                  isOverdue
                    ? "bg-red-700/40 text-red-300"
                    : "bg-gray-600/40 text-gray-300"
                }`}
              >
                Due: {formatDate(todo.dueDate)}
              </span>
            )}
            {isArchived && (
              <span className="bg-yellow-700/40 text-yellow-300 px-2 py-1 rounded-full">
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3 md:mt-0">
          {/* Edit */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-700 hover:bg-blue-600 text-white transition disabled:opacity-50"
            onClick={() => onEdit(todo)}
            disabled={isCompleted || isArchived || isLoading}
            title="Edit"
          >
            ✏️
          </button>

          {/* Archive/Unarchive */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700 hover:bg-gray-600 text-white transition disabled:opacity-50"
            onClick={handleToggleArchive}
            disabled={isLoading}
            title={isArchived ? "Unarchive" : "Archive"}
          >
            {isArchived ? "📤" : "📦"}
          </button>

          {/* Delete */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md bg-red-700 hover:bg-red-600 text-white transition disabled:opacity-50"
            onClick={handleDelete}
            disabled={isLoading}
            title="Delete"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
