import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import { searchUsers } from '../apis/auth';
import { addToGroup, removeUser, renameGroup } from '../apis/chat';
import { fetchChats } from '../redux/chatsSlice';
import Search from './group/Search';
import { getChatName, getChatPhoto } from '../utils/logics';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: '#1C2526',
  borderRadius: '12px',
  boxShadow: '0 0 20px rgba(0,255,255,0.3)',
  p: 3,
};

function ChatModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const { activeChat } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);

  const handleOpen = () => {
    setOpen(true);
    setName(getChatName(activeChat, activeUser));
  };
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSearchResults([]);
  };
  const handleClick = async (e) => {
    if (members.includes(e)) return;
    await addToGroup({ userId: e?._id, chatId: activeChat?._id });
    setMembers([...members, e]);
  };
  const updateBtn = async () => {
    if (name) {
      let data = await renameGroup({ chatId: activeChat._id, chatName: name });
      if (data) {
        dispatch(fetchChats());
        setOpen(false);
      }
    }
    setOpen(false);
  };
  const deleteSelected = async (ele) => {
    const res = await removeUser({ chatId: activeChat._id, userId: ele._id });
    if (res._id) {
      setMembers(members.filter((e) => e._id !== ele._id));
      dispatch(fetchChats());
      setOpen(false);
    }
  };
  const leaveGroup = async () => {
    const res = await removeUser({ chatId: activeChat._id, userId: activeUser.id });
    if (res._id) {
      dispatch(fetchChats());
      setOpen(false);
    }
  };

  useEffect(() => {
    setMembers(activeChat?.users.map((e) => e));
  }, [activeChat]);
  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true);
      const { data } = await searchUsers(search);
      setSearchResults(data);
      setIsLoading(false);
    };
    if (search) searchChange();
  }, [search]);

  return (
    <>
      <button onClick={handleOpen} className="focus:outline-none">
        <img className="w-10 h-10 rounded-full border-2 border-[#00FFFF] shadow-[0_0_5px_rgba(0,255,255,0.3)]" alt="Profile Pic" src={getChatPhoto(activeChat, activeUser)} />
      </button>
      {activeChat?.isGroup ? (
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <h5 className="text-lg font-bold text-[#00FFFF] text-center mb-4" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}>
              {getChatName(activeChat, activeUser)}
            </h5>
            <h6 className="text-sm text-[#00FFFF]" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>Members</h6>
            <div className="flex flex-wrap gap-2 mb-4">
              {members.map((e) => (
                <button
                  key={e._id}
                  onClick={() => deleteSelected(e)}
                  className="flex items-center gap-1 bg-[#00FFFF] text-[#1C2526] text-xs px-2 py-1 rounded-full hover:bg-[#00B7EB] transition-all"
                  style={{
                    textShadow: `
                      -1px -1px 0 #000000,
                      1px -1px 0 #000000,
                      -1px 1px 0 #000000,
                      1px 1px 0 #000000
                    `,
                  }}
                >
                  {e._id === activeUser.id ? "You" : e.name} <RxCross2 className="w-4 h-4 text-[#1C2526]" />
                </button>
              ))}
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full p-2 bg-[#1C2526] text-white border border-[#00FFFF] rounded-md focus:border-[#00B7EB] focus:outline-none shadow-[0_0_5px_rgba(0,255,255,0.3)]"
                type="text"
                placeholder="Group Name"
                required
              />
              <input
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 bg-[#1C2526] text-white border border-[#00FFFF] rounded-md focus:border-[#00B7EB] focus:outline-none shadow-[0_0_5px_rgba(0,255,255,0.3)]"
                type="text"
                placeholder="Add users"
              />
              <Search isLoading={isLoading} handleClick={handleClick} search={search} searchResults={searchResults} />
              <div className="flex gap-2 justify-end">
                <button onClick={updateBtn} className="py-2 px-4 bg-[#00FFFF] text-[#1C2526] rounded-md hover:bg-[#00B7EB] transition-all" style={{
                  textShadow: `
                    -1px -1px 0 #000000,
                    1px -1px 0 #000000,
                    -1px 1px 0 #000000,
                    1px 1px 0 #000000
                  `,
                }}>
                  Update
                </button>
                <button onClick={leaveGroup} className="py-2 px-4 bg-[#FF0000] text-white rounded-md hover:bg-[#CC0000] transition-all" style={{
                  textShadow: `
                    -1px -1px 0 #000000,
                    1px -1px 0 #000000,
                    -1px 1px 0 #000000,
                    1px 1px 0 #000000
                  `,
                }}>
                  Leave
                </button>
              </div>
            </form>
          </Box>
        </Modal>
      ) : (
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <div className="flex flex-col items-center p-4">
              <img className="w-16 h-16 rounded-full border-2 border-[#00FFFF] shadow-[0_0_5px_rgba(0,255,255,0.3)] mb-4" src={getChatPhoto(activeChat, activeUser)} alt="" />
              <h2 className="text-lg font-bold text-[#00FFFF]" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}>{getChatName(activeChat, activeUser)}</h2>
              <h3 className="text-sm text-[#00FFFF]" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
                {!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.email : activeChat?.users[0]?.email}
              </h3>
              <h5 className="text-xs text-[#00FFFF]" style={{ textShadow: "0 0 3px rgba(0, 255, 255, 0.4)" }}>
                {!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.bio : activeChat?.users[0]?.bio}
              </h5>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default ChatModal;