import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

import Logo from "../../../assets/png/logo.png";
import LogoSvg from "../../../assets/svg/logo.svg";

import Home from "../../../assets/svg/home.svg";
import HomeFilled from "../../../assets/svg/home_filled.svg";

import Search from "../../../assets/svg/search.svg";
import SearchFilled from "../../../assets/png/search_filled.png";

import Explore from "../../../assets/png/compass.png";
import ExploreFilled from "../../../assets/png/compass_filled.png";

import Message from "../../../assets/svg/mesage.svg";
import MessageFilled from "../../../assets/svg/message_filled.svg";

import Noti from "../../../assets/svg/notification.svg";
import NotiFilled from "../../../assets/svg/notification_filled.svg";

import Create from "../../../assets/png/create.png";
import CreateFilled from "../../../assets/png/create_filled.png";

import Menu from "../../../assets/svg/menu.svg";
import MenuFilled from "../../../assets/svg/menu_filled.svg";

import DefaultAvatar from "../../../assets/png/avatar.png";
import DefaultAvatarFilled from "../../../assets/png/avatar_filled.png";

import BookIcon from "../../../assets/png/book.png";
import DefaultAvt from "../../../assets/jpg/default_avt.jpg";

import useTailwindBreakpoint from "../../../context/useTailwindBreakpoint";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../../context/useModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIsRoutes, baseURL } from "../../../utils/services/ApiService";
import useNotificationSocket from "../../../context/useNotificationSocket";
import useUser from "../../../context/useUser";

const SideBar = () => {
    const { currentBreakpoint } = useTailwindBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();
    const { openCreatePost, isCreatePost, openDetailPost, isMoreOpen, setIsMoreOpen } = useModal();
    const { user } = useUser();
    const { registerUser } = useNotificationSocket();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(currentBreakpoint === 'md' || currentBreakpoint === 'lg');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [onSearchByUsername, setOnSearchByUsername] = useState(true);
    const [searchContent, setSearchContent] = useState("");
    const sidebarRef = useRef(null);
    const [notiState, setNotiState] = useState({
        isPost: false,
        isComment: false
    });

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
            activeIcon: SearchFilled,
            action: () => {setIsSearchOpen(true); setIsNotiOpen(false);}
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
            activeIcon: NotiFilled,
            action: () => {setIsNotiOpen(true); setIsSearchOpen(false);}
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

    const notificationItems = [
        {
            id: "followers",
            label: "Followers"
        },
        {
            id: "posts",
            label: "Posts"
        },
        {
            id: "comments",
            label: "Comments"
        }
    ];

    const handleClickNotiItem = (id) => {
        if (id === 'followers') {
            setNotiState({
                isPost: false
            });
            return;
        }
        if (id === 'posts') {
            setNotiState({
                isPost: true,
                isComment: false
            });
            return;
        }
        if (id === 'comments') {
            setNotiState({
                isPost: true,
                isComment: true
            });
            return;
        }
    }

    const handleGetActiveNotiItem = (id) => {
        if (id === "followers") return !notiState.isPost;
        if (id === "posts") return notiState.isPost && !notiState.isComment;
        if (id === "comments") return notiState.isPost && notiState.isComment;
        return false;
    }

    const handleClickNotification = (item) => {
        if (!item.postId) navigate(`profile/${item.creatorId.username}`);
        else {
            console.log("Open post");
        }
    }

    useEffect(() => {
        if (user?._id) {
            registerUser(user?._id);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsNotiOpen(false);
                setIsSearchOpen(false);
                setSearchContent("");
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    

    const getActiveStatus = (id) => {
        if (isMoreOpen) return false;
        if (isCreatePost) {
            return id === "create";
        } else if (isSearchOpen) {
            return id === "search";
        } else if (isNotiOpen) {
            return id === "notification";
        } else {
            const path = location.pathname.split('/')[1];
            return path === id;
        }
    }

    const switchToUsernameSearch = () => {
        if (!onSearchByUsername) {
            setOnSearchByUsername(true);
            setSearchContent("");
        }
    }

    const switchToBookNameSearch = () => {
        if (onSearchByUsername) {
            setOnSearchByUsername(false);
            setSearchContent("");
        }
    }

    useEffect(() => {
        setIsSidebarCollapsed(currentBreakpoint === 'md' || currentBreakpoint === 'lg');
    }, [currentBreakpoint]);

    const { data: searchResult, isLoading: isLoadingSearchResult, refetch: refetchSearch } = useQuery({
        queryKey: ["search", searchContent, onSearchByUsername],
        queryFn: () => {
            const addedPath = onSearchByUsername ? `?username=${searchContent}` : `?bookName=${searchContent}`;
            const apiPath = onSearchByUsername ? APIsRoutes.User.Search.path : APIsRoutes.Post.Search.path;
            return axios.get(baseURL+apiPath+addedPath);
        },
        enabled: !!searchContent
    });

    const { data: notification, isLoading: isLoadingNotification, refetch: refetchNotification } = useQuery({
        queryKey: ["notification"],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Notification.Get.path, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    const defaultText = (createAt) => {
        if (!createAt) return;
        const date = new Date(createAt);
    
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }).format(date);
    
        return `${formattedDate}`;
    }

    const handleGoToProfile = (username) => {
        setSearchContent("");
        setIsSearchOpen(false);
        setIsNotiOpen(false);
        navigate(`profile/${username}`);
    }

    const handleOpenPost = (postId) => {
        openDetailPost(postId);
    }

    console.log(notification?.data.filter(noti => {
        if (!notiState.isPost) {
            return !noti.postId;
        } else {
            if (notiState.isComment) {
                return noti.postId && noti.commentId;
            } else {
                return noti.postId && !noti.commentId;
            }
        }
    }));

    return (<div className="w-fit h-full flex relative" ref={sidebarRef}>
        <motion.div 
            className="h-full p-2 flex flex-col select-none relative border-r-[1px] border-ui-input-stroke overflow-hidden"
            initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: "56px" } : { width: "240px" }}
            animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: "56px" } : { width: "240px" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <motion.div 
                className="w-full h-12 flex items-center mb-6 hover:cursor-pointer relative" 
                onClick={() => navigate('home')}
                initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "12px" }}
                animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "12px" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <motion.img 
                    src={LogoSvg} className="h-9" alt="" draggable={false}
                    initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { display: 1 } : { opacity: 0 }}
                    animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                <motion.img 
                    src={Logo} className="h-full absolute inset-0 p-3" alt="" draggable={false}
                    initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { opacity: 0 } : { opacity: 1 }}
                    animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </motion.div>
            <div className="flex-grow flex flex-col gap-2">
                {sideBarItems.map((item, index) => (
                    <motion.div 
                        className="w-full h-12 flex items-center gap-3 rounded-lg hover:bg-slate-100 hover:cursor-pointer" 
                        key={index} onClick={() => item.action()}
                        initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "14px" }}
                        animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "14px" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <img src={getActiveStatus(item.id) ? item.activeIcon : item.icon} alt="" className="w-7" draggable={false} />
                        <motion.div 
                            className={"flex-grow text-base " + (getActiveStatus(item.id) ? "font-semibold" : "")}
                            initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: 0, opacity: 0 } : { width: "fit-content", opacity: 1 }}
                            animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: 0, opacity: 0 } : { width: "fit-content", opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {item.label}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <motion.div 
                className="w-full h-12 flex items-center gap-3 rounded-lg hover:bg-slate-100 hover:cursor-pointer" 
                onClick={() => setIsMoreOpen(true)}
                initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "14px" }}
                animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { padding: "6px" } : { padding: "14px" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <img src={isMoreOpen ? MenuFilled : Menu} alt="" className="h-full" draggable={false} />
                <motion.div 
                    className={"flex-grow text-base " + (isMoreOpen ? "font-semibold" : "")}
                    initial={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: 0, opacity: 0 } : { width: "fit-content", opacity: 1 }}
                    animate={(isSidebarCollapsed || isSearchOpen || isNotiOpen) ? { width: 0, opacity: 0 } : { width: "fit-content", opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    More
                </motion.div>
            </motion.div>
        </motion.div>
        <motion.div
            className="h-full rounded-r-2xl border-r-[1px] border-ui-input-stroke overflow-hidden flex flex-col absolute top-0 left-full z-20 bg-white"
            initial={(isSearchOpen || isNotiOpen) ? { width: "400px", opacity: 1 } : { width: "0px", opacity: 0 }}
            animate={(isSearchOpen || isNotiOpen) ? { width: "400px", opacity: 1 } : { width: "0px", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
                boxShadow: "4px 0 4px rgba(0, 0, 0, 0.05)"
            }}
        >
            {isSearchOpen &&
            <>
                <div className="text-2xl w-full font-semibold px-3 py-5">
                    Search
                </div>
                <div className="w-full flex flex-col flex-grow gap-3">
                    <div className="px-3">
                        <div className="h-10 rounded-md bg-[#EFEFEF] flex overflow-hidden">
                            <motion.div className={onSearchByUsername ? "flex-grow" : "flex-grow-0 hover:cursor-pointer hover:bg-slate-200 px-2 flex items-center justify-center"} onClick={switchToUsernameSearch}>
                                {onSearchByUsername ? <input className="px-3 h-full text-sm bg-transparent focus:outline-none" placeholder="Search by username" value={searchContent} onChange={(e) => setSearchContent(e.target.value)}/> : <img src={DefaultAvatar} alt="" className="h-6" />}
                            </motion.div>
                            <motion.div className={"border-l-[1px] border-ui-input-stroke " +  (!onSearchByUsername ? "flex-grow" : "flex-grow-0 hover:cursor-pointer hover:bg-slate-200 px-2 flex items-center justify-center")} onClick={switchToBookNameSearch}>
                                {!onSearchByUsername ? <input className="px-3 h-full text-sm bg-transparent focus:outline-none" placeholder={`Search by book${`'`}s name`} value={searchContent} onChange={(e) => setSearchContent(e.target.value)}/> : <img src={BookIcon} alt="" className="h-6"/>}
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex-grow overflow-hidden overflow-y-scroll">
                        {(searchResult?.data ?? []).map((item, index) => (
                            onSearchByUsername ? (
                            <div className="w-full flex p-3 hover:bg-slate-100 hover:cursor-pointer gap-3 select-none" key={index} onClick={() => handleGoToProfile(item.username)}>
                                <img src={item.avatar ? baseURL+item.avatar : DefaultAvatar} alt="" className="h-11 w-11 rounded-full" draggable={false} />
                                <div className="flex-grow flex flex-col justify-center text-md">
                                    <div className="font-medium">{item.username}</div>
                                    <div className="font-normal opacity-70 text-md flex overflow-hidden gap-1">
                                        <div>{item.fullName}</div>
                                        &#x2022;
                                        <div>{`${item.followers.length} followers`}</div>
                                    </div>
                                </div>
                            </div>) : (
                            <div className="w-full flex p-3 hover:bg-slate-100 hover:cursor-pointer gap-3 select-none" key={index} onClick={() => handleOpenPost(item._id)}>
                                <img src={baseURL+item.image} alt="" className="w-11 aspect-2/3 rounded-sm" draggable={false} />
                                <div className="flex-grow flex flex-col justify-center text-md">
                                    <div className="font-medium">{item.bookName}</div>
                                    <div className="font-normal text-md flex overflow-hidden gap-1">
                                        <div>{`${item.likes} likes`}</div>
                                        &#x2022;
                                        <div>{`${item.comments} comments`}</div>
                                    </div>
                                    <div className="font-normal opacity-70 text-md flex overflow-hidden gap-1">
                                        <div>{item.author.username}</div>
                                        &#x2022;
                                        <div>{defaultText(item.createdAt)}</div>
                                    </div>
                                </div>
                            </div>)
                        ))}
                    </div>
                </div>
            </>}
            {isNotiOpen && 
            <>
                <div className="text-2xl w-full font-semibold px-3 py-5">
                    Notification
                </div>
                <div className="w-full flex">
                    {notificationItems.map((item) => {
                        const isActive = handleGetActiveNotiItem(item.id);
                        return (
                            <div className={"hover:cursor-pointer w-1/3 flex items-center justify-center border-b-[1px] border-black py-3 " + (isActive ? "font-semibold": "opacity-30")} key={item.id} onClick={() => handleClickNotiItem(item.id)}>{item.label}</div>
                        );
                    })}
                </div>
                <div className="overflow-y-scroll flex flex-col gap-3 py-3">
                    {notification?.data.filter(noti => {
                        if (!notiState.isPost) {
                            return !noti.postId;
                        } else {
                            if (notiState.isComment) {
                                return noti.postId && !!noti.commentId?.comment;
                            } else {
                                return noti.postId && !noti.commentId?.comment;
                            }
                        }
                    }).map((item => {
                        if (!notiState.isPost) {
                            return (
                                <div className="p-3 hover:cursor-pointer hover:bg-slate-100 flex gap-3" onClick={() => handleClickNotification(item)}>
                                    <img src={item.creatorId.avatar ? baseURL+item.creatorId.avatar : DefaultAvt} className="w-11 h-11 rounded-full object-cover object-fit" />
                                    <div className="flex flex-col justify-center">
                                        <div className="font-semibold">@{item.creatorId.username}</div>
                                        <div>started following you.</div>
                                    </div>
                                </div>
                            );
                        } else {
                            if (notiState.isComment) {
                                return (
                                    <div className="p-3 hover:cursor-pointer hover:bg-slate-100 flex gap-3" onClick={() => handleClickNotification(item)}>
                                        <img src={baseURL+item.postId.image} className="w-11 aspect-2/3 rounded-sm object-cover object-fit" />
                                        <div className="flex flex-col justify-center">
                                            <div className="font-semibold">@{item.creatorId.username}</div>
                                            <div>{item.commentId?.content ? "Commented on " : "Reacted to "}your post.</div>
                                            <div className="flex gap-1"><div className="font-light italic">{item.commentId?.content}</div>&bull;<div>{defaultText(item.createdAt)}</div></div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="p-3 hover:cursor-pointer hover:bg-slate-100 flex gap-3" onClick={() => handleClickNotification(item)}>
                                        <img src={baseURL+item.postId.image} className="w-11 aspect-2/3 rounded-sm object-cover object-fit" />
                                        <div className="flex flex-col justify-center">
                                            <div className="font-semibold">@{item.creatorId.username}</div>
                                            <div>{item.commentId?.content ? "Commented on " : "Reacted to "}your post.</div>
                                            <div className="flex gap-1"><div className="font-light italic">{item.commentId?.content}</div>&bull;<div>{defaultText(item.createdAt)}</div></div>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    }))}
                </div>
            </>}
        </motion.div>
    </div>);
}

export default SideBar;