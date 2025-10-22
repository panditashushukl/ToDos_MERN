import { useEffect } from "react";
import { useTodo } from "./../../../contexts/TodoContext";

const NotificationCard = ({notifications, setNotifications}) => {
  const { todos, stats } = useTodo();

  // Generate notifications based on todos
  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const newNotifications = [];

      // Check for overdue todos
      const overdueTodos = todos.filter(
        (todo) =>
          todo.dueDate &&
          new Date(todo.dueDate) < now &&
          !todo.isCompleted &&
          !todo.isArchieved
      );

      if (overdueTodos.length > 0) {
        newNotifications.push({
          id: "overdue",
          type: "warning",
          message: `${overdueTodos.length} todo(s) overdue`,
          icon: "⚠️",
        });
      }

      // Check for todos due today
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const todayTodos = todos.filter(
        (todo) =>
          todo.dueDate &&
          new Date(todo.dueDate) <= today &&
          new Date(todo.dueDate) >=
            new Date(today.getFullYear(), today.getMonth(), today.getDate()) &&
          !todo.isCompleted &&
          !todo.isArchieved
      );

      if (todayTodos.length > 0) {
        newNotifications.push({
          id: "today",
          type: "info",
          message: `${todayTodos.length} todo(s) due today`,
          icon: "📅",
        });
      }

      // Check for completed todos (celebration)
      const completedToday = todos.filter(
        (todo) =>
          todo.isCompleted &&
          todo.updatedAt &&
          new Date(todo.updatedAt).toDateString() === now.toDateString()
      );

      if (completedToday.length > 0) {
        newNotifications.push({
          id: "completed",
          type: "success",
          message: `${completedToday.length} todo(s) completed today!`,
          icon: "🎉",
        });
      }

      // General stats notification
      if (stats && stats.pending > 5) {
        newNotifications.push({
          id: "high-pending",
          type: "info",
          message: `${stats.pending} pending todos - stay focused!`,
          icon: "💪",
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [todos, stats]);

  return (
    <>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-3">Notifications</h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`text-sm p-2 rounded ${
                  notification.type === "warning"
                    ? "bg-red-900/30 text-red-300"
                    : notification.type === "info"
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-green-900/30 text-green-300"
                }`}
              >
                <span className="mr-2">{notification.icon}</span>
                {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No notifications</p>
        )}
      </div>
    </>
  );
};

export default NotificationCard;
