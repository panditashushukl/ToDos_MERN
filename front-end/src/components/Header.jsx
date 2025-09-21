import {
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineBell,
  HiX,
  HiOutlineLogin,
  HiOutlineLogout,
} from "react-icons/hi";
import { useState, useEffect } from "react";
import { useAuth } from "./../contexts/AuthContext";
import { useTodo } from "./../contexts/TodoContext";
import {OverlayCard,ProfileCard} from "./index";

const Header = ({onToggle, onAuthModalOpen, onSearchChange}) => {
  const iconStyle =
    "text-gray-500 hover:text-gray-200 text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded cursor-pointer";

  const { isAuthenticated, user, logout } = useAuth();
  const { todos, stats } = useTodo();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState([]);
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchValue("");
      if (onSearchChange) {
        onSearchChange("");
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showNotificationCard, setShowNotificationCard] = useState(false);

  // Generate notifications based on todos
  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const newNotifications = [];

      // Check for overdue todos
      const overdueTodos = todos.filter(todo => 
        todo.dueDate && 
        new Date(todo.dueDate) < now && 
        !todo.isCompleted && 
        !todo.isArchieved
      );

      if (overdueTodos.length > 0) {
        newNotifications.push({
          id: 'overdue',
          type: 'warning',
          message: `${overdueTodos.length} todo(s) overdue`,
          icon: '⚠️'
        });
      }

      // Check for todos due today
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const todayTodos = todos.filter(todo => 
        todo.dueDate && 
        new Date(todo.dueDate) <= today && 
        new Date(todo.dueDate) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()) &&
        !todo.isCompleted && 
        !todo.isArchieved
      );

      if (todayTodos.length > 0) {
        newNotifications.push({
          id: 'today',
          type: 'info',
          message: `${todayTodos.length} todo(s) due today`,
          icon: '📅'
        });
      }

      // Check for completed todos (celebration)
      const completedToday = todos.filter(todo => 
        todo.isCompleted && 
        todo.updatedAt &&
        new Date(todo.updatedAt).toDateString() === now.toDateString()
      );

      if (completedToday.length > 0) {
        newNotifications.push({
          id: 'completed',
          type: 'success',
          message: `${completedToday.length} todo(s) completed today!`,
          icon: '🎉'
        });
      }

      // General stats notification
      if (stats && stats.pending > 5) {
        newNotifications.push({
          id: 'high-pending',
          type: 'info',
          message: `${stats.pending} pending todos - stay focused!`,
          icon: '💪'
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [todos, stats]);

  const handleLogout = async () => {
    await logout();
    setShowProfileCard(false);
  };

  return (
    <>
      <header className="shadow-sm w-full">
        <nav className="flex items-center justify-between p-2 max-w-7xl mx-auto">
          {/* Left Section: Menu, Logo, and App Name */}
          <div className="flex items-center">
            <button aria-label="Open menu" className={iconStyle} onClick={onToggle}>
              <HiOutlineMenu />
            </button>

            <img src="/todos.svg" alt="LOGO" className="h-12 w-20 object-contain" />

            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Todos</h1>
            </div>
          </div>

          {/* Right Section: Search, Notifications, and Avatar */}
          <div className="flex items-center gap-5">
            {isSearchOpen && (
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search todos..."
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300 transition-all duration-200 text-white w-28 sm:w-40 md:w-64 z-2 bg-black"
              />
            )}
            <button
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Close Search" : "Open Search"}
              className={iconStyle}
            >
              {isSearchOpen ? <HiX /> : <HiOutlineSearch />}
            </button>
            <div className="relative">
              <button
                aria-label="View notifications"
                className={iconStyle}
                onClick={() => {
                  setShowNotificationCard(!showNotificationCard);
                  setShowProfileCard(false);
                }}
              >
                <HiOutlineBell />
              </button>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            
            {isAuthenticated ? (
              <div
                className="w-8 h-8 rounded-full cursor-pointer overflow-hidden"
                onClick={() => {
                  setShowProfileCard(!showProfileCard);
                  setShowNotificationCard(false);
                }}
                aria-label="User avatar"
              >
                {user?.avatar && user.avatar.trim() !== "" ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            ) : (
              <button
                aria-label="Login"
                className={iconStyle}
                onClick={onAuthModalOpen}
              >
                <HiOutlineLogin />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Overlay for Notifications */}
      {showNotificationCard && (
        <OverlayCard
          onClose={() => setShowNotificationCard(false)}
          position={{ top: 65, right: 10 }}
        >
          <div className="p-4">
            <h3 className="font-semibold text-white mb-3">Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className={`text-sm p-2 rounded ${
                      notification.type === 'warning' ? 'bg-red-900/30 text-red-300' :
                      notification.type === 'info' ? 'bg-blue-900/30 text-blue-300' :
                      'bg-green-900/30 text-green-300'
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
        </OverlayCard>
      )}

      {/* Overlay for Profile */}
      {showProfileCard && isAuthenticated && (
        <OverlayCard
          onClose={() => setShowProfileCard(false)}
          position={{ top: 65, right: 10 }}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              {user?.avatar && user.avatar.trim() !== "" ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">{user?.fullName || "User"}</h3>
                <p className="text-sm text-gray-300">@{user?.username || "username"}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <HiOutlineLogout />
                Logout
              </button>
            </div>
          </div>
        </OverlayCard>
      )}
    </>
  );
};

export default Header;
