import React, { useEffect, useRef, useState } from "react";
import Book from "../../assets/svg/book.svg";
import LeftArrow from "../../assets/svg/left-arrow.svg";
import { motion } from "motion/react";
import { useModal } from "../../context/useModal";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const CreatePostModal = () => {
  const { isCreatePost, closeCreatePost } = useModal();
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(null);
  const [step, setStep] = useState(0);
  const [showDiscardPost, setShowDiscardPost] = useState(false);
  const createPostRef = useRef(null);

  const { mutate } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", content.description);
      formData.append("bookName", content.bookName);
      formData.append("linkToBuy", content.linkToBuy);
      formData.append("isFavorite", content.isFavorite);

      return axios.post(baseURL+APIsRoutes.Post.Create.path, formData, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      handleDiscard();
    }
  });

  useEffect(() => {
    if (step < 2) setContent(null);
    if (step < 1) {
      setImage(null);
      setImagePreview(null);
    }
  }, [step]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createPostRef.current && !createPostRef.current.contains(event.target)) {
        setShowDiscardPost(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setStep(1);
    }
  }

  const handleUpload = () => {
    document.getElementById("createPostBookCoverSelect").click();
  }

  const handleBack = () => {
    if (step === 0) {
      setShowDiscardPost(true);
    } else setStep(step - 1);
  }

  const handleNext = () => {
    if (step === 1) setContent({
      description: "",
      bookName: "",
      linkToBuy: "",
      isFavorite: false
    });
    if (step === 2) {
      mutate();
    } else setStep(step + 1);
  }

  const handleDiscard = () => {
    setImage(null);
    setImagePreview(null);
    setContent(null);
    setStep(0);
    setShowDiscardPost(false);
    closeCreatePost();
  }

  return (<>
    {isCreatePost && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
      <div className={"h-[715px] bg-white rounded-xl flex flex-col w-fit "} ref={createPostRef}>
        <div className="w-full rounded-t-xl border-b border-slate-200 py-2 flex items-center justify-between px-2 font-medium">
          <div className="w-8 flex items-center justify-center cursor-pointer" onClick={handleBack}>
            <img src={LeftArrow} className="w-6" alt="Back" />
          </div>
          <div className="text-xl">Share a Book</div>
          <div className="text-xs w-8 flex items-center justify-center text-ui-blue cursor-pointer" onClick={handleNext}>
            {step === 0 ? "" : step === 1 ? "Next" : step === 2 ? "Post" : ""}
          </div>
        </div>
        
        <div className="flex-grow rounded-b-xl flex">
          <div className={"flex flex-col items-center justify-center gap-2 w-[420px]"}>
            {imagePreview ? <img src={imagePreview} alt="Preview" className={step === 2 ? "rounded-bl-xl" : "rounded-b-xl"} /> : <>
              <img src={Book} alt="Upload book cover here" />
              <p className="text-xl font-medium">Upload book cover here</p>
              <input type="file" id="createPostBookCoverSelect" accept="image/*" className="hidden" onChange={handleFileChange} />
              <input type="button" value="Upload" onClick={handleUpload} className="cursor-pointer w-1/3 p-1 bg-ui-blue text-white rounded-xl" />
              </>
            }
          </div>
          {step === 2 && <div className="w-[420px] rounded-br-xl p-5 flex flex-col gap-5">
            <div className="w-full flex items-center gap-3">
              <img className="w-10 rounded-full" src="https://imgs.search.brave.com/DzYUMuG6uVmYZmZQgrATGPCHt8EYwZUw5lH9TKjuVFo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kMzhi/MDQ0cGV2bndjOS5j/bG91ZGZyb250Lm5l/dC9jdXRvdXQtbnV4/dC9jYXJ0b29uL25l/dy8xMy5qcGc" />
              <div className="flex-grow font-medium text-base">7u4n_4nh</div>
            </div>
            <textarea maxLength={2024} className="h-1/2 p-1 text-sm focus:outline-none" placeholder="Description" value={content?.description} onChange={(e) => setContent({...content, description: e.target.value})} />
            <input className="p-1 text-sm focus:outline-none" placeholder="Book's name" value={content?.bookName} onChange={(e) => setContent({...content, bookName: e.target.value})} />
            <input className="p-1 text-sm focus:outline-none" placeholder="Link to buy" value={content?.linkToBuy} onChange={(e) => setContent({...content, linkToBuy: e.target.value})} />
            <div className="w-full flex items-center justify-between p-1">
              <div className="text-base">Mark as Favorite</div>
              <motion.div 
                className="w-14 h-8 p-1 rounded-full cursor-pointer"
                initial={{ backgroundColor: !content?.isFavorite ? "#DBDFE4" : "#F05408" }}
                animate={{ backgroundColor: !content?.isFavorite ? "#DBDFE4" : "#F05408" }}
                transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
                onClick={() => setContent({...content, isFavorite: !content?.isFavorite})}
              >
                <motion.div 
                  className="w-6 h-6 bg-white rounded-full"
                  initial={{ x: !content?.isFavorite ? 0 : "100%" }}
                  animate={{ x: !content?.isFavorite ? 0 : "100%" }}
                  transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
                />
              </motion.div>
            </div>
          </div>}
        </div>
      </div>
    </div>}
    {/* Discard Post */}
    {showDiscardPost && 
    <motion.div 
      className="w-screen h-screen z-50 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none"
      initial={{ opacity: showDiscardPost ? 1 : 0 }}
      animate={{ opacity: showDiscardPost ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
    >
      <div className="bg-white rounded-xl w-80 h-fit flex flex-col">
        <div className="w-full p-5 flex items-center flex-col gap-2 flex-grow">
          <div className="text-xl">Discard post?</div>
          <div className="text-xs">If you leave, your edits won't be saved.</div>
        </div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 text-red-700 font-medium text-sm cursor-pointer" onClick={handleDiscard}>Discard</div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 rounded-b-xl text-sm cursor-pointer" onClick={() => setShowDiscardPost(false)}>Cancel</div>
      </div>
    </motion.div>}
  </>)
}

export default CreatePostModal;