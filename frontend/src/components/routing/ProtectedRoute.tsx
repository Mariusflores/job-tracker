import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";

export function ProtectedRoute() {
    const auth = useAuth();

    if (!auth.isAuthenticated)
        return <Navigate to={"/login"} replace/>

    return <Outlet/>
}