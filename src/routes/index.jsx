import { createBrowserRouter } from "react-router-dom";
import unauthRoutes from "./unauth";
import authRoutes from "./auth";
import PageAfterRegister from "../pages/PageAfterRegister";

const router = createBrowserRouter([
    {
        path: "information",
        element: <PageAfterRegister />
    },
    ...unauthRoutes,
    ...authRoutes,
]);

export default router;