import { Routes, Route, useLocation } from "react-router-dom";
import {
  Header,
  Sidebar,
  TodoCard,
  ProfileEditCard,
  ProtectedRoute,
  AuthModal,
  LoadingCard,
} from "./../components";
import { useState } from "react";
import NotFound from "./NotFound";
import { useAuth } from "./../contexts/AuthContext";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isLoading } = useAuth();

  const location = useLocation();
  const isHome = location.pathname === "/";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  if (isLoading) {
    return (
      <LoadingCard>
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
        </div>
      </LoadingCard>
    );
  }

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

        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
