import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserRaw = localStorage.getItem("user");

    try {
      const savedUser =
        savedUserRaw && savedUserRaw !== "undefined"
          ? JSON.parse(savedUserRaw)
          : null;

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // Login method to update state and localStorage
  const login = (token, userData) => {
    if (!token || !userData || userData === "undefined") {
      console.warn("Invalid login payload", token, userData);
      return;
    }

    console.log("✅ Logging in with:", userData);
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("studentStatus", userData.student_status);
  };

  // Logout method
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("studentStatus");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
