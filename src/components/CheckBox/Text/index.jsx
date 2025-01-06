import React, { useEffect } from "react";
import { motion } from "motion/react";

const TextCheckbox = ({ value, list, onClick }) => {

    return (
        <div className="w-20 h-8 flex items-center justify-center overflow-hidden rounded-full hover:cursor-pointer" onClick={onClick}>
            <motion.div 
                className="w-full h-full flex" 
                initial={{ x: -value*80 }} 
                animate={{ x: -value*80 }}
                transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
            >
                {list.map((item, index) => (
                    <div className="w-20 h-full text-white flex items-center justify-center flex-none" style={{ backgroundColor: item.color }} key={index}>
                        {item.label}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default TextCheckbox;