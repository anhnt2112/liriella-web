import { useEffect, useState } from 'react';
import { baseURL } from '../utils/services/ApiService';
import { chatSocket } from '../components/layout/AuthLayout';

const useChatSocket = () => {

  const sendMessageToConversation = (conversationId) => {
    chatSocket.emit('sendMessage', conversationId);
  };

  const joinConversation = (conversationId) => {
    chatSocket.emit('joinConversation', conversationId);
  };

  const leaveConversation = (conversationId) => {
    chatSocket.emit('leaveConversation', conversationId);
  };

  return { sendMessageToConversation, joinConversation, leaveConversation };
};

export default useChatSocket;
