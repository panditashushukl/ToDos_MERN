import { useAuth } from "./../../contexts/AuthContext";
import { apiService } from "./../../services/api";
import { FaEdit, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BlueButton } from "./../index";
import { useState } from "react";

const ProfileCard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDeletingUser, setIsDeletingUser] = useState(false);

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
            className="absolute top-2 left-4 group cursor-pointer"
            to="/edit-profile"
          >
            <FaEdit className="text-indigo-400 hover:text-indigo-200 text-lg" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Edit Profile
            </div>
          </Link>

          {/* Logout Button */}
          <div
            className="absolute top-2 right-4 group cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-red-400 hover:text-red-200 text-lg" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Logout
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="mt-6">
            <BlueButton
              onClick={async () => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete your account?\n\nAll your data will be permanently deleted and cannot be recovered."
                );
                if (!confirmed) return;

                try {
                  setIsDeletingUser(true);
                  await apiService.deleteUser();
                  setIsDeletingUser(false);
                  handleLogout();
                } catch (error) {
                  setIsDeletingUser(false);
                  alert(error.message || "Failed to delete user account.");
                }
              }}
              className="w-full flex items-center justify-center gap-2 border border-red-500 hover:bg-red-500"
            >
              <FaTrashAlt />
              {isDeletingUser ? "Deleting User..." : "Delete User"}
            </BlueButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
