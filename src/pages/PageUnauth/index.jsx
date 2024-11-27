import React from "react";
import UnauthFormExtra from "../../components/UnauthFormExtra";
import UnauthForm from "../../components/UnauthForm";

const PageUnauth = () => {
    return (
        <div className="w-80 md:w-96 h-fit flex flex-col items-center justify-center gap-4">
            <UnauthForm />
            <UnauthFormExtra />
        </div>
    );
}

export default PageUnauth;