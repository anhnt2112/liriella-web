import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { APIsRoutes, baseURL } from "../../utils/services/ApiService";
import Footer from "../../components/layout/Footer";

const PageActivity = () => {
  const [mode, setMode] = useState(0);

  const { data: activities } = useQuery({
    queryKey: ['activities'],
    queryFn: () => {
      return axios.get(baseURL+APIsRoutes.Activity.Get.path, {
        headers: {
          'session-id': localStorage.getItem('session-id')
        }
      });
    }
  });

  const defaultText = (createAt) => {
    if (!createAt) return;
    const date = new Date(createAt);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);

    return `${formattedDate}`;
  }

  const renderActivity = (item) => {
    const renderText1 = (type) => {
      switch (type) {
        case 0:
          return "You have created a post.";
        case 1:
          return "You have updated a post.";
        case 2:
          return "You have deleted a post.";
        case 3: 
          return `You have commented on ${item?.post?.bookName.slice(0, 10)}...`;
        case 4: 
          return `You have reacted to ${item?.post?.bookName.slice(0, 10)}...`;
        case 5:
          return `You have replied on @${item.comment?.comment?.author?.username}: ${item.comment?.comment?.content.slice(0, 15)}...`;
        case 6:
          return `You have reacted to a comment.`;
        case 13:
          return `You have unreacted to ${item?.post?.bookName.slice(0, 10)}...`;
        case 14:
          return "You have unreacted to a comment.";
        case 7:
          return "You have created a note.";
        default:
          return "";
      }
    }

    const renderText2 = (type, _item) => {
      switch (type) {
        case 0:
        case 1:
        case 2:
          return _item?.bookName.slice(0, 20) + (_item?.bookName.length > 20 ? "..." : "");
        case 3:
        case 5:
          return _item?.content;
        case 4:
        case 6:
        case 13:
        case 14:
        case 7:
        default:
          return "";
      }
    }

    if (mode === 0) {
      return <div className="w-full flex gap-3 hover:cursor-pointer hover:bg-slate-100">
        {item.type !== 7 ? <img className="w-[15%] aspect-2/3 rounded-md" src={baseURL+item.post?.image} /> : <img className="w-[15%] aspect-square object-cover object-fit rounded-md" src={baseURL+item.author.avatar} />}
        <div className="flex-grow flex flex-col justify-center text-xs md:text-base">
          <div>{renderText1(item.type)}</div>
          <div className="italic font-semibold">{renderText2(item.type, item.post)}</div>
          <div className="font-light">{defaultText(item.createdAt)}</div>
        </div>
      </div>;
    } else if (mode === 1) {
      return <div className="w-full flex gap-3 hover:cursor-pointer hover:bg-slate-100">
        <img className="w-[15%] aspect-2/3 rounded-md" src={baseURL+item.post?.image} />
        <div className="flex-grow flex flex-col justify-center text-xs md:text-base">
          <div>{renderText1(item.type)}</div>
          <div className="italic font-semibold">{renderText2(item.type, item.comment)}</div>
          <div className="font-light">{defaultText(item.createdAt)}</div>
        </div>
      </div>;
    } else if (mode === 2) {
      return <div className="w-full flex gap-3 hover:cursor-pointer hover:bg-slate-100">
        <img className="w-[15%] aspect-2/3 rounded-md" src={baseURL+item.post?.image} />
        <div className="flex-grow flex flex-col justify-center text-xs md:text-base">
          <div>{renderText1(item.type)}</div>
          <div className="italic font-semibold">{renderText2(item.type, item.comment)}</div>
          <div className="font-light">{defaultText(item.createdAt)}</div>
        </div>
      </div>;
    } else return <></>;
  }

  const renderByMode = (list) => {
    if (mode === 0) return list?.filter((item) => [0,1,2,7].includes(item?.type));
    else if (mode === 1) return list?.filter((item) => [3,5].includes(item?.type));
    else if (mode === 2) return list?.filter((item) => [4,6,13,14].includes(item?.type));
    else return list;
  }

  console.log(renderByMode(activities?.data), activities?.data);

  return (
    <div className="w-full h-screen p-3 flex flex-col gap-3 items-center">
      <div className="w-full max-w-[800px] h-full border-[1px] border-slate-300 rounded-sm p-3 overflow-hidden">
        <div className="w-full flex select-none">
          <div className={"w-1/3 flex items-center justify-center pb-3 hover:cursor-pointer border-b-[1px] border-black " + (mode === 0 ? "" : "opacity-30")} onClick={() => setMode(0)}>Post</div>
          <div className={"w-1/3 flex items-center justify-center pb-3 hover:cursor-pointer border-b-[1px] border-black " + (mode === 1 ? "" : "opacity-30")} onClick={() => setMode(1)}>Comment</div>
          <div className={"w-1/3 flex items-center justify-center pb-3 hover:cursor-pointer border-b-[1px] border-black " + (mode === 2 ? "" : "opacity-30")} onClick={() => setMode(2)}>React</div>
        </div>
        <div className="w-full h-[calc(100%-45px)] overflow-y-scroll flex flex-col gap-3 pt-3">
          {renderByMode(activities?.data)?.map((item) => renderActivity(item))}
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default PageActivity;