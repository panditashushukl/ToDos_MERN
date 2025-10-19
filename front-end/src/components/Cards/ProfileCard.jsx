import { useAuth } from "./../../contexts/AuthContext";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const getAvatarDisplay = () => {
    if (isAuthenticated && user) {
      if (user.avatar && user.avatar.trim() !== "") {
        return (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-18 h-18 rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
          />
        );
      } else {
        const firstLetter = user.fullName
          ? user.fullName.charAt(0).toUpperCase()
          : "U";
        return (
          <div className="w-18 h-18 rounded-full mx-auto mb-4 border-4 border-indigo-500 bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{firstLetter}</span>
          </div>
        );
      }
    } else {
      return (
        <div className="w-18 h-18 rounded-full mx-auto mb-4 border-4 border-indigo-500 bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">G</span>
        </div>
      );
    }
  };

  const getUserName = () => {
    if (isAuthenticated && user) {
      return user.fullName || "User";
    }
    return "Guest User";
  };

  const getUsername = () => {
    if (isAuthenticated && user) {
      return `@${user.username || "username"}`;
    }
    return "@guest";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative max-w-xs mx-auto shadow-xl rounded-2xl p-6 border border-gray-700 text-center mb-1 bg-gray-900">
      {getAvatarDisplay()}
      <h2 className="text-xl font-semibold text-white mb-1">{getUserName()}</h2>
      <p className="text-sm text-indigo-300 tracking-wide">{getUsername()}</p>

      {/* Bottom buttons */}
      {isAuthenticated && user && (
        <>
          <Link
            className="absolute bottom-2 left-4 group cursor-pointer"
            to="/edit-profile"
          >
            <FaEdit className="text-indigo-400 hover:text-indigo-200 text-lg" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Edit Profile
            </div>
          </Link>

          <div
            className="absolute bottom-2 right-4 group cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-red-400 hover:text-red-200 text-lg" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Logout
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
