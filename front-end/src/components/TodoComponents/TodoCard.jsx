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

        {/* Status Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "pending", "completed", "archived"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleStatusFilterChange(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
          {labelFilter && (
            <button
              onClick={() => handleLabelFilterChange("")}
              className="px-3 py-1 rounded-full bg-red-600 text-white text-xs"
            >
              Clear Label Filter
            </button>
          )}
        </div>

        <SearchComponent />
        
        {/* Search Results */}
        {searchTerm && (
          <div className="mb-4 p-2 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-300">
              Searching for "{searchTerm}" - {filteredTodos.length} result(s)
              found
            </p>
          </div>
        )}

        {/* Active Filter Indicator */}
        {(statusFilter !== "all" || labelFilter) && (
          <div className="mb-4 p-2 bg-indigo-600/20 border border-indigo-600/30 rounded-lg">
            <p className="text-sm text-indigo-300">
              {statusFilter !== "all" && (
                <>
                  Status: <strong>{statusFilter}</strong>
                  {labelFilter && " + "}
                </>
              )}
              {labelFilter && (
                <>
                  Label: <strong>#{labelFilter}</strong>
                </>
              )}
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
              return <TodoItem key={normalizedTodo._id || normalizedTodo.id} todo={normalizedTodo} />;
            })
          )}
        </div>

        {/* Guest Mode Notice */}
        {isGuestMode && (
          <div className="mt-8 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
            <h3 className="font-semibold text-yellow-300 mb-2">Guest Mode</h3>
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
