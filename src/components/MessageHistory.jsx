import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics';

function MessageHistory({ messages, typing }) {
  const activeUser = useSelector((state) => state.activeUser);

  // Debug logs
  console.log('MessageHistory - Messages:', messages);
  console.log('MessageHistory - Active User:', activeUser);

  return (
    <ScrollableFeed
      className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFFF] scrollbar-track-[#1C2526] bg-[#1C2526] p-2 sm:p-4"
    >
      <div className="flex flex-col min-h-full">
        {messages && messages.length > 0 ? (
          messages.map((m, i) => (
            <div
              className={`flex items-end ${m.sender._id === activeUser.id ? 'justify-end' : 'justify-start'} mb-1 sm:mb-2`}
              key={m._id}
            >
              <span
                className={`inline-block text-xs sm:text-sm lg:text-base font-medium tracking-wider px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-[0_0_5px_rgba(0,255,255,0.3)] ${m.sender._id === activeUser.id ? 'bg-[#00FFFF] text-[#1C2526]' : 'bg-[#1C2526] text-[#00FFFF]'}`}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                  marginTop: isSameUser(messages, m, i, activeUser.id) ? 2 : 8,
                  borderRadius: m.sender._id === activeUser.id ? "10px 10px 0 10px" : "10px 10px 10px 0",
                  maxWidth: "65%", // Narrower on mobile
                  sm: { maxWidth: "75%" }, // Wider on larger screens
                }}
              >
                {m.message}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-[#00FFFF] text-xs sm:text-sm" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>No messages yet</p>
        )}
        {/* Spacer to ensure typing indicator has space */}
        <div className="h-12 sm:h-16"></div>
      </div>
    </ScrollableFeed>
  );
}

export default MessageHistory;