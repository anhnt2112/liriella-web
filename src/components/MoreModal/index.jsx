import React, { useRef, useEffect } from "react";

import SettingIcon from "../../assets/png/setting.png";
import ActivityIcon from "../../assets/png/activities.png";
import LogoutIcon from "../../assets/png/logout.png";
import { useModal } from "../../context/useModal";

const MoreModal = () => {
  const { isMoreOpen, setIsMoreOpen, openUpdateSetting } = useModal();
  const moreModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (moreModalRef.current && !moreModalRef.current.contains(event.target)) {
          setIsMoreOpen(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("session-id");
    window.location.reload();
  }

  return (isMoreOpen && <div 
    className="fixed left-5 bottom-16 bg-white z-40 h-fit w-fit p-2 rounded-lg flex flex-col gap-2"
    style={{
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)"
    }}
    ref={moreModalRef}>
      <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 hover:cursor-pointer gap-3">
        <img src={SettingIcon} alt="setting" className="w-6" />
        <div className="flex-grow text-sm" onClick={openUpdateSetting}>Setting</div>
      </div>
      <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 hover:cursor-pointer gap-3">
        <img src={ActivityIcon} alt="setting" className="w-6 p-0.5" />
        <div className="flex-grow w-full text-sm">Your Activities</div>
      </div>
      <div className="w-full h-[1px] bg-slate-100" />
      <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 hover:cursor-pointer gap-3">
        <img src={LogoutIcon} alt="setting" className="w-6 p-0.5" />
        <div className="flex-grow w-full text-sm" onClick={handleLogout}>Log Out</div>
      </div>
    </div>
  );
};

export default MoreModal;