import { Fragment, useEffect, useState } from "react";
import { Box, Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/DoughnutAdmin";
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
import Processo from "../processo/util";
import ComparisonChartGestorVisto from "../charts/echarts/ComparisonChartGestorVisto";
import ComparisonChart from "../charts/echarts/ComparisonChart";
import AppEchart from "../charts/echarts/AppEchart";
import { SimpleCard } from "app/components";

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

const colorMapping = [

  "#ff9800",
  "#4caf50",
  "#dc004e",
  "#2196f3",
  "#1976d2",
  "#f44336",
  "#f44336",
  "#dc004e"





];

export default function DashAdmin() {
  const { palette } = useTheme();


  const [pendente, traducao, mirex, sme, mirempet, finalizados] = [1, 2, 3, 4, 5, 6]

  const processo = new Processo();
  async function contarProcesso() {
    const total = await processo.contar();
    setTotalProcesso(prev => total);

    const totalMirex = await processo.progresso({ stepId: mirex });
    setTotalProcessoMIREX(prev => totalMirex?.total);

    const totalMIREMPET = await processo.progresso({ stepId: mirempet });
    setTotalProcessoMIREMPET(prev => totalMIREMPET?.total);

    const totalProcessoPendentes = await processo.progresso({ stepId: pendente });
    setTotalProcessoPendente(prev => totalProcessoPendentes?.total);

    const totalProcessoSME = await processo.progresso({ stepId: sme });
    setTotalProcessoSME(prev => totalProcessoSME?.total);

    const totalProcessoFinalizados = await processo.progresso({ stepId: finalizados });
    setTotalProcessoConcluidos(prev => totalProcessoFinalizados?.total);
  }


  const [totalProcesso, setTotalProcesso] = useState(0)
  const [totalProcessoAtrasados, setTotalProcessoAtrasados] = useState(0)
  const [totalProcessoSME, setTotalProcessoSME] = useState(0)
  const [totalProcessoMIREMPET, setTotalProcessoMIREMPET] = useState(0)
  const [totalProcessoMIREX, setTotalProcessoMIREX] = useState(0)
  const [totalProcessoPendente, setTotalProcessoPendente] = useState(0)
  const [totalProcessoConcluidos, setTotalProcessoConcluidos] = useState(0)
  const [totalProcessoCancelado, settotalProcessoCancelado] = useState(0)
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
    contarProcesso()

  }, [])
  const cardList = [
    {
      name: "Clientes",
      bgColor: "primary",
      amount: totalCliente,
      Icon: Group,
      path: "/clientes/list"

    },
    {
      name: "Projectos",
      amount: totalProjecto,
      bgColor: "primary",
      path: "/projectos/list",
      Icon: Folder,
    },

    {
      name: "Processos",
      amount: totalProcesso,
      Icon: Wallet,
      bgColor: "info",
      path: "/processos/list"
    },
    {
      name: "Proce. Pendentes",
      amount: totalProcessoPendente,
      Icon: Wallet,
      bgColor: "warning",
      path: "/processos/list"
    },
    {
      name: "Proc.Concluído",
      amount: totalProcessoConcluidos,
      bgColor: "success",
      path: "/processos/list",
      Icon: Wallet,
    },

    {
      name: "procE. em Atraso",
      amount: totalProcessoAtrasados,
      Icon: Timer,
      path: "/processos/list",
      bgColor: "danger",
    },
    {
      name: "proce.MIREMPET",
      amount: totalProcessoMIREMPET,
      Icon: Pending,
      bgColor: "info", path: "/processos/list"
    },
    {
      name: "proce.SME",
      amount: totalProcessoSME,
      Icon: Pending,
      bgColor: "primary",
      path: "/processos/list"
    },
    {
      name: "proce.MIREX",
      amount: totalProcessoMIREX,
      Icon: Pending,
      bgColor: "danger",
      path: "/processos/list"
    },
    {
      name: "proce.Cancelados",
      amount: totalProcessoMIREX,
      Icon: Pending,
      bgColor: "secondary",
      path: "/processos/list"
    },

    {
      name: "Usuários",
      amount: totalUsuarios,
      Icon: Person,
      bgColor: "primary",
      path: "/usuarios/list"
    },
  ]
  const theme = useTheme();
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
        {/* <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card sx={{ px: 3, py: 2, mb: 3 }}>


            <SimpleCard title="Processos">
              <ComparisonChart
                height="350px"
                processos
                color={[theme.palette.primary.dark, theme.palette.primary.light]}
              />
            </SimpleCard>
          </Card>

        </Grid> */}

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card sx={{ px: 3, py: 2, mb: 3 }}>
            <Title>RELATÓRIO  DOS PROCESSOS </Title>
            <SubTitle> </SubTitle>

            <DoughnutChart height={400} processos={[

              {
                name: "Proce. Pendentes",
                value: totalProcessoPendente,
                Icon: Wallet,
                color: colorMapping[0],
              },
              {
                name: "Proc.Concluído",
                value: totalProcessoConcluidos,
                color: colorMapping[1],
                Icon: Wallet,
              },

              {
                name: "procE. em Atraso",
                value: totalProcessoAtrasados,
                Icon: Timer,
                color: colorMapping[2],
              },
              {
                name: "proce.MIREMPET",
                value: totalProcessoMIREMPET,
                Icon: Pending,
                color: colorMapping[3],
              },
              {
                name: "proce.SME",
                value: totalProcessoSME,
                Icon: Pending,
                color: colorMapping[4],
              },
              {
                name: "proce.MIREX",
                value: totalProcessoMIREX,
                Icon: Pending,
                color: colorMapping[5],
              },
              {
                name: "proce.cancelados",
                value: totalProcessoCancelado,
                Icon: Pending,
                color: colorMapping[5],
              },



            ]} colors={colorMapping} />
          </Card>
          {/* <Campaigns /> */}
        </Grid>
      </ContentBox>

    </Fragment>
  );
}

