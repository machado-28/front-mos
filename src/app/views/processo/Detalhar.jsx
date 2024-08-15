import { Edit, FileDownloadDone, Print, Title } from "@mui/icons-material";
import { Avatar, Box, Breadcrumbs, Button, Card } from "@mui/material";
import { H1 } from "app/components/Typography";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Processo from "./util";
import Resumo from "./Resumo";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CFormTextarea } = require("@coreui/react");
const { SimpleCard, Breadcrumb } = require("app/components");
const { useState, useEffect } = require("react");
export default function Detalhar() {
    const [render, setRender] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleMapa, setVisibleMapa] = useState(false);

    const addAprovarShema = z.object({
        descricao: z.string(),
        statusId: z.string(),
        stepId: z.string()
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

    async function actualizarStatus(data) {
        setLoading(prev => !prev)
        data.processoId = processoId;
        console.log("DATAFORM", data);
        const c_pedido = new Processo();
        await c_pedido.actualizarStatus(data);
        setLoading(prev => !prev)

    }
    const [loadingMap, setLoadingMap] = useState(false);
    const [status, setStatus] = useState([{ nome: "pendente" }, { nome: "em andamento" }, { nome: "concluido" }, { nome: "recusado" }, { nome: "cancelado" }]);
    const [fases, setFases] = useState([{ nome: "tradução" }, { nome: "legalização", }, { nome: "sme" }, { nome: "mirempet" }, { nome: "devolvidos" }]);

    async function buscarStatusEfases() {
        const statatusClass = new Status();
        const faseClass = new Fase();

        const status = await statatusClass.buscar().then((res) => res?.data)
        setStatus(prev => status);

        const fases = await faseClass.buscar().then((res) => res?.data)
        setStatus(prev => fases);

    }
    async function gerarFicha() {
        setLoadingMap(prev => true)
        const processo = new Processo();
        await processo.gerarFicha({ processoId })
        setLoadingMap(prev => false)

    }

    const [processos, setProcessos] = useState([])
    const { processoId } = useParams()
    const buscarProcesso = async (data) => {
        setLoading(prev => true)
        const processo = new Processo();
        const res = await processo.buscar({ processoId })
        setProcessos(prev => res.processos[0])
        setLoading(prev => false)

    }
    useEffect(() => {
        buscarProcesso()
    }, [])
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);


    const [pendente, traducao, mirex, sme, mirempet, finalizados] = [1, 2, 3, 4, 5, 6]
    return (
        <>
            <>
                <CModal
                    alignment="center"
                    visible={visibleMapa}
                    onClose={() => setVisibleMapa(false)}
                    aria-labelledby="VerticallyCenteredExample"
                >
                    <CModalHeader>
                        <CModalTitle id="VerticallyCenteredExample">Actualização da Faze do processo</CModalTitle>
                    </CModalHeader>
                    <CForm onSubmit={handleSubmit(actualizarStatus)}>
                        <CModalBody>
                            <CRow className="mb-4">
                                <CCol>
                                    <CFormSelect {...register("stepId")} size="sm"
                                        id="validationServer06" label="Faze">
                                        <option value={1}>
                                            Pendente
                                        </option>
                                        <option value={2}>
                                            Legalização
                                        </option>
                                        <option value={3}>
                                            MIREX
                                        </option>
                                        <option value={4}>
                                            SME
                                        </option>
                                        <option value={5}>
                                            MIREMPET
                                        </option>
                                        <option value={6}>
                                            Finalizado
                                        </option>
                                    </CFormSelect>
                                </CCol>
                                <CCol>
                                    <CFormSelect {...register("statusId")} size="sm"
                                        id="validationServer06" label="Status">
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
                                            concluido
                                        </option>
                                        <option value={5}>
                                            Recusado
                                        </option>
                                        <option value={6}>
                                            Cancelado
                                        </option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol>
                                    <CFormTextarea {...register("descricao")} placeholder="descreva uma nota">

                                    </CFormTextarea>
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
                                <CButton type="submit" color="success">
                                    Actualizar
                                </CButton>
                            )}
                        </CModalFooter>
                        <span className="p-4 text-info">Obs:os responsáveis receberão a mensagem por email</span>
                    </CForm>

                </CModal>
            </>
            <CCard className="m" >

                <CCardBody className=" d-flex align-items-start justify-content-between">

                    <div className="p-4 w-100">
                        <div className="w-100 mb-3 d-flex align-items-start justify-content-between">
                            <Box className="breadcrumb">
                                <Breadcrumb
                                    routeSegments={routeSegments}
                                />
                            </Box>
                            <div>
                                {/* <Link>
                                    <Button>   <Edit></Edit></Button>
                                </Link> */}
                                {
                                    loadingMap === true ? <CSpinner></CSpinner> : <Link onClick={async () => { gerarFicha() }}>
                                        <Button>   <Print>Ficha</Print></Button>
                                    </Link>
                                }
                                <>
                                    {/* {['Faze',].map((color, index) => (
                                        <CDropdown variant="btn-group" key={index}>
                                            <CDropdownToggle color={color}>{color}</CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem href="#">Tradução</CDropdownItem>
                                                <CDropdownItem href="#">Legalização</CDropdownItem>
                                                <CDropdownItem href="#">MIREMPET</CDropdownItem>
                                                <CDropdownDivider />
                                                <CDropdownItem href="#">SME</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    ))}
                                </>
                                <>
                                    {['Status',].map((color, index) => (
                                        <CDropdown variant="btn-group" key={index}>
                                            <CDropdownToggle color={color}>{color}</CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem href="#">Aprovar</CDropdownItem>
                                                <CDropdownItem href="#">Recusar</CDropdownItem>
                                                <CDropdownItem href="#">Concludo</CDropdownItem>
                                                <CDropdownDivider />
                                                <CDropdownItem href="#">Separated link</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    ))} */}
                                </>
                                ^
                            </div>
                        </div>
                        <FormularioVisualizarDadosPessoais processo={processos}></FormularioVisualizarDadosPessoais>
                    </div>
                </CCardBody>
            </CCard>
        </>
    )
}