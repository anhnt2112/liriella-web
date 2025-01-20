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
import DeleteIcon from "../../assets/png/trash.png";
import CreateIcon from "../../assets/png/create.png";
import Star from "../StarRating/star";
import StarRating from "../StarRating";
import Tag, { tags } from "../Tag";

const PostDetail = () => {
    const { detailPostId, closeDetailPost } = useModal();
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [replyComment, setReplyComment] = useState(null);
    const [expands, setExpands] = useState({});
    const [rate, setRate] = useState(-1);

    const { data: post, isLoading: isPostLoading, refetch: refetchPost } = useQuery({
        queryKey: ["postDetail", detailPostId],
        queryFn: () => {
            const addedPath = `/${detailPostId}`;
            return axios.get(baseURL+APIsRoutes.Post.GetByPostId.path+addedPath);
        },
        enabled: !!detailPostId
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
            const formData = { 
                postId: detailPostId,
                content
            };

            if (replyComment) {
                formData.commentId = replyComment;
            }
                
            return axios.post(baseURL+APIsRoutes.Comment.Comment.path, formData, { headers: {
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
        mutationFn: (commentId) => {
            const formData = {
                postId: detailPostId
            };

            if (commentId) formData.commentId = commentId;

            return axios.post(baseURL+APIsRoutes.Comment.Like.path, formData, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetchComments();
            refetchPost();
        },
        enabled: !!detailPostId
    });

    const { mutate: unlikePost } = useMutation({
        mutationFn: (commentId) => {
            const formData = {
                postId: detailPostId
            };

            if (commentId) formData.commentId = commentId;

            return axios.post(baseURL+APIsRoutes.Comment.Unlike.path, formData, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetchComments();
            refetchPost();
        },
        enabled: !!detailPostId
    });

    const { data: postRate, refetch: refetchPostRate } = useQuery({
        queryKey: ['postRate', detailPostId],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.GetRate.path+'/'+detailPostId);
        },
        enabled: !!detailPostId
    });

    useEffect(() => {
        const currentRate = postRate?.data.find(item => item.author === user._id);
        console.log(currentRate);
        setRate(currentRate?.rate || -1);
    }, [postRate]);

    const { mutate: updateRate } = useMutation({
        mutationFn: (rate) => {
            return axios.post(baseURL+APIsRoutes.Post.CreateRate.path, { rate, postId: detailPostId }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }})
        },
        onSuccess: () => {
            refetchPostRate();
            refetchPost();
        }
    });

    useEffect(() => {
        if (rate !== -1)
        updateRate(rate);
    }, [rate]);

    const checkLike = (commentId) => {
        if (!comments?.data.all) return false;
        return comments?.data.all.filter((comment) => {
            const firstCondition = !comment.content && comment.author._id === user?._id;
            return firstCondition && comment.comment === commentId;
        }).length > 0;
    }

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleClickLike = () => {
        if (!checkLike(null)) likePost();
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
            setReplyComment(null);
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

    const countReply = (commentId) => {
        if (!comments?.data.all) return 0;
        return comments?.data.all.filter((comment) => comment.comment?._id === commentId && !!comment.content);
    }

    const countLike = (commentId) => {
        if (!comments?.data.all) return 0;
        return comments?.data.all.filter((comment) => comment.comment === commentId && !comment.content);
    }

    const handleLikeComment = (commentId) => {
        if (!checkLike(commentId)) likePost(commentId);
        else unlikePost(commentId);
    }

    const renderTags = (tagList) => {
        return <div className="flex flex-wrap gap-2">
            {tagList.map(tag => <Tag tag={tags.find(item => item.label === tag)} />)}
        </div>;
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
                        {post?.data?.author._id === user?._id && <div className="flex gap-1">
                            {post?.data.author.username === user?.username &&
                            <div className="flex-grow flex justify-end">
                                <MultipleStateIcon defaultIcon={HeartIcon} hoverIcon={HeartHoverIcon} activeIcon={HeartFilledIcon} className="hover:cursor-pointer w-5" />
                            </div>}
                            <img src={CreateIcon} className="w-5 h-5 hover:cursor-pointer" />
                            <img src={DeleteIcon} className="w-5 h-5 hover:cursor-pointer" />
                        </div>}
                    </div>
                    <div className="w-full p-3 flex flex-col gap-3 flex-grow overflow-y-scroll">
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center gap-3">
                                <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                                <div className="font-medium text-lg h-fit flex-grow flex flex-col">{post?.data.author.username}</div>
                            </div>
                            <div className="w-full pl-12 flex flex-col">
                                <div className="font-semibold flex-grow ">Book&apos;s name:&nbsp;{post?.data.bookName}</div>
                                <div>{post?.data.description}</div>
                                {renderTags(post?.data.tags || [])}
                            </div>
                        </div>
                        {comments?.data.all.filter(item => !!item.content && !item.comment).map((comment, index) => (
                            <div key={index} className="flex gap-3">
                                <img src={comment?.author.avatar ? baseURL+comment?.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                                <div className="flex-grow flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-lg">{comment?.author.username}</div>
                                        <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} className="hover:cursor-pointer h-4" isActive={checkLike(comment._id)} onClick={() => handleLikeComment(comment._id)} />
                                    </div>
                                    <div>{comment?.content}</div>
                                    <div className="text-xs flex gap-3">
                                        <div className="font-normal">{defaultText(comment?.createdAt)}</div>
                                        <div className="font-medium hover:cursor-pointer">{countLike(comment._id).length} likes</div>
                                        <div className="font-medium hover:cursor-pointer" onClick={() => setReplyComment(comment)}>Reply</div>
                                    </div>
                                    {countReply(comment._id).length > 0 && <div className={"mt-3 flex items-center gap-2 " + (expands[comment._id] ? "mb-3" : "")}>
                                        <div className="w-6 h-[1px] bg-slate-400" />
                                        <div className="text-xs font-medium hover:cursor-pointer" onClick={() => setExpands({...expands, [comment._id]: !expands[comment._id]})}>
                                            {expands[comment._id] ? "Hide replies" : `View ${countReply(comment._id).length} replies`}
                                        </div>
                                    </div>}
                                    {expands[comment._id] && countReply(comment._id).map((reply, index) => (
                                        <div key={index} className="flex gap-3">
                                        <img src={reply?.author.avatar ? baseURL+reply?.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                                        <div className="flex-grow flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-lg">{reply?.author.username}</div>
                                                <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} className="hover:cursor-pointer h-4" isActive={checkLike(reply._id)} onClick={() => handleLikeComment(reply._id)} />
                                            </div>
                                            <div>{reply?.content}</div>
                                            <div className="text-xs flex gap-3">
                                                <div className="font-normal">{defaultText(reply?.createdAt)}</div>
                                                <div className="font-medium hover:cursor-pointer">{countLike(reply._id).length} likes</div>
                                            </div>
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full p-3 border-t-2 border-slate-200 flex flex-col gap-2">
                        <div className="w-full flex gap-2">
                            <MultipleStateIcon defaultIcon={LikeIcon} hoverIcon={LikeHoverIcon} activeIcon={LikeFilledIcon} isActive={checkLike(null)} className="hover:cursor-pointer w-7" onClick={handleClickLike} />
                            <MultipleStateIcon defaultIcon={CommentIcon} hoverIcon={CommentFilledIcon} className="hover:cursor-pointer w-7" onClick={handleFocus} />
                            <StarRating rate={rate} setRate={setRate} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <div className="text-base font-medium">{`${post?.data.likes} likes`}</div>
                                <div className="text-base font-medium">{post?.data?.rate}{' '}Ratings{!!post?.data?.rate && ' · ' + post?.data.average + ' average'}</div>
                            </div>
                            <div className="font-light text-xs">{defaultText(post?.data.createdAt)}</div>
                        </div>
                    </div>
                    <div className="w-full p-3 border-t-2 border-slate-300 flex flex-col">
                        {replyComment && <div className="text-sm font-semibold hover:cursor-pointer" onClick={() => setReplyComment(null)}>Reply to{' '}@{replyComment.author.username}</div>}
                        <div className="w-full flex items-center gap-3">
                            <img src={EnterIcon} alt="" className="h-9" />
                            <div className="flex-grow">
                                <input placeholder="Add a comment" className="w-full focus:outline-none" ref={inputRef} onKeyDown={handleKeyDown} value={content} onChange={(e) => setContent(e.target.value)} />
                            </div>
                            <div className="text-ui-blue font-semibold hover:cursor-pointer" onClick={handleComment}>Post</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}

export default PostDetail;