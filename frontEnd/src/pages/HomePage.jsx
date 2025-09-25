import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

function HomePage() {
  const {selectUser,setSelectUser} = useContext(ChatContext) // ✅ should be null, not false

  return (
    <div
      className="
         w-full  h-screen sm:px-[10%] sm:py-[6%] 
        bg-gradient-to-br from-gray-400 via-gray-700 to-black 
        flex items-center justify-center
      "
    >
      {/* Inner container */}
      <div
        className={`
          grid grid-cols-1 h-screen w-full min-h-[500px]
          rounded-2xl shadow-lg overflow-hidden
          ${selectUser ? 'md:grid-cols-[1fr_1.5fr_1fr]' : 'md:grid-cols-2'}
          bg-white/5 backdrop-blur-md border border-gray-700
        `}
      >
        <Sidebar  />
        <ChatContainer  />
        {selectUser && (
          <RightSidebar selectUser={selectUser} setSelectUser={setSelectUser} />
        )}
      </div>
    </div>
  )
}

export default HomePage
