import React, { createContext, useContext, useRef, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [detailPostId, setDetailPostId] = useState(null);
  const [relationID, setRelationID] = useState(null);
  const [inFollowers, setInFollowersMode] = useState(true);
  const [onChangeAvatar, setOnChangeAvatar] = useState(false);
  const [previewUserSetting, setPreviewUserSetting] = useState(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [showNoteCarousel, setShowNoteCarousel] = useState(false);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isUpdateSetting, setIsUpdateSetting] = useState(false);
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

  const openCreateNote = () => setIsCreateNoteOpen(true);
  const closeCreateNote = () => setIsCreateNoteOpen(false);

  const openNoteCarousel = () => setShowNoteCarousel(true);
  const closeNoteCarousel = () => setShowNoteCarousel(false);

  const openUpdateInfo = () => setIsUpdateInfo(true);
  const closeUpdateInfo = () => setIsUpdateInfo(false);

  const openUpdateSetting = () => setIsUpdateSetting(true);
  const closeUpdateSetting = () => setIsUpdateSetting(false);

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
      // more modal
      isMoreOpen, setIsMoreOpen,
      // create note
      isCreateNoteOpen, openCreateNote, closeCreateNote,
      // show note carousel
      showNoteCarousel, openNoteCarousel, closeNoteCarousel,
      // update info
      isUpdateInfo, openUpdateInfo, closeUpdateInfo,
      // update setting
      isUpdateSetting, openUpdateSetting, closeUpdateSetting
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
