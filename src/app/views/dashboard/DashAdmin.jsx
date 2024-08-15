import { Fragment, useEffect, useState } from "react";
import { Box, Card, Grid, Paper, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/DoughnutAdmin";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingTable from "./shared/TopSellingTable";
import { AttachMoney, Check, DocumentScannerSharp, FileCopySharp, FileOpen, FilePresent, Folder, Group, PausePresentation, Pending, Person, Store, Timer, Wallet } from "@mui/icons-material";
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
import { CChart } from "@coreui/react-chartjs";
import { useApi } from "app/hooks/useApi";
import { util } from "echarts";
import Visto from "../visas/util";
import Ficheiros from "app/utils/Ficheiros";

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

export default function DashAdminProjecto() {
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

  const [totalUsuarios, setTotalUsuarios] = useState()
  const [totalProcessosHoje, setTotalProcessosHoje] = useState(0)

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

  const visto = new Visto()
  const [totalVisto, setTotalvisto] = useState(0)
  async function contarvisto() {

    const res = await visto.contar();


    setTotalvisto(res)
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

  const location = useLocation();

  const [processosMensais, setProcessosMensais] = useState([])
  const [processosDiario, setProcessosDiario] = useState([])
  const [processosHoje, setProcessosHoje] = useState([])
  const [totalDocumentos, setTotalDocumentos] = useState(0)


  async function buscarEstatisicas() {
    const processosMensais = await useApi().list("processos/estatistica")
    console.log("PROCESSOS MENSAIS", processosMensais);
    setProcessosMensais(prev => processosMensais?.data || [])

    const processosDiarios = await useApi().list("processos/estatisticadiaria")
    console.log("PROCESSOS Diario", processosDiarios);
    setProcessosDiario(prev => processosDiarios?.data || []);

    const processoshoje = await useApi().list("processos/estatisticahoje")
    console.log("PROCESSOS HOJE", processoshoje);
    setProcessosHoje(prev => processoshoje?.data || []);
  }

  async function contarDocumentos() {
    const total = await Ficheiros.contar()


    setTotalDocumentos(prev => total)
  }

  useEffect(() => {
    buscarEstatisicas()
    contarDocumentos()
  }, [])

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const routeSegments = generateBreadcrumbs(location);
  const theme = useTheme();

  const [estados, setEstados] = useState([{ nome: "Pendente", }, { nome: "Recusao" }, { nome: "Concluido" }])

  const [fases, setFases] = useState([{ nome: "Legalização", }, { nome: "Tradução" }, { nome: "SME sede" }])
  const visaTypes = ["Turismo", "Trabalho", "Curta Duração", "Fronteira"];
  useEffect(() => {
    contarClientes();
    contarProjecto();
    contarUsuario();
    buscarProjecto()
    contarvisto()
    contarProcesso()

  }, [])
  const cardList = [
    {
      name: "Clientes",
      bgColor: "info",
      amount: totalCliente,
      Icon: Group,
      path: "/clientes/list"

    },
    {
      name: "Projectos",
      amount: totalProjecto,
      bgColor: "info",
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
      name: "Files",
      amount: totalDocumentos,
      Icon: FileCopySharp,
      bgColor: "info"
      ,
      IconColor: "#000",
      path: "/processos/list"
    },

    {
      name: "Usuários",
      amount: totalUsuarios,
      Icon: Person,
      bgColor: "info",
      path: "/usuarios/list"
    },
    {
      name: "Vistos",
      amount: totalVisto,
      Icon: FileOpen,
      bgColor: "info",
      path: "/vistos/query?activo=null"
    },
  ]
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
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
              <StatCards cardList={cardList} />
            </Grid> */}
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <StatCards cardList={cardList} />
                <Box pt={2}></Box>

                <Card sx={{ px: 2, py: 2, mb: 3 }} style={{ height: "auto" }}>
                  <CAlert color="info">
                    <Title>
                      <Title>ESTATÍSTICA MENSAL DOS PEDIDOS </Title>
                    </Title>
                  </CAlert>
                  <CChart
                    type="bar"
                    data={{
                      labels: Object.keys(processosMensais),
                      datasets: visaTypes?.map((visaType, index) => {
                        const colors = [
                          'rgba(255, 99, 132, 0.2)', // Turismo color
                          'rgba(54, 162, 235, 0.2)', // Trabalho color
                          'rgba(75, 192, 192, 0.2)', // Curta Duração color
                          'rgba(45, 292, 12, 0.2)'
                        ];
                        const borderColors = [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(75, 192, 192, 1)'
                        ];
                        return {
                          label: visaType,
                          data: Object.values(processosMensais)?.map(monthData => {
                            const visa = monthData?.find(v => v.tipoVisto === visaType);
                            return visa ? visa.count : 0;

                          }),
                          backgroundColor: colors[index],
                          borderColor: borderColors[index],
                          borderWidth: 1
                        };
                      })
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: "#41B883",
                          }
                        }
                      }
                    }}
                  />
                </Card>
                <Card sx={{ px: 2, py: 2, mb: 3 }} style={{ height: "auto" }}>
                  <CAlert color="info">
                    <Title>
                      <Title>ESTATÍSTICA SEMANAL DOS PEDIDOS </Title>
                    </Title>
                  </CAlert>
                  <CChart
                    type="radar"
                    data={{
                      labels: Object.keys(processosDiario),
                      datasets: visaTypes?.map((visaType, index) => {
                        const colors = [
                          'rgba(255, 99, 132, 0.2)', // Turismo color
                          'rgba(54, 162, 235, 0.2)', // Trabalho color
                          'rgba(75, 192, 192, 0.2)', // Curta Duração color
                          'rgba(45, 292, 12, 0.2)'
                        ];
                        const borderColors = [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(75, 192, 192, 1)'
                        ];
                        return {
                          label: visaType,
                          data: Object.values(processosDiario)?.map(dayData => {
                            const visa = dayData.find(v => v.tipoVisto === visaType);
                            return visa ? visa.count : 0;

                          }),
                          backgroundColor: colors[index],
                          borderColor: borderColors[index],
                          borderWidth: 1
                        };
                      })
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: "#41B883",
                          }
                        }
                      }
                    }}
                  />
                </Card>

                {/* <ChartLine></ChartLine> */}
              </Grid>

              <Grid item lg={4} md={8} sm={6} xs={12}>
                <Card sx={{ px: 2, py: 4, mb: 3 }} style={{ height: "auto" }}>
                  <Title>Relatoio</Title>
                  <SubTitle>de hoje</SubTitle>
                  <CChart
                    type="doughnut"
                    data={{
                      labels: visaTypes,
                      datasets: [
                        {
                          label: "Total",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: Object.values(processosHoje)?.map(day => {
                            
                            return day ? day.count : 0;
                          }),
                        },
                      ],
                    }}

                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: "#41B883",
                          }
                        }
                      },
                    }}

                  />
                </Card>
                <Card sx={{ px: 2, py: 3, mb: 3 }} style={{ height: "auto" }}>
                  <Title>Fase Dos Processos</Title>
                  <SubTitle></SubTitle>
                  <CChart
                    type="polarArea"
                    data={{
                      labels: visaTypes,
                      datasets: [
                        {
                          label: "Tradução",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "Legalização",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "SME Sede",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "SME Aeroporto",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "MIREMPET",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: "#41B883",
                          }
                        }
                      },
                    }}
                  />
                </Card>
                <Card sx={{ px: 2, py: 4, mb: 3 }} style={{ height: "auto" }}>
                  <Title> Estado Dos Processos</Title>
                  <SubTitle></SubTitle>
                  <CChart
                    type="polarArea"
                    data={{
                      labels: estados?.map(item => item.nome),
                      datasets: [
                        {
                          label: "Tradução",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "Legalização",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "SME Sede",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "SME Aeroporto",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                        {
                          label: "MIREMPET",
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                          data: [40, 20, 80, 10],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: "#41B883",
                          }
                        }
                      },
                    }}
                  />
                </Card>
              </Grid>
            </Grid>
          </CContainer>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}

