import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import { authRoles } from "./authRoles";

export default function PrivateRoutes({ key, children, auth }) {

    const { isAuthenticated, user } = useAuth();
    const { pathname } = useLocation();

    if (!isAuthenticated) {
        return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
    }
    // Verifica se o perfil do usuário tem permissão para acessar a rota
    const hasPermission = auth?.filter(permission => permission == user?.painel?.nome);
    // authRoles[permission.toLowerCase()]?.includes(user.painel?.nome.toUpperCase())
   
    if (hasPermission.length<=0) {
        return <Navigate to="/session/404" />;
    }

    return <>{children}</>;
}
