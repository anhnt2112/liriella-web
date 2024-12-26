import React, { createContext, useContext, useRef, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [detailPostId, setDetailPostId] = useState(null);
  const [relationID, setRelationID] = useState(null);
  const [inFollowers, setInFollowersMode] = useState(true);
  const [onChangeAvatar, setOnChangeAvatar] = useState(false);
  const [previewUserSetting, setPreviewUserSetting] = useState(null);
  const previewUserRef = useRef(null);

  const openCreatePost = () => setIsCreatePost(true);
  const closeCreatePost = () => setIsCreatePost(false);

  const openDetailPost = (id) => setDetailPostId(id);
  const closeDetailPost = () => setDetailPostId(null);

  const openRelationModal = (userID) => setRelationID(userID);
  const closeRelationModal = () => setRelationID(null);

  const setInFollowing = () => setInFollowersMode(false);
  const setInFollowers = () => setInFollowersMode(true);

  const openChangeAvatar = () => setOnChangeAvatar(true);
  const closeChangeAvatar = () => setOnChangeAvatar(false);

  const openPreviewUser = (userID, position) => {
    setPreviewUserSetting({ userID, position });
  }

  const closePreviewUser = () => {
    setPreviewUserSetting(null);
  }

  return (
    <ModalContext.Provider value={{ 
      // create post
      isCreatePost, openCreatePost, closeCreatePost,
      // detail post 
      detailPostId, openDetailPost, closeDetailPost, 
      // relation modal
      relationID, openRelationModal, closeRelationModal, 
      // connections
      inFollowers, setInFollowing, setInFollowers,
      // change avatar
      onChangeAvatar, openChangeAvatar, closeChangeAvatar,
      // preview user
      previewUserRef, previewUserSetting, openPreviewUser, closePreviewUser,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
