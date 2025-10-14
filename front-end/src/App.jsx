import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { TodoProvider } from "./contexts/TodoContext";
import AuthModal from "./components/Auth/AuthModal";
import { Header, TodoCard , Sidebar} from "./components/index";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthProvider>
      <TodoProvider>
        <div className="min-h-screen">
          <Header 
            onToggle={toggleSidebar} 
            onAuthModalOpen={openAuthModal}
          />
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
          />
          <TodoCard />
          
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={closeAuthModal}
          />
        </div>
      </TodoProvider>
    </AuthProvider>
  );
}
