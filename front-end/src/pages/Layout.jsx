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
import { ToastProvider } from "./../contexts/ToastContext";

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
    return <LoadingCard />;
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
              <ToastProvider>
                <ProfileEditCard />
              </ToastProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
