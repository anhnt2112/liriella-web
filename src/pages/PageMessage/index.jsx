import React, { useEffect, useRef } from "react";
import useUser from "../../context/useUser";
import CreateFilled from "../../assets/png/create_filled.png";
import EnterIcon from "../../assets/png/enter.png";

const PageMessage = () => {
  const { user } = useUser();
  const chatboxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatboxRef.current)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  })

  const chats = [
    {
      sender: {
        username: "user1",
        content: "Hello"
      },
    },
    {
      sender: {
        username: "user2",
        content: "Hi"
      },
    },
    {
      sender: {
        username: "user2",
        content: "Nice to meet you"
      },
    },
    {
      sender: {
        username: "user2",
        content: "How old are you?"
      },
    },
    {
      sender: {
        username: "user1",
        content: "I'm 20 years old"
      },
    }
  ];

  return (
    <div className="w-full h-full flex">
      <div className="w-[400px] h-full border-r-[1px] border-ui-input-stroke flex flex-col">
        <div className="w-full h-fit p-5 flex items-center justify-between shadow">
          <div className="text-xl font-semibold">{user?.username}</div>
          <img src={CreateFilled} alt="" className="w-8 h-8 hover:cursor-pointer" />
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto">
          {/* Avatar and name */}
          <div className="w-full h-fit py-5 px-2 flex">
            <div className="w-14 h-14 rounded-full bg-red-300 mx-2"></div>
            <div className="w-14 h-14 rounded-full bg-red-300 mx-2"></div>
          </div>
          {/* Conversation */}
          <div className="w-full h-fit py-5 px-4 flex items-center justify-between select-none">
            <div className="font-medium text-lg hover:cursor-pointer">Message</div>
            <div className="font-medium text-lg hover:cursor-pointer opacity-30">Request</div>
          </div>
          <div className="w-full">
            <div className="w-full px-5 py-2 hover:bg-slate-50 flex gap-3 hover:cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-red-50" />
              <div className="flex-grow flex flex-col justify-center">
                <div className="w-full text-base">Thule</div>
                <div className="w-full text-xs font-light">Active 53m ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow h-full flex flex-col">
        <div className="w-full flex-grow overflow-y-auto select-none pb-3" ref={chatboxRef}>
          <div className="py-10 flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-red-300" />
            <div className="flex flex-col items-center">
              <div className="text-2xl font-semibold">Thule</div>
              <div className="opacity-70">thule</div>
            </div>
            <div className="w-fit h-fit px-3 py-2 rounded-xl bg-[#efefef] hover:bg-[#cccccc] hover:cursor-pointer text-sm font-semibold">View Profile</div>
          </div>

          {[...chats, ...chats, ...chats, ...chats].map((chat, index) => {
            return <div className={"w-full h-fit flex py-0.5 px-2 " + (chat.sender.username === "user1" ? "justify-end" : "justify-start")} key={index}>
              <div 
                className={"w-fit max-w-1/2 py-1 px-4 rounded-full " 
                  + (chat.sender.username !== "user1" ? "bg-[#efefef]" : "bg-[#3399ff] text-white")}
                >
                {chat.sender.content}
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
              <input placeholder="Message..." className="w-full text-sm focus:outline-none" />
          </div>
          <div className="text-[#3399ff] text-sm font-semibold hover:cursor-pointer">Send</div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default PageMessage;