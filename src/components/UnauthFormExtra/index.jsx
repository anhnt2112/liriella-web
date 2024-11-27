import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { unauthFormStates } from "../../utils/unauth";

const UnauthFormExtra = () => {
    const location = useLocation();
    const path = location.pathname;
    const authState = path.split('/').filter(Boolean).pop();
    const content = unauthFormStates[authState].formExtra;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${content.path}`);
    }

    return (
        <div className="w-full py-2 px-12 border border-ui-stroke flex justify-center gap-1 select-none rounded-sm text-xs md:text-base">
            {content.label}
            <Link to={`/${content.path}`} onClick={handleClick} className="text-ui-blue font-semibold">{content.extraLabel}</Link>
        </div>
    );
}

export default UnauthFormExtra;