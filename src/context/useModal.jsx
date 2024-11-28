import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCreatePost, setIsCreatePost] = useState(false);

  const openCreatePost = () => setIsCreatePost(true);
  const closeCreatePost = () => setIsCreatePost(false);

  return (
    <ModalContext.Provider value={{ isCreatePost, openCreatePost, closeCreatePost }}>
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
