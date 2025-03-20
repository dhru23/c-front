import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth';
import { setActiveUser } from '../redux/activeUserSlice';
import { RiNotificationBadgeFill } from "react-icons/ri";
import { BiNotification } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { setShowNotifications, setShowProfile } from '../redux/profileSlice';
import Chat from './Chat';
import Profile from "../components/Profile";
import { acessCreate } from "../apis/chat.js";
import { fetchChats, setNotifications, setActiveChat } from '../redux/chatsSlice';
import { getSender } from '../utils/logics';
import Group from '../components/Group';
import Contacts from '../components/Contacts';
import { Effect } from "react-notification-badge";
import NotificationBadge from 'react-notification-badge';
import Search from '../components/group/Search';

function Home() {
  const dispatch = useDispatch();
  const { showProfile, showNotifications } = useSelector((state) => state.profile);
  const { notifications } = useSelector((state) => state.chats);
  const { activeUser } = useSelector((state) => state);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showChat, setShowChat] = useState(false); // State to toggle between contacts and chat on mobile

  const handleSearch = async (e) => setSearch(e.target.value);

  const handleClick = async (e) => {
    await acessCreate({ userId: e._id });
    dispatch(fetchChats());
    setSearch("");
  };

  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true);
      const { data } = await searchUsers(search);
      setSearchResults(data);
      setIsLoading(false);
    };
    searchChange();
  }, [search]);

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      console.log('Valid User API Response:', data); // Debug log
      const user = {
        id: data?.user?._id,
        email: data?.user?.email,
        profilePic: data?.user?.profilePic || 'https://via.placeholder.com/40?text=User',
        bio: data?.user?.bio,
        name: data?.user?.name,
      };
      dispatch(setActiveUser(user));
    };
    isValid();
  }, [dispatch, activeUser]);

  // Debug log for showChat state
  useEffect(() => {
    console.log('Home - showChat state:', showChat);
  }, [showChat]);

  return (
    <div className="h-screen flex bg-[#1C2526] overflow-hidden">
      <div className="flex w-full h-full">
        {/* Sidebar */}
        {!showProfile ? (
          <div className={`flex flex-col w-full md:w-96 h-full bg-[#1C2526] shadow-[0_0_10px_rgba(0,255,255,0.3)] ${showChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 bg-[#1C2526]">
              <h3 className="text-base sm:text-lg font-bold text-[#00FFFF]" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}>
                Q6Fold Chat
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => dispatch(setShowNotifications(!showNotifications))} className="relative">
                  <NotificationBadge
                    count={notifications.length}
                    effect={Effect.SCALE}
                    style={{ width: "12px", height: "12px", fontSize: "8px", padding: "3px 1px 1px 1px", sm: { width: "15px", height: "15px", fontSize: "9px", padding: "4px 2px 2px 2px" }, backgroundColor: "#00FFFF", color: "#1C2526" }}
                  />
                  {showNotifications ? <RiNotificationBadgeFill className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FFFF]" /> : <BiNotification className="w-5 h-5 sm:w-6 sm:h-6 text-[#00FFFF]" />}
                  {showNotifications && (
                    <div className="absolute top-8 sm:top-10 z-10 right-0 w-52 sm:w-64 bg-[#1C2526] text-[#00FFFF] p-2 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.3)] max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFFF]">
                      {!notifications.length ? (
                        <p className="text-xs sm:text-sm text-[#00FFFF]" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>No new messages</p>
                      ) : (
                        notifications.map((e, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              console.log('Notification clicked:', e.chatId); // Debug log
                              dispatch(setActiveChat(e.chatId));
                              dispatch(setNotifications(notifications.filter((data) => data !== e)));
                              if (window.innerWidth < 1024) {
                                setShowChat(true);
                              }
                            }}
                            className="text-xs sm:text-sm text-[#00FFFF] hover:bg-[#00B7EB] p-1 cursor-pointer rounded"
                            style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}
                          >
                            {e.chatId.isGroup ? `New Message in ${e.chatId.chatName}` : `New Message from ${getSender(activeUser, e.chatId.users)}`}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </button>
                <button onClick={() => dispatch(setShowProfile(true))} className="flex items-center gap-1">
                  <img
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#00FFFF]"
                    src={activeUser?.profilePic || 'https://via.placeholder.com/40?text=User'}
                    alt=""
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=User')}
                  />
                  <IoIosArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#00FFFF]" />
                </button>
              </div>
            </div>

            {/* Search & Group */}
            <div className="p-2 sm:p-4 relative">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <input
                  onChange={handleSearch}
                  className="w-full p-2 pl-8 bg-[#1C2526] text-white border border-[#00FFFF] rounded-md focus:border-[#00B7EB] focus:outline-none shadow-[0_0_5px_rgba(0,255,255,0.3)] text-sm sm:text-base"
                  type="text"
                  placeholder="Search"
                />
                <BsSearch className="absolute top-3 left-2 text-[#00FFFF] w-4 h-4 sm:w-5 sm:h-5" />
              </form>
              <Group />
              {search && (
                <div className="absolute top-12 sm:top-16 left-0 w-full bg-[#1C2526] p-2 sm:p-4 z-10 max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFFF]">
                  <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />
                </div>
              )}
            </div>

            {/* Contacts */}
            <Contacts className="flex-1" setShowChat={setShowChat} />
          </div>
        ) : (
          <Profile className="w-full md:w-96 h-full bg-[#1C2526] shadow-[0_0_10px_rgba(0,255,255,0.3)]" />
        )}

        {/* Chat Area */}
        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 h-full`}>
          <Chat className="flex-1 h-full" setShowChat={setShowChat} />
        </div>
      </div>
    </div>
  );
}

export default Home;