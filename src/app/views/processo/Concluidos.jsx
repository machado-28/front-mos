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
    PostAdd,
    Print,
    PunchClock,
    ReceiptLongSharp,
    Search,
    Send,
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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";

import { Projecto } from "./../projecto/util";
import { CustomBadge, StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import Processo from "./util";
import useAuth from "app/hooks/useAuth";
import { Breadcrumb } from "app/components";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import Visto from "../visas/util";
import FormAdd from "../visas/Formularios/FormAdd";
import AddvistoShema from "../visas/Formularios/schemas/AddvistoShema";

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
        resolver: zodResolver(AddvistoShema),
        shouldFocusError: true,
        progressive: true
    });

    const { user } = useAuth()
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
    const api = useApi();
    const [vistos, setVistos] = useState([{ nome: "Turismo" }, { nome: "Trabalho" }]);
    const [status, setStatus] = useState([{ nome: "pendente" }])
    const [fases, setFazes] = useState([{ nome: "Legalização" }])
    const [filtroStatus, setFiltroStatus] = useState(0);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
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

    const { clienteId, projectoId } = useParams()
    const [processoId, setProcessoId] = useState()
    const [processoInfo, setProcessoInfo] = useState()
    const [projectoData, setProjectoData] = useState({})

    const projecto = new Projecto();
    async function buscarProjecto() {
        const res = await projecto.buscar({ id: projectoId, order, orderBy });
        setProjectoData(prev => res[0])
    }

    const [loading, setLoading] = useState(false);
    const [processos, setProcessos] = useState([]);
    const [totalProcessos, setTotalProcessos] = useState(0);
    const [visibleRegistarVisto, setVisibleRegistarVisto] = useState(false);

    function handleProcesso({ processo }) {
        setProcessoId(prev => processo?.processo.id)
        setProcessoInfo(prev => processo)

    }
    console.log("PROCESSO ID", processoId, processoInfo);
    const gerarMapa = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        await processo.gerarMapa({ data, projectoId })
        setLoading(prev => false)
    }
    const buscarProcesso = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        const res = await processo.progresso({ projectoId, stepId: 6, statusId: 4 })
        setProcessos(prev => res.progresso)
        setLoading(prev => false)
        console.log("PROGRESSO", res.progresso);
    }
    const registarVisto = async ({ data }) => {
        setLoading(prev => true)
        const vistoClass = new Visto();
        const res = await vistoClass.criar({ data })

        setLoading(prev => false)
        console.log("PROGRESSO", res.progresso);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        buscarProjecto();
        buscarProcesso()
    }, [])

    console.log("PROGRESSO 2", processos);
    console.log("ERRO FORM", errors);
    const filteredProcessos = processos?.filter((process) =>
        process?.processo?.beneficiario?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
        || process?.processo?.passaporteNumero?.toLowerCase().includes(searchTerm?.toLowerCase())
        || new Date(process?.processo?.createdAt)?.toLocaleDateString()?.includes(searchTerm?.toLowerCase())
        || new Date(process?.processo?.createdAt).toLocaleDateString("default", { month: "long" })?.includes(searchTerm?.toLowerCase())
        || ("Dia " + new Date(process?.processo?.createdAt).getDay()).toLowerCase().includes(searchTerm?.toLowerCase())
        || process?.processo?.tipoVisto?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
        || process?.step?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
    )

    async function AddVisto(data) {
        console.log(data);

        data.processoId = processoId
        const vistoClass = new Visto()
        await vistoClass.criar({ data })
    }
    function FormVistoAdd() {


        return (
            <CForm onSubmit={handleSubmit(AddVisto)}>
                <CModalBody>
                    <CAlert color="secondary">

                    </CAlert>
                    <CRow className="mb-4">
                        <CCol>
                            <CFormInput {...register("numero")} size="sm" placeholder="ex.984P3A" label="Nº do Visto" >
                            </CFormInput>
                        </CCol>

                    </CRow >
                    <CRow className="mb-4">
                        <CCol>
                            <CFormInput {...register("dataEmissao")} type="date" size="sm" label="Data de Emissão" >
                            </CFormInput>
                        </CCol>
                        <CCol>
                            <CFormInput  {...register("dataEntrega")} type="date" size="sm" label="Data de Entrega" >
                            </CFormInput>
                        </CCol>
                    </CRow>
                    <CRow className="mb-4">
                        <CCol>
                            <CFormInput label={"Anexo(pdf/jpeg)"} type="file" size="sm"></CFormInput>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol>
                            <CFormTextarea {...register("descricao")} size="sm" label="Descrição" placeholder="Escreva aqui.." >

                            </CFormTextarea>
                        </CCol>
                    </CRow>
                </CModalBody>


                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleRegistarVisto(false)}>
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

        )
    }
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);
    return (
        <AppButtonRoot>
            <Box className="breadcrumb">

                <Breadcrumb
                    routeSegments={routeSegments}
                />
            </Box>
            <CAlert color="info"> <strong>Nota:</strong><i>Processos com todos estágios finalizados finalizados, Com vistos prontos</i></CAlert>
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
            </>
            <>

                <CModal
                    alignment="center"
                    visible={visibleRegistarVisto}
                    onClose={() => setVisibleRegistarVisto(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>

                        <CModalTitle id="VerticallyCenteredExample">REGISTO DE VISTO EMITIDO </CModalTitle>

                    </CModalHeader>
                    <Link className="p-4 text-info" to={`/processos/${processoId}/detail`}><strong> PROCESSO Nº </strong>{processoInfo?.processo?.numero}</Link>
                    <FormVistoAdd></FormVistoAdd>
                </CModal>
            </>
            <CAlert color="secondary">

                <CInputGroup className="mt-2" size="sm">
                    <CInputGroupText size="sm">
                        <Search color="info" size="sm"></Search>
                    </CInputGroupText>
                    <CFormInput
                        type="text"
                        size="sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="beneficiario, passaporte, codigo, visto, data, faze, status"
                    />
                </CInputGroup>
            </CAlert>

            <div className="w-100 d-flex  justify-content-between">
                <StyledButton size="small" color="info" variant="text">Todos</StyledButton>
                <div className="d-flex">
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >
                        <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="info">
                            IMPRIMIR <Print className="" style={{ marginLeft: "4px" }}></Print>
                        </StyledButton>

                    </Link>


                </div>
            </div>
            <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
                <CContainer className="d-flex justify-content-between">
                    <CForm>
                        <div className="d-flex w-100" >
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
                            <CFormInput onChange={(event) => setDate(prev => new Date(event.target.value))} size="sm" type="date"></CFormInput>

                        </div>
                    </CForm>

                    <CForm>
                        <div className="d-flex w-100 p-2"  >
                            <CFormSelect {...register("stepId")} size="sm"
                                id="validationServer05"  >
                                <option disabled value={null}>
                                    Visto
                                </option>
                                {vistos?.map((item) => (
                                    <option value={item?.id}>
                                        {item?.nome}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CFormSelect  {...register("stepId")} size="sm"
                                id="validationServer05"  >
                                <option disabled value={null}>
                                    Faze
                                </option>
                                {fases?.map((item) => (
                                    <option value={item?.id}>
                                        {item?.nome}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CFormSelect {...register("statusId")} size="sm"
                                id="validationServer05"  >
                                <option disabled>
                                    Status
                                </option>
                                {status?.map((item) => (
                                    <option value={item?.id}>{item?.nome}</option>
                                ))}
                            </CFormSelect>

                        </div>
                    </CForm>
                </CContainer>
                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Beneficiario
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Visto
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Passaporte
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Finalizado Por
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Dat.Conclusão
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
                                        ?.map((processo, index) => (
                                            <TableRow key={index} hover>

                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                    {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                    <Box display="flex" alignItems="center" gap={3}>
                                                        <Avatar src={processo?.processo?.beneficiario?.avatar?.url} />
                                                        <Paragraph style={{ textAlign: "center", fontSize: "0.74rem" }}>   {processo?.processo?.beneficiario?.nome}</Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                                                    <Paragraph >{VistoBadge({ status: processo?.processo?.tipoVistoId })}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                    <Paragraph  >{processo?.processo?.passaporteNumero}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                    <Paragraph  >{processo?.responsavel?.nome}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}  >
                                                    <Paragraph  >
                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>{new Date(processo?.updatedAt).toLocaleDateString()}</CBadge>
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "5.45rem" }}
                                                        size="sm"
                                                        id="validationServer04"
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                setVisibleRegistarVisto((prev) => true);
                                                                handleProcesso({ processo })
                                                            }
                                                            if (e.target.value == 2) {
                                                                return goto(
                                                                    `/processos/${processo?.passaporte}/edit`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {

                                                                setPedido(prev => processo?.id);
                                                                setUpdateStatusId(prev => 3);

                                                            }
                                                            if (e.target.value == 4) {
                                                                setOpenRecusar((prev) => !true);
                                                            }

                                                            console.log(e.target.value);
                                                        }}

                                                        sx={0}
                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>Registar Visto</option>
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
