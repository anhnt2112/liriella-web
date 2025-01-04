import React, { useEffect, useRef, useState } from "react";
import DefaultAvatar from "../../../assets/jpg/default_avt.jpg";
import NoteBox from "../../NoteBox";
import useEmblaCarousel from "embla-carousel-react";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../ArrowButton';
import { baseURL, APIsRoutes } from "../../../utils/services/ApiService"; 
import { useQuery } from "@tanstack/react-query";
import Autoplay from 'embla-carousel-autoplay';
import { useModal } from "../../../context/useModal";

const NoteCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({}, [
        Autoplay({ delay: 5000 })
    ]);
    const ref = useRef(null);
    const { showNoteCarousel, closeNoteCarousel } = useModal();

    const { data: notesResponse, refetch: refetchNotes } = useQuery({
        queryKey: ['notes'],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.Post.GetNotes.path, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });
    
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
            closeNoteCarousel();
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const calculateTimeDifference = (timestamp) => {
        const currentTimestamp = Date.now();
        const differenceInMilliseconds = currentTimestamp - timestamp;
        
        const hours = Math.floor(differenceInMilliseconds / 3600000);
        const minutes = Math.floor((differenceInMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((differenceInMilliseconds % 60000) / 1000);
    
        if (hours === 0) {
            if (minutes === 0) {
                return `${seconds} seconds`;
            } else return `${minutes} minutes`;
        } else return `${hours} hours`;
    };
    

    return (showNoteCarousel &&
        <div className="w-screen h-screen z-40 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center select-none">
            <div className={"w-[400px] max-w-full h-full aspect-square rounded-xl flex flex-col py-4 relative"} ref={ref}>
                <div className="w-full h-1 rounded-full bg-white" />
                <PrevButton className="w-10 h-10 absolute left-0 top-1/2 -translate-x-1/2" onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <NextButton className="w-10 h-10 absolute right-0 top-1/2 -translate-x-1/2" onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                <div className="w-full flex-grow flex overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y touch-pinch-zoom w-full h-full">
                        {(notesResponse?.data ?? []).map(note => (
                            <div className="flex-none w-full h-full flex items-center justify-center pt-6 relative">
                                <div className="absolute top-2 left-0 flex gap-2">
                                    <img src={note.user.avatar ? baseURL+note.user.avatar : DefaultAvatar} className="rounded-full w-12 h-12 hover:cursor-pointer object-cover object-center" draggable={false} />
                                    <div className="flex flex-col">
                                        <div className="font-semibold text-white">{note.user.username}</div>
                                        <div className="font-semibold text-white opacity-70">{calculateTimeDifference(note.timestamp)}</div>
                                    </div>
                                </div>
                                <img src={note.user.avatar ? baseURL+note.user.avatar : DefaultAvatar} className="rounded-full w-40 h-40 hover:cursor-pointer object-cover object-center" draggable={false} />
                                <NoteBox className="top-1/2 left-1/2 -translate-x-20 -translate-y-20 max-w-full text-xs h-12" note={note.content} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteCarousel;