import { createBrowserRouter } from "react-router-dom";
import unauthRoutes from "./unauth";
import authRoutes from "./auth";

const router = createBrowserRouter([
    ...unauthRoutes,
    ...authRoutes,
]);

export default router;