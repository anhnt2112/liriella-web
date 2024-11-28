import React from "react";
import { useModal } from "../../context/useModal";
import EnterIcon from "../../assets/png/enter.png";

const PostDetail = () => {
    const { detailPostId, closeDetailPost } = useModal();

    return (<>
        {detailPostId && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className="bg-white w-[60vw] h-[90vh] overflow-hidden rounded-md flex">
                <img src="https://imgs.search.brave.com/DzYUMuG6uVmYZmZQgrATGPCHt8EYwZUw5lH9TKjuVFo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kMzhi/MDQ0cGV2bndjOS5j/bG91ZGZyb250Lm5l/dC9jdXRvdXQtbnV4/dC9jYXJ0b29uL25l/dy8xMy5qcGc" alt="" className="aspect-2/3 w-[30vw]" />
                <div className="h-full w-2 bg-black" />
                <div className="h-full flex-grow bg-white flex flex-col">
                    <div className="w-full p-3 border-b-2 border-slate-200">aaa</div>
                    <div className="w-full p-3 flex-grow">aaa</div>
                    <div className="w-full p-3 border-t-2 border-slate-200">bbb</div>
                    <div className="w-full p-3 border-t-2 border-slate-300 flex items-center gap-2">
                        <img src={EnterIcon} alt="" className="h-9" />
                        <div className="flex-grow">
                            <input placeholder="Add a comment" className="w-full focus:outline-none" />
                        </div>
                        <div className="text-ui-blue font-semibold hover:cursor-pointer">Post</div>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}

export default PostDetail;