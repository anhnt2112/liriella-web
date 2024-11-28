import AuthLayout from "../components/layout/AuthLayout";
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
                element: <div>aaa</div>
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