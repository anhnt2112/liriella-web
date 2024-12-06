import React from "react";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import { useModal } from "../../context/useModal";

const PreviewUser = () => {
  const data = {};
  const { previewUserSetting, closePreviewUser, previewUserRef } = useModal();

  console.log("Setting ", previewUserSetting);

  return (<>
    {previewUserSetting &&
    <div 
      className={"bg-white w-96 h-fit flex flex-col gap-3 rounded-xl z-50 fixed"}
      style={{
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        left: previewUserSetting.position.x,
        top: previewUserSetting.position.y
      }}
      ref={previewUserRef}
      onMouseLeave={closePreviewUser}
    >
      <div className="w-full flex gap-3 p-3">
        <img src={data.avatar ?? DefaultAvatar} alt="" className="rounded-full w-14 h-14 hover:cursor-pointer object-cover object-center" draggable={false} />
        <div className="flex flex-col justify-center">
          <div className="text-base font-medium hover:cursor-pointer">{data.username ?? "abc"}</div>
          <div className="text-sm">{data.fullName ?? "abc"}</div>
        </div>
      </div>
      <div className="w-full flex gap-1">
        <div className="flex-grow flex justify-center">2</div>
        <div className="flex-grow flex justify-center">3</div>
        <div className="flex-grow flex justify-center">4</div>
      </div>
      <div className="w-full flex gap-1">
        {(data.image ?? [1,2,3]).map((image, index) => (
          // <img key={index} src={image} alt="" className="w-[120px] aspect-2/3 hover:cursor-pointer object-cover object-center" draggable={false} />
          <div className="flex-grow aspect-2/3 bg-red-200"></div>
        ))}
      </div>
      <div className="w-full flex gap-2 p-3">
        <div className="flex-grow flex justify-center">Button 1</div>
        <div className="flex-grow flex justify-center">Button 2</div>
      </div>
    </div>}
  </>);
}

export default PreviewUser;