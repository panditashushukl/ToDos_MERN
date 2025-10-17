import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiService } from "../services/api";

export const TodoContext = createContext({
  todos: [],
  labels: [],
  stats: null,
  isLoading: false,
  error: null,
  addTodo: () => {},
  updateTodo: () => {},
  deleteTodo: () => {},
  toggleCompleted: () => {},
  toggleArchived: () => {},
  getTodosByLabel: () => {},
  updateLabel: () => {},
  deleteLabel: () => {},
  bulkUpdate: () => {},
  refreshTodos: () => {},
  isGuestMode: false,
  searchTerm: "",
  statusFilter: "",
  labelFilter: "",
});

export const useTodo = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [labelFilter, setLabelFilter] = useState("");

  const isGuestMode = !isAuthenticated;

  // Load todos based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      loadServerTodos();
    } else {
      loadGuestTodos();
    }
  }, [isAuthenticated]);

  // Load todos from server
  const loadServerTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [todosResponse, labelsResponse, statsResponse] = await Promise.all([
        apiService.getTodos(),
        apiService.getLabels(),
        apiService.getTodoStats(),
      ]);

      setTodos(todosResponse.data.todos || []);
      setLabels(labelsResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load server todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load todos from localStorage (guest mode)
  const loadGuestTodos = () => {
    try {
      const savedTodos = localStorage.getItem("guestTodos");
      const savedLabels = localStorage.getItem("guestLabels");

      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }

      if (savedLabels) {
        setLabels(JSON.parse(savedLabels));
      }

      // Calculate stats for guest mode
      const guestStats = calculateGuestStats(JSON.parse(savedTodos || "[]"));
      setStats(guestStats);
    } catch (err) {
      console.error("Failed to load guest todos:", err);
      setTodos([]);
      setLabels([]);
    }
  };

  // Save guest todos to localStorage
  const saveGuestTodos = (newTodos) => {
    try {
      localStorage.setItem("guestTodos", JSON.stringify(newTodos));

      // Update labels from todos
      const uniqueLabels = [
        ...new Set(newTodos.map((todo) => todo.label).filter(Boolean)),
      ];
      setLabels(uniqueLabels);
      localStorage.setItem("guestLabels", JSON.stringify(uniqueLabels));

      // Update stats
      const guestStats = calculateGuestStats(newTodos);
      setStats(guestStats);
    } catch (err) {
      console.error("Failed to save guest todos:", err);
    }
  };

  // Calculate stats for guest mode
  const calculateGuestStats = (todos) => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.isCompleted).length;
    const pending = todos.filter(
      (todo) => !todo.isCompleted && !todo.isArchieved
    ).length;
    const archived = todos.filter((todo) => todo.isArchieved).length;
    const overdue = todos.filter(
      (todo) =>
        todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        !todo.isCompleted &&
        !todo.isArchieved
    ).length;

    return {
      total,
      completed,
      pending,
      archived,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  // Add todo
  const addTodo = async (todoData) => {
    if (isGuestMode) {
      const newTodo = {
        id: Date.now().toString(),
        content: todoData.content || todoData.todo,
        label: todoData.label || "General",
        isCompleted: false,
        isArchieved: false,
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newTodos = [newTodo, ...todos];
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true, todo: newTodo };
    } else {
      try {
        const response = await apiService.createTodo(todoData);
        const newTodo = response.data;

        setTodos((prev) => [newTodo, ...prev]);
        await refreshLabels();
        await refreshStats();

        return { success: true, todo: newTodo };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Update todo
  const updateTodo = async (id, todoData) => {
    if (isGuestMode) {
      const newTodos = todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...todoData, updatedAt: new Date().toISOString() }
          : todo
      );
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        const response = await apiService.updateTodo(id, todoData);
        const updatedTodo = response.data;

        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updatedTodo : todo))
        );

        await refreshStats();

        return { success: true, todo: updatedTodo };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (isGuestMode) {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        await apiService.deleteTodo(id);

        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        await refreshStats();

        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle completion
  const toggleCompleted = async (id) => {
    if (isGuestMode) {
      const newTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              isCompleted: !todo.isCompleted,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        const response = await apiService.toggleTodoCompletion(id);
        const updatedTodo = response.data;

        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updatedTodo : todo))
        );

        await refreshStats();

        return { success: true, todo: updatedTodo };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle archive
  const toggleArchived = async (id) => {
    if (isGuestMode) {
      const newTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              isArchieved: !todo.isArchieved,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        const response = await apiService.toggleTodoArchive(id);
        const updatedTodo = response.data;

        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? updatedTodo : todo))
        );

        await refreshStats();

        return { success: true, todo: updatedTodo };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get todos by label
  const getTodosByLabel = async (label) => {
    if (isGuestMode) {
      return todos.filter((todo) => todo.label === label);
    } else {
      try {
        const response = await apiService.getTodosByLabel(label);
        return response.data;
      } catch (err) {
        setError(err.message);
        return [];
      }
    }
  };

  // Update label
  const updateLabel = async (oldLabel, newLabel) => {
    if (isGuestMode) {
      const newTodos = todos.map((todo) =>
        todo.label === oldLabel
          ? { ...todo, label: newLabel, updatedAt: new Date().toISOString() }
          : todo
      );
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        await apiService.updateLabel(oldLabel, newLabel);
        await loadServerTodos();
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete label
  const deleteLabel = async (label) => {
    if (isGuestMode) {
      const newTodos = todos.filter((todo) => todo.label !== label);
      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        await apiService.deleteLabel(label);
        await loadServerTodos();
        await refreshStats();
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Bulk update
  const bulkUpdate = async (todoIds, operation) => {
    if (isGuestMode) {
      let newTodos = [...todos];

      switch (operation) {
        case "markCompleted":
          newTodos = newTodos.map((todo) =>
            todoIds.includes(todo.id)
              ? {
                  ...todo,
                  isCompleted: true,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          );
          break;
        case "markPending":
          newTodos = newTodos.map((todo) =>
            todoIds.includes(todo.id)
              ? {
                  ...todo,
                  isCompleted: false,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          );
          break;
        case "archive":
          newTodos = newTodos.map((todo) =>
            todoIds.includes(todo.id)
              ? {
                  ...todo,
                  isArchieved: true,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          );
          break;
        case "unarchive":
          newTodos = newTodos.map((todo) =>
            todoIds.includes(todo.id)
              ? {
                  ...todo,
                  isArchieved: false,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          );
          break;
        case "delete":
          newTodos = newTodos.filter((todo) => !todoIds.includes(todo.id));
          break;
      }

      setTodos(newTodos);
      saveGuestTodos(newTodos);
      return { success: true };
    } else {
      try {
        await apiService.bulkUpdateTodos(todoIds, operation);
        await loadServerTodos();
        await refreshStats();
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh todos
  const refreshTodos = async () => {
    if (isAuthenticated) {
      await loadServerTodos();
    } else {
      loadGuestTodos();
    }
  };

  // Refresh labels
  const refreshLabels = async () => {
    if (isAuthenticated) {
      try {
        const response = await apiService.getLabels();
        setLabels(response.data || []);
      } catch (err) {
        console.error("Failed to refresh labels:", err);
      }
    }
  };

  // Refresh stats
  const refreshStats = async () => {
    if (isAuthenticated) {
      try {
        const response = await apiService.getTodoStats();
        setStats(response.data || null);
      } catch (err) {
        console.error("Failed to refresh stats:", err);
      }
    }
  };

  // Search Facility
  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  // Filter Facility
const handleStatusFilterChange = (filter) => {
  setStatusFilter(filter);
};

  const handleLabelFilterChange = (label) => {
    setLabelFilter(label); 
  };

  const value = {
    todos,
    labels,
    stats,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted,
    toggleArchived,
    getTodosByLabel,
    updateLabel,
    deleteLabel,
    bulkUpdate,
    refreshTodos,
    isGuestMode,
    handleSearchChange,
    searchTerm,
    handleStatusFilterChange,
    statusFilter,
    handleLabelFilterChange,
    labelFilter,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
