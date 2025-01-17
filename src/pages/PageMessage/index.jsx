import React, { useEffect, useRef, useState } from "react";
import useUser from "../../context/useUser";
import CreateFilled from "../../assets/png/create_filled.png";
import EnterIcon from "../../assets/png/enter.png";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg"
import NoteBox from "../../components/NoteBox";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useChatSocket from "../../context/useChatSocket";
import { chatSocket } from "../../components/layout/AuthLayout";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from 'embla-carousel-autoplay';
import { NextButton, PrevButton, usePrevNextButtons } from "../../components/Carousel/ArrowButton";

const PageMessage = () => {
  const { user } = useUser();
  const chatboxRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const conversationId = location.pathname.split("/")[2];
  const [conversationInfo, setConversationInfo] = useState(null);
  const [content, setContent] = useState("");
  const { sendMessageToConversation, joinConversation } = useChatSocket();
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [
    Autoplay({ delay: 5000 })
  ]);

  const scrollToBottom = () => {
    if (chatboxRef.current)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  });

  const { data: conversations, isLoading: isLoadingConversations, refetch: reloadConversations } = useQuery({
    queryKey: ['conversationList'],
    queryFn: () => {
      return axios.get(baseURL+APIsRoutes.Conversation.Get.path, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    }
  });

  const { data: notesResponse, refetch: refetchNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => {
      return axios.get(baseURL+APIsRoutes.Post.GetNotes.path, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    }
  });

  const { data: messages, isLoading: isMessageLoading, refetch: reloadMessage } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => {
      const addedPath = `/${conversationId}`;
      return axios.get(baseURL+APIsRoutes.Message.GetByConversationId.path+addedPath, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    enabled: !!conversationId
  });

  const { mutate: sendMessage, isLoading: isSendingMessage } = useMutation({
    mutationFn: () => {
      if (!conversationId || !content.length) return;
      return axios.post(baseURL+APIsRoutes.Message.Post.path, {
        conversationId,
        content
      }, { headers: {
        'session-id': localStorage.getItem('session-id')
      }});
    },
    onSuccess: () => {
      setContent("");
      reloadConversations();
      reloadMessage();
      sendMessageToConversation(conversationId);
    }
  });

  useEffect(() => {
    chatSocket.on('receiveMessage', () => {
      reloadConversations();
      reloadMessage();
    });

    return () => {
      chatSocket.off('receiveMessage');
    }
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !conversations) return;
    const finded = conversations?.data.find(c => c._id === conversationId);
    setConversationInfo(finded);
  }, [conversationId, conversations]);

  const getChatClassNames = (_chats, index) => {
    const classNames = [];
    if (_chats[index].sender !== user?.username) {
      classNames.push("bg-[#efefef] rounded-r-2xl");
      if (index === 0 || _chats[index-1].sender === user?.username) classNames.push("rounded-tl-2xl");
      else classNames.push("rounded-tl-md");
      if (index === _chats.length-1 || _chats[index+1].sender === user?.username) classNames.push("rounded-bl-2xl");
      else classNames.push("rounded-bl-md");
    }
    else {
      classNames.push("bg-[#3399ff] text-white rounded-l-2xl");
      if (index === 0 || _chats[index-1].sender !== user?.username) classNames.push("rounded-tr-2xl");
      else classNames.push("rounded-tr-md");
      if (index === _chats.length-1 || _chats[index+1].sender !== user?.username) classNames.push("rounded-br-2xl");
      else classNames.push("rounded-br-md");
    }

    return classNames;
  }

  const handleGotoConversation = (id) => {
    navigate(`/message/${id}`);
  }

  const defaultText = (createAt) => {
    if (!createAt) return;
    const date = new Date(createAt);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);

    return `Created at ${formattedDate}`;
  }

  const renderSenderAvatar = (chat) => {
    if (chat.sender === user?.username) return <></>;
    return <img src={chat.senderAvatar ? baseURL+chat.senderAvatar : DefaultAvatar} alt="" draggable={false} className="w-7 h-7 rounded-full" />;
  }

  const handleSendMessage = () => {
    sendMessage();
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  const renderLastMessage = (item) => {
    if (!item.lastMessage) return defaultText(item.createdAt);
    return <div className="flex gap-1">
      <div className="w-fit font-medium">{item.lastSender === user?.username ? "You:" : `${item.lastSender}: `}</div>
      <div className="overflow-hidden flex-grow">{item.lastMessage}</div>
    </div>;
  }

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="w-full h-full flex">
      <div className="w-96 h-full border-r-[1px] border-ui-input-stroke flex flex-col">
        <div className="w-full h-fit p-5 flex items-center justify-between shadow">
          <div className="text-xl font-semibold">{user?.username}</div>
          <img src={CreateFilled} alt="" className="w-8 h-8 hover:cursor-pointer" />
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto relative">
          {/* Avatar and name */}
          <div className="overflow-hidden w-full select-none" ref={emblaRef}>
            <div className="w-full h-fit py-5 px-4 flex gap-3 touch-pan-y touch-pinch-zoom">
              {(notesResponse?.data ?? []).map(note => (
              <div className="relative flex justify-center pt-8 w-24 flex-none">
                <img src={note.user.avatar ? baseURL+note.user.avatar : DefaultAvatar} className="rounded-full w-16 h-16" draggable={false} />
                <NoteBox className="top-0 left-0 max-w-full h-12 text-[10px]" note={note.content}/>
              </div>))}
            </div>
          </div>
          {/* Conversation */}
          <div className="w-full h-fit py-5 px-4 pt-0 flex items-center justify-between select-none">
            <div className="font-medium text-lg hover:cursor-pointer">Message</div>
            <div className="font-medium text-lg hover:cursor-pointer opacity-30">Group</div>
          </div>
          <div className="w-full overflow-y-auto pb-5">
            {conversations?.data.map((conversation) => (
              <div className="w-full px-5 py-2 hover:bg-slate-50 flex gap-3 hover:cursor-pointer" key={conversation._id} onClick={() => handleGotoConversation(conversation._id)}>
                <img src={baseURL+conversation.avatar} alt="" draggable={false} className="w-12 h-12 rounded-full object-cover object-center" />
                <div className="flex-grow flex flex-col justify-center">
                  <div className="w-full text-base">{conversation.participants.length < 3 ? conversation.participants.filter(p => user.username !== p) : conversation.name}</div>
                  <div className="w-full text-xs font-light">{renderLastMessage(conversation)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow h-full flex flex-col">
        <div className="w-full flex-grow overflow-y-auto select-none pb-3" ref={chatboxRef}>
          <div className="py-10 flex flex-col items-center gap-2">
            <img src={baseURL+conversationInfo?.avatar} alt="" draggable={false} className="w-24 h-24 rounded-full object-cover object-center" />
            <div className="flex flex-col items-center">
              <div className="text-2xl font-semibold">{conversationInfo?.participants.length < 3 ? conversationInfo.participants.filter(p => user.username !== p) : conversationInfo?.name}</div>
              <div className="opacity-70">{conversationInfo?.participants.join(', ')}</div>
            </div>
            <div className="w-fit h-fit py-2 font-light underline">{defaultText(conversationInfo?.createdAt)}</div>
          </div>

          {messages?.data.map((chat, index) => {
            return <div className={"w-full h-fit flex py-0.5 px-2 gap-2 items-end " + (chat.sender === user?.username ? "justify-end" : "justify-start")} key={index}>
              {(index === messages?.data.length || messages?.data[index+1]?.sender !== chat.sender) ? renderSenderAvatar(chat) : <div className="w-7 h-7" />}
              <div 
                className={"w-fit max-w-96 py-1.5 px-4 hover:cursor-text " 
                  + getChatClassNames(messages?.data, index).join(" ")}
              >
                {chat.content}
              </div>
            </div>;
          })}
        </div>

        <div className="px-2 py-3" style={{
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
        }}>
          <div className="p-2 flex items-center gap-2 rounded-full border border-ui-input-stroke">
          <img src={EnterIcon} alt="" className="h-6" />
          <div className="flex-grow h-full flex items-center">
              <input placeholder="Message..." className="w-full text-sm focus:outline-none" value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleKeyDown} />
          </div>
          <div className="text-[#3399ff] text-sm font-semibold hover:cursor-pointer" onClick={handleSendMessage}>Send</div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PageMessage;