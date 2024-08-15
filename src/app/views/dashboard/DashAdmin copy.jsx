import { Fragment, useEffect, useState } from "react";
import { Box, Card, Grid, Paper, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/DoughnutAdmin";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { AttachMoney, Check, FileCopySharp, Folder, Group, PausePresentation, Pending, Person, Store, Timer, Wallet } from "@mui/icons-material";
import PizzaSecretaria from "./shared/PizzaSecretaria";
import { Cliente } from "../Clientes/util";
import { Projecto } from "../projecto/util";
import { Usuario } from "../usuario/util";
import Tabela2 from "./shared/Tabela2";
import { H1, H3 } from "app/components/Typography";
import Listar from "../Clientes/Listar";
import Processo from "../processo/util";
import ComparisonChartGestorVisto from "../charts/echarts/ComparisonChartGestorVisto";
import ComparisonChart from "../charts/echarts/ComparisonChart";
import AppEchart from "../charts/echarts/AppEchart";
import { Breadcrumb, SimpleCard } from "app/components";
import ModifiedAreaChart from "./shared/ModifiedAreaChart";
import { useLocation } from "react-router-dom";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import { CAlert, CCallout, CCard, CContainer } from "@coreui/react";
import Novos from "../processo/Novos";
import LineChart from "../charts/echarts/LineChart";
import AreaChart from "../charts/echarts/AreaChart";
import ReactEcharts from "echarts-for-react";
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
      bgColor: "success",
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
    // {
    //   name: "Proce. Pendentes",
    //   amount: totalProcessoPendente,
    //   Icon: Wallet,
    //   bgColor: "warning",
    //   path: "/processos/list"
    // },
    // {
    //   name: "Proc.Concluído",
    //   amount: totalProcessoConcluidos,
    //   bgColor: "success",
    //   path: "/processos/list",
    //   Icon: Wallet,
    // },

    // {
    //   name: "procE. em Atraso",
    //   amount: totalProcessoAtrasados,
    //   Icon: Timer,
    //   path: "/processos/list",
    //   bgColor: "danger",
    // },
    // {
    //   name: "proce.MIREMPET",
    //   amount: totalProcessoMIREMPET,
    //   Icon: Pending,
    //   bgColor: "info", path: "/processos/list"
    // },
    // {
    //   name: "proce.SME",
    //   amount: totalProcessoSME,
    //   Icon: Pending,
    //   bgColor: "primary",
    //   path: "/processos/list"
    // },
    // {
    //   name: "proce.MIREX",
    //   amount: totalProcessoMIREX,
    //   Icon: Pending,
    //   bgColor: "danger",
    //   path: "/processos/list"
    // },
    {
      name: "Documentos",
      amount: totalProcessoMIREX,
      Icon: FileCopySharp,
      bgColor: "success"
      ,
      IconColor: "#000",
      path: "/processos/list"
    },

    {
      name: "Usuários",
      amount: totalUsuarios,
      Icon: Person,
      bgColor: "primary",
      path: "/usuarios/list"
    },
    {
      name: "Vistos",
      amount: totalUsuarios,
      Icon: Person,
      bgColor: "info",
      path: "/usuarios/list"
    },
  ]
  const location = useLocation();
  const routeSegments = generateBreadcrumbs(location);
  const theme = useTheme();
  return (
    <Fragment>

      <ContentBox className="analytics h-auto">

        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={routeSegments}
          />
        </Box>



        <Box pt={4}></Box>
        <Grid container spacing={3}>
          <CContainer>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <StatCards cardList={cardList} />
            </Grid>
          </CContainer>

          <Grid item lg={8} md={8} sm={12} xs={12}>

            {/* <SubTitle>PROJECTOS RECENTES</SubTitle>
            <RowCards></RowCards> */}
            <Box pt={3}></Box>
            <H3 color={"InfoText"}>Estados dos Processos</H3>
            <hr></hr>
            <Card>            <Grid container={3} spacing={2} elevation={4} sx={{ mb: "14px" }}>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="warnig">
                  <Title>Pendentes</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>

              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="info">
                  <Title>Em Andamento</Title>
                  <H1>{totalProcessoPendente}</H1>

                </CCallout>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="danger">
                  <Title>Recusados</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="danger">
                  <Title>Conluíddos</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>

            </Grid>
            </Card>

            <Box pt={4}></Box>
            <Box pt={3}></Box>
            <H3 color={"InfoText"}>Fase dos Processos</H3>
            <hr></hr>
            {/* <Card>            <Grid container={3} spacing={2} elevation={4} sx={{ mb: "14px" }}>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="warnig">
                  <Title>Traducao</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>

              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="info">
                  <Title>Legação</Title>
                  <H1>{totalProcessoPendente}</H1>

                </CCallout>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="danger">
                  <Title>Recusados</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <CCallout color="danger">
                  <Title>Conluíddos</Title>
                  <H1>{totalProcessoPendente}</H1>


                </CCallout>
              </Grid>

            </Grid>
            </Card> */}
            {/* <SubTitle>PROCESSOS DE HOJE</SubTitle> */}
            {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>RELATORIO DE PROCESSOS MENSAL</Title>
              <LineChart
                height="200px"
                color={[theme.palette.warning.dark, theme.palette.primary.light]}
              />
            </Card> */}
          </Grid >

          <Grid item lg={4} md={8} sm={12} xs={2}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>RELATORIO DE PROCESSOS MENSAL</Title>
              <ComparisonChart color={[theme.palette.warning.dark, theme.palette.primary.light]} height={200}></ComparisonChart>


            </Card>
            <Card sx={{ px: 3, py: 2, mb: 4 }}>
              <Title>Faze dos Processos</Title>
              <SubTitle> </SubTitle>

              <DoughnutChart height={200} processos={[

                {
                  name: "Legalização - " + totalProcessoPendente,
                  value: totalProcessoPendente,
                  Icon: Wallet,
                  color: colorMapping[0],
                },
                {
                  name: "MIREX - " + totalProcessoMIREX,
                  value: totalProcessoMIREX,
                  color: colorMapping[1],
                  Icon: Wallet,
                },

                {
                  name: "SME - " + totalProcessoSME,
                  value: totalProcessoSME,
                  Icon: Timer,
                  color: colorMapping[2],
                },

                {
                  name: "MIREMPET - " + totalProcessoMIREMPET,
                  value: totalProcessoMIREMPET,
                  Icon: Timer,
                  color: colorMapping[3],
                },

                // {
                //   name: "proce.MIREMPET",
                //   value: totalProcessoMIREMPET,
                //   Icon: Pending,
                //   color: colorMapping[3],
                // },
                // {
                //   name: "proce.SME",
                //   value: totalProcessoSME,
                //   Icon: Pending,
                //   color: colorMapping[4],
                // },
                // {
                //   name: "proce.MIREX",
                //   value: totalProcessoMIREX,
                //   Icon: Pending,
                //   color: colorMapping[5],
                // },
                // {
                //   name: "proce.cancelados",
                //   value: totalProcessoCancelado,
                //   Icon: Pending,
                //   color: colorMapping[5],
                // },
              ]} colors={colorMapping} />
            </Card>


            {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Estados dos Processos</Title>
              <SubTitle> </SubTitle>

              <DoughnutChart height={400} processos={[

                {
                  name: "Pendentes -" + totalProcessoPendente,
                  value: totalProcessoPendente,
                  Icon: Wallet,
                  color: colorMapping[0],
                },
                {
                  name: "Finalizados -" + totalProcessoConcluidos,
                  value: totalProcessoConcluidos,
                  color: colorMapping[1],
                  Icon: Wallet,
                },

                {
                  name: "Atrasados -" + totalProcessoAtrasados,
                  value: totalProcessoAtrasados,
                  Icon: Timer,
                  color: colorMapping[2],
                },

                {
                  name: "Cancelados -" + totalProcessoCancelado,
                  value: totalProcessoCancelado,
                  Icon: Timer,
                  color: colorMapping[3],
                },
                // {
                //   name: "proce.MIREMPET",
                //   value: totalProcessoMIREMPET,
                //   Icon: Pending,
                //   color: colorMapping[3],
                // },
                // {
                //   name: "proce.SME",
                //   value: totalProcessoSME,
                //   Icon: Pending,
                //   color: colorMapping[4],
                // },
                // {
                //   name: "proce.MIREX",
                //   value: totalProcessoMIREX,
                //   Icon: Pending,
                //   color: colorMapping[5],
                // },
                // {
                //   name: "proce.cancelados",
                //   value: totalProcessoCancelado,
                //   Icon: Pending,
                //   color: colorMapping[5],
                // },
              ]} colors={colorMapping} />
            </Card> */}


          </Grid>


        </Grid>

      </ContentBox>

    </Fragment>
  );
}

