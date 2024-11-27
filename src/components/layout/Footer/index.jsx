import React from "react";
import { Link } from "react-router-dom";
import CopyrightIcon from "../../../assets/svg/copyright.svg";

const Footer = () => {
    const footerItems = [
        {
            path: "about-us",
            label: "About Us"
        },
        {
            path: "privacy-policy",
            label: "Privacy Policy",
        },
        {
            path: "terms-of-service",
            label: "Terms Of Service",
        },
        {
            path: "contact-us",
            label: "Contact Us",
        },
    ];

    return (
        <div className="w-full h-fit flex flex-col items-center py-4 gap-2 md:gap-4">
            <div className="flex justify-between w-fit h-fit gap-2 md:gap-4 text-xs md:text-base">
                {footerItems.map((item, index) => <Link key={index} to={item.path}>{item.label}</Link>)}
            </div>
            <div className="w-fit h-fit flex items-center gap-1">
                <img src={CopyrightIcon} alt="" className="w-3 md:w-4" />
                <div className="w-fit h-full flex items-center justify-center text-xs md:text-base">2024 Libriella from anhnt2112</div>
            </div>
        </div>
    )
}

export default Footer;