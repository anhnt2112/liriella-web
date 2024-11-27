import React, { useState } from "react";
import Book from "../../assets/svg/book.svg";
import LeftArrow from "../../assets/svg/left-arrow.svg";

const CreatePostModal = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }

  const handleUpload = () => {
    document.getElementById("createPostBookCoverSelect").click();
  }

  return (
    <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
      <div className="w-[420px] h-[700px] bg-white rounded-xl flex flex-col">
        {/* Step 1 */}
        <div className="w-full rounded-t-xl border-b border-ui-input-stroke py-2 flex items-center justify-between px-2 font-medium">
          <div className="w-8 flex items-center justify-center">
            <img src={LeftArrow} className="w-6 cursor-pointer" alt="Back" />
          </div>
          <div className="text-xl">Share a Book</div>
          <div className="text-xs w-8 flex items-center justify-center text-ui-blue cursor-pointer">Next</div>
        </div>
        <div className="w-full flex-grow rounded-b-xl flex flex-col items-center justify-center gap-2">
          {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full rounded-b-xl" /> : <>
            <img src={Book} alt="Upload book cover here" />
            <p className="text-xl font-medium">Upload book cover here</p>
            <input type="file" id="createPostBookCoverSelect" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input type="button" value="Upload" onClick={handleUpload} className="cursor-pointer w-1/3 p-1 bg-ui-blue text-white rounded-xl" />
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default CreatePostModal;