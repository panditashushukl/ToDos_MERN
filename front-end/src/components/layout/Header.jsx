import { HiOutlineMenu, HiOutlineBell, HiOutlineLogin } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./../../contexts/AuthContext";
import { OverlayCard, ProfileCard, NotificationCard } from "./../index";

const Header = ({ onToggle, onAuthModalOpen, isHome }) => {
  const iconStyle =
    "text-gray-500 hover:text-gray-200 text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded cursor-pointer";

  const { isAuthenticated, user } = useAuth();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showNotificationCard, setShowNotificationCard] = useState(false);
  const [notifications, setNotifications] = useState([]);

  return (
    <>
      <header className="shadow-sm w-full">
        <nav className="flex items-center justify-between p-2 max-w-7xl mx-auto">
          {/* Left Section: Menu, Logo, and App Name */}
          <div className="flex items-center">
            {isHome && (
              <button
                aria-label="Open menu"
                className={iconStyle}
                onClick={onToggle}
              >
                <HiOutlineMenu />
              </button>
            )}

            <img
              src="/todos.svg"
              alt="LOGO"
              className="h-12 w-20 object-contain"
            />

            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Todos</h1>
            </div>
          </div>

          {/* Right Section: Search, Notifications, and Avatar */}
          <div className="flex items-center gap-5">
            {isHome && (
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
            )}

            {!isHome && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </Link>
            )}

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
                    {user?.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
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
          <NotificationCard
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </OverlayCard>
      )}

      {/* Overlay for Profile */}
      {showProfileCard && isAuthenticated && (
        <OverlayCard
          onClose={() => setShowProfileCard(false)}
          position={{ top: 65, right: 10 }}
        >
          <ProfileCard />
        </OverlayCard>
      )}
    </>
  );
};

export default Header;
