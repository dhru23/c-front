import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth';
import { setActiveUser } from '../redux/activeUserSlice';
import { RiNotificationBadgeFill } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { BiNotification } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { setShowNotifications, setShowProfile } from '../redux/profileSlice';
import Chat from './Chat';
import Profile from "../components/Profile";
import { acessCreate } from "../apis/chat.js";
import "./home.css";
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import { getSender } from '../utils/logics';
import { setActiveChat } from '../redux/chatsSlice';
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

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };

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
      const user = {
        id: data?.user?._id,
        email: data?.user?.email,
        profilePic: data?.user?.profilePic,
        bio: data?.user?.bio,
        name: data?.user?.name
      };
      dispatch(setActiveUser(user));
    };
    isValid();
  }, [dispatch, activeUser]);

  return (
    <div className="bg-[#282C35] scrollbar-hide z-10 h-[100vh] w-full lg:w-[90%] lg:mx-auto overflow-y-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar (Contacts, Search, Notifications) */}
        {!showProfile ? (
          <div className={`flex flex-col w-full lg:w-[360px] h-[100vh] lg:h-[98.6vh] bg-[#ffff] relative ${showChat ? 'hidden lg:flex' : 'flex'}`}>
            {/* Header */}
            <div className="h-[61px] px-2 sm:px-4">
              <div className="flex items-center justify-between">
                <a className="flex items-center h-[61px]" href="/">
                  <h3 className="text-lg sm:text-xl lg:text-[20px] text-[#1f2228] font-body font-extrabold tracking-wider">
                    Messages
                  </h3>
                </a>
                <div className="flex items-center gap-x-2 sm:gap-x-3">
                  <button onClick={() => dispatch(setShowNotifications(!showNotifications))} className="relative">
                    <NotificationBadge
                      count={notifications.length}
                      effect={Effect.SCALE}
                      style={{ width: "12px", height: "12px", fontSize: "8px", padding: "3px 1px 1px 1px" }}
                    />
                    {showNotifications ? (
                      <RiNotificationBadgeFill className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[25px] lg:h-[25px] text-[#319268]" />
                    ) : (
                      <BiNotification className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[25px] lg:h-[25px] text-[#319268]" />
                    )}
                  </button>
                  {/* Notifications Dropdown */}
                  <div className={`${showNotifications ? "absolute top-12 right-2 sm:right-4 w-52 sm:w-60 bg-[#fafafa] px-3 py-2 shadow-xl z-10 max-h-[200px] overflow-y-auto scrollbar-hide" : "hidden"}`}>
                    <div className="text-xs sm:text-[13px]">
                      {!notifications.length && "No new messages"}
                    </div>
                    {notifications.map((e, index) => (
                      <div
                        onClick={() => {
                          dispatch(setActiveChat(e.chatId));
                          dispatch(setNotifications(notifications.filter((data) => data !== e)));
                          // Only set showChat to true on mobile
                          if (window.innerWidth < 1024) {
                            setShowChat(true);
                          }
                        }}
                        key={index}
                        className="text-xs sm:text-[12.5px] text-black px-2 py-1 cursor-pointer hover:bg-gray-100"
                      >
                        {e.chatId.isGroup ? `New Message in ${e.chatId.chatName}` : `New Message from ${getSender(activeUser, e.chatId.users)}`}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => dispatch(setShowProfile(true))} className="flex items-center gap-x-1">
                    <img className="w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] rounded-full" src={activeUser?.profilePic} alt="" />
                    <IoIosArrowDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[14px] lg:h-[14px] text-[#616c76]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar and Contacts */}
            <div className="flex-1 overflow-y-auto">
              <div className="relative pt-4 sm:pt-6 px-2 sm:px-4">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    onChange={handleSearch}
                    className="w-full bg-[#f6f6f6] text-[#111b21] tracking-wider pl-8 sm:pl-9 py-2 sm:py-[8px] rounded-[9px] outline-0 text-sm sm:text-base"
                    type="text"
                    name="search"
                    placeholder="Search"
                  />
                </form>
                <div className="absolute top-6 sm:top-7 left-4 sm:left-5">
                  <BsSearch className="w-4 h-4 sm:w-5 sm:h-5 text-[#c4c4c5]" />
                </div>
                <Group />
                <div
                  style={{ display: search ? "" : "none" }}
                  className="absolute z-10 w-full left-0 top-16 sm:top-[70px] bg-[#fff] flex flex-col gap-y-2 sm:gap-y-3 pt-2 sm:pt-3 px-2 sm:px-4 h-[calc(100vh-70px)] overflow-y-auto"
                >
                  <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />
                </div>
              </div>
              <Contacts setShowChat={setShowChat} />
            </div>
          </div>
        ) : (
          <Profile className="w-full lg:w-[360px] h-[100vh] bg-[#fafafa] shadow-xl relative" />
        )}
        
        {/* Always render Chat on larger screens, and on mobile when showChat is true */}
        <div className={`${showChat ? 'flex' : 'hidden lg:flex'} w-full lg:w-[calc(100%-360px)] h-[100vh] bg-[#fafafa]`}>
          <Chat className="chat-page relative lg:w-[100%] h-[100vh] bg-[#fafafa]" setShowChat={setShowChat} />
        </div>
      </div>
    </div>
  );
}

export default Home;