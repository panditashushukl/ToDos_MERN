import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Sidebar, TodoCard, ProfileEditCard } from "./components";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/Auth/AuthModal";
import { useState } from "react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <div className="min-h-screen">
      <Header
        onToggle={toggleSidebar}
        onAuthModalOpen={openAuthModal}
        isHome={isHome}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
              <TodoCard />
            </>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <ProfileEditCard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
