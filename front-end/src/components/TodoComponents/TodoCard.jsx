import { useTodo } from "./../../contexts/TodoContext";
import { useAuth } from "./../../contexts/AuthContext";
import { SearchComponent, TodoForm, TodoItem } from "./../index";

export default function TodoCard() {
  const {
    todos,
    isLoading,
    error,
    stats,
    isGuestMode,
    statusFilter,
    labelFilter,
    handleStatusFilterChange,
    handleLabelFilterChange,
    searchTerm,
  } = useTodo();

  const { isAuthenticated } = useAuth();

  const filteredTodos = todos.filter((todo) => {
    const isCompleted = todo.isCompleted || todo.completed;
    const isArchived = todo.isArchieved || todo.archived;
    const content = todo.content || todo.todo || "";

    // Apply search filter
    const matchesSearch =
      !searchTerm ||
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.label &&
        todo.label.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Apply label filter
    const matchesLabel =
      !labelFilter ||
      (todo.label && todo.label.toLowerCase() === labelFilter.toLowerCase());

    if (!matchesLabel) return false;

    // Apply status filter
    switch (statusFilter) {
      case "completed":
        return isCompleted && !isArchived;
      case "pending":
        return !isCompleted && !isArchived;
      case "archived":
        return isArchived;
      case "all":
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-[#0e1525] min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading todos...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0e1525] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-[#1a2332] shadow-xl rounded-2xl px-6 py-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {isAuthenticated ? "Your Todos" : "Guest Mode - Local Todos"}
          </h1>
          {isGuestMode && (
            <div className="text-xs bg-yellow-500 text-black font-semibold px-3 py-1 rounded-full shadow-md">
              Guest Mode
            </div>
          )}
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "bg-blue-600" },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-green-600",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "bg-orange-500",
              },
              {
                label: "Archived",
                value: stats.archived,
                color: "bg-gray-500",
              },
              {
                label: "Complete",
                value: `${stats.completionRate}%`,
                color: "bg-purple-600",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={`${color} p-4 rounded-lg text-center shadow-md`}
              >
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm opacity-80">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["pending", "completed", "archived", "all"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleStatusFilterChange(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                statusFilter === filterType
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}

          {labelFilter && (
            <button
              onClick={() => handleLabelFilterChange("")}
              className="px-3 py-1 rounded-full bg-red-600 text-white text-xs shadow-md hover:bg-red-500 transition"
            >
              Clear Label Filter
            </button>
          )}
        </div>

        {/* Search */}
        <SearchComponent />

        {/* Search Info */}
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-800/30 border border-blue-500/30 rounded-md">
            <p className="text-sm text-blue-300">
              Searching for "<span className="italic">{searchTerm}</span>" -{" "}
              {filteredTodos.length} result(s) found
            </p>
          </div>
        )}

        {/* Active Filters */}
        {(statusFilter !== "all" || labelFilter) && (
          <div className="mb-4 p-3 bg-indigo-800/30 border border-indigo-500/30 rounded-md">
            <p className="text-sm text-indigo-300">
              {statusFilter !== "all" && (
                <>
                  Status: <strong>{statusFilter}</strong>
                </>
              )}
              {statusFilter !== "all" && labelFilter && " + "}
              {labelFilter && (
                <>
                  Label: <strong>#{labelFilter}</strong>
                </>
              )}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-700 p-4 rounded-lg mb-6 shadow-md">
            <p className="text-white font-medium">Error: {error}</p>
          </div>
        )}

        {/* Todo Form */}
        <div className="mb-8">
          <TodoForm />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">
              No todos found for selected filter.
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const normalizedTodo = {
                ...todo,
                content: todo.content ?? todo.todo ?? "",
                label: todo.label ?? "",
                isCompleted: todo.isCompleted ?? todo.completed ?? false,
                isArchived: todo.isArchieved ?? todo.archived ?? false,
                _id: todo._id ?? todo.id,
                id: todo.id ?? todo._id,
              };
              return (
                <TodoItem
                  key={normalizedTodo._id || normalizedTodo.id}
                  todo={normalizedTodo}
                />
              );
            })
          )}
        </div>

        {/* Guest Mode Notice */}
        {isGuestMode && (
          <div className="mt-10 p-5 bg-yellow-700/20 border border-yellow-500/30 rounded-xl">
            <h3 className="font-semibold text-yellow-300 text-lg mb-2">
              Guest Mode
            </h3>
            <p className="text-sm text-yellow-200">
              You're using the app in guest mode. Your todos are stored locally
              in your browser. To sync across devices and access advanced
              features, please create an account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
