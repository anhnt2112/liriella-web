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
import CartIcon from "../../assets/png/cart.png";
import CancelIcon from "../../assets/png/cancel.png";
import Star from "../StarRating/star";
import StarRating from "../StarRating";
import Tag, { tags } from "../Tag";
import TagSelect from "../TagSelect";

const PostDetail = () => {
    const { detailPostId, closeDetailPost } = useModal();
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [replyComment, setReplyComment] = useState(null);
    const [expands, setExpands] = useState({});
    const [rate, setRate] = useState(-1);
    const [onUpdatePost, setOnUpdatePost] = useState(false);

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

    const { mutate: updatePost } = useMutation({
        mutationFn: (data) => {
            console.log(data);
            return axios.post(baseURL+APIsRoutes.Post.UpdatePost.path+"/"+detailPostId, data, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: (_, variables) => {
            if (variables.isDeleted) closeDetailPost();
            else {
                refetchPost();
                setOnUpdatePost(false);
            }
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

    const [formData, setFormData] = useState(null);
    const [selectedTags, setSelectedTags] = useState(null);

    const handleEdit = () => {
        setFormData(post?.data);
        setSelectedTags(post?.data.tags || []);
        setOnUpdatePost(true);
    }

    const handleUpdatePost = () => {
        updatePost({...formData, tags: selectedTags});
    }

    const handleFav = () => {
        updatePost({ isFavorite: !post?.data.isFavorite });
    }

    const [showConfirm, setShowConfirm] = useState(false);
    const handleDeletePost = () => {
        updatePost({ isDeleted: true });
        setShowConfirm(false);
    }

    const renderConfirmDelete = () => {
        if (!showConfirm) return <></>;

        return (
            <div className="w-screen h-screen z-50 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
                <div className="bg-white rounded-xl w-80 h-fit flex flex-col">
                    <div className="w-full p-5 flex items-center flex-col gap-2 flex-grow">
                        <div className="text-xl">Delete post?</div>
                    </div>
                    <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 text-red-700 font-medium text-sm cursor-pointer" onClick={handleDeletePost}>Delete</div>
                    <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 rounded-b-xl text-sm cursor-pointer" onClick={() => setShowConfirm(false)}>Cancel</div>
                </div>
            </div>
        );
    }

    const renderFormUpdatePost = () => {
        if (!onUpdatePost) return (<>
            <div className="w-full flex items-center gap-3">
                <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                <div className="font-medium text-lg h-fit flex-grow flex flex-col">{post?.data.author.username}</div>
            </div>
            <div className="w-full pl-12 flex flex-col">
                <div className="font-semibold flex-grow ">Book&apos;s name:&nbsp;{post?.data.bookName}</div>
                <div>{post?.data.description}</div>
                {renderTags(post?.data.tags || [])}
            </div>
        </>);

        return (
            <>
                <div className="absolute top-0 right-0 border-[1px] border-slate-200 rounded-md flex">
                    <div className="w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:bg-slate-100" onClick={() => setOnUpdatePost(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-4 h-4" viewBox="0,0,256,256">
                            <g fill="#fa5252" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(9.84615,9.84615)"><path d="M21.73438,19.64063l-2.09766,2.09375c-0.38281,0.38672 -1.00781,0.38672 -1.39453,0l-5.24219,-5.23828l-5.23828,5.23828c-0.38672,0.38672 -1.01562,0.38672 -1.39844,0l-2.09766,-2.09375c-0.38672,-0.38672 -0.38672,-1.01172 0,-1.39844l5.23828,-5.24219l-5.23828,-5.23828c-0.38281,-0.39062 -0.38281,-1.01953 0,-1.39844l2.09766,-2.09766c0.38281,-0.38672 1.01172,-0.38672 1.39844,0l5.23828,5.24219l5.24219,-5.24219c0.38672,-0.38672 1.01563,-0.38672 1.39453,0l2.09766,2.09375c0.38672,0.38672 0.38672,1.01563 0.00391,1.40234l-5.24219,5.23828l5.23828,5.24219c0.38672,0.38672 0.38672,1.01172 0,1.39844z"></path></g></g>
                        </svg>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-200" />
                    <div className="w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:bg-slate-100" onClick={() => handleUpdatePost()}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-4 h-4" viewBox="0,0,256,256">
                            <g fill="#5c7cfa" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(9.84615,9.84615)"><path d="M22.56641,4.73047l-1.79297,-1.21875c-0.49609,-0.33594 -1.17578,-0.20703 -1.50781,0.28516l-8.78906,12.96094l-4.03906,-4.03906c-0.42187,-0.42187 -1.10937,-0.42187 -1.53125,0l-1.53516,1.53516c-0.42187,0.42188 -0.42187,1.10938 0,1.53516l6.21094,6.21094c0.34766,0.34766 0.89453,0.61328 1.38672,0.61328c0.49219,0 0.98828,-0.30859 1.30859,-0.77344l10.57813,-15.60547c0.33594,-0.49219 0.20703,-1.16797 -0.28906,-1.50391z"></path></g></g>
                        </svg>
                    </div>
                </div>
                <div className="w-full flex items-center gap-3">
                    <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                    <div className="font-medium text-lg h-fit flex-grow flex flex-col">{post?.data.author.username}</div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-3 items-center">
                        <div className="h-[1px] bg-slate-200 w-1/12"/>
                        <div className="w-fit text-xs">Book's name</div>
                        <div className="flex-grow h-[1px] bg-slate-200"/>
                    </div>
                    <input value={formData.bookName} placeholder="Book's name" className="text-sm focus:outline-none" onChange={(e) => setFormData({ ...formData, bookName: e.target.value })} />
                    <div className="flex gap-3 items-center">
                        <div className="h-[1px] bg-slate-200 w-1/12"/>
                        <div className="w-fit text-xs">Description</div>
                        <div className="flex-grow h-[1px] bg-slate-200"/>
                    </div>
                    <textarea value={formData.description} placeholder="Description" className="text-sm focus:outline-none h-32" maxLength={2024} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <div className="flex gap-3 items-center">
                        <div className="h-[1px] bg-slate-200 w-1/12"/>
                        <div className="w-fit text-xs">Link To Buy</div>
                        <div className="flex-grow h-[1px] bg-slate-200"/>
                    </div>
                    <input value={formData.linkToBuy} placeholder="Book's name" className="text-sm focus:outline-none" onChange={(e) => setFormData({ ...formData, linkToBuy: e.target.value })} />
                    <div className="flex gap-3 items-center">
                        <div className="h-[1px] bg-slate-200 w-1/12"/>
                        <div className="w-fit text-xs">Tags</div>
                        <div className="flex-grow h-[1px] bg-slate-200"/>
                    </div>
                    <TagSelect selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                </div>
            </>
        );
    }

    console.log(post?.data);

    return (<>
        {renderConfirmDelete()}
        {detailPostId && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <img src={CancelIcon} className="absolute top-2 right-2 h-6 w-6 hover:cursor-pointer" onClick={closeDetailPost} />
            <div className="bg-white w-[750px] lg:w-[1000px] h-[66vh] lg:h-[88vh] overflow-hidden rounded-md flex">
                <div className="w-1/2 bg-black flex items-center justify-center">
                    <img src={baseURL+post?.data.image} alt="" className="aspect-2/3 w-full" />
                </div>
                <div className="h-full w-1/2 bg-white flex flex-col">
                    <div className="w-full p-3 border-b-2 border-slate-200 flex gap-3 items-center">
                        <img src={post?.data.author.avatar ? baseURL+post?.data.author.avatar : DefaultAvatar} alt="" className="w-9 h-9 rounded-full object-cover object-center" />
                        <div className="font-medium text-lg h-fit flex-grow">{post?.data.author.username}</div>
                        <div className="flex gap-1">
                            {post?.data.linkToBuy && <img src={CartIcon} className="w-5 h-5 hover:cursor-pointer" onClick={() => window.location.href=post?.data.linkToBuy} />}
                            {post?.data.author._id === user?._id && <>
                                <div className="flex-grow flex justify-end">
                                    <MultipleStateIcon defaultIcon={HeartIcon} hoverIcon={HeartHoverIcon} activeIcon={HeartFilledIcon} isActive={post?.data.isFavorite} onClick={handleFav} className="hover:cursor-pointer w-5" />
                                </div>
                                <img src={CreateIcon} className="w-5 h-5 hover:cursor-pointer" onClick={handleEdit} />
                                <img src={DeleteIcon} className="w-5 h-5 hover:cursor-pointer" onClick={() => setShowConfirm(true)}/>
                            </>}
                        </div>
                    </div>
                    <div className="w-full p-3 flex flex-col gap-3 flex-grow overflow-y-scroll">
                        <div className={"w-full flex flex-col items-center " + (onUpdatePost ? "gap-3 p-3 border-[1px] border-slate-200 rounded-md relative" : "")}>
                            {renderFormUpdatePost()}
                        </div>
                        {!onUpdatePost && comments?.data.all.filter(item => !!item.content && !item.comment).map((comment, index) => (
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