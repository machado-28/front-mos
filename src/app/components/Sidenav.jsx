import { Fragment } from "react";
import { styled } from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";

import { MatxVerticalNav } from "app/components";
import useSettings from "app/hooks/useSettings";
import { AdminNavigations, AdminProjectoNavigations, ClienteNavigations, GestorProjectoExternoNavigations, GestorProjectoNavigations, GestorVistoNavigations, RhNavigations, SecretariaNavigations, TecnicoProcessoNavigations, VisualizadorNavigations } from "app/navigations";
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  position: "relative"
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0,0)",
  [theme.breakpoints.up("lg")]: { display: "none" }
}));

export default function Sidenav({ children }) {
  const { isAuthenticated, user } = useAuth();
  const painel = user
  const RenderSideBar = () => {
    const painel = user?.painel?.nome
    switch (painel) {
      case "ADMINISTRADOR GERAL": return <></>;
      case "ADMINISTRADOR": return AdminNavigations;
      case "ADMINISTRADOR DE PROJECTO": return AdminProjectoNavigations;
      case "GESTOR DE PROJECTO": return GestorProjectoNavigations;

      case "TECNICO DE PROCESSO": return TecnicoProcessoNavigations;
      case "CLIENTE": return ClienteNavigations;
      case "GESTOR DE PROJECTO EXTERNO": return GestorProjectoExternoNavigations;
      case "VISUALISADOR": return VisualizadorNavigations
      case "SECRETARIA": return SecretariaNavigations

      case "GESTOR DE VISTO": return GestorVistoNavigations
      case "RECURSOS HUMANOS": return RhNavigations

      default: return <></>
        break;
    }
  }
  const { settings, updateSettings } = useSettings();

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };

  return (
    <Fragment>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        {children}
        <MatxVerticalNav items={RenderSideBar()} />
      </StyledScrollBar>

      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}
