import React, { useEffect, useState } from "react";
import { useModal } from "../../context/useModal";
import CloseIcon from "../../assets/svg/close.svg";
import YesNoCheckBox from "../CheckBox/YesNo";
import TextCheckbox from "../CheckBox/Text";
import useUser from "../../context/useUser";
import { useMutation } from "@tanstack/react-query";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import { toast } from "react-toastify";
import axios from "axios";
import { queryClient } from "../../main";

const UpdateSettingModal = () => {
    const { isUpdateSetting, closeUpdateSetting } = useModal();
    const { user } = useUser();
    const [isUpdateNoti, setIsUpdateNoti] = useState(true);
    const [value, setValue] = useState(0);
    const [setting, setSetting] = useState({
        followNoti: true,
        reactPostNoti: true,
        commentPostNoti: true,
        reactCommentNoti: true,
        replyCommentNoti: true,
        viewPosts: 0,
        viewFavorite: 0,
        reveiveMessage: 0
    });

    useEffect(() => {
        if (user?.setting) setSetting(user.setting);
    }, [user]);

    const { mutate: changeSetting } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+APIsRoutes.User.UpdateSetting.path, setting, { headers: {
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
            closeUpdateSetting();
        }
    });

    const handleSave = () => {
        changeSetting();
    }

    const handleReset = () => {
        setSetting(user?.setting);
    }

    const list = [
        {
            label: "All",
            color: "#4CAF50"
        },
        {
            label: "Follower",
            color: "#FF9800"
        },
        {
            label: "Friend",
            color: "#2196F3"
        }
    ];

    return (isUpdateSetting && 
        <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className="bg-white rounded-xl w-[calc(100%-20px)] max-w-96 h-[600px] flex flex-col overflow-hidden">
                <div className="w-full h-fit flex flex-col mb-2">
                    <div className="w-full h-fit flex items-center justify-center py-2 font-medium text-base relative">
                        Update Personal Information
                        <img src={CloseIcon} alt="" className="h-1/2 w-auto absolute right-0 -translate-x-1/2 hover:cursor-pointer" onClick={closeUpdateSetting}/>
                        </div>
                        <div className="w-full h-fit flex border-t-[1px] border-slate-200">
                        <div 
                            className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (!isUpdateNoti ? "opacity-30" : "")}
                            onClick={() => setIsUpdateNoti(true)}
                        >
                            Noti
                        </div>
                        <div 
                            className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (isUpdateNoti ? "opacity-30" : "")}
                            onClick={() => setIsUpdateNoti(false)}
                        >
                            Role
                        </div>
                    </div>
                </div>
                <div className="flex-grow p-4 flex flex-col gap-4">
                    <div className="flex-grow flex flex-col gap-4">
                        {isUpdateNoti && <>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Follow Your Account
                            <YesNoCheckBox value={setting.followNoti} onClick={() => setSetting({...setting,followNoti: !setting.followNoti})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            React Your Post
                            <YesNoCheckBox value={setting.reactPostNoti} onClick={() => setSetting({...setting,reactPostNoti: !setting.reactPostNoti})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Comment Your Post
                            <YesNoCheckBox value={setting.commentPostNoti} onClick={() => setSetting({...setting,commentPostNoti: !setting.commentPostNoti})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            React Your Comment
                            <YesNoCheckBox value={setting.reactCommentNoti} onClick={() => setSetting({...setting,reactCommentNoti: !setting.reactCommentNoti})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Reply Your Comment
                            <YesNoCheckBox value={setting.replyCommentNoti} onClick={() => setSetting({...setting,replyCommentNoti: !setting.replyCommentNoti})} />
                        </div></>}
                        {!isUpdateNoti && <>
                        <div className="w-full flex justify-between items-center font-semibold">
                            View Your Posts
                            <TextCheckbox value={setting.viewPosts} list={list} onClick={() => setSetting({...setting,viewPosts: (setting.viewPosts + 1) % 3})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            View Your Favorite
                            <TextCheckbox value={setting.viewFavorite} list={list} onClick={() => setSetting({...setting,viewFavorite: (setting.viewFavorite + 1) % 3})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Receive Message
                            <TextCheckbox value={setting.reveiveMessage} list={list} onClick={() => setSetting({...setting,reveiveMessage: (setting.reveiveMessage + 1) % 3})} />
                        </div>
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

export default UpdateSettingModal;