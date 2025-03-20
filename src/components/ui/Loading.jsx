import React from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <lottie-player
        src="https://assets9.lottiefiles.com/packages/lf20_cud2yjlq.json"
        background="transparent"
        speed="1"
        style={{ width: "120px", height: "120px" }}
        loop
        autoplay
      ></lottie-player>
    </div>
  );
}

export default Loading;