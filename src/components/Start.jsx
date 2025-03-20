import React, { useEffect } from 'react';
import { validUser } from '../apis/auth';
import { useNavigate } from "react-router-dom";

function Start() {
  const pageRoute = useNavigate();

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        pageRoute("/login");
      } else {
        pageRoute("/chats");
      }
    };
    isValid();
  }, [pageRoute]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C2526] p-4">
      <div className="flex flex-col items-center gap-4">
        <lottie-player
          src="https://assets1.lottiefiles.com/private_files/lf30_kanwuonz.json"
          background="transparent"
          speed="1"
          style={{ width: "200px", height: "200px" }}
          loop
          autoplay
        ></lottie-player>
        <h3 className="text-sm font-semibold text-[#00FFFF] tracking-wider shadow-[0_0_5px_rgba(0,255,255,0.3)]" style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.6)" }}>
          Please Wait...
        </h3>
      </div>
    </div>
  );
}

export default Start;