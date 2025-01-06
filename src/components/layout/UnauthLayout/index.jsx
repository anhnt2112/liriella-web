import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import { ToastContainer } from "react-toastify";

const UnauthLayout = () => {
    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="w-full flex-grow flex items-center justify-center">
                <Outlet />
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default UnauthLayout;