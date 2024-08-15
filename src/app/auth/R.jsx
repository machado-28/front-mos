import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import { authRoles } from "./authRoles";
import DashAdmin from "app/views/dashboard/DashAdmin";
import DashRH from "app/views/dashboard/DashRH";
import DashCliente from "app/views/Clientes/DashCliente";
import DashAdminProjecto from "app/views/dashboard/DashAdminProjecto";
import DashTecnicoProcesso from "app/views/dashboard/DashTecnicoProcesso";
import DashGestorProjectoCliente from "app/views/dashboard/DashGestorProjectoCliente";


export default function ControlDash({ key, children, auth }) {

    const { isAuthenticated, user } = useAuth();
    const { pathname } = useLocation();

    if (!isAuthenticated) {
        return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
    }

    const painel = user?.painel?.nome
    switch (painel) {
        case "ADMINISTRADOR GERAL": return <></>;
            break;
        case "ADMINISTRADOR DE PROJECTO": return <DashAdminProjecto></DashAdminProjecto>;
            break;
        case "GESTOR DE PROJECTO CLIENTE": return <DashGestorProjectoCliente></DashGestorProjectoCliente>;
            break;
        case "GESTOR DE PROJECTO": return <DashGestorProjectoCliente></DashGestorProjectoCliente>;
            break;

        case "ADMINISTRADOR": return <DashAdmin></DashAdmin>;
        case "RECURSOS HUMANOS": return <DashRH></DashRH>
            break;
        case "SECRETARIA": return <DashRH></DashRH>
        case "TECNICO DE PROCESSO":
            return <DashTecnicoProcesso></DashTecnicoProcesso>;
        case "GESTOR DE VISTO": return <DashRH></DashRH>
        case "CLIENTE": return <DashCliente></DashCliente>

        default: return <></>
            break;
    }
}
