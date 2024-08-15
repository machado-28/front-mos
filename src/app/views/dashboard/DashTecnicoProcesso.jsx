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
import ListarProcessos from "../../views/processo/delegados/Listar"
import useAuth from "app/hooks/useAuth";
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

export default function DashTecnicoProcesso() {
  const { user, } = useAuth()

  const { palette } = useTheme();

  const [processos, setProcessos] = useState({
    cancelados: 0,
    submetidos: 0,
    recusados: 0,
    andamento: 0,
    pendente: 0,
    finalizado: 0
  })


  async function buscarPRocessos() {
    const processosSubmetidos = await new Processo().contarDelegados({ responsavelId: user?.id });
    const processosPendentes = await new Processo().contarDelegados({ responsavelId: user?.id, statusId: 1 });
    const processosCancelados = await new Processo().contarDelegados({ responsavelId: user?.id, statusId: 6 });
    const processosFinalizados = await new Processo().contarDelegados({ responsavelId: user?.id, statusId: 4 });
    const processosAndamento = await new Processo().contarDelegados({ responsavelId: user?.id, statusId: 2 });
    const processosRecusado = await new Processo().contarDelegados({ responsavelId: user?.id, statusId: 5 });

    // const vistosActivos = await new Visto().contar({ clienteId, activo: true });
    // const vistosExpirados = await new Visto().contar({ clienteId, activo: false });

    // // Update state
    setProcessos(prev => ({
      ...prev, // Keep previous state
      cancelados: processosCancelados,
      submetidos: processosSubmetidos,
      recusados: processosRecusado,
      andamento: processosAndamento,
      pendente: processosPendentes,
      finalizado: processosFinalizados
    }));

  }
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

  const visto = new Visto({})
  const [vistos, setvistos] = useState({
    expirado: 0,
    activo: 0
  })


  async function contarvisto() {
    const activo = await visto.contar({ activo: true });
    const expirado = await visto.contar({ activo: false });
    setvistos(prev => ({
      ...prev,
      expirado,
      activos: activo,

    }))
  }

  const [projectos, setprojectos] = useState()
  async function buscarProjecto() {
    const res = await projectos?.contar();
    setprojectos(res)
  }
  useEffect(() => {
    contarClientes();
    buscarProjecto()
    contarvisto()
    buscarPRocessos()

  }, [])
  const cardList = [
    {
      name: "Andamento",
      bgColor: "info",
      amount: processos?.andamento,
      Icon: Group,
      path: "/clientes/list"

    },
    {
      name: "Pendentes",
      amount: processos?.pendente,
      bgColor: "info",
      path: "/projectos/list",
      Icon: Folder,
    },

    {
      name: "Cancelados",
      amount: processos?.cancelados,
      Icon: Wallet,
      bgColor: "info",
      path: "/processos/list"
    },
    {
      name: "Concluídos",
      amount: processos?.finalizado,
      Icon: Wallet,
      bgColor: "info",
      path: "/processos/list"
    },
    {
      name: "Vistos Activos",
      amount: vistos?.activos,
      Icon: Wallet,
      bgColor: "success",
      path: "/vistos/query?activo=true"
    },
    {
      name: "Vistos Expirados",
      amount: vistos?.expirado,
      Icon: Wallet,
      bgColor: "danger",
      path: "/vistos/query?activo=false"
    },


  ]
  const location = useLocation();
  const [processosMensais, setProcessosMensais] = useState([])
  const [processosDiario, setProcessosDiario] = useState([])


  async function buscarEstatisicas() {
    const processosMensais = await useApi().list("processos/estatistica")
    console.log("PROCESSOS MENSAIS", processosMensais);
    setProcessosMensais(prev => processosMensais?.data)

    const processosDiario = await useApi().list("processos/estatisticadiaria")
    console.log("PROCESSOS Diario", processosDiario);
    setProcessosDiario(prev => processosDiario?.data);
  }

  useEffect(() => {
    buscarEstatisicas()
  }, [])

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const routeSegments = generateBreadcrumbs(location);
  const theme = useTheme();

  const [estados, setEstados] = useState([{ nome: "Pendente", }, { nome: "Recusao" }, { nome: "Concluido" }])

  const [fases, setFases] = useState([{ nome: "Legalização", }, { nome: "Tradução" }, { nome: "SME sede" }])
  const visaTypes = ["Turismo", "Trabalho", "Curta Duração", "Fronteira"];
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
              <Grid item lg={12} md={8} sm={12} xs={12}>
                <StatCards cardList={cardList} />
                <ListarProcessos></ListarProcessos>
                <Box pt={2}></Box>
              </Grid>
            </Grid>
          </CContainer>
        </Grid>


      </ContentBox>

    </Fragment>
  );
}

