import { Edit, FileDownloadDone, Folder, Print, Title } from "@mui/icons-material";
import { Avatar, Box, Button, Card } from "@mui/material";
import { H1, H2 } from "app/components/Typography";
import FormularioVisualizarDadosIdentificacao from "./Formularios/visualisar/FormularioVisualizarDadosIdentificacao";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Tabela from "./../processo/ListarInProjecto";
import { LoadingButton } from "@mui/lab";
import Resumo from "./Resumo";

// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CCallout } = require("@coreui/react");

export default function Detalhar() {
    const [render, setRender] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleMapa, setVisibleMapa] = useState(false);

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
                            <div className="d-flex COLUMN justify-content-center align-items-center " role="group" aria-label="Basic radio toggle button group flex-0">

                                <CFormSelect size="sm"
                                    id="validationServer06" label="Faze">
                                    <option>
                                        Tradução
                                    </option>
                                    <option>
                                        Transição
                                    </option>
                                    <option>
                                        MIREMPET
                                    </option>
                                    <option>
                                        SME
                                    </option>
                                </CFormSelect>
                                <CFormSelect size="sm"
                                    id="validationServer06" label="Status">
                                    <option>
                                        Em andamento
                                    </option>
                                    <option>
                                        Aprovado
                                    </option>
                                    <option>
                                        Recusado
                                    </option>
                                    <option>
                                        Cancelado
                                    </option>
                                    <option>
                                        Finalizado
                                    </option>

                                </CFormSelect>
                            </div>



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
                    </CForm>
                </CModal>
            </>


            <Box overflow="auto">
                <Tabela></Tabela>
            </Box>
        </>
    )
}