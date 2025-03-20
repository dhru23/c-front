import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { fetchMessages, sendMessage } from '../apis/messages';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client";
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import NoChat from '../components/NoChat'; // Import the new component

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

  // Debug log to confirm Chat component renders
  useEffect(() => {
    console.log('Chat Component Rendered - Active Chat:', activeChat);
    console.log('Chat Component - Props:', props);
  }, [activeChat, props]);

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
        try {
          const data = await fetchMessages(activeChat._id);
          setMessages(data || []);
          socket.emit("join room", activeChat._id);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        } finally {
          setLoading(false);
        }
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
    console.log('Back button clicked - Setting showChat to false'); // Debug log
    props.setShowChat(false);
  };

  if (loading) {
    return <div className={props.className}><Loading /></div>;
  }

  return (
    <div className={`h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 ${props.className}`}>
      {activeChat ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center p-2 sm:p-4 bg-gray-800 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handleBackClick} className="md:hidden">
                <IoIosArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </button>
              <h5 className="text-sm sm:text-base font-bold text-cyan-400">{getChatName(activeChat, activeUser)}</h5>
            </div>
            <Model />
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-800 p-2 sm:p-4">
            <MessageHistory typing={isTyping} messages={messages} />
            {isTyping && <Typing width="40" height="40" className="ml-2 sm:ml-4 w-10 h-10 sm:w-12 sm:h-12" />}
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-4 bg-gray-800">
            {showPicker && (
              <div className="absolute bottom-16 sm:bottom-20 z-10">
                <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-700 border border-cyan-500 rounded-md p-1 sm:p-2 shadow-[0_0_5px_rgba(0,255,255,0.3)]">
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
                className="flex-1 p-2 bg-transparent text-white focus:outline-none text-xs sm:text-sm lg:text-base"
                type="text"
                name="message"
                placeholder="Enter message"
                value={message}
              />
              <button onClick={() => setShowPicker(!showPicker)} className="text-cyan-400 hover:text-cyan-400 transition-all">
                {showPicker ? <BsFillEmojiSmileFill className="w-4 h-4 sm:w-5 sm:h-5" /> : <BsEmojiSmile className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button onClick={keyDownFunction} className="bg-cyan-500 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-teal-600 transition-all text-xs sm:text-sm">
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <NoChat activeUser={activeUser} />
        </div>
      )}
    </div>
  );
}

export default Chat;