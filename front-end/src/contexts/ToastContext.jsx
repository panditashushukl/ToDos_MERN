import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = "info", message, title = "", duration = 3000 }) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, message, title }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
      animate-in slide-in-from-top fade-in duration-300
      max-w-sm w-full 
      px-4 py-3 rounded-lg shadow-lg transition-all
      ${toast.type === "success" ? "bg-green-600 text-white" : ""}
      ${toast.type === "error" ? "bg-red-600 text-white" : ""}
      ${toast.type === "info" ? "bg-blue-500 text-white" : ""}
      ${toast.type === "warning" ? "bg-yellow-500 text-black" : ""}
    `}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
