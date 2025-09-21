import React, { useState } from "react";
import { useTodo } from "../../contexts/TodoContext";
import { useAuth } from "../../contexts/AuthContext";
import { TodoForm, TodoItem } from "../index";

export default function TodoCard({ searchTerm = "", sidebarFilter = "all" }) {
  const { todos, isLoading, error, stats, isGuestMode } = useTodo();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all"); // all, completed, pending, archived

  // Combine sidebar filter with local filter
  const activeFilter = sidebarFilter !== "all" ? sidebarFilter : filter;

  const filteredTodos = todos.filter(todo => {
    const isCompleted = todo.isCompleted || todo.completed;
    const isArchived = todo.isArchieved || todo.archived;
    const content = todo.content || todo.todo || "";
    
    // Apply search filter
    const matchesSearch = !searchTerm || 
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.label && todo.label.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Apply status filter
    switch (activeFilter) {
      case "completed":
        return isCompleted && !isArchived;
      case "pending":
        return !isCompleted && !isArchived;
      case "archived":
        return isArchived;
      case activeFilter.startsWith("label:"):
        const labelFilter = activeFilter.replace("label:", "");
        return todo.label === labelFilter && !isArchived;
      default:
        return !isArchived; // Show all non-archived by default
    }
  });

  // Update local filter when sidebar filter changes
  React.useEffect(() => {
    if (sidebarFilter !== "all") {
      setFilter(sidebarFilter);
    }
  }, [sidebarFilter]);

  if (isLoading) {
    return (
      <div className="bg-[#172842] min-h-screen py-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#172842] min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isAuthenticated ? "Your Todos" : "Guest Mode - Local Todos"}
          </h1>
          {isGuestMode && (
            <div className="text-sm bg-yellow-600 px-3 py-1 rounded-full">
              Guest Mode
            </div>
          )}
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-80">Total</div>
            </div>
            <div className="bg-green-600 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm opacity-80">Completed</div>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm opacity-80">Pending</div>
            </div>
            <div className="bg-gray-600 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.archived}</div>
              <div className="text-sm opacity-80">Archived</div>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm opacity-80">Complete</div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "completed", "archived"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Results Indicator */}
        {searchTerm && (
          <div className="mb-4 p-2 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-300">
              Searching for "{searchTerm}" - {filteredTodos.length} result(s) found
            </p>
          </div>
        )}

        {/* Active Filter Indicator */}
        {sidebarFilter !== "all" && (
          <div className="mb-4 p-2 bg-indigo-600/20 border border-indigo-600/30 rounded-lg">
            <p className="text-sm text-indigo-300">
              Filtered by: {sidebarFilter.startsWith("label:") ? `#${sidebarFilter.replace("label:", "")}` : sidebarFilter}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-600 p-3 rounded-lg mb-4">
            <p className="text-white">Error: {error}</p>
          </div>
        )}

        {/* Todo Form */}
        <div className="mb-6">
          <TodoForm />
        </div>

        {/* Todos List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {filter === "all" 
                ? "No todos yet. Create your first todo above!" 
                : `No ${filter} todos found.`}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem key={todo._id || todo.id} todo={todo} />
            ))
          )}
        </div>

        {/* Guest Mode Notice */}
        {isGuestMode && (
          <div className="mt-8 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
            <h3 className="font-semibold text-yellow-300 mb-2">Guest Mode</h3>
            <p className="text-sm text-yellow-200">
              You're using the app in guest mode. Your todos are stored locally in your browser. 
              To sync across devices and access advanced features, please create an account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
