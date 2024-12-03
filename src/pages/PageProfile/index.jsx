import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import axios from "axios";

import Grid from "../../assets/png/grid.png";
import GridFilled from "../../assets/png/grid_filled.png";

import Heart from "../../assets/png/heart.png";
import HeartFilled from "../../assets/png/heart_filled.png";
import PostPreview from "../../components/PostPreview";
import useUser from "../../context/useUser";

const PageProfile = () => {
  const [inFavorite, setInFavorite] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const username = (location.pathname.split("/")[2] ?? user?.username) ?? "";

  const { data: profile, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ['profileInfo', username],
    queryFn: async () => {
      if (!username.length) return;
      const addedPath = `/${username}`;
      return axios.get(baseURL+APIsRoutes.User.ProfileByUsername.path+addedPath, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
  });

  const { data, isLoading: isLoadingPost} = useQuery({
    queryKey: ['profilePosts', username, inFavorite],
    queryFn: async () => {
      const addedPath = `/${username}?isFavorite=${inFavorite}`;
      return axios.get(baseURL+APIsRoutes.Post.GetProfile.path+addedPath, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
  });

  const { mutate, isLoading: isLoadingMutate } = useMutation({
    mutationFn: () => {
      if (!user || !profile.data) return;
      if (user?.username === username) return;
      const isFollowing = profile.data.followers.includes(user.username);
      const addedPath = `/${username}`;
      return axios.post(baseURL+(isFollowing ? APIsRoutes.User.UnFollowUser.path : APIsRoutes.User.FollowUser.path)+addedPath, null, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleClick = () => {
    // if (!user) return;
    if (user?.username === username) {
      console.log("Edit profile");
    } else {
      mutate();
    }
  }

  return (
    <div className="w-full h-screen flex justify-center select-none">
      <div className="w-full max-w-[1024px]">
        {/* Profile */}
        {isProfileLoading ? <div>Loading...</div> : profile?.data ? 
        <div className="w-full px-20 py-10 flex items-center md:gap-10 lg:gap-20">
          <img src="https://imgs.search.brave.com/DzYUMuG6uVmYZmZQgrATGPCHt8EYwZUw5lH9TKjuVFo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kMzhi/MDQ0cGV2bndjOS5j/bG91ZGZyb250Lm5l/dC9jdXRvdXQtbnV4/dC9jYXJ0b29uL25l/dy8xMy5qcGc" className="rounded-full w-40 h-40" draggable={false} />
          <div className="flex-grow h-full flex flex-col gap-3">
            <div className="w-full flex items-center gap-4">
              <div className="text-xl">{profile.data.username}</div>
              <div className="bg-[#0095F6] px-4 py-1 text-white rounded-xl hover:cursor-pointer font-medium" onClick={handleClick}>
                {user.username === username ? "Edit profile" : !profile.data.followers.includes(user.username) ? "Follow" : "Unfollow"}
              </div>
              <div className="bg-[#EFEFEF] px-4 py-1 rounded-xl font-medium hover:cursor-pointer">
                {user.username === username ? "Setting" : "Message"}
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex gap-1 text-lg">
                <div className="font-semibold">2</div>
                <div>posts</div>
              </div>
              <div className="flex gap-1 text-lg hover:cursor-pointer active:opacity-60">
                <div className="font-semibold">{profile.data.followers.length}</div>
                <div>followers</div>
              </div>
              <div className="flex gap-1 text-lg hover:cursor-pointer active:opacity-60">
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
                <div className="w-1/4 aspect-2/3 p-3" key={index}>
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