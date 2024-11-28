import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import CreatePostModal from "../../CreatePostModal";
import PostDetail from "../../PostDetail";

const AuthLayout = () => {

    return (<>
        <div className="w-screen h-screen flex">
            <div className="w-0 md:w-14 xl:w-60">
                <SideBar />
            </div>
            <div className="w-[1px] h-full bg-ui-input-stroke" />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
        <CreatePostModal />
        <PostDetail />
    </>);
}

export default AuthLayout;