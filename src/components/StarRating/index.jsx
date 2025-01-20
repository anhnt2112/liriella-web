import React, { useEffect, useState } from "react";
import Star from "./star";

const StarRating = ({ rate = 3, setRate }) => {
    const [hovered, setHovered] = useState(-1);
    const [value, setValue] = useState(rate);

    const onHoverStart = (index) => {
        setHovered(index);
        setValue(-1);
    }

    const onHoverEnd = () => {
        setHovered(-1);
        setValue(rate);
    }

    useEffect(() => {
        setValue(rate);
    }, [rate]);

    return (
        <div className="flex gap-2 flex-grow justify-end">
            {[0,1,2,3,4].map((index) => <Star active={index < value} isHovered={index <= hovered} onHoverStart={() => onHoverStart(index)} onHoverEnd={onHoverEnd} onClick={() => setRate(index+1)} />)}
        </div>
    );
}

export default StarRating;