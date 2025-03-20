// src/pages/Regsiter.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { googleAuth, registerUser } from '../apis/auth';
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from 'react-toastify';
import { validUser } from '../apis/auth';
import logo from "../assets/logo.ico";

const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
};

function Regsiter() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email.includes("@") || formData.password.length <= 6) {
      setIsLoading(false);
      toast.warning("Please provide a valid email and a password longer than 6 characters!");
      setFormData({ ...formData, password: "" });
      return;
    }

    try {
      const response = await registerUser(formData);
      if (!response || !response.data) {
        throw new Error("No data received from server");
      }

      const { data } = response;
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        toast.success("Successfully Registered!");
        pageRoute("/");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Registration failed!");
      setFormData({ ...formData, password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const googleSuccess = async (res) => {
    if (res?.profileObj) {
      setIsLoading(true);
      try {
        const response = await googleAuth({ tokenId: res.tokenId });
        if (response?.data?.token) {
          localStorage.setItem("userToken", response.data.token);
          pageRoute("/");
        } else {
          throw new Error("No token received from server");
        }
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast.error("Google Sign-In Failed. Please Try Again!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const googleFailure = (error) => {
    toast.error("Google Sign-In Failed. Please Try Again!");
    console.error("Google Sign-In Error:", error);
    setIsLoading(false);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'profile email'
      });
    };
    gapi.load('client:auth2', initClient);

    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/";
      }
    };
    isValid();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="flex justify-center mb-4 sm:mb-6">
          <img src={logo} alt="ChatApp Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">New User Getting Started</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Already have an Account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        <form className="flex flex-col gap-y-3 sm:gap-y-4" onSubmit={handleOnSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              onChange={handleOnChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              required
            />
            <input
              onChange={handleOnChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              required
            />
          </div>
          <div>
            <input
              onChange={handleOnChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
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
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              required
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {!showPass ? (
                <BsEmojiLaughing
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                />
              ) : (
                <BsEmojiExpressionless
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                />
              )}
            </div>
          </div>
          <button
            className="w-full p-2 sm:p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors relative text-sm sm:text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "40px", height: "40px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
            ) : (
              <p>Create Account</p>
            )}
          </button>
          <div className="flex items-center my-3 sm:my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 sm:px-3 text-gray-600 text-xs sm:text-sm uppercase">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled || isLoading}
                aria-label="Continue with google"
                className="py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg flex items-center justify-center w-full hover:bg-gray-100 transition-colors"
                disableElevation={true}
                disableFocusRipple={true}
              >
                <img
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg"
                  alt="google"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <p className="text-sm sm:text-base font-medium ml-2 sm:ml-4 text-gray-800">
                  Continue with Google
                </p>
              </button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
            scope="profile email"
          />
        </form>
        <p className="text-gray-600 text-center mt-3 sm:mt-4 text-xs sm:text-sm">
          By signing up, I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default Regsiter;