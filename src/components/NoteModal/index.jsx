import React, { useRef, useState, useEffect } from "react";
import CloseIcon from "../../assets/svg/close.svg";
import NoteBox from "../NoteBox";
import DefaultAvatar from "../../assets/jpg/default_avt.jpg";
import { useModal } from "../../context/useModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL, APIsRoutes } from "../../utils/services/ApiService";
import useUser from "../../context/useUser";

const NodeModal = () => {
    const { user } = useUser();
    const { isCreateNoteOpen, closeCreateNote } = useModal();
    const ref = useRef(null);

    const { data: response, isLoading, refetch } = useQuery({
        queryKey: ['note', user?._id],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.GetNote.path+`/${user?._id}`);
        },
        enabled: !!user?._id
    });

    const [note, setNote] = useState("");
    
    useEffect(() => {
        if (response?.data?.length > 0) {
            setNote(response.data[0].content);
        }
    }, [response]);

    const { mutate } = useMutation({
        mutationFn: () => {
            return axios.post(baseURL+APIsRoutes.Post.CreateNote.path, { content: note }, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        },
        onSuccess: () => {
            refetch();
        }
    });

    const handleSave = () => {
        closeCreateNote();
        mutate();
    }

    const handleClose = () => {
        closeCreateNote();
        setNote(response?.data[0].content);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
            handleClose();
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (isCreateNoteOpen && 
        <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className={"w-[400px] aspect-square bg-white rounded-xl flex flex-col"} ref={ref}>
                <div className="w-full rounded-t-xl border-b border-slate-200 py-2 flex items-center justify-between px-2 font-medium">
                    <div className="w-8 flex items-center justify-center cursor-pointer">
                        <img src={CloseIcon} className="w-4" alt="Back" onClick={handleClose} />
                    </div>
                    <div className="text-xl">Note</div>
                    <div className="text-xs w-8 flex items-center justify-center text-ui-blue cursor-pointer" onClick={handleSave}>
                        Save
                    </div>
                </div>
                <div className="flex-grow flex items-center justify-center">
                <div className="relative flex justify-center pt-6">
                    <img src={user?.avatar ? baseURL+user?.avatar : DefaultAvatar} className="rounded-full w-40 h-40 hover:cursor-pointer object-cover object-center" draggable={false} />
                    <NoteBox className="top-0 left-0 w-full text-xs h-12" isInput note={note} setNote={setNote} />
                </div>
                </div>
            </div>
        </div>
    );
}

export default NodeModal;