import React, { useState } from "react";
import ColorLogo from "../../assets/png/color-logo.png";
import Input from "../../components/Input";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import Footer from "../../components/layout/Footer";

const PageAfterRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const facebookId = searchParams.get("facebookId");
    const googleId = searchParams.get("googleId");
    const email = searchParams.get("email");
    const [username, setUsername] = useState("");
    const [recovery, setRecovery] = useState("");

    const { mutate } = useMutation({
        mutationFn: () => {
            let formData = {
                recovery: recovery,
            };
            let path = email ? APIsRoutes.Auth.Register.path : APIsRoutes.User.UpdateUser.path;
            let options = email ? {} : { headers: {
                'session-id': localStorage.getItem('session-id')
            }};
            if (email) {
                formData.email = email;
                formData.username = username;
                if (facebookId) {
                    formData.facebookId = facebookId;
                    formData.fullName = `Facebook ${facebookId}`;
                }
                if (googleId) {
                    formData.googleId = googleId;
                    formData.fullName = `Google ${googleId}`;
                }
            }

            return axios.post(baseURL+path, formData, options);
        },
        onSuccess: (response) => {
            if (response.data.sessionId)
                localStorage.setItem("session-id", response.data.sessionId);
            navigate("home");
        }
    });

    const handleClick = () => {
        mutate();
    }

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="w-full flex-grow flex items-center justify-center">
                <div className="w-80 md:w-96 h-fit flex flex-col items-center justify-center gap-4">
                    <div className="w-full px-10 md:px-12 border border-ui-stroke select-none rounded-sm text-xs md:text-base">
                        <div className="w-full flex justify-center">
                            <img src={ColorLogo} className="w-1/2 py-10" draggable={false} />
                        </div>
                        <div className="w-full flex flex-col gap-2 py-2">
                            {email && <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />}
                            <Input label="Recovery" type="text" value={recovery} onChange={(e) => setRecovery(e.target.value)} />
                            <button className="my-3 md:my-4 bg-ui-blue text-white font-semibold p-1 rounded-lg" onClick={handleClick}>Save information</button>
                        </div>
                    </div>
                    <div className="w-full px-10 md:px-12 border border-ui-stroke select-none rounded-sm text-xs md:text-base flex items-center justify-center">
                        <button className="my-3 md:my-4 text-ui-blue font-semibold p-1 rounded-lg" onClick={() => navigate("log-in")}>Back To{' '}{email ? "Login" : "Home"}</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PageAfterRegister;