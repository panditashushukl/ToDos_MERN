import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TodoProvider } from "./contexts/TodoContext";
import { Layout } from "./pages/Layout";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TodoProvider>
          <Router>
            <Layout />
          </Router>
        </TodoProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
