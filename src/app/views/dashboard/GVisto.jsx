import { Fragment } from "react";
import { Box, Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { useApi } from "app/hooks/useApi";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ChartLine } from "../admin/processos/ChartLine";
import { AttachMoney, Group, PausePresentation, Store } from "@mui/icons-material";
import TopSellingTableVisto from "./shared/TopSellingTableVisto";
import { NotifyError } from "app/utils/toastyNotification";

// STYLED COMPONENTS
export const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize"
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

export default function Analytics() {
  const [totalPedidoSubmetido, setTotalPedidoSubmetido] = useState(0);
  const [totalPedidoCancelados, setTotalPedidoCancelados] = useState(0);
  const api = useApi();

  const buscarRelario = async () => {
    try {
      await api.list("pedido-emissao/count").then((resp) => {
        console.log(resp.data);
        setTotalPedidoSubmetido(resp?.data?.total);
      });

      await api.listQuery(`pedido-emissao/count?statusId=7`).then((resp) => {
        console.log("GGG", resp.data);
        setTotalPedidoCancelados(resp?.data?.total);
      });
    } catch (error) {
      NotifyError(error);
    }
  };
  const { palette } = useTheme();
  const cardList = [
    {
      name: "Vistos Emitidos",
      amount: 3050,
      Icon: Group,
      path: "vistos/list"
    },
    {
      name: "Visto Expirados",
      amount: "76",
      Icon: AttachMoney
    },
    { name: "Visto Cancelados ", amount: "8 ", Icon: Store },
    { name: "Processos Submetidos ", amount: totalPedidoSubmetido, Icon: Store },
    { name: "Processos em atraso ", amount: "8 ", Icon: Store },
    { name: "Processos Cancelados ", amount: totalPedidoCancelados, Icon: Store }
  ];
  useEffect(() => {
    buscarRelario();
  }, []);
  return (
    <Fragment>
      <ContentBox className="analytics h-auto">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards cardList={cardList} />
            <TopSellingTableVisto />

        
          </Grid>

          <Grid item lg={4} md={8} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }} style={{ height: "auto" }}>
              <Title>RELATÓRIO DE VISTO / PROCESSOS NOS </Title>
              <SubTitle>Últimos 30 dias</SubTitle>
              <DoughnutChart
                height="440px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              />
            </Card>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
