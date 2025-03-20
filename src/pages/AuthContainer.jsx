import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Regsiter';

function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#1C2526] overflow-hidden">
      {/* Register Section (Left on Desktop) */}
      <div
        className="w-full lg:w-1/2 h-2/3 lg:h-full flex items-center justify-center order-1 lg:order-1 relative"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          {!isLogin && (
            <Register key="register" toggleForm={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
        {isLogin && (
          <div className="max-w-md w-full min-h-[400px] flex items-center justify-center">
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#00FFFF] text-center tracking-wider"
              style={{ textShadow: "0 0 15px rgba(0, 255, 255, 0.6)" }}
            >
              Welcome Back! Sign in to continue.
            </h1>
          </div>
        )}
      </div>

      {/* Login Section (Right on Desktop) */}
      <div
        className="w-full lg:w-1/2 h-1/3 lg:h-full flex items-center justify-center order-2 lg:order-2 relative"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          {isLogin && (
            <Login key="login" toggleForm={() => setIsLogin(false)} />
          )}
        </AnimatePresence>
        {!isLogin && (
          <div className="max-w-md w-full min-h-[400px] flex items-center justify-center">
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#00FFFF] text-center tracking-wider"
              style={{ textShadow: "0 0 15px rgba(0, 255, 255, 0.6)" }}
            >
              Join Us! Create your account on Q6Fold.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthContainer;