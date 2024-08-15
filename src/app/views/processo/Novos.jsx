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
import { H4, Paragraph } from "app/components/Typography";
import { useApi } from "app/hooks/useApi";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";

import { Projecto } from "../projecto/util";
import { CustomBadge, StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import Processo from "./util";
import useAuth from "app/hooks/useAuth";

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
export default function Novos() {
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
        const res = await processo.progresso( )
        setProcessos(prev => res.progresso)
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

    const styleDropdown = {};
    return (
        
            <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>
                <H4>PROCESSOS RECENTES</H4>
                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5} sx={{ px: 2 }}>
                                    Beneficiario
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 3 }}>
                                    Visto
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Status
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Data
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
                                        ?.map((projecto, index) => (
                                            <TableRow key={index} hover>

                                                <TableCell sx={{ px: 3 }} align="left" colSpan={5}>
                                                    {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                    <Box display="flex" alignItems="center" gap={3}>
                                                        <Avatar src={projecto?.processo?.beneficiario?.avatar?.url} />
                                                        <Paragraph style={{ textAlign: "center", fontSize: "0.74rem" }}>   {projecto?.processo?.beneficiario?.nome}</Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                    <Paragraph >{VistoBadge({ status: projecto?.processo?.tipoVistoId })}</Paragraph>
                                                </TableCell>
                                              
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {StatusBadge({ status: projecto?.step?.id })}

                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {formatDateDifference(new Date(projecto?.createdAt))}
                                                    </Paragraph>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "5.45rem" }}
                                                        size="sm"
                                                        id="validationServer04"
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/processos/${projecto?.id}/detail`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {
                                                                console.log("SOLICI ID", projecto?.id);
                                                                setVisibleTarefa(prev => true)
                                                            }

                                                        }}

                                                        sx={0}
                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>visualisar</option>
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
                    
                </Box>
                <Box pt={3}></Box>
            </Card>
        
    );
}
