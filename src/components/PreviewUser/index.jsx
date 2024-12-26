import React from "react";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import { useModal } from "../../context/useModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import BookCircle from "../../assets/svg/book_circle.svg";

const PreviewUser = () => {
  const { previewUserSetting, closePreviewUser, previewUserRef } = useModal();

  const { data: previewProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profileInfo', previewUserSetting],
    queryFn: async () => {
      const addedPath = `/${previewUserSetting.userID}`;
      return axios.get(baseURL+APIsRoutes.User.ProfileByUserID.path+addedPath);
    },
    enabled: !!previewUserSetting
  });

  const { data: previewPosts, isLoading: isPostLoading } = useQuery({
    queryKey: ['previewPosts', previewUserSetting],
    queryFn: async () => {
      const addedPath = `/${previewUserSetting.userID}`;
      return axios.get(baseURL+APIsRoutes.Post.Preview.path+addedPath);
    }
  });

  return (<>
    {previewUserSetting &&
    <div 
      className={"bg-white w-96 h-fit flex flex-col rounded-xl z-50 fixed select-none"}
      style={{
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        left: previewUserSetting.position.x,
        top: previewUserSetting.position.y
      }}
      ref={previewUserRef}
      onMouseLeave={closePreviewUser}
    >
      <div className="w-full flex gap-3 p-3">
        <img src={previewProfile?.data.avatar ? baseURL + previewProfile?.data.avatar : DefaultAvatar} alt="" className="rounded-full w-14 h-14 hover:cursor-pointer object-cover object-center" draggable={false} />
        <div className="flex flex-col justify-center">
          <div className="text-base font-medium hover:cursor-pointer">{previewProfile?.data.username}</div>
          <div className="text-sm">{previewProfile?.data.fullName}</div>
        </div>
      </div>
      <div className="w-full flex gap-1 pb-3">
        <div className="w-[125.33px] flex flex-col items-center">
          <div className="text-base font-medium">{previewPosts?.data.count}</div>
          <div className="text-sm">posts</div>
        </div>
        <div className="w-[125.33px] flex flex-col items-center">
          <div className="text-base font-medium">{previewProfile?.data.followers.length}</div>
          <div className="text-sm">followers</div>
        </div>
        <div className="w-[125.33px] flex flex-col items-center">
          <div className="text-base font-medium">{previewProfile?.data.following.length}</div>
          <div className="text-sm">following</div>
        </div>
      </div>
      <div className="w-full flex gap-1">
        {previewPosts?.data.previewImage.length ? <>
          {previewPosts?.data.previewImage.map((previewPost, index) => (
            <img key={index} src={baseURL+previewPost.image} alt="" className="w-[125.33px] aspect-2/3 hover:cursor-pointer object-cover object-center" draggable={false} />
          ))}
        </> : 
        <div className="w-full h-[188px] flex flex-col items-center justify-center gap-1 border-y-[1px] border-slate-300">
          <img src={BookCircle} className="w-14 h-14" />
          <div className="text-sm font-medium">No posts yet</div>
          <div className="text-center text-sm">{`When ${previewUserSetting.username} shares books, you'll see them here.`}</div>
        </div>}
      </div>
      <div className="w-full flex gap-2 p-3">
        <div className="flex-grow flex items-center justify-center text-sm font-medium px-4 py-1 rounded-xl bg-[#0095F6] hover:cursor-pointer hover:bg-[#3F00FF] text-white">Message</div>
        <div className="flex-grow flex items-center justify-center text-sm font-medium px-4 py-2 rounded-xl bg-[#EFEFEF] hover:cursor-pointer hover:bg-[#d7d7d7]">Following</div>
      </div>
    </div>}
  </>);
}

export default PreviewUser;