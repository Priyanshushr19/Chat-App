import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

function Sidebar() {
  const {
    users,
    selectUser,
    getUsers,
    setSelectUser,
    unseenMessages,
  } = useContext(ChatContext);

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [input, setInput] = useState("");

  const { logout, onlineUsers } = useContext(AuthContext);

  // ✅ Search filter
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`h-full w-[370px] bg-dark-900 border-r border-dark-700 
        p-4 text-gray-200 flex flex-col
        ${selectUser ? "max-md:hidden" : ""}
      `}
    >
      {/* 🔹 Top Section */}
      <div className="pb-5">
        <div className="flex justify-between items-center relative">
          <img src={assets.logo} alt="logo" className="max-w-32" />

          {/* Menu Icon */}
          <div className="relative">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer hover:opacity-80"
              onClick={() => setShowMenu(!showMenu)}
            />

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-dark-800 rounded-md shadow-lg p-2 text-sm z-50 border border-dark-700">
                <p
                  className="px-2 py-1 hover:bg-dark-700 rounded cursor-pointer"
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                >
                  Edit Profile
                </p>
                <hr className="border-dark-600 my-1" />
                <p
                  className="px-2 py-1 hover:bg-red-600/80 rounded cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Search */}
        <div className="mt-4 flex items-center gap-2 bg-dark-800 px-3 py-2 rounded-md border border-dark-700">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 opacity-70"
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search User"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-200"
          />
        </div>
      </div>

      {/* 🔹 Users List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-dark-900">
        {filteredUsers.map((user, index) => (
          <div
            key={user._id || index}
            onClick={() => setSelectUser(user)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition 
              ${
                selectUser?._id === user._id
                  ? "bg-dark-700 border-l-2 border-purple-500"
                  : "hover:bg-dark-800"
              }
            `}
          >
            {/* Avatar */}
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-dark-600"
            />

            {/* User Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">
                {user.fullName}
              </p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-xs text-green-400">Online</span>
              ) : (
                <span className="text-xs text-gray-200">Offline</span>
              )}
            </div>

            {/* Unseen messages count */}
            {unseenMessages?.[user._id] > 0 && (
              <span className="text-xs bg-purple-600 text-gray-200 px-2 py-0.5 rounded-full">
                {unseenMessages[user._id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
