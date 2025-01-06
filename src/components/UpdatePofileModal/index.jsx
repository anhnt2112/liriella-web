import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svg/close.svg";
import Input from "../Input";
import useUser from "../../context/useUser";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import { useModal } from "../../context/useModal";
import { queryClient } from "../../main";

const UpdateProfileModal = () => {
    const { user } = useUser();
    const [isUpdatePassword, setIsUpdatePassword] = useState(false);
    const [formData, setFormData] = useState(null);
    const { isUpdateInfo, closeUpdateInfo } = useModal();

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleReset = () => {
        setFormData(user);
    };

    const handleClose = () => {
        setFormData(user);
        closeUpdateInfo();
    }

    const { mutate: changeProfile } = useMutation({
        mutationFn: (data) => {
            return axios.post(baseURL+APIsRoutes.User.UpdateUser.path, data, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onError: (error) => {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries("profile");
        }
    });

    const handleSave = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check
        if (isUpdatePassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("The new password and confirmation password do not match.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            } else {
                if (formData?.password?.length < 8 || formData?.newPassword?.length < 8) {
                    toast.error("Password must be at least 8 characters", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                }
            }
        } else {
            if (!formData.fullName || !formData.fullName.length) {
                toast.error("The full name is required.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            } else if (formData?.email?.length && !emailRegex.test(formData.email)) {
                toast.error("Email is not in correct format.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            } else {
                changeProfile({
                    fullName: formData.fullName,
                    email: formData.email
                });
            }
        }
    }

    return (isUpdateInfo &&
        <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className="bg-white rounded-xl w-[calc(100%-20px)] max-w-96 h-[600px] flex flex-col overflow-hidden">
                <div className="w-full h-fit flex flex-col mb-2">
                    <div className="w-full h-fit flex items-center justify-center py-2 font-medium text-base relative">
                        Update Personal Information
                        <img src={CloseIcon} alt="" className="h-1/2 w-auto absolute right-0 -translate-x-1/2 hover:cursor-pointer" onClick={handleClose}/>
                        </div>
                        <div className="w-full h-fit flex border-t-[1px] border-slate-200">
                        <div 
                            className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (isUpdatePassword ? "opacity-30" : "")}
                            onClick={() => setIsUpdatePassword(false)}
                        >
                            Profile
                        </div>
                        <div 
                            className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (!isUpdatePassword ? "opacity-30" : "")}
                            onClick={() => setIsUpdatePassword(true)}
                        >
                            Password
                        </div>
                    </div>
                </div>
                <div className="flex-grow p-4 flex flex-col gap-4">
                    <div className="flex-grow flex flex-col gap-4">
                        <Input label="Username" value={user?.username} readOnly />
                        {!isUpdatePassword && <>
                            <Input label="Full Name" value={formData?.fullName} onChange={(e) => setFormData({
                                ...formData,
                                fullName: e.target.value
                            })} />
                            <Input label="Email" value={formData?.email} onChange={(e) => setFormData({
                                ...formData,
                                email: e.target.value
                            })} />
                        </>}
                        {isUpdatePassword && <>
                            <Input label="Password" value={formData?.password} onChange={(e) => setFormData({
                                ...formData,
                                password: e.target.value
                            })} type="password" />
                            <Input label="New Password" value={formData?.newPassword} onChange={(e) => setFormData({
                                ...formData,
                                newPassword: e.target.value
                            })} type="password" />
                            <Input label="Confirm Password" value={formData?.confirmPassword} onChange={(e) => setFormData({
                                ...formData,
                                confirmPassword: e.target.value
                            })} type="password" />
                        </>}
                    </div>
                    <div className="w-full flex justify-between items-center gap-2">
                        <button className="py-1 w-1/2 rounded-xl bg-slate-300 hover:bg-slate-400" onClick={handleReset}>Reset</button>
                        <button className="py-1 w-1/2 rounded-xl text-white bg-ui-blue hover:font-semibold" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfileModal;