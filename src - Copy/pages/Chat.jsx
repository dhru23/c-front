import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { fetchMessages, sendMessage } from '../apis/messages';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client";
import "./home.css";
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import { setActiveChat } from '../redux/chatsSlice';

// Default profile picture as a fallback
const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/40?text=User";

const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket, selectedChatCompare;

function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const activeUser = useSelector((state) => state.activeUser);

  // Log the entire activeUser object for debugging
  useEffect(() => {
    console.log('Active User Object:', activeUser);
  }, [activeUser]);

  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && message) {
      setMessage("");
      socket.emit("stop typing", activeChat._id);
      try {
        const data = await sendMessage({ chatId: activeChat._id, message });
        socket.emit("new message", data);
        setMessages([...messages, data]);
        dispatch(fetchChats());
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.emit("setup", activeUser);
    socket.on("connected", () => setSocketConnected(true));
  }, [activeUser]);

  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true);
        console.log('Fetching messages for chat:', activeChat._id);
        try {
          const data = await fetchMessages(activeChat._id);
          console.log('Fetched messages:', data);
          setMessages(data || []);
          socket.emit("join room", activeChat._id);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        } finally {
          setLoading(false);
        }
      } else {
        setMessages([]); // Clear messages when no chat is selected
      }
    };
    fetchMessagesFunc();
    selectedChatCompare = activeChat;
  }, [activeChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatId._id) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]));
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
      dispatch(fetchChats());
    });
  }, [messages, notifications, dispatch]);

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) window.location.href = "/login";
    };
    isValid();
  }, []);

  const handleBackClick = () => {
    props.setShowChat(false); // Hide chat and show contacts
    dispatch(setActiveChat(null)); // Clear the active chat
  };

  if (loading) {
    return <div className={props.className}><Loading /></div>;
  }

  return (
    <div className={props.className}>
      {activeChat ? (
        <>
          {/* Chat Header */}
          <div className="flex justify-between items-center px-3 sm:px-5 bg-[#ffff] w-full h-[61px] border-b border-gray-200">
            <div className="flex items-center gap-x-2 sm:gap-x-3">
              <button onClick={handleBackClick} className="lg:hidden">
                <IoIosArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-[#2b2e33]" />
              </button>
              <div className="flex flex-col items-start justify-center overflow-hidden">
                <h5 className="text-sm sm:text-base lg:text-[17px] text-[#2b2e33] font-bold tracking-wide truncate">
                  {getChatName(activeChat, activeUser)}
                </h5>
              </div>
            </div>
            <div><Model /></div>
          </div>

          {/* Message History */}
          <div className="scrollbar-hide w-full h-[calc(100vh-120px)] flex flex-col overflow-y-scroll p-2 sm:p-3 lg:p-4 bg-[#fafafa]">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[#56585c] text-sm sm:text-base">No messages yet</p>
              </div>
            ) : (
              <>
                <MessageHistory messages={messages} />
                <div className="ml-4 sm:ml-7 -mb-8 sm:-mb-10">{isTyping ? <Typing width="80" height="80" className="w-12 h-12 sm:w-16 sm:h-16" /> : ""}</div>
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center px-2 sm:px-4">
            {showPicker && (
              <div className="absolute bottom-14 sm:bottom-16 z-10">
                <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
              </div>
            )}
            <div className="border-[1px] border-gray-300 bg-white px-2 sm:px-4 py-1.5 sm:py-2 w-[90%] max-w-[600px] rounded-[20px] flex items-center gap-x-1 sm:gap-x-3 shadow-sm box-border">
              <div className="cursor-pointer" onClick={() => setShowPicker(!showPicker)}>
                {showPicker ? (
                  <BsFillEmojiSmileFill className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffb02e]" />
                ) : (
                  <BsEmojiSmile className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                )}
              </div>
              <form onKeyDown={keyDownFunction} onSubmit={(e) => e.preventDefault()} className="flex-1">
                <input
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (!socketConnected) return;
                    if (!typing) {
                      setTyping(true);
                      socket.emit('typing', activeChat._id);
                    }
                    let lastTime = new Date().getTime();
                    const time = 3000;
                    setTimeout(() => {
                      const timeNow = new Date().getTime();
                      const timeDiff = timeNow - lastTime;
                      if (timeDiff >= time && typing) {
                        socket.emit("stop typing", activeChat._id);
                        setTyping(false);
                      }
                    }, time);
                  }}
                  className="focus:outline-0 w-full bg-white text-xs sm:text-sm lg:text-base placeholder-gray-400"
                  type="text"
                  name="message"
                  placeholder="Enter message"
                  value={message}
                />
              </form>
              <button
                onClick={keyDownFunction}
                className="bg-white text-gray-600 text-xs sm:text-sm px-1 sm:px-3 py-0.5 sm:py-1.5 font-medium rounded-[10px] hover:bg-gray-100"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="relative h-full bg-[#fafafa]">
          <div className="absolute top-[30vh] sm:top-[40vh] left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-y-2 sm:gap-y-3">
            <img
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
              alt="User profile"
              src={activeUser?.profilePic || DEFAULT_PROFILE_PIC}
              onError={(e) => {
                console.log('Profile picture failed to load, using fallback');
                e.target.src = DEFAULT_PROFILE_PIC;
              }}
            />
            <h3 className="text-[#111b21] text-sm sm:text-base lg:text-[20px] font-medium tracking-wider">
              Welcome <span className="text-[#166e48] text-sm sm:text-base lg:text-[19px] font-bold">{activeUser.name}</span>
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;