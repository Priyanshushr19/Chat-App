import React, { useContext, useEffect, useRef, useState } from "react"
import assets from "../assets/assets"
import { ChatContext } from "../../context/ChatContext"
import { AuthContext } from "../../context/AuthContext"
import toast from "react-hot-toast"

function ChatContainer() {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const {
    messages,
    selectUser,
    getMessages,
    sendMessage,
    setSelectUser,
  } = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState("")

  const handleSendMsg = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return
    try {
      await sendMessage({ text: input.trim() })
      setInput("")
    } catch (error) {
      toast.error("Failed to send message")
    }
  }

  const handleSendImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Select image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await sendMessage({ image: reader.result });
        e.target.value = "";
      } catch (error) {
        toast.error("Failed to send image");
      }
    };
    reader.onerror = () => {
      toast.error("Error reading image file");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectUser?._id) {
      getMessages(selectUser._id)
    }
  }, [selectUser, getMessages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    if (selectUser) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [selectUser])

  const handleScrollToBottom = () => {
    scrollToBottom()
  }

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-gray-600 bg-gray-700">
        <p className="text-lg font-medium">Please log in to chat</p>
      </div>
    )
  }

  return selectUser ? (
    <div className="flex flex-col h-screen w-full bg-gray-700">
      {/* -------- Header -------- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600 bg-gray-600 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={selectUser.profilePic || assets.avatar_icon}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-white">{selectUser.fullName}</p>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectUser._id) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className={`text-xs ${onlineUsers.includes(selectUser._id) ? 'text-green-300' : 'text-gray-300'}`}>
                {onlineUsers.includes(selectUser._id) ? 'online' : 'offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectUser(null)}
            className="p-2 rounded-full hover:bg-gray-500 transition-colors duration-200"
          >
            <img
              src={assets.arrow_icon}
              className="w-5 h-5 filter invert"
              alt="back"
            />
          </button>
          <button 
            onClick={handleScrollToBottom}
            className="p-2 rounded-full hover:bg-gray-500 transition-colors duration-200"
            title="Scroll to bottom"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* -------- Chat Area -------- */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-700 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
      >
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <img src={assets.logo_icon} className="w-16 h-16 mb-4 opacity-60" alt="No messages" />
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation with {selectUser.fullName}</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isSender = msg.senderId === authUser._id
              return (
                <div
                  key={msg._id || i}
                  className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  {!isSender && (
                    <img
                      src={selectUser.profilePic || assets.avatar_icon}
                      alt="user"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}

                  <div className={`max-w-md rounded-2xl p-3 shadow-md ${isSender 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-600 text-gray-100 rounded-bl-none border border-gray-500'
                  }`}>
                    {msg.text && (
                      <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                    )}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="sent"
                        className="mt-2 rounded-xl max-w-[280px] max-h-[280px] object-cover shadow-md"
                      />
                    )}
                    <p className={`text-xs mt-2 ${isSender ? 'text-purple-200' : 'text-gray-300'} text-right`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'Just now'}
                    </p>
                  </div>

                  {isSender && (
                    <img
                      src={authUser.profilePic || assets.avatar_icon}
                      alt="me"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* -------- Input Bar -------- */}
      <form
        onSubmit={handleSendMsg}
        className="p-4 border-t border-gray-600 bg-gray-600 shadow-md"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="relative">
            <input
              onChange={handleSendImg}
              type="file"
              id="image"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              className="hidden"
            />
            <label 
              htmlFor="image" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-400 transition-colors duration-200 cursor-pointer group"
            >
              <img
                src={assets.gallery_icon}
                alt="upload"
                className="w-5 h-5 filter invert group-hover:scale-110 transition-transform duration-200"
              />
            </label>
          </div>

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-500 text-white placeholder-gray-300 
                       border border-gray-400 focus:outline-none focus:border-purple-400 
                       focus:ring-2 focus:ring-purple-400/30 transition-all duration-200
                       shadow-inner"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 shadow-md
                      ${input.trim() 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105' 
                        : 'bg-gray-400 cursor-not-allowed opacity-50'
                      }`}
          >
            <img 
              src={assets.send_button} 
              alt="send" 
              className="w-5 h-5 filter invert" 
            />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-gray-700 via-purple-700 to-gray-700">
      <div className="bg-gray-600/60 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-gray-500/50">
        <img 
          src={assets.logo_icon} 
          className="w-20 h-20 mb-6 mx-auto filter invert animate-pulse" 
          alt="Chat App Logo" 
        />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
          Welcome to ChatApp
        </h1>
        <p className="text-lg text-gray-200 mb-2">Select a friend to start chatting</p>
        <p className="text-gray-300 text-sm">Real-time messaging • File sharing • Secure & Private</p>
        
        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex items-center text-green-300 text-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
            Online: {onlineUsers.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
