import React, { useRef, useState, useEffect } from "react";
import Logo from "../../../assets/png/logo.png";

import Home from "../../../assets/svg/home.svg";
import HomeFilled from "../../../assets/svg/home_filled.svg";

import Search from "../../../assets/svg/search.svg";
import SearchFilled from "../../../assets/svg/search_filled.svg";

import Explore from "../../../assets/png/explore.png";
import ExploreFilled from "../../../assets/png/explore_filled.png";

import Message from "../../../assets/svg/mesage.svg";
import MessageFilled from "../../../assets/svg/message_filled.svg";

import Noti from "../../../assets/svg/notification.svg";
import NotiFilled from "../../../assets/svg/notification_filled.svg";

import Create from "../../../assets/png/create.png";
import CreateFilled from "../../../assets/png/create_filled.png";

import Menu from "../../../assets/svg/menu.svg";
import MenuFilled from "../../../assets/svg/menu_filled.svg";

import LogoSvg from "../../../assets/svg/logo.svg";
import DefaultAvatar from "../../../assets/png/avatar.png";
import DefaultAvatarFilled from "../../../assets/png/avatar_filled.png";

import SettingIcon from "../../../assets/png/setting.png";
import ActivityIcon from "../../../assets/png/activities.png";
import LogoutIcon from "../../../assets/png/logout.png";

import useTailwindBreakpoint from "../../../context/useTailwindBreakpoint";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../../context/useModal";

const SideBar = () => {
    const { currentBreakpoint } = useTailwindBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();
    const { openCreatePost, isCreatePost } = useModal();

    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const moreModalRef = useRef(null);

    const sideBarItems = [
        {
            id: "home",
            label: "Home",
            icon: Home,
            activeIcon: HomeFilled,
            action: () => navigate("home")
        },
        {
            id: "search",
            label: "Search",
            icon: Search,
            activeIcon: SearchFilled
        },
        {
            id: "explore",
            label: "Explore",
            icon: Explore,
            activeIcon: ExploreFilled,
            action: () => navigate("explore")
        },
        {
            id: "message",
            label: "Message",
            icon: Message,
            activeIcon: MessageFilled,
            action: () => navigate("message")
        },
        {
            id: "notification",
            label: "Notification",
            icon: Noti,
            activeIcon: NotiFilled
        },
        {
            id: "create",
            label: "Create",
            icon: Create,
            activeIcon: CreateFilled,
            action: openCreatePost
        },
        {
            id: "profile",
            label: "Profile",
            icon: DefaultAvatar,
            activeIcon: DefaultAvatarFilled,
            action: () => navigate("profile")
        }
    ];

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

    const getActiveStatus = (id) => {
        if (isCreatePost) {
            return id === "create";
        } else {
            const path = location.pathname.split('/')[1];
            return path === id;
        }
    }

    return (
        <div className="w-full h-full p-2 flex flex-col select-none relative">
            <div className="w-full h-12 flex items-center p-1.5 xl:p-3 mb-6 cursor-pointer" onClick={() => navigate('home')}>
                <img src={(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') ? Logo : LogoSvg} className="h-full" alt="" draggable={false} />
            </div>
            <div className="flex-grow flex flex-col gap-2">
                {sideBarItems.map((item, index) => (
                    <div className="w-full h-12 flex items-center gap-3 p-1.5 xl:p-3.5 rounded-lg hover:bg-slate-100 cursor-pointer" key={index} onClick={() => item.action()}>
                        <img src={getActiveStatus(item.id) ? item.activeIcon : item.icon} alt="" className="w-7" draggable={false} />
                        {(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') && <div className={"flex-grow text-base " + (getActiveStatus(item.id) ? "font-semibold" : "")}>{item.label}</div>}
                    </div>
                ))}
            </div>
            <div className="w-full h-12 flex items-center p-1.5 xl:p-3.5 gap-3 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={() => setIsMoreOpen(true)}>
                <img src={isMoreOpen ? MenuFilled : Menu} alt="" className="h-full" draggable={false} />
                {(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') && <div className={"flex-grow text-base " + (isMoreOpen ? "font-semibold" : "")}>More</div>}
            </div>

            {/* More modal */}
            {isMoreOpen && <div 
                className="absolute left-5 bottom-16 bg-white h-fit w-fit p-2 rounded-lg flex flex-col gap-2"
                style={{
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)"
                }}
                ref={moreModalRef}
            >
                <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 cursor-pointer gap-3">
                    <img src={SettingIcon} alt="setting" className="w-6" />
                    <div className="flex-grow text-sm">Setting</div>
                </div>
                <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 cursor-pointer gap-3">
                    <img src={ActivityIcon} alt="setting" className="w-6 p-0.5" />
                    <div className="flex-grow w-full text-sm">Your Activities</div>
                </div>
                <div className="w-full h-[1px] bg-slate-100" />
                <div className="px-2 h-10 w-48 flex items-center rounded-lg hover:bg-slate-100 cursor-pointer gap-3">
                    <img src={LogoutIcon} alt="setting" className="w-6 p-0.5" />
                    <div className="flex-grow w-full text-sm">Log Out</div>
                </div>
            </div>}
        </div>
    );
}

export default SideBar;