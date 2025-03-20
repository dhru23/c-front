import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat, fetchChats } from '../redux/chatsSlice';
import { getChatName, getChatPhoto, timeSince } from '../utils/logics';

const aDay = 24 * 60 * 60 * 1000;

function Contacts(props) {
  const { chats, activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatClick = (chat) => {
    console.log('Chat clicked in Contacts:', chat); // Debug log
    dispatch(setActiveChat(chat));
    if (props.setShowChat && window.innerWidth < 1024) {
      console.log('Setting showChat to true'); // Debug log
      props.setShowChat(true);
    }
  };

  if (!chats) {
    return (
      <div className="flex items-center justify-center h-[87vh] text-[#00FFFF] text-xs sm:text-sm" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[87vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFFF] scrollbar-track-[#1C2526] bg-[#1C2526] p-1 sm:p-2">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            onClick={() => handleChatClick(chat)}
            key={chat._id}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg mb-2 cursor-pointer transition-all ${activeChat?._id === chat._id ? 'bg-[#00B7EB] shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-[#1C2526] hover:bg-[#00B7EB] hover:shadow-[0_0_5px_rgba(0,255,255,0.3)]'}`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#00FFFF]"
                src={getChatPhoto(chat, activeUser)}
                alt="Chat avatar"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=User')}
              />
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-[#00FFFF]" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
                  {getChatName(chat, activeUser)}
                </h5>
                <p className="text-[10px] sm:text-xs text-[#00FFFF] truncate max-w-[120px] sm:max-w-[150px] lg:max-w-[200px]" style={{ textShadow: "0 0 3px rgba(0, 255, 255, 0.4)" }}>
                  {chat.latestMessage?.message
                    ? (chat.latestMessage.message.length > 30
                        ? chat.latestMessage.message.slice(0, 30) + '...'
                        : chat.latestMessage.message)
                    : 'No messages yet'}
                </p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-[#00FFFF]" style={{ textShadow: "0 0 3px rgba(0, 255, 255, 0.4)" }}>
              {timeSince(new Date(Date.parse(chat.updatedAt) - aDay))}
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-[#00FFFF]">
          <p className="text-sm sm:text-lg font-semibold" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>No Contacts Yet</p>
        </div>
      )}
    </div>
  );
}

export default Contacts;