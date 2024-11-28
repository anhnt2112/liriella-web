import React from "react";
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

import useTailwindBreakpoint from "../../../context/useTailwindBreakpoint";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/useModal";

const SideBar = () => {
    const { currentBreakpoint } = useTailwindBreakpoint();
    const navigate = useNavigate();
    const { openCreatePost } = useModal();

    const sideBarItems = [
        {
            label: "Home",
            icon: Home,
            activeIcon: HomeFilled
        },
        {
            label: "Search",
            icon: Search,
            activeIcon: SearchFilled
        },
        {
            label: "Explore",
            icon: Explore,
            activeIcon: ExploreFilled
        },
        {
            label: "Message",
            icon: Message,
            activeIcon: MessageFilled
        },
        {
            label: "Notification",
            icon: Noti,
            activeIcon: NotiFilled
        },
        {
            label: "Create",
            icon: Create,
            activeIcon: CreateFilled,
            aciton: openCreatePost
        }
    ];

    return (
        <div className="w-full h-full p-2 flex flex-col select-none">
            <div className="w-full h-12 flex items-center p-1.5 xl:p-3 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                <img src={(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') ? Logo : LogoSvg} className="h-full" alt="" draggable={false} />
            </div>
            <div className="flex-grow flex flex-col gap-2">
                {sideBarItems.map((item, index) => (
                    <div className="w-full h-12 flex items-center gap-3 p-1.5 xl:p-3.5 rounded-lg hover:bg-slate-100 cursor-pointer" key={index} onClick={() => item.aciton()}>
                        <img src={item.icon} alt="" className="w-7" draggable={false} />
                        {(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') && <div className="flex-grow text-base">{item.label}</div>}
                    </div>
                ))}
            </div>
            <div className="w-full h-12 flex items-center p-1.5 xl:p-3.5 gap-3 rounded-lg hover:bg-slate-100 cursor-pointer">
                <img src={Menu} alt="" className="h-full" draggable={false} />
                {(currentBreakpoint !== 'md' && currentBreakpoint !== 'lg') &&<div className="flex-grow text-base">More</div>}
            </div>
        </div>
    );
}

export default SideBar;