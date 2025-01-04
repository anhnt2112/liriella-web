import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import axios from "axios";

import Grid from "../../assets/png/grid.png";
import GridFilled from "../../assets/png/grid_filled.png";

import Heart from "../../assets/png/heart.png";
import HeartFilled from "../../assets/png/heart_filled.png";
import PostPreview from "../../components/PostPreview";
import useUser from "../../context/useUser";
import { useModal } from "../../context/useModal";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import NoteBox from "../../components/NoteBox";

const PageProfile = () => {
  const [inFavorite, setInFavorite] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const username = (location.pathname.split("/")[2] ?? user?.username) ?? ""; 
  const { openRelationModal, setInFollowing, setInFollowers, openChangeAvatar, openCreateNote } = useModal();

  const { data: profile, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ['profileInfo', username],
    queryFn: async () => {
      const addedPath = `/${username}`;
      return axios.get(baseURL+APIsRoutes.User.ProfileByUsername.path+addedPath, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    enabled: !!username
  });

  const { data: response, isLoading, refetch: refetchNote } = useQuery({
    queryKey: ['note', profile?.data._id],
    queryFn: () => {
        return axios.get(baseURL+APIsRoutes.Post.GetNote.path+`/${profile?.data._id}`);
    },
    enabled: !! profile?.data._id
});

  const { data, isLoading: isLoadingPost} = useQuery({
    queryKey: ['profilePosts', profile?.data._id, inFavorite],
    queryFn: async () => {
      const addedPath = `/${profile?.data._id}?isFavorite=${inFavorite}`;
      return axios.get(baseURL+APIsRoutes.Post.GetProfile.path+addedPath, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    enabled: !!profile
  });

  const { mutate, isLoading: isLoadingMutate } = useMutation({
    mutationFn: () => {
      if (!user || !profile.data) return;
      if (user?.username === username) return;
      const isFollowing = profile.data.followers.includes(user._id);
      const addedPath = `/${profile.data._id}`;
      return axios.post(baseURL+(isFollowing ? APIsRoutes.User.UnFollowUser.path : APIsRoutes.User.FollowUser.path)+addedPath, null, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      refetch();
    }
  });

  const { mutate: goToConversation, isLoading: isLoadingConversation } = useMutation({
    mutationFn: () => {
      if (!user || !profile.data) return;
      if (user?.username === username) return;
      return axios.post(baseURL+APIsRoutes.Conversation.Post.path, { receiver: username }, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: (response) => {
      navigate(`/message/${response.data._id}`);
    }
  })

  const handleClick = () => {
    // if (!user) return;
    if (user?.username === username) {
      console.log("Edit profile");
    } else {
      mutate();
    }
  }

  const handleMessage = () => {
    if (user?.username === username) {
      console.log("Go to setting");
    } else {
      goToConversation();
    }
  }

  const handleOpenFollowers = () => {
    openRelationModal(profile?.data._id);
    setInFollowers(true);
  }

  const handleOpenFollowing = () => {
    openRelationModal(profile?.data._id);
    setInFollowing(true);
  }

  const handleChangeAvatar = () => {
    if (user?.username === username) {
      openChangeAvatar();
    }
  }

  const handleChangeNote = () => {
    if (user?.username === username) openCreateNote();
  }

  return (
    <div className="w-full h-screen flex justify-center select-none">
      <div className="w-full max-w-[1024px]">
        {/* Profile */}
        {isProfileLoading ? <div>Loading...</div> : profile?.data ? 
        <div className="w-full px-20 py-10 flex items-center gap-5 md:gap-10 lg:gap-20">
          <div className="relative flex justify-center pt-6">
            <img src={profile?.data.avatar ? baseURL + profile?.data.avatar : DefaultAvatar} className="rounded-full w-20 h-20 md:w-40 md:h-40 hover:cursor-pointer object-cover object-center" draggable={false} onClick={handleChangeAvatar} />
            <NoteBox className="top-0 left-0 max-w-full text-xs h-12" note={response?.data[0]?.content ?? null} onClick={handleChangeNote} />
          </div>
          <div className="flex-grow h-full flex flex-col gap-1 md:gap-3">
            <div className="w-full flex items-center gap-4">
              <div className="text-xl">{profile.data.username}</div>
              <div className="bg-[#0095F6] px-3.5 py-1 text-white rounded-xl hover:cursor-pointer hover:bg-[#3F00FF] font-medium" onClick={handleClick}>
                {user.username === username ? "Edit profile" : !profile.data.followers.includes(user._id) ? "Follow" : "Unfollow"}
              </div>
              <div className="bg-[#EFEFEF] px-3.5 py-1 rounded-xl font-medium hover:cursor-pointer hover:bg-[#d7d7d7]" onClick={handleMessage}>
                {user.username === username ? "Setting" : "Message"}
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex gap-1 text-lg">
                <div className="font-semibold">2</div>
                <div>posts</div>
              </div>
              <div className="flex gap-1 text-lg hover:cursor-pointer active:opacity-60" onClick={handleOpenFollowers}>
                <div className="font-semibold">{profile.data.followers.length}</div>
                <div>followers</div>
              </div>
              <div className="flex gap-1 text-lg hover:cursor-pointer active:opacity-60" onClick={handleOpenFollowing}>
                <div className="font-semibold">{profile.data.following.length}</div>
                <div>following</div>
              </div>
            </div>
            <div>{profile.data.fullName}</div>
          </div>
        </div> : (
          <div>Error loading profile data</div>
        )}
        {/* Post */}
        <div className="w-full border-t-[1px] border-slate-200 flex justify-center gap-2">
          <div className={"w-32 p-2 flex items-center justify-center gap-2 cursor-pointer rounded-b-sm active:text-slate-500 " + (!inFavorite ? "border-t-[1px] border-black" : "")} onClick={() => setInFavorite(false)}>
            <img src={inFavorite ? Grid : GridFilled} alt="grid" className="h-6 p-1" />
            <div className={!inFavorite ? "font-semibold" : ""}>POSTS</div>
          </div>
          <div className={"w-32 p-2 flex items-center justify-center gap-2 cursor-pointer rounded-b-sm active:text-slate-500 " + (inFavorite ? "border-t-[1px] border-black" : "")} onClick={() => setInFavorite(true)}>
            <img src={inFavorite ? HeartFilled : Heart} alt="heart" className="h-6" />
            <div className={inFavorite ? "font-semibold" : ""}>FAVORITE</div>
          </div>
        </div>

        <div className="w-full py-10">
          {isLoadingPost ? <div>Loading...</div> : data?.data?.posts ? data?.data?.posts?.reduce((acc, _, index) => {
            if (index % 4 === 0) acc.push(data.data.posts?.slice(index, index + 4));
            return acc;
          }, []).map((postGr, ind) => (
            <div className="w-full h-fit flex" key={ind}>
              {postGr.map((post, index) => (
                <div className="w-1/4 aspect-2/3 p-1" key={index}>
                  <PostPreview post={post} />
                </div>
              ))}
            </div>
          )) : (
            <div>Error loading profile data</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageProfile;