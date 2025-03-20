import React, { useState } from 'react';
import { TbEdit } from "react-icons/tb";
import { BsCheck2 } from "react-icons/bs";

function InputEdit({ type, handleChange, input, handleSubmit }) {
  const [editable, setEditable] = useState(false);

  const submitButton = () => {
    handleSubmit();
    setEditable(false);
  };

  return (
    <div className="flex flex-col py-4 mt-4 bg-gray-800 shadow-[0_0_10px_rgba(0,255,255,0.3)] px-4 gap-y-3 rounded-md">
      <p className="text-xs text-teal-400 font-medium tracking-wider shadow-[0_0_5px_rgba(0,255,255,0.3)]">
        Your {type === "name" ? "name" : "bio"}
      </p>
      {!editable ? (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">{input}</p>
          <button onClick={() => setEditable(!editable)}>
            <TbEdit className="w-5 h-5 text-cyan-400 hover:text-teal-400 transition-all" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <input
            name={type}
            onChange={handleChange}
            className="text-sm text-gray-300 bg-transparent border-b border-teal-500 focus:border-cyan-400 focus:outline-none w-full"
            type="text"
            value={input}
          />
          <button onClick={submitButton} className="ml-4">
            <BsCheck2 className="w-5 h-5 text-teal-400 hover:text-cyan-400 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
}

export default InputEdit;