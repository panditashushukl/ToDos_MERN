import { HiOutlineX } from "react-icons/hi";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFirefoxBrowser,
  FaInstagram,
  FaHome,
  FaBell,
  FaArchive,
  FaClock,
  FaQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTodo } from "../contexts/TodoContext";
import { useAuth } from "../contexts/AuthContext";
import {ProfileCard} from "./index";

export default function Sidebar({ isOpen, onClose, onSearchChange, onFilterChange }) {
  const { todos, labels, stats } = useTodo();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const navContentStyle =
    "hover:bg-gray-700 p-3 rounded-lg cursor-pointer flex items-center transition-colors duration-200";

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
          timestamp: now
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
          timestamp: now
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
          message: `🎉 ${completedToday.length} todo(s) completed today!`,
          timestamp: now
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [todos]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-72 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ zIndex: 1000 }}
      aria-label="Sidebar Navigation"
    >
      {/* Close button */}
      <button
        aria-label="Close menu"
        className="absolute top-1 right-1 text-3xl text-gray-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        <HiOutlineX />
      </button>

      {/* Scrollable content wrapper */}
      <div className="flex-grow overflow-y-auto">
        <ProfileCard/>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">{stats.completed}</div>
                <div className="text-gray-400">Done</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold">{stats.pending}</div>
                <div className="text-gray-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">{stats.archived}</div>
                <div className="text-gray-400">Archived</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{stats.overdue || 0}</div>
                <div className="text-gray-400">Overdue</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav>
          <ul className="space-y-1 text-gray-300 text-lg">
            <li 
              className={`${navContentStyle} ${selectedFilter === 'all' ? 'bg-gray-700' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <FaHome className="mr-3 text-indigo-400" />
              All Todos
            </li>
            <li 
              className={`${navContentStyle} ${selectedFilter === 'pending' ? 'bg-gray-700' : ''}`}
              onClick={() => handleFilterChange('pending')}
            >
              <FaClock className="mr-3 text-orange-400" />
              Pending ({stats?.pending || 0})
            </li>
            <li 
              className={`${navContentStyle} ${selectedFilter === 'completed' ? 'bg-gray-700' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              <FaBell className="mr-3 text-green-400" />
              Completed ({stats?.completed || 0})
            </li>
            <li 
              className={`${navContentStyle} ${selectedFilter === 'archived' ? 'bg-gray-700' : ''}`}
              onClick={() => handleFilterChange('archived')}
            >
              <FaArchive className="mr-3 text-gray-400" />
              Archived ({stats?.archived || 0})
            </li>
          </ul>
        </nav>

        {/* Labels Section */}
        {labels && labels.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Labels</h3>
            <div className="space-y-1">
              {labels.slice(0, 5).map((label) => (
                <div
                  key={label}
                  className="text-sm text-gray-400 hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-gray-800"
                  onClick={() => handleFilterChange(`label:${label}`)}
                >
                  #{label}
                </div>
              ))}
              {labels.length > 5 && (
                <div className="text-xs text-gray-500">
                  +{labels.length - 5} more labels
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Notifications</h3>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`text-xs p-2 rounded ${
                    notification.type === 'warning' ? 'bg-red-900/30 text-red-300' :
                    notification.type === 'info' ? 'bg-blue-900/30 text-blue-300' :
                    'bg-green-900/30 text-green-300'
                  }`}
                >
                  {notification.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Developer Info + Socials */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center flex-shrink-0">
        <p className="text-sm text-gray-400 mb-4 font-light">
          Developed by Ashutosh Shukla
        </p>
        <div className="flex justify-center space-x-6 text-white">
          <a
            href="https://github.com/panditashushukl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://twitter.com/panditashushukl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            <FaTwitter size={22} />
          </a>
          <a
            href="https://linkedin.com/in/panditashushukl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href="https://www.instagram.com/panditashushukl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition-colors duration-200"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://panditashushukl.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Firefox Browser"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            <FaFirefoxBrowser size={22} />
          </a>
        </div>
      </div>
    </aside>
  );
}

