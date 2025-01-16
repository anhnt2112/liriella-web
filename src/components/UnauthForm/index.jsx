import React, { useState } from "react";
import ColorLogo from "../../assets/png/color-logo.png";
import { unauthFormStates } from "../../utils/unauth";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthStateEnum } from "../../utils/unauth";
import Input from "../Input";
import { useMutation } from "@tanstack/react-query";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import axios from "axios";
import { toast } from "react-toastify";

const UnauthForm = () => {
    const location = useLocation();
    const path = location.pathname;
    const authState = path.split('/').filter(Boolean).pop();
    const content = unauthFormStates[authState].form;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    const sessionId = searchParams.get('sessionId');

    const [formData, setFormData] = useState({});

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+content.button.action.path, formData);
        },
        onSuccess: (response) => {
            if (content.button.callback) content.button.callback(response);
            if (!response.data.isRecovery) navigate("/information");else navigate(0);
        }
    });

    const { mutate: resetPassword } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL + APIsRoutes.Auth.ResetPassword.path, {username});
        },
        onSuccess: () => {
            toast.done("Send mail successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        },
        onError: (error) => {
            toast.error(error.response.data.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        }
    });

    const handleClick = (item) => {
        if (item.path === "use-google-account") {
            resetPassword();
            return;
        }
        if (item.action) item.action();
        if (item.path) navigate(`/${item.path}?username=${username}`);
        if (item.href) {
            const newLink = baseURL + item.href;
            window.location.href = newLink;
        }
    }

    const handleChangeField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    const renderField = (item) => {
        if (item.type === "link") {
            return <div className="w-full h-fit flex items-center justify-center">
                <button className="font-medium hover:text-ui-blue" onClick={() => handleClick(item)}>{item.label}</button>
            </div>;
        }

        return <>
            {item.description && <div className="w-full h-fit font-semibold">{item.description}</div>}
            <Input label={item.label} type={item.type} value={formData[item.id] ?? ""} onChange={(e) => handleChangeField(item.id, e.target.value)} />
        </>;
    }

    const { mutate: forgotPassword } = useMutation({
        mutationFn: (code) => {
            return axios.post(baseURL + APIsRoutes.Auth.ForgotPassword.path, {
                username,
                code
            });
        },
        onSuccess: (response) => {
            navigate(`/new-password?sessionId=${response?.data.sessionId}`);
        }
    });

    const { mutate: updatePassword } = useMutation({
        mutationFn: (newPassword) => {
            return axios.post(baseURL+APIsRoutes.User.UpdateUser.path, {
                password: newPassword
            }, {
                headers: {
                'session-id': sessionId
            }});
        },
        onSuccess: () => {
            localStorage.setItem("session-id", sessionId);
            navigate("/home");
        }
    })

    const handleSubmit = () => {
        if (authState === AuthStateEnum.ForgotPassword) {
            navigate(`/${AuthStateEnum.ForgotPasswordOptions}?username=${formData.username}`);
        } else if (authState === AuthStateEnum.AnswerQuestion) {
            forgotPassword(formData.code);
        } else if (authState === AuthStateEnum.NewPassword) {
            const errorMessages = [];
            if (!formData?.password || formData.password?.length < 8) errorMessages.push("Password must be at least 8 characters");
            if (formData.password !== formData.confirm) errorMessages.push("Confirm password does not match");
            if (errorMessages.length) {
                errorMessages.map(err => {
                    toast.error(err, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    });
                });
            } else updatePassword(formData.password);
        } else {
            // check username password
            const errorMessages = [];

            if (!formData.username?.length) errorMessages.push("Username is required");
            if (formData.password?.length < 8) errorMessages.push("Password must be at least 8 characters");

            if (authState === AuthStateEnum.SignUp) {
                if (formData.password !== formData.confirm) errorMessages.push("Confirm password does not match");
                if (!formData.fullName?.length) errorMessages.push("Fullname is required");
            }

            if (errorMessages.length) {
                errorMessages.map(err => {
                    toast.error(err, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    });
                });
            } else mutate();
        }
    }

    return (
        <div className="w-full px-10 md:px-12 border border-ui-stroke select-none rounded-sm text-xs md:text-base">
            <div className="w-full flex justify-center">
                <img src={ColorLogo} className="w-1/2 py-10" draggable={false} />
            </div>
            <div className="w-full flex flex-col gap-2 py-2">
                {content.field.map(item => renderField(item))}
                {content.link && content.link.map((item, index) => (
                    <div className="w-full h-fit items-center justify-center" key={index}>{item}</div>
                ))}
                {content.explainText && <>
                <div className="w-full px-4 md:px-5 py-1 flex flex-col gap-2">
                    {content.explainText.map((text, index) => (
                        <div className="text-center text-sm" key={index}>{text}</div>
                    ))}
                </div>
                </>}
                {content.button && <button className="my-3 md:my-4 bg-ui-blue text-white font-semibold p-1 rounded-lg" onClick={handleSubmit}>{content.button.text}</button>}
            </div>
            {content.extra && <>
                <div className="w-full h-fit flex items-center justify-between">
                    <div className="w-1/3 h-0.5 bg-ui-input-stroke" />
                    <div className="font-semibold text-ui-stroke">OR</div>
                    <div className="w-1/3 h-0.5 bg-ui-input-stroke" />
                </div>
                <div className="w-full flex flex-col px-9 md:px-10 gap-1 py-2 md:py-3">
                    {content.extra.map((item, index) => (
                        <div className={"w-full h-fit flex items-center " + (!item.icon ? "justify-center" : "gap-2")} key={index}>
                            <img src={item.icon} alt="" className="h-3 md:h-4" />
                            <button className="font-medium hover:text-ui-blue" onClick={() => handleClick(item)}>{item.label}</button>
                        </div>
                    ))}
                </div>
            </>}
        </div>
    );
}

export default UnauthForm;