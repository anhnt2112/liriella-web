import React from "react";
import { Navigate } from "react-router-dom";

const Page404 = () => {
    return <Navigate to="/log-in" replace />;
}

export default Page404;