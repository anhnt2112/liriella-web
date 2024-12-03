import React from "react";
import { useModal } from "../../context/useModal";

const RelationModal = () => {
  const { relationUsername, openRelationModal, closeRelationModal } = useModal();

  return (<>
    {relationUsername && <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
      <div className="bg-white rounded-xl w-[400px] h-[600px] flex flex-col overflow-hidden">
        <div className="w-full h-fit">aaa</div>
        <div className="w-full flex-grow bg-red-100 rounded-b-xl overflow-y-scroll"></div>

      </div>
    </div>}
  </>);
}
export default RelationModal;