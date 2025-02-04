import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import ThreeDot from "../../assets/png/three_dot.png";
import LikeIcon from "../../assets/png/like.png";
import LikeHoverIcon from "../../assets/png/like_hover.png";
import LikeFilledIcon from "../../assets/png/like_filled.png";
import CommentIcon from "../../assets/png/comment.png";
import CommentFilledIcon from "../../assets/png/comment_hover.png";
import MultipleStateIcon from "../../components/MultipleStateIcon";
import CartIcon from "../../assets/png/cart.png";
import CartHoverIcon from "../../assets/png/cart_hover.png";
import { useModal } from "../../context/useModal";
import DivIntersection from "../../components/DivIntersection";
import useUser from "../../context/useUser";
import useTailwindBreakpoint from "../../context/useTailwindBreakpoint";
import useEmblaCarousel from "embla-carousel-react";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
  } from '../../components/Carousel/ArrowButton';
import { useNavigate } from "react-router-dom";
import Tag, { tags } from "../../components/Tag";

const PageHome = () => {
    const { openDetailPost, openNoteCarousel } = useModal();
    const { user } = useUser();
    const [postState, setPostState] = useState({});
    const { isLargeScreen } = useTailwindBreakpoint();
    const [emblaRef, emblaApi] = useEmblaCarousel();
    const navigate = useNavigate();

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
      } = usePrevNextButtons(emblaApi);

    const { data: followingPosts, isLoading, refetch } = useQuery({
        queryKey: ['followingPosts'],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.Following.path,  { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    const { data: suggested, refetch: refetchSuggessted } = useQuery({
        queryKey: ['suggested'],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.User.Explore.path,  { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    const { data: notesResponse, refetch: refetchNotes } = useQuery({
        queryKey: ['notes'],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.GetNotes.path, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    const { mutate } = useMutation({
        mutationFn: (id) => {
            return axios.post(baseURL+APIsRoutes.User.FollowUser.path+`/${id}`, null, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetchSuggessted();
        }
    });

    const { mutate: getLikeState } = useMutation({
        mutationFn: (postId) => {
            const addedPath = `?postId=${postId}&username=${user?.username}`;
            return axios.get(baseURL+APIsRoutes.Comment.HasLikedPost.path+addedPath);
        },
        onSuccess: (response, postId) => {
            setPostState({
                ...postState,
                [postId]: response.data.hasLiked
            });
        },
        enabled: !!user
    });

    const { mutate: likePost } = useMutation({
        mutationFn: (postId) => {
            return axios.post(baseURL+APIsRoutes.Comment.Like.path, { 
                postId
            }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: (response, postId) => {
            refetch();
            getLikeState(postId);
        },
    });

    const { mutate: unlikePost } = useMutation({
        mutationFn: (postId) => {
            return axios.post(baseURL+APIsRoutes.Comment.Unlike.path, { 
                postId
            }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: (response, postId) => {
            refetch();
            getLikeState(postId);
        }
    });

    const handleClickLike = (postId) => {
        const hasLiked = !!postState[postId];
        if (hasLiked) unlikePost(postId);
        else likePost(postId);
    }

    const action = (postId) => {
        getLikeState(postId);
    }

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

    const handleLogout = () => {
        localStorage.removeItem("session-id");
        window.location.reload();
    }

    const renderTags = (tagList) => {
        console.log(tagList);
        return <div className="flex flex-wrap gap-2">
            {tagList.map(tag => <Tag tag={tags.find(item => item.label === tag)} />)}
        </div>;
    }

    return (
        <div className="flex justify-center gap-32">
            <div className="max-w-[630px] w-full flex h-screen overflow-y-scroll flex-col items-center">
                {notesResponse?.data?.length > 0 && <div className="w-full py-12 overflow-hidden relative select-none flex items-center" ref={emblaRef}>
                    <div className="flex gap-4 h-fit items-center">
                        {(notesResponse?.data ?? []).map(note => (<>
                            <div className="w-16 h-16 rounded-full flex-none flex items-center justify-center hover:cursor-pointer" style={{
                                background: "linear-gradient(270deg, #BA1313 0%, #BABA00 100%)"
                            }} onClick={openNoteCarousel}>
                                <img src={note.user.avatar ? baseURL+note.user.avatar : DefaultAvatar} className="w-[60px] h-[60px] border-white border-[2px] rounded-full object-cover object-fit" draggable={false} />
                            </div>
                        </>))}
                    </div>
                    {/* <PrevButton className="w-6 h-6 absolute left-2 top-[52px]" onClick={onPrevButtonClick} disabled={prevBtnDisabled} /> */}
                    {/* <NextButton className="w-6 h-6 absolute right-2 top-[52px]" onClick={onNextButtonClick} disabled={nextBtnDisabled} /> */}
                </div>}
                <div className="max-w-[470px] w-full flex flex-col gap-3 py-5">
                    {followingPosts?.data.posts.map((post, index) => (
                    <DivIntersection className="w-full flex flex-col gap-3 select-none" action={() => action(post._id)} key={index}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={post.author.avatar ? baseURL+post.author.avatar : DefaultAvatar} alt="" className="w-8 h-8 rounded-full object-cover object-center hover:cursor-pointer" onClick={() => navigate(`/profile/${post.author.username}`)}/>
                                <div className="flex gap-1">
                                    <div className="font-medium hover:cursor-pointer" onClick={() => navigate(`/profile/${post.author.username}`)}>{post.author.username}</div>
                                    <div>&#x2022;</div>
                                    <div className="font-light">{defaultText(post.createdAt)}</div>
                                </div>
                            </div>
                            <img src={ThreeDot} alt="" className="w-4 hover:cursor-pointer" onClick={() => openDetailPost(post._id)}/>
                        </div>
                        <img src={baseURL+post.image} alt="" className="w-full aspect-2/3 rounded-md hover:cursor-pointer" onClick={() => openDetailPost(post._id)}/>
                        <div className="w-full flex justify-between">
                            <div className="flex gap-3">
                                <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} isActive={!!postState[post._id]} onClick={() => handleClickLike(post._id)} className="hover:cursor-pointer w-7" />
                                <MultipleStateIcon defaultIcon={CommentIcon} hoverIcon={CommentFilledIcon} className="hover:cursor-pointer w-7" onClick={() => openDetailPost(post._id)}/>
                            </div>
                            <div className="flex gap-3">
                                <MultipleStateIcon defaultIcon={CartIcon} hoverIcon={CartHoverIcon} activeIcon={CartHoverIcon} className={"w-7 " + (post.linkToBuy ? "hover:cursor-pointer" : "hover:cursor-not-allowed opacity-50 pointer-events-none")} onClick={() => window.open(post.linkToBuy, '_blank')} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col">
                            <div className="font-medium hover:cursor-pointer">{`${post.likes} likes`}</div>
                            <div className="font-medium">Book&apos;s name:&nbsp;{post.bookName}</div>
                            <div>{post.description}</div>
                            {post?.tags?.length > 0 && renderTags(post?.tags || [])}
                            <div 
                                className="font-light hover:cursor-pointer text-sm hover:text-slate-500"
                                onClick={() => openDetailPost(post._id)}
                            >
                                {`View all ${post.comments} comments`}
                            </div>
                        </div>
                        <div className="w-full h-[2px] bg-slate-200" />
                    </DivIntersection>))}
                </div>
            </div>
            {isLargeScreen && <div className="flex flex-col py-9 gap-3">
                <div className="flex items-center gap-3 w-80">
                    <img src={user?.avatar ? baseURL+user?.avatar : DefaultAvatar} className="w-14 h-14 rounded-full object-cover object-fit hover:cursor-pointer" onClick={() => navigate(`/profile`)}/>
                    <div className="flex flex-col flex-grow">
                        <div className="font-semibold">{user?.username}</div>
                        <div className="font-light">{user?.fullName}</div>
                    </div>
                    <button className="text-ui-blue font-semibold" onClick={handleLogout}>Log out</button>
                </div>
                <div className="font-semibold opacity-50">Suggested for you</div>
                {(suggested?.data.explore ?? []).map(item => (
                    <div className="flex items-center gap-3 w-80" key={item._id}>
                        <img src={item?.avatar ? baseURL+item?.avatar : DefaultAvatar} className="w-14 h-14 rounded-full object-cover object-fit hover:cursor-pointer" onClick={() => navigate(`/profile/${item.author.username}`)}/>
                        <div className="flex flex-col flex-grow">
                            <div className="font-semibold">{item?.username}</div>
                            <div className="font-light">{item?.fullName}</div>
                        </div>
                        <button className="text-ui-blue font-semibold" onClick={() => mutate(item._id)}>Follow</button>
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default PageHome;
