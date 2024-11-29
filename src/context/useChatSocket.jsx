import { useEffect } from "react";
import socketService from "../utils/services/socketService";

export const useChatSocket = (conversationId) => {
  useEffect(() => {
    const socket = socketService.connect("chat");

    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (message) => {
      console.log("New message received:", message);
    });

    return () => {
      socket.emit("leaveConversation", conversationId);
      socketService.disconnect();
    };
  }, [conversationId]);
};

export const sendMessage = (conversationId, senderId, content) => {
  const socket = socketService.getSocket();
  socket.emit("sendMessage", { conversationId, senderId, content });
};
