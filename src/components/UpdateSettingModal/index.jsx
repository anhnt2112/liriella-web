import React, { useState } from "react";
import { useModal } from "../../context/useModal";
import CloseIcon from "../../assets/svg/close.svg";
import YesNoCheckBox from "../CheckBox/YesNo";
import TextCheckbox from "../CheckBox/Text";

const UpdateSettingModal = () => {
    const { isUpdateSetting, closeUpdateSetting } = useModal();
    const [isUpdateNoti, setIsUpdateNoti] = useState(true);
    const [value, setValue] = useState(0);
    const [setting, setSetting] = useState({
        notiFollowAccount: true,
        notiReactPost: true,
        notiCommentPost: true,
        notiReactComment: true,
        notiReplyComment: true,
        whoCanViewPosts: 0,
        whoCanViewFavorite: 0,
        whoCanViewLiked: 0,
        receiveMessageFrom: 0
    });

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
                            <YesNoCheckBox value={setting.notiFollowAccount} onClick={() => setSetting({...setting,notiFollowAccount: !setting.notiFollowAccount})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            React Your Post
                            <YesNoCheckBox value={setting.notiReactPost} onClick={() => setSetting({...setting,notiReactPost: !setting.notiReactPost})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Comment Your Post
                            <YesNoCheckBox value={setting.notiCommentPost} onClick={() => setSetting({...setting,notiCommentPost: !setting.notiCommentPost})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            React Your Comment
                            <YesNoCheckBox value={setting.notiReactComment} onClick={() => setSetting({...setting,notiReactComment: !setting.notiReactComment})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Reply Your Comment
                            <YesNoCheckBox value={setting.notiReplyComment} onClick={() => setSetting({...setting,notiReplyComment: !setting.notiReplyComment})} />
                        </div></>}
                        {!isUpdateNoti && <>
                        <div className="w-full flex justify-between items-center font-semibold">
                            View Your Posts
                            <TextCheckbox value={setting.whoCanViewPosts} list={list} onClick={() => setSetting({...setting,whoCanViewPosts: (setting.whoCanViewPosts + 1) % 3})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            View Your Favorite
                            <TextCheckbox value={setting.whoCanViewFavorite} list={list} onClick={() => setSetting({...setting,whoCanViewFavorite: (setting.whoCanViewFavorite + 1) % 3})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            View Your Liked
                            <TextCheckbox value={setting.whoCanViewLiked} list={list} onClick={() => setSetting({...setting,whoCanViewLiked: (setting.whoCanViewLiked + 1) % 3})} />
                        </div>
                        <div className="w-full flex justify-between items-center font-semibold">
                            Receive Message
                            <TextCheckbox value={setting.receiveMessageFrom} list={list} onClick={() => setSetting({...setting,receiveMessageFrom: (setting.receiveMessageFrom + 1) % 3})} />
                        </div>
                        </>}
                    </div>
                    <div className="w-full flex justify-between items-center gap-2">
                        <button className="py-1 w-1/2 rounded-xl bg-slate-300 hover:bg-slate-400">Reset</button>
                        <button className="py-1 w-1/2 rounded-xl text-white bg-ui-blue hover:font-semibold">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateSettingModal;