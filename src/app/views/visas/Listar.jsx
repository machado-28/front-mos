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

    Print,

    Search,

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import Visto from "./util";
import useAuth from "app/hooks/useAuth";
import { Breadcrumb } from "app/components";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import DetalhVisto from "../visto/controlo/DetalheVisto";
import { StatusBadge, VistoBadge } from "../Clientes/function";

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
    try {
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
        const [visibleVisto, setVisibleVisto] = useState(false);

        const [loading, setLoading] = useState(false);
        const [processos, setProcessos] = useState([]);

        const [totalProcessos, setTotalProcessos] = useState(0);
        const [visibleDetalheVisto, setVisibleDetalheVisto] = useState(true);

        const [tipoVistoId, setTipoVistoId] = useState(null);
        const [FaseId, setFaseId] = useState(null);

        const { clienteId, processoId, projectoId } = useParams()
        const [searchTerm, setSearchTerm] = useState("");

        const [vistos, setVistos] = useState([])
        const [vistoId, setVistoId] = useState(null)

        const [statusId, setStatusId] = useState(null);
        const [vistoDetalhe, setVistoDetalhe] = useState(null);

        const [visibleAddVisto, setVisibleAddVisto] = useState(false);
        const handleChangePage = (_, newPage) => {
            setPage(newPage);
        };

        const api = useApi();
        const [tipoVistos, setTipoVistos] = useState([{ nome: "Turismo" }, { nome: "Trabalho" }, { nome: "Fronteira" }, { nome: "Curta Duração" }]);
        const [status, setStatus] = useState([{ nome: "activo" }, { nome: "expirado" }])
        const [fases, setFazes] = useState([{ nome: "Legalização" }, { nome: "MIREX" }, { nome: "SME" }, { nome: "MIREMPET" }, { nome: "Finalizado" }])
        const [filtroStatus, setFiltroStatus] = useState(0);
        function handleFiltroStatus(e) {
            setFiltroStatus((prev) => e);
        }
        const fSize = "0.775rem";
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        const StyledButton = styled(Button)(({ theme }) => ({
            margin: theme.spacing(1)
        }));

        const visto = new Visto();
        async function buscarVistos() {
            const res = await visto.buscar({
                clienteId,
                statusId,
                tipoVistoId,
                order,
                orderBy
            });
            setVistos(prev => [] || res.vistos)
        }
        // let clienteId=1
        function handleTipoVisto(e) {
            let value = e.target.value
            setTipoVistoId(prev => value)
        }
        function handleStatus(e) {
            let value = e.target.value
            setStatusId(prev => value)
        }
        function handleFase(e) {
            let value = e.target.value
            setFaseId(prev => value)
        }
        function handleTodosVistos() {
            console.log("GOOD");
            setFaseId(prev => null);
            setDate(prev => null);
            setTipoVistoId(prev => null);
            setStatusId(prev => null);
        }
        const vistoClass = new Visto();

        async function buscarVisto({ id }) {
            setLoading(prev => true)
            const dados = await vistoClass.buscar({ id });
            setVistoDetalhe(prev => dados[0])
            setLoading(prev => false)
        }

        const gerarMapa = async (data) => {
            setLoading(prev => true)
            await vistoClass.gerarMapa({ data, tipoVistoId })
            setLoading(prev => false)
        }

        async function handFicha() {
            try {
                await gerarFicha()
            } catch (error) {
                NotifyError("Erro inesperdao:", error)
            }
        }

        const [loadingFicha, setLoadingFicha] = useState(false)
        const gerarFicha = async (id) => {
            setLoadingFicha(prev => true)
            await vistoClass.gerarPDFIndidual({ id })
            setLoadingFicha(prev => false)
        }

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };

        useEffect(() => {
            buscarVistos()
        }, [statusId, order, orderBy, tipoVistoId, FaseId])

        const filteredVisto = processos?.filter((process) =>
            process?.processo?.beneficiario?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
            || process?.processo?.passaporteNumero?.toLowerCase().includes(searchTerm?.toLowerCase())
            || new Date(process?.processo?.createdAt)?.toLocaleDateString()?.includes(searchTerm?.toLowerCase())
            || new Date(process?.processo?.createdAt).toLocaleDateString("default", { month: "long" })?.includes(searchTerm?.toLowerCase())
            || ("Dia " + new Date(process?.processo?.createdAt).getDay()).toLowerCase().includes(searchTerm?.toLowerCase())
            || process?.processo?.tipoVisto?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
            || process?.step?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())
        )
        const location = useLocation();
        const routeSegments = generateBreadcrumbs(location);

        return (
            <AppButtonRoot>
                <Box className="breadcrumb">
                    <Breadcrumb
                        routeSegments={routeSegments}
                    />
                </Box>
                <Title>{activo == true ? "VISTOS ACTIVOS" : "VISTOS EXPIRADOS"}</Title>
                <>
                    <CModal
                        alignment="center"
                        visible={visibleVisto}
                        onClose={() => setVisibleVisto(false)}
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
                                <CButton color="secondary" onClick={() => setVisibleVisto(false)}>
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
                        visible={visibleDetalheVisto}
                        onClose={() => setVisibleDetalheVisto(false)}
                        aria-labelledby="OptionalSizesExample2"
                        size="lg"
                    ><CModalHeader>
                            <CModalTitle id="OptionalSizesExample2">Informações do Visto</CModalTitle>

                        </CModalHeader>
                        <div className="d-flex">
                            <Link
                                onClick={handFicha}
                            >
                                <StyledButton disabled={loadingFicha ? true : false} className="d-flex align-content-center" size="sm" variant="contained" color="info">
                                    IMPRIMIR {loadingFicha ? <CSpinner></CSpinner> : <Print className="" style={{ marginLeft: "4px" }}></Print>}
                                </StyledButton>

                            </Link>
                            {/* 
                    <Link onClick={() => {
                        setVisibleAddVisto(prev => true)
                    }}>
                        <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="success">
                            Registar novo<Add></Add>
                        </StyledButton>
                    </Link> */}
                        </div>
                        <CAlert color="secondary">

                        </CAlert>
                        <CModalBody className="p-4">
                            <CRow className="mb-4 ">
                                <CCol md={3}>
                                    <img className="mb-3" src={DetalhVisto?.titular?.avatar?.url} style={{ width: "150px", height: "150px" }}></img>

                                </CCol>
                                <CCol md={3}>
                                    <CFormInput md disabled size="sm" label={"Nº:"} value={vistoDetalhe?.numero} ></CFormInput>
                                    <CFormInput size="sm" label={"Tipo de visto:"} value={vistoDetalhe?.tipoVisto?.nome} ></CFormInput>
                                </CCol>
                                <CCol md={6}>
                                    <CCol>
                                        <CFormInput size="sm" label={"Titutal:"} value={vistoDetalhe?.titular?.nome} ></CFormInput>
                                    </CCol>
                                    <CCol>
                                        <CFormInput size="sm" label={"Nacionalidade:"} value={vistoDetalhe?.processo?.nacionalidade}></CFormInput>
                                    </CCol>

                                </CCol>
                            </CRow>
                            <CRow className="mb-4">
                                <CCol md={4}>
                                    <CFormInput size="sm" label={"Data de Emissão:"} value={new Date(vistoDetalhe?.dataEmissao)} ></CFormInput>
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput size="sm" label={"Data de Validade:"} value={new Date(vistoDetalhe?.dataValidade)} ></CFormInput>
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput size="sm" label={"Tada de Entrega"} value={new Date(vistoDetalhe?.dataEntrega).toLocaleDateString()} ></CFormInput>
                                </CCol>

                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={3}>
                                    <CFormInput size="sm" label={"Duração:"} value={vistoDetalhe?.processo?.tipoVisto?.duracao}  ></CFormInput>
                                </CCol>
                                <CCol md={3}>
                                    <CFormInput size="sm" label={"Dias Restante:"} value={"90 dias"} ></CFormInput>
                                </CCol>
                                <CCol >
                                    <CFormInput className={vistoDetalhe?.ativo ? "bg-success text-white" : "bg-danger text-white"} size="sm" label={"Status:"} value={vistoDetalhe?.ativo ? "activo" : "expirado"} ></CFormInput>

                                </CCol>
                            </CRow>
                            <CRow className="">
                                <CFormTextarea size="sm" label={"Descrição:"} ></CFormTextarea>
                            </CRow>
                        </CModalBody>
                        <CAlert color="secondary">
                            <CModalFooter>

                            </CModalFooter>
                        </CAlert>
                    </CModal>
                </>
                <CAlert color="secondary">
                    <hr></hr>
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
                    <StyledButton size="small" color="info" variant="text" onClick={handleTodosVistos}>Todos</StyledButton>
                    <div className="d-flex">
                        <Link
                            onClick={() => {
                                setVisibleVisto(prev => true)
                            }}
                        >
                            <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="info">
                                Mapa <Print className="" style={{ marginLeft: "4px" }}></Print>
                            </StyledButton>

                        </Link>
                        {/* 
                    <Link onClick={() => {
                        setVisibleAddVisto(prev => true)
                    }}>
                        <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="success">
                            Registar novo<Add></Add>
                        </StyledButton>
                    </Link> */}
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
                                    defaultValue={"DESC"}
                                    onChange={(event) => { setOrderBy(prev => event.target.value) }}
                                    id="validationServer05"  >
                                    <option value={null} selected>
                                        Ordenar
                                    </option>

                                    <option value={"ASC"}>
                                        Ascendente
                                    </option>
                                    <option value={"DESC"}>
                                        Descendente
                                    </option>

                                </CFormSelect>
                                <CFormInput onChange={(event) => setDate(prev => new Date(event.target.value))} size="sm" type="date"></CFormInput>

                            </div>
                        </CForm>

                        <CForm>
                            <div className="d-flex w-100 p-2"  >
                                <CFormSelect onChange={handleTipoVisto} {...register("stepId")} size="sm"
                                    id="validationServer05"  >
                                    <option disabled value={null}>
                                        Visto
                                    </option>
                                    {tipoVistos?.map((item) => (
                                        <option value={item?.id}>
                                            {item?.nome}
                                        </option>
                                    ))}
                                </CFormSelect>
                                <CFormSelect onChange={handleFase}  {...register("stepId")} size="sm"
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
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Visto Nº
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Titular
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Visto
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Temp.Restante
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Dat.Emissão
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Status
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Dat.Expiração
                                    </TableCell>
                                    {/* <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Atraso
                                </TableCell> */}
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
                                        {filteredVisto?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            ?.map((visto, index) => (
                                                <TableRow key={index} hover spellCheck>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                        <Box display="flex" alignItems="center" gap={3}>
                                                            <Paragraph style={{ textAlign: "center", fontSize: "0.74rem" }}  >   {visto?.processo?.numero}</Paragraph>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                        <Box display="flex" alignItems="center" gap={3}>
                                                            <Paragraph >   {visto?.processo?.beneficiario?.nome}</Paragraph>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        <Paragraph >{VistoBadge({ status: visto?.processo?.tipoVistoId })}</Paragraph>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                        <Paragraph  > 90 dias</Paragraph>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}  >
                                                        <Paragraph  >
                                                            <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>{new Date(visto?.updatedAt).toLocaleDateString()}</CBadge>
                                                        </Paragraph>
                                                    </TableCell>

                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        <Paragraph  >
                                                            {StatusBadge({ status: visto?.status?.id })}

                                                        </Paragraph>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                        <Paragraph  >
                                                            {formatDateDifference(new Date(visto?.createdAt))}
                                                        </Paragraph>
                                                    </TableCell>

                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                        <CFormSelect
                                                            style={{ fontSize: "12px", minWidth: "5.45rem" }}
                                                            size="sm"
                                                            id="validationServer04"
                                                            onChange={async (e) => {
                                                                if (e.target.value == 1) {
                                                                    setVisibleDetalheVisto(prev => true);
                                                                    await buscarVisto({ id: visto?.id })
                                                                }
                                                                if (e.target.value == 2) {
                                                                    return goto(
                                                                        `/processos/${visto?.passaporte}/edit`
                                                                    );
                                                                }

                                                                if (e.target.value == 3) {
                                                                    console.log("SOLICI ID", visto?.id);
                                                                    setPedido(prev => visto?.id);
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
                                                            <option value={1}>ver detalhe</option>
                                                            <option value={2}>Editar</option>
                                                            {(user?.painel?.nome === "ADMINISTRADOR" || user?.painel?.nome === "ADMINISTRADOR GERAL" || user?.painel?.nome === "ADMINISTRADOR DE PROJECTO") && <option value={3}>Delegar</option>}
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
    } catch (error) {
        console.log("erro inesperdao:" + error)
    }
}
