import React, { useState, useEffect } from 'react';
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { googleAuth, registerUser } from '../apis/auth';
import { BsEmojiSmile, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from 'react-toastify';
import { validUser } from '../apis/auth';
import { motion } from 'framer-motion';

const defaultData = { firstname: "", lastname: "", email: "", password: "" };

function Register({ toggleForm }) {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleOnChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted on Register page');
    console.log('Form Data:', formData);

    setIsLoading(true);
    if (!formData.email.includes("@") || formData.password.length <= 6) {
      setIsLoading(false);
      toast.warning("Please provide a valid email and a password longer than 6 characters!");
      setFormData({ ...formData, password: "" });
      return;
    }
    try {
      const response = await registerUser(formData);
      console.log('Register API Response:', response);
      if (!response || !response.data) throw new Error("No data received from server");
      const { data } = response;
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        toast.success("Successfully Registered 😍");
        setIsLoading(false);
        window.location.href = "/chats";
      } else {
        setIsLoading(false);
        toast.error(data?.error || "Registration failed!");
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Something went wrong. Please try again!");
      setFormData({ ...formData, password: "" });
    }
  };

  const googleSuccess = async (res) => {
    console.log('Google Sign-In Success:', res);
    if (res?.profileObj) {
      setIsLoading(true);
      try {
        const response = await googleAuth({ tokenId: res.tokenId });
        console.log('Google Auth API Response:', response);
        setIsLoading(false);
        if (response?.data?.token) {
          localStorage.setItem("userToken", response.data.token);
          toast.success("Successfully Registered with Google!");
          window.location.href = "/chats";
        } else {
          toast.error("Google Sign-In Failed!");
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Google Sign-In Error:', error);
        toast.error("Something Went Wrong with Google Sign-In. Try Again!");
      }
    } else {
      console.warn('Google Sign-In: No profileObj in response');
      toast.error("Google Sign-In Failed!");
    }
  };

  const googleFailure = (error) => {
    console.error('Google Sign-In Failure:', error);
    toast.error("Google Sign-In Failed. Try Again!");
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: '',
      }).catch(error => {
        console.error('GAPI Client Init Error:', error);
      });
    };
    gapi.load('client:auth2', initClient);

    const isValid = async () => {
      try {
        const data = await validUser();
        console.log('Valid User Check:', data);
        if (data?.user) window.location.href = "/chats";
      } catch (error) {
        console.error('Valid User Check Error:', error);
      }
    };
    isValid();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, rotateY: -180, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-md w-full min-h-[400px] bg-[#1C2526] rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.5)] p-6 sm:p-8 border-2 border-[#00FFFF] border-opacity-30 flex flex-col justify-center absolute"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-[#00FFFF] text-center mb-4 sm:mb-6" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.8)" }}>
        Register
      </h3>
      <p className="text-xs sm:text-sm text-[#00FFFF] text-center mb-6 sm:mb-8">
        Have an Account?{' '}
        <button onClick={toggleForm} className="underline hover:text-[#00B7EB] transition-all duration-200">
          Sign in
        </button>
      </p>
      <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex gap-3 sm:gap-4 mb-4">
          <input
            onChange={handleOnChange}
            className="w-1/2 p-3 sm:p-4 bg-[#1C2526] text-white border border-[#00FFFF] rounded-lg focus:border-[#00B7EB] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            required
          />
          <input
            onChange={handleOnChange}
            className="w-1/2 p-3 sm:p-4 bg-[#1C2526] text-white border border-[#00FFFF] rounded-lg focus:border-[#00B7EB] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            required
          />
        </div>
        <div className="relative">
          <input
            onChange={handleOnChange}
            className="w-full p-3 sm:p-4 bg-[#1C2526] text-white border border-[#00FFFF] rounded-lg focus:border-[#00B7EB] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            required
          />
        </div>
        <div className="relative">
          <input
            onChange={handleOnChange}
            className="w-full p-3 sm:p-4 bg-[#1C2526] text-white border border-[#00FFFF] rounded-lg focus:border-[#00B7EB] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 sm:right-4 top-3 sm:top-4 text-[#00FFFF] hover:text-[#00B7EB] transition-all duration-200"
          >
            {showPass ? <BsEmojiExpressionless className="w-5 h-5 sm:w-6 sm:h-6" /> : <BsEmojiSmile className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
        <button
          style={{ background: "#00FFFF" }}
          className="w-full py-3 sm:py-4 text-black font-bold rounded-lg hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transition-all duration-300 relative overflow-hidden group touch-manipulation"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                background="transparent"
                speed="1"
                style={{ width: "60px", height: "60px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
          ) : (
            <span className="relative z-10">Register</span>
          )}
          <span className="absolute inset-0 bg-[#00B7EB] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </button>
        <div className="flex items-center my-4 sm:my-6">
          <div className="flex-1 border-t border-[#00FFFF] border-opacity-30"></div>
          <span className="mx-3 text-gray-400 text-xs sm:text-base">or</span>
          <div className="flex-1 border-t border-[#00FFFF] border-opacity-30"></div>
        </div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <button
              style={{ background: "#00FFFF" }}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="w-full py-2 sm:py-3 bg-[#1C2526] text-black border-2 border-[#00FFFF] rounded-lg flex items-center justify-center gap-2 sm:gap-3 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-200 touch-manipulation"
            >
              <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm">Continue with Google</span>
            </button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </form>
    </motion.div>
  );
}

export default Register;