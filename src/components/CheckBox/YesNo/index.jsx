import React from "react";
import { motion } from "motion/react";

const YesNoCheckBox = ({ value, onClick }) => {
    return (
        <motion.div 
            className="w-14 h-8 p-1 rounded-full hover:cursor-pointer"
            initial={{ backgroundColor: !value ? "#DBDFE4" : "#F05408" }}
            animate={{ backgroundColor: !value ? "#DBDFE4" : "#F05408" }}
            transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
            onClick={onClick}
        >
        <motion.div 
            className="w-6 h-6 bg-white rounded-full"
            initial={{ x: !value ? 0 : "100%" }}
            animate={{ x: !value ? 0 : "100%" }}
            transition={{ ease: "easeOut", type: "spring", damping: 15, stiffness: 120 }}
        />
        </motion.div>
    );
}

export default YesNoCheckBox;