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
import { format, formatDateDifference, } from "app/utils/validate";
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
import FormularioEdiTipo from "./Formularios/editar/FormularioEditTipo";

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
const vistoShema = z.object({
    nome: z
        .string()
        .min(1, { message: "Este campo é obrigatorio" }),
    duracao: z.coerce
        .number()



});
export default function Listar() {
    try {


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

        const goto = useNavigate();
        const [visibleVisto, setVisibleVisto] = useState(false);

        const [loading, setLoading] = useState(false);
        const [processos, setProcessos] = useState([]);

        const [visibleDetalheVisto, setVisibleDetalheVisto] = useState(false);

        const [tipoVistoId, setTipoVistoId] = useState(null);

        const [searchTerm, setSearchTerm] = useState("");

        const [vistos, setVistos] = useState([])
        const [vistoId, setVistoId] = useState(null)


        const [vistoDetalhe, setVistoDetalhe] = useState({});

        function handleTipoId({ id }) {
            setTipoVistoId(prev => id)
            console.log("ID SELECT", id);
        }
        const defaultValues = () => {
            // lógica para definir os valores padrão dinamicamente
            return {
                nome: vistoDetalhe?.nome,
                duracao: vistoDetalhe?.duracao,
            };
        };
        const {
            register,
            reset,
            watch,
            handleSubmit,
            formState: { errors }
        } = useForm({
            resolver: zodResolver(vistoShema),
            shouldFocusError: true,
            progressive: true,
            defaultValues: defaultValues()
        });
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
        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);

        // Obtendo um parâmetro específico
        const activo = queryParams.get('activo'); // Substitua 'parametro1' pelo nome do seu parâmetro

        const visto = new Visto();
        async function buscarVistos() {
            const res = await visto.buscarTipos();
            console.log("tiPO DE VISTO", res.tipos);
            if (res.tipos?.length <= 0)
                setVistos(prev => []);
            else
                setVistos(prev => res?.tipos);
        }

        async function PostData(data) {
            console.log(data);
            data.id = vistoId
            await visto.actualizarTipo({ data })
            reset()
        }
        async function buscarVisto({ id }) {
            setLoading(prev => true)
            const dados = await visto.buscarTipos({ id });
            console.log("VISTO UM", dados);
            setVistoDetalhe(prev => dados?.tipos[0])
            setLoading(prev => false)
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
        }, [])

        const filteredVisto = vistos?.filter((visto) =>
            visto?.numero?.toLowerCase().includes(searchTerm?.toLowerCase())
            || visto?.processo?.passaporteNumero?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            visto?.titular?.nome?.toLowerCase().includes(searchTerm?.toLowerCase())

        )
        const routeSegments = generateBreadcrumbs(location);
        return (
            <AppButtonRoot>
                <Box className="breadcrumb">
                    <Breadcrumb
                        routeSegments={routeSegments}
                    />
                </Box>
                <Title>TIPOS DE VISTO ({vistos?.length})</Title>
                <>
                    <CModal
                        alignment="center"
                        visible={visibleDetalheVisto}
                        onClose={() => { setVisibleDetalheVisto(false); reset(); }}
                        aria-labelledby="OptionalSizesExample2"
                        size="sm"
                    >
                        <CModalHeader>
                            <CModalTitle id="VerticallyCenteredExample">EDITAR TIPO {tipoVistoId} </CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <FormularioEdiTipo tipoId={tipoVistoId}></FormularioEdiTipo>

                        </CModalBody>
                        <CButton size="sm" color="secondary" onClick={() => setVisibleVisto(prev => false)}>
                            Cancelar
                        </CButton>
                    </CModal>
                </>
                <CAlert color="secondary">
                    <hr></hr>
                </CAlert>
                <Card elevation={3}  >
                    <Box overflow="auto">
                        <ProductTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={1} sx={{ px: 2 }}>
                                        Nº
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 2 }}>
                                        Visto
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 1 }}>
                                        Duração
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
                                        {vistos
                                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((visto, index) => (
                                                <TableRow key={index} hover spellCheck>
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={1}>
                                                        {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                        <Box display="flex" alignItems="center" gap={3}>
                                                            <Paragraph style={{ textAlign: "center", fontSize: "0.74rem" }}  >   {index + 1}</Paragraph>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>
                                                        {/* <StyledAvatar src={tecn?.avatar?.url} /> */}
                                                        <Box display="flex" alignItems="center" gap={3}>
                                                            <Paragraph >   {visto?.nome}</Paragraph>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 2 }} align="left" colSpan={3}>

                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}> <Paragraph  >{visto?.duracao} dias</Paragraph></CBadge>

                                                    </TableCell>

                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                        <CRow>
                                                            <CCol md={3}>
                                                                <CFormSelect
                                                                    style={{ fontSize: "12px", minWidth: "5.45rem" }}
                                                                    size="sm"
                                                                    id="validationServer04"
                                                                    onChange={async (e) => {
                                                                        if (e.target.value == 1) {
                                                                            setVisibleDetalheVisto(prev => true);
                                                                            handleTipoId({ id: visto?.id })
                                                                        }
                                                                    }}
                                                                    sx={0}
                                                                >
                                                                    <option>Informações</option>
                                                                    <option value={1}>personalizar</option>
                                                                </CFormSelect>
                                                            </CCol>
                                                        </CRow>
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
                            count={vistos?.length}
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
