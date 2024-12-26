import React, { useState } from "react";
import { motion } from "motion/react";
import { baseURL } from "../../utils/services/ApiService";
import { useModal } from "../../context/useModal";
import WhiteLike from "../../assets/png/white_like.png";
import WhiteComment from "../../assets/png/comment_white.png";

const PostPreview = ({ post }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    
    const { openDetailPost } = useModal();

    return (
        <motion.div 
            className="relative w-full h-full overflow-hidden cursor-pointer"
            onHoverStart={() => setShowOverlay(true)}
            onHoverEnd={() => setShowOverlay(false)}
            onClick={() => openDetailPost(post._id)}
        >
            {showOverlay && 
                <motion.div 
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute bg-black pointer-events-none opacity-60 w-full h-full rounded-md" />
                    <div className="w-2/3 items-center justify-center text-white z-10 text-xl flex gap-5">
                        <div className="flex gap-1 items-center">
                            <img src={WhiteLike} className="h-6" />
                            {post.likes}
                        </div>
                        <div className="flex gap-1 items-center">
                            <img src={WhiteComment} className="h-6" />
                            {post.comments}
                        </div>
                    </div>
                </motion.div>
            }
            <img src={`${baseURL}${post?.image}`} alt="" className="w-full h-full object-cover rounded-md" />
        </motion.div>
    );
}

export default PostPreview;