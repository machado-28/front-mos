import {
    CAlert,
    CAvatar,
    CBadge,
    CButton,
    CCallout,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormSelect,
    CFormSwitch,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CSpinner
} from "@coreui/react";
import {
    AirplaneTicket,
    CallToAction,
    Download,
    DownloadOutlined,
    FolderCopySharp,
    Image,
    Person,
    PlusOne,
    Print,
    PunchClock,
    ReceiptLongSharp,
    Search,
    Send,
    Timer,
    TroubleshootOutlined
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    styled,
    useTheme
} from "@mui/material";
import { Paragraph } from "app/components/Typography";
import { useApi } from "app/hooks/useApi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./../style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";;
import { CustomBadge, StatusBadge, VistoBadge } from "../function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import Processo from "../util";
import useAuth from "app/hooks/useAuth";
import { Breadcrumb } from "app/components";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import { Projecto } from "app/views/projecto/util";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
    display: "flex",
    paddingLeft: "24px",
    paddingRight: "24px",
    marginBottom: "12px",
    alignItems: "center",
    justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
    minWidth: 400,
    whiteSpace: "pre",
    "& small": {
        width: 50,
        height: 15,
        borderRadius: 500,
        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
    },
    "& td": { borderBottom: "none" },
    "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
    width: 50,
    height: 15,
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    overflow: "hidden",
    background: bgcolor,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));
const AppButtonRoot = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
    },
    "& .button": { margin: theme.spacing(1) },
    "& .input": { display: "none" }
}));
const loadMapashema = z.object({
    tipoVistoId: z
        .string()
        .min(1, { message: "Este campo é obrigatorio" }),
    projectoId: z
        .string()
        .min(1, { message: "Este campo é obrigatorio" }),

    month: z.coerce
        .string({ message: "Telefone Incorrecto" })
        .min(1, { message: "Este campo é obrigatorio" }),
    year: z.string().default(new Date().getFullYear().toString())


});
export default function Listar() {
    const {
        register,
        reset,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loadMapashema),
        shouldFocusError: true,
        progressive: true
    });
    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;
    const [page, setPage] = useState(0);
    const [OrigemId, setOrigemId] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState("DESC");
    const [orderBy, setOrderBy] = useState("nome");
    const [date, setDate] = useState();
    const goto = useNavigate();
    const [visibleMapa, setVisibleMapa] = useState(false);
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
    const api = useApi();



    const [filtroStatus, setFiltroStatus] = useState(0);

    function handleFiltroStatus(e) {
        setFiltroStatus((prev) => e);
    }
    const fSize = "0.775rem";
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const StyledButton = styled(Button)(({ theme }) => ({
        margin: theme.spacing(1)
    }));

    const { user } = useAuth()
    const { clienteId, projectoId } = useParams()
    const [projectoData, setProjectoData] = useState({})

    console.log("PARAMS NEW", useParams());

    const projecto = new Projecto();
    async function buscarProjectos() {
        const res = await projecto.buscar({});

        setProjectos(prev => res)

    }
    const [searchParams, setSearchParams] = useSearchParams();

    // Obter parâmetros de consulta
    const statusId = searchParams.get('statusId') || 'undefined';
    // Atualizar parâmetros de consulta
    const updateQueryParams = () => {
        setSearchParams({ name: 'John', age: '30' });
    };
    const { passaporte: clientId = 1 } = useParams()
    // let clientId=1
    const [loading, setLoading] = useState(false);
    const [processos, setProcessos] = useState([]);
    const [projectos, setProjectos] = useState([]);
    const [totalProcessos, setTotalProcessos] = useState(0);


    const [visibleAprovar, setVisibleAprovar] = useState(false);
    const gerarMapa = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        await processo.gerarMapa({ data, projectoId: data.projectoId })
        setLoading(prev => false)
    }

    const [visibleTarefa, setVisibleTarefa] = useState(false);
    const delegarTarega = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        await processo.gerarMapa({ data, projectoId: data.projectoId })
        setLoading(prev => false)
    }


    const buscarProcesso = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();

        let [responsavelId, gestorId] = [null, null]
        if (["TECNICO DE PROCESSO"].includes(user?.painel?.nome)) {
            responsavelId = user?.id
        }
        if (["GESTOR DE PROJECTO", "GESTOR DE PROJECTO CLIENTE"].includes(user?.painel?.nome)) {
            gestorId = user?.id
        }
        if (["CLIENTE"].includes(user?.painel?.nome)) {
            clienteId = user?.clientId
        }

        const res = await processo.buscarDelegados({ statusId: 7, responsavelId, clienteId, gestorId, projectoId })
        setProcessos(prev => res.processos)
        setLoading(prev => false)
        console.log("PROGRESSO", res.progresso);

    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        buscarProjectos();
        buscarProcesso()
    }, [statusId])

    console.log("PROGRESSO 2", processos);


    console.log("ERRO FORM", errors);


    const filteredProcessos = processos?.filter((process) =>
        process?.processo?.beneficiario?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
        || process?.processo?.passaporteNumero?.toLowerCase().includes(searchTerm?.toLowerCase())
        || new Date(process?.processo?.createdAt)?.toLocaleDateString()?.includes(searchTerm?.toLowerCase())
        || new Date(process?.processo?.createdAt).toLocaleDateString("default", { month: "long" })?.includes(searchTerm?.toLowerCase())
        || ("Dia " + new Date(process?.processo?.createdAt).getDay()).toLowerCase().includes(searchTerm?.toLowerCase())
    );
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);
    const styleDropdown = {};
    return (
        <AppButtonRoot>
            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={routeSegments}
                />
            </Box>
            <>
                <CModal
                    alignment="center"
                    visible={visibleMapa}
                    onClose={() => setVisibleMapa(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Emissão de Mapa</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(gerarMapa)} >
                        <CModalBody>

                            <CRow className="mb-4">

                                <CCol>
                                    <CFormSelect {...register("tipoVistoId")} defaultValue={1} size="sm"
                                        id="validationServer05" label="Tipo: ">
                                        <option value={1}>
                                            Turismo
                                        </option>
                                        <option value={2}>
                                            Trabalho
                                        </option>
                                        <option value={3}>
                                            Curta Duração
                                        </option>
                                        <option value={4}>
                                            Fronteira
                                        </option>
                                    </CFormSelect>
                                </CCol>

                                <CCol>
                                    <CFormSelect {...register("projectoId")} defaultValue={1} size="sm"
                                        id="validationServer05" label="Projecto">
                                        {
                                            projectos?.map((item) => (
                                                <option value={item?.id}>
                                                    {item?.nome}
                                                </option>

                                            ))
                                        }
                                    </CFormSelect>
                                </CCol>

                            </CRow>

                            <CRow>
                                <CCol>
                                    <CFormSelect defaultValue={new Date().getFullYear().toString()} {...register("year")} size="sm" id="validationServer06" label="Ano">
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                        <option value="2028">2028</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol>
                                    <CFormSelect {...register("month")} size="sm" defaultValue={new Date().getMonth() + 1} id="validationServer07" label="Mês">
                                        <option value="1">Janeiro</option>
                                        <option value="2">Fevereiro</option>
                                        <option value="3">Março</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Maio</option>
                                        <option value="6">Junho</option>
                                        <option value="7">Julho</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Setembro</option>
                                        <option value="10">Outubro</option>
                                        <option value="11">Novembro</option>
                                        <option value="12">Dezembro</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>




                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleMapa(false)}>
                                Cancelar
                            </CButton>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" color="primary">
                                    Gerar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>

                <CModal
                    alignment="center"
                    visible={visibleTarefa}
                    onClose={() => setVisibleTarefa(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Delegacao de tarefa</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(delegarTarega)} >
                        <CModalBody>

                            <CRow className="mb-4">
                                <CCol>
                                    <CFormSelect {...register("usuarioId")} defaultValue={1} size="sm"
                                        id="validationServer05" label="Usuarios">
                                        {
                                            projectos?.map((item) => (
                                                <option value={item?.id}>
                                                    {item?.nome}
                                                </option>

                                            ))
                                        }
                                    </CFormSelect>
                                </CCol>
                                <CCol md={6}>
                                    <Timer></Timer>
                                    <CFormInput {...register("dias")} defaultValue={7} min={7} max={360} label="Prazo de termino (Dias)" type="number">

                                    </CFormInput>
                                </CCol>
                            </CRow>

                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleMapa(false)}>
                                Cancelar
                            </CButton>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" color="primary">
                                    Delegar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>
            </>
            <>

                <CModal
                    alignment="center"
                    visible={visibleAprovar}
                    onClose={() => setVisibleAprovar(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Aprovação de Solicitação</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit>
                        <CModalBody>
                            <CFormTextarea {...register("descricao")}
                                text={
                                    <>{errors?.descricao && <p className="text-error">{errors?.descricao?.message}</p>}</>
                                }
                            ></CFormTextarea>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleAprovar(false)}>
                                Cancelar
                            </CButton>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" color="primary">
                                    Enviar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>
            </>
            <CAlert color="secondary
            ">
                acompanho todo fluxo dos processos
            </CAlert>

            <div className="w-100 d-flex  justify-content-between">
                <strong>Processos Cancelados ({processos?.length})   <Person></Person> </strong>
                <div className="d-flex">
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >
                        {/* <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="success">
                            Mapa <Print></Print>
                        </StyledButton> */}

                    </Link>

                    {/* <Link to={`/clientes/${clientId}/projdddcto/${projectoId}/processos/add`}>
                        <StyledButton className="d-flex align-content-center" size="sm" variant="outlined" color="success">
                            Criar Novo <Add></Add>
                        </StyledButton>
                    </Link> */}
                </div>

            </div>

            <Box pt={4}>{/* <Campaigns /> */}</Box>

            <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
                <CContainer className="d-flex justify-content-between">
                    <CForm>
                        <div className="d-flex w-100   "  >

                            <CFormSelect {...register("stepId")} size="sm"
                                id="validationServer05"  >
                                <option disabled value={null}>
                                    Faze
                                </option>
                                <option value={1}>
                                    Legalizção
                                </option>
                                <option value={2}>
                                    MIREX
                                </option>
                                <option value={3}>
                                    MIREMPET
                                </option>
                                <option value={4}>
                                    SME
                                </option>
                            </CFormSelect>
                            <CFormSelect {...register("statusId")} size="sm"
                                id="validationServer05"  >
                                <option disabled>
                                    Status
                                </option>

                                <option value={1}>
                                    Pendente
                                </option>
                                <option value={2}>
                                    Em Andamento
                                </option>
                                <option value={3}>
                                    Aprovado
                                </option>
                                <option value={4}>
                                    Recusado
                                </option>
                                <option value={5}>
                                    Cancelado
                                </option>
                                <option value={6}>
                                    Finalizado
                                </option>

                            </CFormSelect>
                            <LoadingButton>Buscar</LoadingButton>
                        </div>

                    </CForm>
                </CContainer>

                <CContainer>
                    <CInputGroup size="sm">
                        <CInputGroupText size="sm">
                            <Search size="sm"></Search>
                        </CInputGroupText>
                        <CFormInput
                            type="text"
                            size="sm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="titular, passaporte,visto, data, faze, status"
                        />
                    </CInputGroup>

                    <div className="d-flex w-100   "  >

                        <CFormSelect size="sm"
                            onChange={(event) => { setOrderBy(prev => event.target.value) }}
                            id="validationServer05"  >
                            <option value={"nome"} selected>
                                Ordenar por
                            </option>

                            <option value={"createdAt"}>
                                Data de Criação
                            </option>
                            <option value={"nome"}>
                                nome
                            </option>
                            <option value={"clienteId"}>
                                cliente
                            </option>


                        </CFormSelect>
                        <CFormSelect onChange={(event) => { setOrder(prev => event.target.value) }}
                            size="sm"
                            id="validationServer05"  >
                            <option value={"DESC"} selected>
                                ordenar
                            </option>

                            <option value={"ASC"}>
                                Ascendente
                            </option>
                            <option value={2}>
                                Decrescente
                            </option>

                        </CFormSelect>
                        <CFormInput onChange={(event) => setDate(prev => new Date(event.target.value))} size="sm" type="date"></CFormInput>
                    </div>

                </CContainer>


                <Box overflow="auto">

                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} sx={{ px: 2 }}>
                                    Titular
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 3 }}>
                                    Visto
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 3 }}>
                                    Status
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Responsável
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Prazo
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Dat. delegado
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Dat. conclusao
                                </TableCell>

                                <TableCell colSpan={2} sx={{ px: 2 }}>
                                    Acção
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody style={{ overflow: "scroll" }}>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <>
                                    {filteredProcessos
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((process, index) => (
                                            <TableRow key={index} hover>

                                                <TableCell sx={{ px: 3 }} align="left" colSpan={4}>
                                                    {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                    <Box display="flex" alignItems="center" gap={3}>
                                                        {/* <Avatar src={process?.processo?.beneficiario?.avatar?.url} /> */}
                                                        <Paragraph >   {process?.processo?.beneficiario?.nome}</Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                    <Paragraph >{VistoBadge({ status: process?.processo?.tipoVistoId })}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                    <Paragraph >{StatusBadge({ status: process?.statusId })}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                    <Paragraph  >{process?.responsavel?.nome}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}  >
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                        <Paragraph  >{process?.prazo} dias</Paragraph>
                                                    </TableCell>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}  >
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                        <Paragraph  >{formatDateDifference(new Date(process?.createdAt))} </Paragraph>
                                                    </TableCell>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}  >
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                        <Paragraph  >{formatDateDifference(new Date(process?.dataConclusao))}</Paragraph>
                                                    </TableCell>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "5.45rem" }}
                                                        size="sm"
                                                        id="validationServer04"
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/processos/${process?.id}/detail`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {
                                                                console.log("SOLICI ID", process?.id);
                                                                setVisibleTarefa(prev => true)
                                                            }

                                                        }}
                                                        sx={0}
                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>ver processo</option>

                                                    </CFormSelect>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                </>
                            )}
                        </TableBody>
                    </ProductTable>
                    <TablePagination
                        sx={{ px: 2 }}
                        page={page}
                        component="div"
                        rowsPerPage={rowsPerPage}
                        count={processos?.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>
                <Box pt={3}></Box>
            </Card>
        </AppButtonRoot >
    );
}
