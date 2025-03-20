import React from 'react';
import nocontacts from "../../assets/no-contacts.jpg";

function NoContacts() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-teal-400">
      <img
        className="w-32 h-32 mb-4"
        src={nocontacts}
        alt="No Contacts"
      />
      <h4 className="text-lg font-semibold text-teal-400 tracking-wider shadow-[0_0_5px_rgba(0,255,255,0.3)]">
        No Contacts Yet
      </h4>
      <span className="text-xs text-gray-400 tracking-wider">
        Search for people
      </span>
    </div>
  );
}

export default NoContacts;