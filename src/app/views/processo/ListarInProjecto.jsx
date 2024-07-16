import {
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
    PunchClock,
    ReceiptLongSharp,
    Search,
    Send,
    TroubleshootOutlined
} from "@mui/icons-material";
import {
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
import { Link, useNavigate, useParams } from "react-router-dom";
import "./style.css";
// import { ChartLine } from "./ChartLine";
import { NotifyError } from "app/utils/toastyNotification";
import { formatDateDifference } from "app/utils/validate";

import { Projecto } from "./../projecto/util";
import { StatusBadge, VistoBadge } from "./function";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Add from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

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
export default function Listar() {
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

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
    const api = useApi();

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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

    const addAprovarShema = z.object({
        descricao: z.string()
    });

    const { clienteId, projectoId } = useParams()
    const [projectoData, setProjectoData] = useState({})

    console.log("PARAMS NEW", useParams());

    const projecto = new Projecto();
    async function buscarProjecto() {
        const res = await projecto.buscar({ id: projectoId, order, orderBy });

        setProjectoData(prev => res[0])

    }

    useEffect(() => {
        buscarProjecto()
    }, [])
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

    const { passaporte: clientId = 1 } = useParams()
    // let clientId=1
    const [loading, setLoading] = useState(false);
    const [processos, setProcessos] = useState([]);
    const [totalProcessos, setTotalProcessos] = useState(0);
    const [visibleMapa, setVisibleMapa] = useState(false);

    const [visibleAprovar, setVisibleAprovar] = useState(false);

    console.log("ERRO FORM", errors);


    const filteredProcessos = processos?.filter((process) =>
        process?.beneficiario?.nome.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    const styleDropdown = {};
    return (
        <AppButtonRoot>
            <>
                <CModal
                    alignment="center"
                    visible={visibleMapa}
                    onClose={() => setVisibleMapa(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Emissão de Mapa de Solicitações</CModalTitle>
                    </CModalHeader>
                    <CForm  >
                        <CModalBody>
                            <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
                                <CFormSelect   style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
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
                                <CFormSelect style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                                    id="validationServer06" label="Projecto:">
                                    <option>
                                        CLOV3
                                    </option>
                                    <option>
                                        SLGC
                                    </option>
                                    <option>
                                        AGOGO
                                    </option>
                                </CFormSelect>
                                <CFormSelect style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }}
                                    id="validationServer06" label="Status:">
                                    <option>
                                        Aprovados
                                    </option>
                                    <option>
                                        Cancelados
                                    </option>
                                    <option>
                                        Recusados
                                    </option>
                                    <option>
                                        Finalizado
                                    </option>
                                </CFormSelect>
                            </div>
                            <div className="d-flex justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">
                                <CFormInput style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }} label={"Desde"} type="date"></CFormInput>
                                <CFormInput style={{ scale: "0.67", fontSize: "0.74rem", minWidth: "2.45rem" }} label={"Até"} type="date"></CFormInput>
                            </div>


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
            <CCallout color="info">
                Cliente:<strong>{projectoData?.cliente?.nome}</strong> <br></br>
                Gestor 1: <strong>{projectoData?.gestorInterno?.nome}</strong><br></br>
                Gestor 2:<strong>{projectoData?.gestorExterno?.nome}</strong><br></br>
            </CCallout>

            <div className="w-100 d-flex  justify-content-between">
                <strong>Processos ({totalProcessos})   <Person></Person> </strong>
                <div>
                    <Link
                        onClick={() => {
                            setVisibleMapa(prev => true)
                        }}
                    >

                    </Link>

                    <Link to={`/clientes/${clientId}/processos/add`}>
                        <StyledButton className="d-flex align-content-center" style={{ fontSize: "0.54rem", minWidth: "2.45rem", maxWidth: "6.45rem", borderRadius: 0 }} variant="outlined" color="success">
                            Criar Novo <Add></Add>
                        </StyledButton>
                    </Link>
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
                                    SME
                                </option>
                                <option value={2}>
                                    MIREPET
                                </option>

                            </CFormSelect>
                            <CFormSelect {...register("statusId")} size="sm"
                                id="validationServer05"  >
                                <option disabled>
                                    Status
                                </option>

                                <option value={1}>
                                    Tradução
                                </option>
                                <option value={2}>
                                    Legalização
                                </option>
                                <option value={2}>
                                    Em atraso
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
                            placeholder="Buscar..."
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

                                <TableCell colSpan={2} sx={{ px: 3 }}>
                                    Id.
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Requerente
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Beneficiario
                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Nacion

                                </TableCell>
                                <TableCell colSpan={3} sx={{ px: 2 }}>
                                    Passaporte
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>
                                    MOB
                                    <DownloadOutlined></DownloadOutlined>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ px: 0 }}>

                                    Dat. recep
                                    <DownloadOutlined></DownloadOutlined>
                                </TableCell>
                                <  TableCell colSpan={2} sx={{ px: 0 }}>
                                    Dat. envio

                                </TableCell>
                                <TableCell colSpan={1} sx={{ px: 0 }}>
                                    Acções

                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <CSpinner></CSpinner>
                            ) : (
                                <>
                                    {filteredProcessos
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((projecto, index) => (
                                            <TableRow key={index} hover>

                                                <TableCell sx={{ px: 3 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: "0.60rem" }}>{projecto?.numero}</Paragraph>
                                                </TableCell>

                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            {projecto?.requerente?.nome}
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            Sampaio Alberto
                                                        </Paragraph>
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    colSpan={3}
                                                    align="left"
                                                    sx={{ px: 2, textTransform: "capitalize" }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>

                                                        <Paragraph style={{ fontSize: fSize }}>
                                                            <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>24/04/2024</CBadge>
                                                        </Paragraph>

                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <CBadge className={(index % 2 !== 0) ? "bg-success text-black" : "bg-warning text-black"}>P4656</CBadge>

                                                        <AirplaneTicket></AirplaneTicket>
                                                    </Paragraph>


                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        <CBadge className="bg-success text-black">24/04/2024</CBadge>
                                                        <DownloadOutlined></DownloadOutlined>
                                                    </Paragraph>

                                                </TableCell>

                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {formatDateDifference(new Date(projecto?.createdAt))}
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <Paragraph style={{ fontSize: fSize }}>
                                                        {formatDateDifference(new Date(projecto?.createdAt))}
                                                        <Send></Send>
                                                    </Paragraph>
                                                </TableCell>
                                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                                    <CFormSelect
                                                        style={{ fontSize: "12px", minWidth: "6.45rem" }}
                                                        id="validationServer04"
                                                        onChange={async (e) => {
                                                            if (e.target.value == 1) {
                                                                return goto(
                                                                    `/processos/${projecto?.id}/detail`
                                                                );
                                                            }
                                                            if (e.target.value == 2) {
                                                                return goto(
                                                                    `/processos/${projecto?.passaporte}/edit`
                                                                );
                                                            }

                                                            if (e.target.value == 3) {
                                                                console.log("SOLICI ID", projecto?.id);
                                                                setPedido(prev => projecto?.id);
                                                                setUpdateStatusId(prev => 3);
                                                                setVisibleAprovar((prev) => true);

                                                            }
                                                            if (e.target.value == 4) {
                                                                setOpenRecusar((prev) => !true);
                                                            }

                                                            console.log(e.target.value);
                                                        }}

                                                        sx={0}
                                                    >
                                                        <option>selecione</option>
                                                        <option value={1}>visualisar</option>
                                                        <option value={2}>Editar</option>


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
