import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import { authRoles } from "./authRoles";
import DashAdmin from "app/views/dashboard/DashAdmin";
import DashRH from "app/views/dashboard/DashRH";
import DashVisto from "app/views/dashboard/DashVisto";
import DashSecretaria from "app/views/dashboard/DashSecretaria";
import DashTecnicoProcesso from "app/views/dashboard/DashTecnicoProcesso";
import { H1 } from "app/components/Typography";
import DashAdminProjecto from "app/views/dashboard/DashAdminProjecto";
export default function ControlDash({ key, children, auth }) {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
  }

  const painel = user?.painel?.nome;
  console.log("EXISTE", painel);

  switch (painel) {
    case "ADMINISTRADOR GERAL":
      return <></>;

      break;
    case "ADMINISTRADOR":
      return <DashAdmin></DashAdmin>;
      break;
    case "RECURSOS HUMANOS":
      return <DashRH></DashRH>;
    case "ADMINISTRADOR DE PROJECTO":
      return <DashAdminProjecto></DashAdminProjecto>;
      break;
    case "TECNICO DE PROCESSO":
      return <DashTecnicoProcesso></DashTecnicoProcesso>;
    case "GESTOR DE VISTO":
      return <DashVisto></DashVisto>;

    case "SECRETARIA":
      return <DashSecretaria></DashSecretaria>;
      break;
    default:
      return <H1>seja bem vindo</H1>;
      break;
  }
}
