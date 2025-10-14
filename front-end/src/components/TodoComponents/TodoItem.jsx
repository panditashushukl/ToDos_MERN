import { useState } from "react";
import { useTodo } from "../../contexts/TodoContext";

function TodoItem({ todo }) {
  const todoId = todo.id ?? todo._id;
  const isCompleted = todo.completed ?? todo.isCompleted ?? false;
  const isArchived = todo.archived ?? todo.isArchieved ?? false;
  const label = todo.label || "General";
  const content = todo.content ?? todo.todo ?? "";

  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoContent, setTodoContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  const { updateTodo, deleteTodo, toggleCompleted, toggleArchived } = useTodo();

  const editTodo = async () => {
    if (!todoContent.trim()) return;

    setIsLoading(true);
    const result = updateTodo(todoId, { content: todoContent.trim() });

    if (result.success) {
      setIsTodoEditable(false);
    }
    setIsLoading(false);
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    toggleCompleted(todoId);
    setIsLoading(false);
  };

  const handleToggleArchive = async () => {
    setIsLoading(true);
    toggleArchived(todoId);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setIsLoading(true);
      deleteTodo(todoId);
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
      className={`border border-black/10 rounded-lg px-3 py-2 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black ${
        isCompleted
          ? "bg-green-200"
          : isArchived
          ? "bg-gray-300"
          : "bg-purple-200"
      } ${isOverdue ? "border-red-500" : ""}`}
    >
      <div className="flex items-center gap-x-3">
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={isCompleted}
          onChange={handleToggleComplete}
          disabled={isLoading}
        />

        <div className="flex-1">
          <input
            type="text"
            className={`border outline-none w-full bg-transparent rounded-lg ${
              isTodoEditable ? "border-black/10 px-2" : "border-transparent"
            } ${isCompleted ? "line-through" : ""}`}
            value={todoContent}
            onChange={(e) => setTodoContent(e.target.value)}
            readOnly={!isTodoEditable || isArchived}
            disabled={isLoading}
          />

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <span className="bg-blue-100 px-2 py-1 rounded-full">{label}</span>
            {todo.dueDate && (
              <span
                className={`px-2 py-1 rounded-full ${
                  isOverdue ? "bg-red-100 text-red-800" : "bg-gray-100"
                }`}
              >
                Due: {formatDate(todo.dueDate)}
              </span>
            )}
            {isArchived && (
              <span className="bg-yellow-100 px-2 py-1 rounded-full">
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          {/* Edit/Save Button */}
          <button
            className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
            onClick={() => {
              if (isCompleted || isArchived) return;
              isTodoEditable ? editTodo() : setIsTodoEditable(true);
            }}
            disabled={isCompleted || isArchived || isLoading}
            title={isTodoEditable ? "Save" : "Edit"}
          >
            {isTodoEditable ? "💾" : "✏️"}
          </button>

          {/* Archive/Unarchive Button */}
          <button
            className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
            onClick={handleToggleArchive}
            disabled={isLoading}
            title={isArchived ? "Unarchive" : "Archive"}
          >
            {isArchived ? "📤" : "📦"}
          </button>

          {/* Delete Button */}
          <button
            className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
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
