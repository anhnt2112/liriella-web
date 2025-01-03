import React, { useRef, useState, useEffect } from "react";
import { useModal } from "../../context/useModal";
import EnterIcon from "../../assets/png/enter.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import LikeIcon from "../../assets/png/like.png";
import LikeHoverIcon from "../../assets/png/like_hover.png";
import LikeFilledIcon from "../../assets/png/like_filled.png";
import CommentIcon from "../../assets/png/comment.png";
import CommentFilledIcon from "../../assets/png/comment_hover.png";
import HeartIcon from "../../assets/png/heart.png";
import HeartFilledIcon from "../../assets/png/heart_filled.png";
import HeartHoverIcon from "../../assets/png/heart_hover.png";
import MultipleStateIcon from "../MultipleStateIcon";
import useUser from "../../context/useUser";

const PostDetail = () => {
    const { detailPostId, closeDetailPost } = useModal();
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const { user } = useUser();
    const [content, setContent] = useState("");

    const { data: post, isLoading: isPostLoading, refetch: refetchPost } = useQuery({
        queryKey: ["postDetail", detailPostId],
        queryFn: () => {
            const addedPath = `/${detailPostId}`;
            return axios.get(baseURL+APIsRoutes.Post.GetByPostId.path+addedPath);
        },
        enabled: !!detailPostId
    });

    const { data: likeState, refetch: refetchLikeState } = useQuery({
        queryKey: ["likeState", user?.username, detailPostId],
        queryFn: () => {
            const addedPath = `?postId=${detailPostId}&username=${user?.username}`;
            return axios.get(baseURL+APIsRoutes.Comment.HasLikedPost.path+addedPath);
        },
        enabled: !!detailPostId && !!user
    });

    const { data: comments, refetch: refetchComments } = useQuery({
        queryKey: ["comment", detailPostId],
        queryFn: () => {
            const addedPath = `?postId=${detailPostId}`;
            return axios.get(baseURL+APIsRoutes.Comment.Comment.path+addedPath);
        },
        enabled: !!detailPostId
    });

    const { mutate: commentPost } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+APIsRoutes.Comment.Comment.path, { 
                postId: detailPostId,
                content
            }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: (data) => {
            refetchComments();
            setContent("");
        },
        enabled: !!detailPostId
    });

    const { mutate: likePost } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+APIsRoutes.Comment.Like.path, { 
                postId: detailPostId
            }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetchLikeState();
            refetchPost();
        },
        enabled: !!detailPostId
    });

    const { mutate: unlikePost } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+APIsRoutes.Comment.Unlike.path, { 
                postId: detailPostId
            }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetchLikeState();
            refetchPost();
        },
        enabled: !!detailPostId
    });

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleClickLike = () => {
        if (!likeState?.data.hasLiked) likePost();
        else unlikePost();
    }

    const handleComment = () => {
        if (content.length > 0) {
            commentPost();
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleComment();
        }
    }
    
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeDetailPost();
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const defaultText = (createAt) => {
        if (!createAt) return;
        const date = new Date(createAt);
    
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }).format(date);
    
        return `${formattedDate}`;
    }

    return (<>
        {detailPostId && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className="bg-white w-[750px] lg:w-[1000px] h-[66vh] lg:h-[88vh] overflow-hidden rounded-md flex" ref={modalRef}>
                <div className="w-1/2 bg-black flex items-center justify-center">
                    <img src={baseURL+post?.data.image} alt="" className="aspect-2/3 w-full" />
                </div>
                <div className="h-full w-1/2 bg-white flex flex-col">
                    <div className="w-full p-3 border-b-2 border-slate-200 flex gap-3 items-center">
                        <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                        <div className="font-medium text-lg h-fit flex-grow">{post?.data.author.username}</div>
                    </div>
                    <div className="w-full p-3 flex flex-col gap-3 flex-grow overflow-y-scroll">
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center gap-3">
                                <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                                <div className="font-medium text-lg h-fit flex-grow flex flex-col">{post?.data.author.username}</div>
                            </div>
                            <div className="w-full pl-12 flex flex-col">
                                <div className="flex">
                                    <div className="italic underline font-medium">Book's name:</div>
                                    &nbsp;
                                    <div className="font-semibold flex-grow ">{post?.data.bookName}</div></div>
                                <div>{post?.data.description}</div>
                            </div>
                        </div>
                        {comments?.data.all.map((comment, index) => (
                            <div key={index} className="flex gap-3">
                                <img src={comment?.author.avatar ? baseURL+comment?.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                                <div className="flex-grow flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-lg">{comment?.author.username}</div>
                                        <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} className="hover:cursor-pointer h-4" />
                                    </div>
                                    <div>{comment?.content}</div>
                                    <div className="font-light text-xs">{defaultText(comment?.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full p-3 border-t-2 border-slate-200 flex flex-col gap-2">
                        <div className="w-full flex gap-2">
                            <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} isActive={likeState?.data.hasLiked} className="hover:cursor-pointer w-7" onClick={handleClickLike} />
                            <MultipleStateIcon defaultIcon={CommentIcon} hoverIcon={CommentFilledIcon} className="hover:cursor-pointer w-7" onClick={handleFocus} />
                            {post?.data.author.username === user?.username &&
                            <div className="flex-grow flex justify-end">
                                <MultipleStateIcon defaultIcon={HeartIcon} hoverIcon={HeartHoverIcon} activeIcon={HeartFilledIcon} className="hover:cursor-pointer w-7" />
                            </div>}
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-medium">{`${post?.data.likes} likes`}</div>
                            <div className="font-light text-xs">{defaultText(post?.data.createdAt)}</div>
                        </div>
                    </div>
                    <div className="w-full p-3 border-t-2 border-slate-300 flex items-center gap-3">
                        <img src={EnterIcon} alt="" className="h-9" />
                        <div className="flex-grow">
                            <input placeholder="Add a comment" className="w-full focus:outline-none" ref={inputRef} onKeyDown={handleKeyDown} value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>
                        <div className="text-ui-blue font-semibold hover:cursor-pointer" onClick={handleComment}>Post</div>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}

export default PostDetail;