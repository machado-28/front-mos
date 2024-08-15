import { Edit, FileDownloadDone, FilePresent, Folder, PeopleAlt, Print, SendAndArchive, Title } from "@mui/icons-material";
import { Avatar, Box, Button, Card } from "@mui/material";
import { H1, H2 } from "app/components/Typography";
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
import Processo from "../processo/util";
import { Usuario } from "../usuario/util";
import { Projecto } from "../projecto/util";
import Visto from "../visas/util";

// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody } = require("@coreui/react");

export default function Detalhar() {
    const api = useApi()
    const clienteClass = new Cliente()
    const [render, setRender] = useState(0);
    const [cliente, setCliente] = useState('');
    const [processos, setProcessos] = useState({
        cancelados: 0,
        submetidos: 0,
        recusados: 0,
        andamento: 0,
        pendente: 0,
        finalizado: 0
    });
    const [vistos, setVistos] = useState({
        activos: 0,
        expirados: 0
    })

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
        try {
            // Fetch client data
            const { data } = await api.list(`clientes/${clienteId}`);
            console.log("CLIENTE", data);

            setCliente(data?.cliente);

            // Fetch counts of different process statuses
            const processosSubmetidos = await new Processo().contar({ clienteId });
            const processosPendentes = await new Processo().contar({ clienteId, statusId: 1 });
            const processosCancelados = await new Processo().contar({ clienteId, statusId: 6 });
            const processosFinalizados = await new Processo().contar({ clienteId, statusId: 4 });
            const processosAndamento = await new Processo().contar({ clienteId, statusId: 2 });
            const processosRecusado = await new Processo().contar({ clienteId, statusId: 5 });

            const vistosActivos = await new Visto().contar({ clienteId, activo: true });
            const vistosExpirados = await new Visto().contar({ clienteId, activo: false });

            // Update state
            setProcessos(prev => ({
                ...prev, // Keep previous state
                cancelados: processosCancelados,
                submetidos: processosSubmetidos,
                recusados: processosRecusado,
                andamento: processosAndamento,
                pendente: processosPendentes,
                finalizado: processosFinalizados
            }));

            setVistos(
                prev => ({
                    ...prev,
                    activos: vistosActivos,
                    expirados: vistosExpirados
                })
            )
        } catch (error) {
            console.error('Erro ao buscar cliente e processos:', error);
            // Handle error as needed
        }
    }

    const projecto = new Projecto()
    const [totalProjecto, setTotalProjecto] = useState()
    async function contarProjecto() {
        const res = await projecto.contar();
        setTotalProjecto(prev => res)
    }

    const usuario = new Usuario()
    const [totalgestores, setTotalgestores] = useState();
    async function contarUsuario() {
        const res = await usuario?.contar({ clienteId, painelId: 5 });

        setTotalgestores(prev => res)
    }


    useEffect(() => {
        buscarCliente()
        contarProjecto()
        contarUsuario()
    }, [render])
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);
    return (
        <>

            <div className="p-4 w-100">
                <Box className="breadcrumb">
                    <Breadcrumb
                        routeSegments={routeSegments}
                    />
                </Box>
                <span className="mb-4">
                    {cliente?.nome}/{cliente?.nomeEmpresa}
                </span>
                <CNav className="mt-4" variant="tabs">
                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 0 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 0 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="trabalho"
                            href="#"
                            onClick={() => setRender((prev) => 0)}
                            active={render === 0 ? true : false}
                        >
                            RESUMO
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>

                        <CNavLink
                            style={{
                                backgroundColor: render === 1 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 1 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="trabalho"
                            href="#"
                            onClick={() => setRender((prev) => 1)}
                            active={render === 1 ? true : false}
                        >
                            DADOS DE IDENTIFICAÇÃO
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 8 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 8 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 8)}
                            active={render === 8 ? true : false}
                        >
                            GESTORES
                        </CNavLink>
                    </CNavItem>

                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 7 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 7 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 7)}
                            active={render === 7 ? true : false}
                        >
                            BENEFICIÁRIOS
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 6 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 6 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 6)}
                            active={render === 6 ? true : false}
                        >
                            PROJECTOS
                        </CNavLink>
                    </CNavItem>

                </CNav>

                <CCol className="d-flex align-items-center" style={{ background: "#eee", height: 50 }}>


                </CCol>
                <CTabContent className="rounded-bottom">
                    <CTabPane data="trabalho" className="preview" visible={render === 0 ? true : false}>
                        <Resumo data={[
                            {
                                name: "Gestores",
                                amount: totalgestores || 0,
                                Icon: PeopleAlt,
                                bgColor: "secondary"
                            },
                            {
                                name: "Projectos",
                                amount: cliente?.projectos?.length || 0,
                                Icon: Folder,
                                path: "vistos/list",
                                bgColor: "primary"
                            },

                            {
                                name: "Processos Submetidos",
                                amount: processos.submetidos || 0,
                                color: "black",
                                Icon: SendAndArchive,
                                bgColor: "info"
                            },
                            {
                                name: "Processos Pendentes",
                                amount: processos.pendente || 0,
                                color: "black",
                                Icon: SendAndArchive,
                                bgColor: "secondary"
                            },
                            {
                                name: "Processos Em Andamento",
                                amount: processos.andamento || 0,
                                color: "black",
                                Icon: SendAndArchive,
                                bgColor: "warning"
                            },
                            {
                                name: "Processos Finalizados",
                                amount: processos.finalizado || 0,
                                Icon: FilePresent,
                                bgColor: "success"
                            },
                            {
                                name: "Processos Cancelados",
                                amount: processos.cancelados || 0,
                                Icon: PeopleAlt,
                                bgColor: "danger"
                            },
                            {
                                name: "Processos recusadoss",
                                amount: processos.recusados || 0,
                                Icon: PeopleAlt,
                                bgColor: "danger"
                            },
                            {
                                name: "Vistos activos",
                                amount: vistos.activos || 0,
                                Icon: PeopleAlt,
                                bgColor: "success"
                            },
                            {
                                name: "Vistos Expirados",
                                amount: vistos.inactivos || 0,
                                Icon: PeopleAlt,
                                bgColor: "danger"
                            },

                        ]} ></Resumo>
                    </CTabPane>
                    <CTabPane data="turismo" className="preview" visible={render === 1 ? true : false}>
                        <Box pt={4}></Box>
                        <FormularioVisualizarDadosPessoais cliente={cliente}></FormularioVisualizarDadosPessoais>

                    </CTabPane>

                    <CTabPane className="preview border-1" visible={render === 6 ? true : false}>
                        <Box pt={2}></Box>
                        <Tabela></Tabela>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 7 ? true : false}>
                        <Box pt={2}></Box>
                        <Tecnicos></Tecnicos>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 8 ? true : false}>
                        <Box pt={2}></Box>
                        <Gestores></Gestores>
                    </CTabPane>
                </CTabContent>
            </div>
        </>
    )
}