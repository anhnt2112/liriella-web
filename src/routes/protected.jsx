import { Navigate } from "react-router-dom";

export const ProtectedAuth = ({ children }) => {
    const sessionId = localStorage.getItem("session-id");

    if (!sessionId) return <Navigate to="/log-in" replace />;

    return children;
}

export const ProtectedUnAuth = ({ children }) => {
    const sessionId = localStorage.getItem("session-id");

    if (sessionId) return <Navigate to="/home" replace />;

    return children;
}