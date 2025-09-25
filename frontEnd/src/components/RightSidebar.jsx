import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

function RightSidebar() {
  const { selectUser, messages } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);
  const [msgImages, setMessageImages] = useState([]);

  // Extract images from messages
  useEffect(() => {
    const imgs = messages.filter((msg) => msg.image).map((msg) => msg.image);
    setMessageImages(imgs);
  }, [messages]);

  if (!selectUser) return null;

  return (
    <div className="w-[320px] h-full bg-dark-900 border-l border-dark-700 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center p-6 border-b border-dark-700 bg-dark-800">
        <img
          src={selectUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-dark-600 mb-3"
        />
        <h1 className="text-lg font-semibold text-gray-100">
          {selectUser.fullName}
        </h1>
        <p className="text-sm text-gray-400">
          {selectUser.bio || "No bio available"}
        </p>
      </div>

      {/* Media Section */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-dark-900">
        <p className="text-gray-300 text-sm font-medium mb-3">Media</p>
        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {msgImages.map((url, idx) => (
              <div
                key={idx}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={url}
                  alt="media"
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No media shared yet</p>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-5 border-t border-dark-700 bg-dark-800">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default RightSidebar;
