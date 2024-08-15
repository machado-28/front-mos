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
import AccessLogs from "./util";

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

        const [page, setPage] = useState(0);

        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [loading, setLoading] = useState(false);
        const handleChangePage = (_, newPage) => {
            setPage(newPage);
        };
        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };
        const [logs, setlogs] = useState([]);

        const StyledButton = styled(Button)(({ theme }) => ({
            margin: theme.spacing(1)
        }));

        const logClass = new AccessLogs();
        async function buscarLogs() {
            const res = await logClass.buscar();
            console.log("LOGS", res);
            setlogs(prev => res?.logs)
        }
        useEffect(() => {
            buscarLogs()
        }, [])

        const location = useLocation();
        const routeSegments = generateBreadcrumbs(location);

        return (
            <AppButtonRoot>
                <Box className="breadcrumb">
                    <Breadcrumb
                        routeSegments={routeSegments}
                    />
                </Box>
                <Title>LOGS DE ACESSO DE USUÁRIOS ({logs?.length})</Title>

                <CAlert color="secondary">
                    <hr></hr>
                </CAlert>
                <Card elevation={3} sx={{ pt: "10px", mb: 3 }}>

                    <Box overflow="auto">

                        <ProductTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={0} sx={{ px: 3 }}>
                                        Nº
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Usuario
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Painel
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Method
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        IP Address
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Agent
                                    </TableCell>
                                    <TableCell colSpan={3} sx={{ px: 3 }}>
                                        Data
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody >
                                {loading ? (
                                    <CSpinner></CSpinner>
                                ) : (
                                    <>
                                        {logs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            ?.map((log, index) => (
                                                <TableRow key={index} hover spellCheck>

                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={1}>
                                                        <Box display="flex" alignItems="justify" gap={0}>
                                                            <Paragraph >{index + 1}</Paragraph>

                                                        </Box>

                                                    </TableCell>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        <Box display="flex" alignItems="justify" gap={3}>
                                                            <Paragraph >   {log?.usuario?.nome}</Paragraph>

                                                        </Box>

                                                    </TableCell>
                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>{log?.usuario?.painel?.nome}</CBadge>

                                                    </TableCell>

                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}  >
                                                        <Paragraph  >
                                                            <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>{log?.method} </CBadge>{log?.url?.split("v1")[1]}
                                                        </Paragraph>
                                                    </TableCell>

                                                    <TableCell sx={{ px: 3 }} align="left" colSpan={3}>
                                                        <Paragraph  >
                                                            {log?.ipAddress}
                                                        </Paragraph>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                        <Paragraph  >
                                                            {log?.userAgent}
                                                        </Paragraph>
                                                    </TableCell>
                                                    <TableCell sx={{ px: 0 }} align="left" colSpan={3}>
                                                        <Paragraph  >
                                                            <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>                                                        {formatDateDifference(new Date(log?.createdAt))}
                                                            </CBadge>
                                                        </Paragraph>
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
                            count={logs?.length}
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
        NotifyError("erro inesperdao:" + error)
    }
}
