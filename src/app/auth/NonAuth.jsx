import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";

export default function NonAuth({ children }) {
    const { isAuthenticated, user } = useAuth();
    const { pathname } = useLocation();

    if (isAuthenticated) {
        return <Navigate replace to="/" state={{ from: pathname }} />;
    }
    return <>{children}</>
}
