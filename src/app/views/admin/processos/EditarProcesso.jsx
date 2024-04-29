import { Box } from "@mui/material";
import { Breadcrumb } from "app/components";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import FormularioEditPedido from "./Local/Formularios/editar/FormularioEditPedido";
import { useParams } from "react-router-dom";

export default () => {
  const { numero } = useParams();
  return (
    <>
      <AppButtonRoot>
        <Box className="breadcrumb">
          <Breadcrumb routeSegments={[{ name: "Processo", path: "/processo/list" }]} />
        </Box>
        <Box pt={4}>{/* <Campaigns /> */}</Box>
        <FormularioEditPedido></FormularioEditPedido>
      </AppButtonRoot>
    </>
  );
};
