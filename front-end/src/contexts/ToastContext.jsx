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
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 z-[1000]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
        max-w-sm w-full px-4 py-3 rounded-lg shadow-lg transition-all duration-300
        ${
          toast.type === "success"
            ? "bg-green-600 text-white border-l-4 border-green-400"
            : toast.type === "error"
            ? "bg-red-600 text-white border-l-4 border-red-400"
            : toast.type === "info"
            ? "bg-blue-500 text-white border-l-4 border-blue-300"
            : toast.type === "warning"
            ? "bg-yellow-500 text-black border-l-4 border-yellow-300"
            : ""
        }
      `}
          >
            {toast.title && (
              <div className="font-semibold mb-1">{toast.title}</div>
            )}
            <div className="text-sm">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
