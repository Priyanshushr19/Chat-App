import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // ✅ default

// Configure axios globally
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; // ✅ send credentials (token/cookies)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // 🔹 Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ attach token
      });
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Login / Signup
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["Authorization"] = null;

    if (socket) socket.disconnect();
    toast.success("Logged Out Successfully");
  };

  // 🔹 Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Connect to socket server
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // 🔹 Run once on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ axios, authUser, onlineUsers, socket, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
