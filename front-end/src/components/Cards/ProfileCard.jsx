import { useAuth } from "../../contexts/AuthContext";

const ProfileCard = () => {
  const { user, isAuthenticated } = useAuth();

  const getAvatarDisplay = () => {
    if (isAuthenticated && user) {
      // If user has an avatar URL, display it
      if (user.avatar && user.avatar.trim() !== "") {
        return (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-18 h-18 rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
          />
        );
      } else {
        // If no avatar, show first letter of name
        const firstLetter = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";
        return (
          <div className="w-18 h-18 rounded-full mx-auto mb-4 border-4 border-indigo-500 bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{firstLetter}</span>
          </div>
        );
      }
    } else {
      // Guest mode - show generic avatar
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

  return (
    <>
      <div className="max-w-xs mx-auto shadow-xl rounded-2xl p-6 border border-gray-700 text-center mb-1">
        {getAvatarDisplay()}
        <h2 className="text-xl font-semibold text-white mb-1">{getUserName()}</h2>
        <p className="text-sm text-indigo-300 tracking-wide">{getUsername()}</p>
      </div>
    </>
  );
};

export default ProfileCard;
