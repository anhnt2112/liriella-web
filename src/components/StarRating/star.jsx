import React, { useState } from "react";
import { motion } from "motion/react";

import StarDefault from "./star.png";
import StarFilled from "./star_filled.png";

const Star = ({ active, isHovered, onHoverStart, onHoverEnd, onClick }) => {

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 1 }}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className="h-7 aspect-square flex justify-center items-center cursor-pointer"
            onClick={onClick}
        >
            <motion.img
                src={(isHovered || active) ? StarFilled : StarDefault}
                alt="star"
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
}

export default Star;