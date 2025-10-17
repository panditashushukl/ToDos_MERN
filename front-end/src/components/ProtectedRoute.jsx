import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // While checking auth, show a loading screen (or spinner)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users
    return <Navigate to="/" replace />;
  }

  // ✅ Authenticated, render children
  return children;
}
