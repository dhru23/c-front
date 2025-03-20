import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat, fetchChats } from '../redux/chatsSlice';
import { getChatName, getChatPhoto, timeSince } from '../utils/logics';
import NoContacts from './ui/NoContacts';

const aDay = 24 * 60 * 60 * 1000;

function Contacts({ setShowChat }) {
  const { chats, activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // Add a loading or error state check
  if (!chats) {
    return <div>Loading chats...</div>;
  }

  const handleContactClick = (chat) => {
    dispatch(setActiveChat(chat));
    // Only set showChat to true on mobile
    if (window.innerWidth < 1024) {
      setShowChat(true);
    }
  };

  return (
    <div className="flex flex-col -space-y-1 overflow-y-scroll scrollbar-hide h-[87vh] pb-10">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            onClick={() => handleContactClick(chat)}
            key={chat._id}
            className={`flex items-center justify-between sm:gap-x-1 md:gap-x-1 mt-5 ${
              activeChat?._id === chat._id ? 'bg-[#fafafa]' : 'bg-[#fff]'
            } cursor-pointer py-4 px-2`}
          >
            <div className="flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3">
              <img
                className="w-12 h-12 sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover"
                src={getChatPhoto(chat, activeUser)}
                alt="Chat avatar"
              />
              <div>
                <h5 className="text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold">
                  {getChatName(chat, activeUser)}
                </h5>
                <p className="text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c]">
                  {chat.latestMessage?.message
                    ? chat.latestMessage.message.length > 30
                      ? chat.latestMessage.message.slice(0, 30) + '...'
                      : chat.latestMessage.message
                    : 'No messages yet'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-y-[8px]">
              <p className="text-[12.4px] sm:text-[12px] font-normal text-[#b0b2b3] tracking-wide">
                {timeSince(new Date(Date.parse(chat.updatedAt) - aDay))}
              </p>
            </div>
          </div>
        ))
      ) : (
        <NoContacts />
      )}
    </div>
  );
}

export default Contacts;