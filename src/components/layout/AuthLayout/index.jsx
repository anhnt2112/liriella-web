import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import CreatePostModal from "../../CreatePostModal";
import PostDetail from "../../PostDetail";
import RelationModal from "../../RelationModal";
import UpdateAvatarModal from "../../UpdateAvatarModal";
import PreviewUser from "../../PreviewUser";
import { baseURL } from "../../../utils/services/ApiService";
import { io } from 'socket.io-client';

export const chatSocket = io(`${baseURL}/chat`);
export const notificationSocket = io(`${baseURL}/notification`, {
    transports: ["websocket"],
    reconnection: true
});

const AuthLayout = () => {

    return (<>
        <div className="w-screen h-screen flex">
            <div className="hidden md:inline md:w-fit">
                <SideBar />
            </div>
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
        <CreatePostModal />
        <PostDetail />
        <RelationModal />
        <UpdateAvatarModal />
        <PreviewUser />
    </>);
}

export default AuthLayout;