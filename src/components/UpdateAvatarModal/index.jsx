import React, { useState } from "react";
import { useModal } from "../../context/useModal";
import useUser from "../../context/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";

const UpdateAvatarModal = () => {
  const { onChangeAvatar, openChangeAvatar, closeChangeAvatar } = useModal();
  const [showAcceptRemove, setShowAcceptRemove] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate: removeAvatar } = useMutation({
    mutationFn: async () => {
      return axios.post(baseURL+APIsRoutes.User.RemoveAvatar.path, null, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      setShowAcceptRemove(false);
      closeChangeAvatar();
      queryClient.refetchQueries(["profileInfo", user.username]);
    }
  });

  const { mutate: updateAvatar } = useMutation({
    mutationFn: async (avatar) => {
      const formData = new FormData();
      formData.append("image", avatar);
      return axios.post(baseURL+APIsRoutes.User.UpdateAvatar.path, formData, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      closeChangeAvatar();
      queryClient.refetchQueries(["profileInfo", user.username]);
    }
  });

  const handleRemove = () => {
    removeAvatar();
  }

  const handleUpload = () => {
    document.getElementById("updatePhotoSelect").click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateAvatar(file);
    }
  }

  return (<>
    {onChangeAvatar && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
      <div className="bg-white rounded-xl w-80 h-fit flex flex-col">
        <div className="w-full p-8 flex items-center flex-col gap-2 flex-grow">
          <div className="text-xl">Change Profile Photo</div>
        </div>
        <input type="file" id="updatePhotoSelect" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 text-blue-700 font-medium text-sm cursor-pointer" onClick={handleUpload}>Upload Photo</div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 text-red-700 font-medium text-sm cursor-pointer" onClick={() => setShowAcceptRemove(true)}>Remove Current Photo</div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 rounded-b-xl text-sm cursor-pointer" onClick={closeChangeAvatar}>Cancel</div>
      </div>
    </div>}
    {showAcceptRemove &&
    <div 
      className="w-screen h-screen z-50 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none"
    >
      <div className="bg-white rounded-xl w-60 h-fit flex flex-col">
        <div className="w-full p-5 flex items-center flex-col gap-2 flex-grow">
          <div className="text-xl">Remove Avatar</div>
        </div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 text-red-700 font-medium text-sm cursor-pointer" onClick={handleRemove}>Remove</div>
        <div className="w-full flex items-center justify-center hover:bg-slate-100 border-t-2 p-2 rounded-b-xl text-sm cursor-pointer" onClick={() => setShowAcceptRemove(false)}>Cancel</div>
      </div>
    </div>}
  </>);
};

export default UpdateAvatarModal;