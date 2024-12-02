import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [detailPostId, setDetailPostId] = useState(null);
  const [relationUsername, setRelationUsername] = useState(1);

  const openCreatePost = () => setIsCreatePost(true);
  const closeCreatePost = () => setIsCreatePost(false);

  const openDetailPost = (id) => setDetailPostId(id);
  const closeDetailPost = () => setDetailPostId(null);

  const openRelationModal = (username) => setRelationUsername(username);
  const closeRelationModal = () => setRelationUsername(null);

  return (
    <ModalContext.Provider value={{ isCreatePost, openCreatePost, closeCreatePost, detailPostId, openDetailPost, closeDetailPost, relationUsername, openRelationModal, closeRelationModal }}>
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
