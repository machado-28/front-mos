import { Edit, FileDownloadDone, FilePresent, Folder, Group, PeopleAlt, Print, SendAndArchive, Title } from "@mui/icons-material";
import { Avatar, Box, Button, Card } from "@mui/material";
import { H1, H2, H4 } from "app/components/Typography";
import { Link, useLocation, useParams } from "react-router-dom";
import FormularioVisualizarDadosMigratorio from "./Formularios/visualisar/FormularioVisualizarDadosMigratorio";
import FormularioVisualizarContacto from "./Formularios/visualisar/FormularioVisualizarContactos";
import FormularioVisualizarDadosProFissionais from "./Formularios/visualisar/FormularioVisualizarDadosProFissionais";
import ListarDocumentos from "../documento/ListarDocumentos";
import FormularioVisualizarEndereco from "./Formularios/visualisar/FormularioVisualizarEndereco";
import FormularioVisualizarIdentificacao from "./Formularios/visualisar/FormularioVisualizarIndentificacao";
import FormularioVisualizarDadosPessoais from "./Formularios/visualisar/FormularioVisualizarDadosPessoais";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Breadcrumb, SimpleCard } from "app/components";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Tabela from "../projecto/Listar";
import Tecnicos from "../tecnico/Listar";
import Gestores from "./Gestores/Listar";
import { LoadingButton } from "@mui/lab";
import Resumo from "./Resumo";
import { Cliente } from "./util";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import useAuth from "app/hooks/useAuth";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import StatCards from "../dashboard/shared/StatCards";
import { Usuario } from "../usuario/util";
import Processo from "../processo/util";
import { Projecto } from "../projecto/util";

// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CCallout, CAlert } = require("@coreui/react");

export default function DashCliente() {
    const api = useApi()
    const clienteClass = new Cliente()
    const [render, setRender] = useState(0);
    const [cliente, setCliente] = useState('');
    const [loading, setLoading] = useState(false);
    const [visibleMapa, setVisibleMapa] = useState(false);
    let { clienteId } = useParams()

    const addAprovarShema = z.object({
        descricao: z.string()
    });
    const {
        register,
        reset,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(addAprovarShema),
        shouldFocusError: true,
        progressive: true
    });

    const { user } = useAuth();
    if (user?.painel?.nome === "CLIENTE") {
        clienteId = user?.clienteId

    }
    async function actualizarStatus(data) {
        setLoading(prev => !prev)
        data.statusId = statusToUpdateId;
        data.pedidoId = pedidoId
        console.log("DATAFORM", data);
        const c_pedido = new Solicitacao();
        await c_pedido.actualizarStatus(data);
        setLoading(prev => !prev)
        window.location.reload()
    }

    async function buscarCliente() {
        console.log("ID C", clienteId);
        const { data } = await api.list(`clientes/${clienteId}`);
        console.log("CLIENTESSSSSSSSSSSS", data?.cliente);
        setCliente(data?.cliente)
    }

    const projecto = new Projecto()
    const [totalProjecto, setTotalProjecto] = useState()
    async function contarProjecto() {
        const res = await projecto.contar();
        setTotalProjecto(prev => res)
    }

    const processo = new Processo();
    const [totalProcesso, setTotalProcesso] = useState(0)
    const [totalprocessosPendentes, setTotalProcessoPendente] = useState(0)
    const [totalprocessosEmAndamento, setTotalProcessosEmAndamento] = useState(0)
    const [totalprocessosFinalizados, setTotalProcessosFinalizados] = useState(0)

    async function contarProcesso() {
        const res = await processo.contar({ clienteId });
        setTotalProcesso(prev => res)

        const pendente = await processo.contar({ clienteId, statusId: 1 });
        setTotalProcessoPendente(p => pendente)

        const andamento = await processo.contar({ clienteId, statusId: 2 });
        setTotalProcessosEmAndamento(p => andamento)


        const finalizado = await processo.contar({ clienteId, statusId: 4 });
        setTotalProcessosFinalizados(p => finalizado)
    }

    const usuario = new Usuario()
    const [totalgestores, setTotalgestores] = useState();
    async function contarUsuario() {
        const res = await usuario?.contar({ clienteId, painelId: 5 });

        setTotalgestores(prev => res)
    }
    useEffect(() => {
        contarProjecto();
        contarUsuario();
        contarProcesso();


    }, [])
    useEffect(() => {
        buscarCliente()
    }, [render])
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);
    return (
        <AppButtonRoot>

            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={routeSegments}
                />
            </Box>

            <CRow>
                <CCol md={4}>
                    <CCallout>
                        <div>
                            <H4>Projectos </H4>
                            <H1>  <Folder  ></Folder>{totalProjecto}</H1>
                        </div>

                    </CCallout>
                </CCol>
                <CCol md={4}>
                    <CCallout color="info">
                        <H4>Processos</H4>
                        <H1>{totalProcesso}<FilePresent></FilePresent></H1>
                    </CCallout>
                </CCol>
                <CCol md={4}>
                    <CCallout color="warning">
                        <H4>Gestores</H4>
                        <H1>{totalgestores} <Group></Group></H1>
                    </CCallout>
                </CCol>
            </CRow>


            <Box pt={4}></Box>
            <CAlert color="secondary">
                <H1>Andamento Dos Processos</H1>
            </CAlert>
            <hr></hr>
            <StatCards cardList={[

                {
                    name: "Processos Submetidos",
                    amount: totalProcesso || 0,
                    color: "black",
                    Icon: Folder,
                    path: "/cliente/processos/list",
                    bgColor: "info"
                },
                {
                    name: "Em Andamento",
                    amount: totalprocessosEmAndamento || 0,
                    Icon: PeopleAlt,
                    color: "black",
                    bgColor: "warning"
                },
                {
                    name: "Pendente",
                    amount: totalprocessosPendentes || 0,

                    Icon: PeopleAlt,
                    color: "black",
                    bgColor: "warning"
                },
                {
                    name: "Processos Finalizados",
                    amount: totalprocessosFinalizados || 0,

                    Icon: FilePresent,
                    bgColor: "success",
                    path: "/cliente/processos/finalizadps"
                },


            ]} ></StatCards>
        </AppButtonRoot>
    )
}