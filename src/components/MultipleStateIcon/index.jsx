import React, { useState } from "react";

const MultipleStateIcon = ({ className = "", defaultIcon, hoverIcon, activeIcon, isActive = false, onClick }) => {
    const [icon, setIcon] = useState(defaultIcon);

    return (
        <img 
            src={isActive ? activeIcon : icon} 
            alt="" className={className}
            onMouseEnter={() => setIcon(isActive ? activeIcon : hoverIcon)}
            onMouseLeave={() => setIcon(isActive ? activeIcon : defaultIcon)}
            onClick={onClick}
        />
    );
}

export default MultipleStateIcon;