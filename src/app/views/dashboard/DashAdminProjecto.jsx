import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { AttachMoney, Folder, Group, PausePresentation, Pending, Person, Store, Timer, Wallet } from "@mui/icons-material";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
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

export default function DashAdmin() {
  const { palette } = useTheme();
  const cardList = [
    {
      name: "Clientes",
      bgColor: "warning",
      amount: 30,
      Icon: Group,

    },
    {
      name: "Projectos",
      amount: "12",
      bgColor: "success",

      Icon: Folder,
    },

    {
      name: "Processos",
      amount: "61",
      Icon: Wallet,
      bgColor: "primary",
    },
    {
      name: "Proc.Concluído",
      amount: "12",
      bgColor: "success",
      Icon: Wallet,
    },

    {
      name: "Proc.Atraso",
      amount: "61",
      Icon: Timer,
      bgColor: "danger",
    },
    {
      name: "MIREMPET",
      amount: "61",
      Icon: Pending,
      bgColor: "warning",
    },
    {
      name: "SME",
      amount: "61",
      Icon: Pending,
      bgColor: "warning",
    },
    {
      name: "MIREX",
      amount: "61",
      Icon: Pending,
      bgColor: "warning",
    },

    {
      name: "Técnicos",
      amount: "61",
      Icon: Person,
      bgColor: "info",
    },
    {
      name: "Gestores",
      amount: "61",
      Icon: Person,
      bgColor: "info",
    },
  ]

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards cardList={cardList} />
            <TopSellingTable />
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>RELATÓRIO  DE VISTO NOS </Title>
              <SubTitle>Últimos 30 dias</SubTitle>
              <DoughnutChart
                height="440px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              />
            </Card>
            {/* <Campaigns /> */}
          </Grid>

        </Grid>
      </ContentBox>
    </Fragment>
  );
}
