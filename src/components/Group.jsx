import React, { useState, useEffect } from 'react';
import { BsPlusLg } from "react-icons/bs";
import { Modal, Box } from "@mui/material";
import { searchUsers } from '../apis/auth';
import { RxCross2 } from "react-icons/rx";
import { createGroup } from '../apis/chat';
import { fetchChats } from '../redux/chatsSlice';
import { useDispatch } from 'react-redux';
import Search from './group/Search';

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

function Group() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUsers] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSelectedUsers([]);
  };

  const handleFormSearch = async (e) => setSearch(e.target.value);
  const handleClick = (e) => { if (!selectedUser.includes(e)) setSelectedUsers([...selectedUser, e]); };
  const deleteSelected = (ele) => setSelectedUsers(selectedUser.filter((e) => e._id !== ele._id));
  const handleSubmit = async () => {
    if (selectedUser.length >= 2) {
      await createGroup({ chatName, users: JSON.stringify(selectedUser.map((e) => e._id)) });
      dispatch(fetchChats());
      handleClose();
    }
  };

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
      <button onClick={handleOpen} className="flex items-center gap-2 bg-[#1C2526] text-[#00FFFF] mt-2 py-1 px-3 rounded-md hover:bg-[#00B7EB] transition-all" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
        New Group <BsPlusLg className="w-3 h-3 text-[#00FFFF]" />
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h5 className="text-lg font-bold text-[#00FFFF] text-center mb-4" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}>
            Create A Group
          </h5>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <input
              onChange={(e) => setChatName(e.target.value)}
              className="w-full p-2 bg-[#1C2526] text-white border border-[#00FFFF] rounded-md focus:border-[#00B7EB] focus:outline-none shadow-[0_0_5px_rgba(0,255,255,0.3)]"
              type="text"
              placeholder="Group Name"
              required
            />
            <input
              onChange={handleFormSearch}
              className="w-full p-2 bg-[#1C2526] text-white border border-[#00FFFF] rounded-md focus:border-[#00B7EB] focus:outline-none shadow-[0_0_5px_rgba(0,255,255,0.3)]"
              type="text"
              placeholder="Add users"
            />
            <div className="flex flex-wrap gap-2">
              {selectedUser.map((e) => (
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
                  {e.name} <RxCross2 className="w-4 h-4 text-[#1C2526]" />
                </button>
              ))}
            </div>
            <Search isLoading={isLoading} handleClick={handleClick} search={search} searchResults={searchResults} />
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-[#00FFFF] text-[#1C2526] rounded-md hover:bg-[#00B7EB] hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"
              style={{
                textShadow: `
                  -1px -1px 0 #000000,
                  1px -1px 0 #000000,
                  -1px 1px 0 #000000,
                  1px 1px 0 #000000
                `,
              }}
            >
              Create
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default Group;