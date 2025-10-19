import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TodoProvider } from "./contexts/TodoContext";
import { Layout } from "./pages/Layout"
export default function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <Router>
          <Layout />
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
}
