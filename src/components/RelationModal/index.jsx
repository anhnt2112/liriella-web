import React, { useRef } from "react";
import { useModal } from "../../context/useModal";
import { useQuery } from "@tanstack/react-query";
import { baseURL,APIsRoutes } from "../../utils/services/ApiService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CloseIcon from "../../assets/svg/close.svg";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";

const RelationModal = () => {
  const { relationID, openRelationModal, closeRelationModal, inFollowers, setInFollowing, setInFollowers, openPreviewUser, closePreviewUser, previewUserRef } = useModal();
  const avatarRef = useRef(null);
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['relation', relationID],
    queryFn: async () => {
      const addedPath = `/${relationID}`;
      return axios.get(baseURL+APIsRoutes.User.Connections.path+addedPath);
    },
    enabled: !!relationID
  });

  const handleMouseEnter = (_username, ref) => {
    if (!ref) return;
    const rect = ref.current.getBoundingClientRect();
    openPreviewUser(_username, {
      x: rect.left,
      y: rect.bottom
    });
  }

  const handleMouseLeave = (event) => {
    if (previewUserRef) {
      const rect = previewUserRef.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        closePreviewUser();
      }
    }
  }

  const handleGoToProfile = (username) => {
    closeRelationModal();
    closePreviewUser();
    navigate(`profile/${username}`);
  }

  return (<>
    {relationID && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
      <div className="bg-white rounded-xl w-96 h-[600px] flex flex-col overflow-hidden">
        <div className="w-full h-fit flex flex-col mb-2">
          <div className="w-full h-fit flex items-center justify-center py-2 font-medium text-base relative">
            Connections
            <img src={CloseIcon} alt="" className="h-1/2 w-auto absolute right-0 -translate-x-1/2 hover:cursor-pointer" onClick={closeRelationModal} />
          </div>
          <div className="w-full h-fit flex border-t-[1px] border-slate-200">
            <div 
              className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (inFollowers ? "" : "opacity-30")}
              onClick={setInFollowers}
            >
              Followers
            </div>
            <div 
              className={"w-1/2 py-2 flex justify-center hover:cursor-pointer text-sm border-b-[1px] border-slate-950 font-medium " + (inFollowers ? "opacity-30" : "")}
              onClick={setInFollowing}
            >
              Following
            </div>
          </div>
        </div>
        <div className="w-full flex-grow rounded-b-xl overflow-y-scroll relative">
          {((inFollowers ? data?.data?.followers : data?.data?.following) ?? []).map((user, index) => (
            <div className="w-full h-fit px-4 py-2 flex items-center justify-between gap-3" key={index}>
              <div className="relative">
                <img src={user.avatar ? baseURL + user.avatar : DefaultAvatar} alt="" className="rounded-full w-12 h-12 hover:cursor-pointer object-cover object-center" draggable={false} ref={avatarRef} onMouseEnter={() => handleMouseEnter(user._id, avatarRef)} onMouseLeave={handleMouseLeave} onClick={() => handleGoToProfile(user.username)}/>
              </div>
              <div className="flex-grow flex flex-col relative">
                <div className="text-sm font-medium hover:cursor-pointer" ref={usernameRef} onMouseEnter={() => handleMouseEnter(user._id, usernameRef)} onMouseLeave={handleMouseLeave} onClick={() => handleGoToProfile(user.username)}>{user.username}</div>
                <div className="text-base font-normal opacity-70">{user.fullName}</div>
              </div>
              <div className="w-28 h-8 flex items-center justify-center rounded-xl bg-[#EFEFEF] hover:cursor-pointer hover:bg-[#d7d7d7] text-sm font-medium">Following</div>
            </div>
          ))}
        </div>
      </div>
    </div>}
  </>);
}
export default RelationModal;