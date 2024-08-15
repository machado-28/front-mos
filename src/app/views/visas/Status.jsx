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

import { Projecto } from "../projecto/util";
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
import Visto from "./util";
import FormAdd from "./Formularios/FormAdd";
import addStatusShema from "./Formularios/schemas/addStatusShema";
import FormularioEditStatus from "./Formularios/editar/FormularioEditStatus";

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
        resolver: zodResolver(addStatusShema),
        shouldFocusError: true,
        progressive: true
    });

    const { palette } = useTheme();
    const [page, setPage] = useState(0);
    const [OrigemId, setOrigemId] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState("DESC");
    const [orderBy, setOrderBy] = useState("nome");
    const [date, setDate] = useState();
    const goto = useNavigate();
    const [visibleAdicionar, setVisibleAdicionar] = useState(false);


    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const fSize = "0.775rem";
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const StyledButton = styled(Button)(({ theme }) => ({
        margin: theme.spacing(1)
    }));
    const [statusId, setstatusId] = useState()
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState([]);
    const [visibleEditar, setVisibleEditar] = useState(false);

    function handleStatus({ id }) {
        setstatusId(prev => id)
        console.log("ID SELECT", id);
    }
    console.log("ID SELECT 22", statusId);
    const buscarStatusProcesso = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        const res = await processo.buscarStatus()
        setStatus(prev => res?.status)
        setLoading(prev => false)

    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        buscarStatusProcesso()
    }, [])

    async function AddStatus(data) {
        setLoading(prev => true)
        console.log(data);
        const statusClass = new Processo()
        await statusClass.criarStatus({ data })
        window.location.reload()
        setLoading(prev => false)
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
            <>
                <CModal
                    alignment="center"
                    visible={visibleAdicionar}
                    onClose={() => setVisibleAdicionar(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">ADICIONAR NOVO STATUS DE PROCESSOS </CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(AddStatus)} >
                        <CModalBody>
                            <CRow>
                                <CCol>
                                    <CFormInput text={
                                        errors.nome && <div className="text-light bg-danger">{errors.nome}</div>
                                    }
                                        {...register("nome")} label="Nome">

                                    </CFormInput>
                                </CCol>
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleAdicionar(false)}>
                                Cancelar
                            </CButton>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <CButton type="submit" size="sm" color="success">
                                    Adicionar
                                </CButton>
                            )}
                        </CModalFooter>
                    </CForm>
                </CModal>
            </>
            <>
                <CModal
                    alignment="center"
                    visible={visibleEditar}
                    onClose={() => setVisibleEditar(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">EDITAR STATUS </CModalTitle>
                    </CModalHeader>
                    <FormularioEditStatus statusId={statusId}></FormularioEditStatus>
                </CModal>
            </>
            <Title className="p-3"> CONFIGURAÇÃO DE  STATUS DE PROCESSOS</Title>
            <CAlert color="secondary">
            </CAlert>
            <div className="w-100 d-flex  justify-content-between">
                <Title></Title>
                {/* <div className="d-flex">
                    <Link
                        onClick={() => {
                            setVisibleAdicionar(prev => true)
                        }}
                    >
                        <StyledButton className="d-flex align-content-center" size="sm" variant="contained" color="success">
                            Adicionar <PlusOne className="" style={{ marginLeft: "4px" }}></PlusOne>
                        </StyledButton>

                    </Link>


                </div> */}
            </div>
            <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>

                <Box overflow="auto">
                    <ProductTable>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1} sx={{ px: 2 }}>
                                    id
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Nome
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Data criação
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
                                    {status
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((stat, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell sx={{ px: 2 }} align="left" colSpan={1}>
                                                    <Paragraph  >{stat?.id}</Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                                                    <Paragraph  >
                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>{stat?.nome}</CBadge>
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}  >
                                                    <Paragraph  >
                                                        <CBadge className={(index % 2 !== 0) ? "bg-warning text-black" : "bg-success text-black"}>{formatDateDifference(new Date(stat?.updatedAt))}</CBadge>
                                                    </Paragraph>
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
                                                                        setVisibleEditar((prev) => true);
                                                                        handleStatus({ id: stat?.id })
                                                                    }

                                                                }}

                                                                sx={0}
                                                            >
                                                                <option>selecione</option>
                                                                <option value={1}>editar</option>
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
                        count={status?.length}
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