import AuthLayout from "../components/layout/AuthLayout";
import PageMessage from "../pages/PageMessage";
import PageProfile from "../pages/PageProfile";
import { ProtectedAuth } from "./protected";

const authRoutes = [
    {
        path: "/",
        element: (
            <ProtectedAuth>
                <AuthLayout />
            </ProtectedAuth>
        ),
        children: [
            {
                path: "home",
                element: <div>aaa</div>
            },
            {
                path: "explore",
                elment: <div>aaa</div>
            },
            {
                path: "message",
                element: <PageMessage />
            },
            {
                path: "message/:conversationId",
                element: <PageMessage />
            },
            {
                path: "profile",
                element: <PageProfile />
            },
            {
                path: "profile/:username",
                element: <PageProfile />
            }
        ]
    }
];

export default authRoutes;