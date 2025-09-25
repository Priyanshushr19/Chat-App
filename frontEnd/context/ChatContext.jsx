import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // 🔹 Get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage) => {
      const senderId = String(newMessage.senderId);

      if (selectUser && senderId === String(selectUser._id)) {
        // Chatting with sender → mark as seen
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);

        try {
          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } catch (err) {
          console.error("Mark seen failed:", err);
        }
      } else {
        // Increment unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: prev[senderId] ? prev[senderId] + 1 : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectUser, axios]);

  const value = {
    messages,
    users,
    selectUser,
    getUsers,
    getMessages,
    setMessages,
    sendMessage,
    setSelectUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
