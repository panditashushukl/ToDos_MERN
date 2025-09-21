import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { TodoProvider } from "./contexts/TodoContext";
import AuthModal from "./components/Auth/AuthModal";
import { Header, TodoCard , Sidebar} from "./components/index";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarFilter, setSidebarFilter] = useState("all");
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (filter) => {
    setSidebarFilter(filter);
  };

  return (
    <AuthProvider>
      <TodoProvider>
        <div className="min-h-screen">
          <Header 
            onToggle={toggleSidebar} 
            onAuthModalOpen={openAuthModal}
            onSearchChange={handleSearchChange}
          />
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          <TodoCard 
            searchTerm={searchTerm}
            sidebarFilter={sidebarFilter}
          />
          
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={closeAuthModal}
          />
        </div>
      </TodoProvider>
    </AuthProvider>
  );
}
