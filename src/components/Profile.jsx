import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { setShowProfile } from '../redux/profileSlice';
import { MdLogout } from "react-icons/md";
import InputEdit from './profile/InputEdit';
import { updateUser } from '../apis/auth';
import { toast } from 'react-toastify';
import { setUserNameAndBio } from '../redux/activeUserSlice';

function Profile(props) {
  const dispatch = useDispatch();
  const { showProfile } = useSelector((state) => state.profile);
  const activeUser = useSelector((state) => state.activeUser);
  const [formData, setFormData] = useState({
    name: activeUser.name,
    bio: activeUser.bio,
  });

  const logoutUser = () => {
    toast.success("Logout Successfull!");
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    dispatch(setUserNameAndBio(formData));
    toast.success("Updated!");
    await updateUser(activeUser.id, formData);
  };

  return (
    <motion.div
      initial={{ x: '100%' }} // Start off-screen to the right
      animate={{ x: showProfile ? 0 : '100%' }} // Slide in when showProfile is true, slide out otherwise
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }} // Smooth spring animation
      style={{ transition: showProfile ? "0.3s ease-in-out" : "" }} // Keep original transition for fallback
      className="fixed inset-0 w-full max-w-md mx-auto bg-[#1C2526] text-white shadow-2xl overflow-y-auto"
    >
      <div className="p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00FFFF] to-[#00B7EB] py-12 px-4 mb-4 shadow-lg rounded-t-md">
          <button onClick={() => dispatch(setShowProfile(false))} className="flex items-center gap-3">
            <IoArrowBack
              style={{ color: "#fff", width: "30px", height: "20px" }}
              className="hover:text-[#00B7EB] transition-all duration-200"
            />
            <h6 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r  text-black">
              Profile
            </h6>
          </button>
        </div>

        {/* Content */}
        <div className="px-4">
          <div className="flex flex-col items-center relative mb-6">
            <img
              className="w-36 h-36 rounded-full border-4 border-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.7)] hover:shadow-[0_0_25px_rgba(0,191,255,0.8)] transition-all duration-300"
              src={activeUser?.profilePic}
              alt=""
            />
            {/* Neon Ring Effect */}
            <div className="absolute w-40 h-40 rounded-full border-2 border-[#00FFFF] opacity-50 animate-pulse"></div>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <InputEdit
              type="name"
              handleChange={handleChange}
              input={formData.name}
              handleSubmit={submit}
            />
            <p className="text-xs tracking-wider text-[#00FFFF] italic mt-2" style={{ textShadow: "0 0 3px rgba(0, 255, 255, 0.4)" }}>
              This is not your username or pin. This name will be visible to your contacts.
            </p>
          </div>

          {/* Bio Input */}
          <div className="mb-6">
            <InputEdit
              type="bio"
              handleChange={handleChange}
              input={formData.bio}
              handleSubmit={submit}
            />
          </div>

          {/* Logout Button */}
          <div
            onClick={logoutUser}
            className="flex items-center justify-center gap-2 mt-6 py-3 px-6 bg-gradient-to-r from-[#FF0000] to-[#CC0000] rounded-md hover:from-[#FF3333] hover:to-[#CC3333] hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all duration-300"
          >
            <MdLogout className="w-6 h-6 text-white mr-2" />
            <h6 className="text-base font-semibold text-white tracking-wide">Logout</h6>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;