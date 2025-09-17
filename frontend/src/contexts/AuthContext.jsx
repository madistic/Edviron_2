import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import * as jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const getDecodedToken = (token) => {
  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = getDecodedToken(token);
  if (decoded) {
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
  return true;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to check localStorage for user data and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && !isTokenExpired(token)) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false); // Once the check is complete, stop the loading
  }, []);

  // Sync across tabs using storage event listener
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData && !isTokenExpired(token)) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Login method
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    }
  };

  // Registration method
  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // Context value passed to components
  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
