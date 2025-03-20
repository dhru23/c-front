import React from 'react';
import SkeletonLoading from '../ui/SkeletonLoading';

function Search({ type, isLoading, searchResults, handleClick, search }) {
  return (
    <div
      className={`${search ? "overflow-y-auto scrollbar-thin scrollbar-thumb-[#00FFFF] scrollbar-track-[#1C2526] h-[250px] mb-5 bg-[#1C2526] flex flex-col gap-3 p-3 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.3)]" : "hidden"}`}
    >
      {isLoading ? (
        <SkeletonLoading height={55} count={3} />
      ) : (
        searchResults.length > 0 ? (
          searchResults.map((e) => (
            <div key={e._id} className="flex items-center justify-between p-2 hover:bg-[#00B7EB] rounded-md transition-all">
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full border-2 border-[#00FFFF] shadow-[0_0_5px_rgba(0,255,255,0.3)]"
                  src={e.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt=""
                />
                <div className="flex flex-col gap-[2px]">
                  <h5 className="text-sm text-[#00FFFF] tracking-wider font-medium shadow-[0_0_5px_rgba(0,255,255,0.3)]" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
                    {e.name}
                  </h5>
                  <h5 className="text-xs text-[#00FFFF] tracking-wider font-normal" style={{ textShadow: "0 0 3px rgba(0, 255, 255, 0.4)" }}>
                    {e.email}
                  </h5>
                </div>
              </div>
              <button
                onClick={() => handleClick(e)}
                className="bg-[#00FFFF] px-3 py-1 text-[10.6px] tracking-wider text-[#1C2526] rounded-md hover:bg-[#00B7EB] transition-all shadow-[0_0_5px_rgba(0,255,255,0.3)]"
                
              >
                Add
              </button>
            </div>
          ))
        ) : (
          <span className="text-sm text-[#00FFFF] tracking-wider" style={{ textShadow: "0 0 5px rgba(0, 255, 255, 0.6)" }}>
            No results found
          </span>
        )
      )}
    </div>
  );
}

export default Search;