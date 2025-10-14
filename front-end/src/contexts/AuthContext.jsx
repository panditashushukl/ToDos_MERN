import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  refreshToken: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Verify token with backend
          const response = await fetch("/api/v1/users/current-user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setIsAuthenticated(true);
          } else {
            // Token invalid, try refresh
            await refreshToken();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data = null;

      // Check if response has a body before trying to parse JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        const { user: userData, accessToken, refreshToken } = data?.data || {};

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } else {
        const errorMsg =
          data?.message || `Login failed with status ${response.status}`;
        console.error("Login failed:", {
          status: response.status,
          message: errorMsg,
          endpoint: "/api/v1/users/login",
        });

        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Network or unexpected error during login:", {
        error: error.message || error,
        endpoint: "/api/v1/users/login",
      });

      return { success: false, error: "Network error" };
    }
  };

  const register = async (fullName, username, password, avatar) => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const loginResult = await login(username, password);
        return loginResult;
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) {
        throw new Error("No refresh token");
      }

      const response = await fetch("/api/v1/users/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await response.json();

      if (response.ok) {
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        return true;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
