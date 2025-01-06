import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PageSession = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    console.log(searchParams.get("sessionId"), searchParams.get("needRecovery"));
    const sessionId = searchParams.get("sessionId");
    const needRecovery = searchParams.get("needRecovery");

    useEffect(() => {
        localStorage.setItem("session-id", sessionId);
        if (needRecovery) navigate("information");
        else navigate(0);
    }, []);

    return <div>a</div>;
}

export default PageSession;