import { Fragment, useEffect, useState } from "react";
import { Box, Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { AttachMoney, Folder, Group, PausePresentation, Pending, Person, Store, Timer, Wallet } from "@mui/icons-material";
import PizzaSecretaria from "./shared/PizzaSecretaria";
import { Cliente } from "../Clientes/util";
import { Projecto } from "../projecto/util";
import { Usuario } from "../usuario/util";
import Tabela2 from "./shared/Tabela2";
import { H1 } from "app/components/Typography";
import Listar from "../Clientes/Listar";

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



  const [totalProcesso, setTotalProcesso] = useState()
  const [totalUsuarios, setTotalUsuarios] = useState()

  const cliente = new Cliente()
  const [totalCliente, setTotalCliente] = useState()
  async function contarClientes() {
    const res = await cliente.contar();
    setTotalCliente(res)
  }

  const projecto = new Projecto()
  const [totalProjecto, setTotalProjecto] = useState()
  async function contarProjecto() {
    const res = await projecto.contar();
    setTotalProjecto(res)
  }

  const usuario = new Usuario()
  const [totalUsuario, setTotalUsuario] = useState()
  async function contarUsuario() {
    const res = await usuario?.contar({});
    setTotalUsuarios(res)
  }

  const [projectos, setprojectos] = useState()
  async function buscarProjecto() {
    const res = await projectos?.contar();
    setprojectos(res)
  }

  useEffect(() => {
    contarClientes();
    contarProjecto();
    contarUsuario();
    buscarProjecto()

  }, [])
  const cardList = [
    {
      name: "Clientes",
      bgColor: "warning",
      amount: totalCliente,
      Icon: Group,

    },
    {
      name: "Projectos",
      amount: totalProjecto,
      bgColor: "success",

      Icon: Folder,
    },

    {
      name: "Processos",
      amount: 0,
      Icon: Wallet,
      bgColor: "primary",
    },
    {
      name: "Proc.Concluído",
      amount: 0,
      bgColor: "success",
      Icon: Wallet,
    },

    {
      name: "Proc.Atraso",
      amount: 0,
      Icon: Timer,
      bgColor: "danger",
    },
    {
      name: "MIREMPET",
      amount: 0,
      Icon: Pending,
      bgColor: "warning",
    },
    {
      name: "SME",
      amount: 0,
      Icon: Pending,
      bgColor: "warning",
    },
    {
      name: "MIREX",
      amount: 0,
      Icon: Pending,
      bgColor: "warning",
    },

    {
      name: "Usuários",
      amount: totalUsuarios,
      Icon: Person,
      bgColor: "info",
    },
  ]

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={12} md={8} sm={12} xs={12}>
            <StatCards cardList={cardList} />
            {/* <Listar></Listar> */}
            <Box pt={2}></Box>
            {/* <H1>Projectos</H1> */}
            <Box pt={1}></Box>
            {/* <Tabela2 projectos={projectos}></Tabela2> */}
          </Grid>


        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card sx={{ px: 3, py: 2, mb: 3 }}>
            <Title>RELATÓRIO  DE VISTO NOS </Title>
            <SubTitle>Últimos 30 dias</SubTitle>
            <PizzaSecretaria></PizzaSecretaria>
            <DoughnutChart
              height="440px"
              color={[palette.primary.dark = "red", palette.primary.dark = "yellow", palette.primary.light, palette.background.default]}
            />
          </Card>
          {/* <Campaigns /> */}
        </Grid>

      </ContentBox>
    </Fragment>
  );
}
