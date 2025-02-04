import React from "react";

const NoteBox = ({ note, className, onClick, isInput = false, setNote }) => {
  return (<>
    <div className={"absolute select-none " + className} onClick={onClick}>
      <div 
        className={"w-fit h-full flex items-center p-2 rounded-xl bg-white hover:cursor-pointer " + ((note || isInput) ? "" : "text-slate-400")}
        style={{
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)"
        }}
      >
        {isInput ? <input placeholder="Note..." value={note} className="w-full focus:outline-none" onChange={(e) => setNote(e.target.value)} /> : (note ?? "Note...")}
      </div>
      <div 
        className="absolute bg-white w-3 h-3 rounded-full left-3 bottom-0 translate-y-1.5" />
      <div className="absolute bg-white w-1 h-1 rounded-full left-5 bottom-0 translate-y-2.5" />
    </div>
  </>)
}

export default NoteBox;