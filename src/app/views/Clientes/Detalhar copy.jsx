import { Edit, FileDownloadDone, Folder, Print, Title } from "@mui/icons-material";
import { Avatar, Box, Button, Card } from "@mui/material";
import { H1, H2 } from "app/components/Typography";
import { Link } from "react-router-dom";
import FormularioVisualizarDadosMigratorio from "./Formularios/visualisar/FormularioVisualizarDadosMigratorio";
import FormularioVisualizarContacto from "./Formularios/visualisar/FormularioVisualizarContactos";
import FormularioVisualizarDadosProFissionais from "./Formularios/visualisar/FormularioVisualizarDadosProFissionais";
import ListarDocumentos from "../documento/ListarDocumentos";
import FormularioVisualizarEndereco from "./Formularios/visualisar/FormularioVisualizarEndereco";
import FormularioVisualizarIdentificacao from "./Formularios/visualisar/FormularioVisualizarIndentificacao";
import FormularioVisualizarDadosPessoais from "./Formularios/visualisar/FormularioVisualizarDadosPessoais";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Tabela from "../projecto/Listar";
import Tecnicos from "../Beneficiarios/Listar";
import Gestores from "./Gestores/Listar";
import { LoadingButton } from "@mui/lab";
import Resumo from "./Resumo";

// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody } = require("@coreui/react");

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

            <div className="p-4 w-100">
                <H2 className="mb-2">INFORMAÇÕES DO CLIENTE</H2>
                <CNav variant="tabs">

                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 0 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 0 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="trabalho"
                            href="#"
                            onClick={() => setRender((prev) => 0)}
                            active={render === 0 ? true : false}
                        >
                            RESUMO
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>

                        <CNavLink
                            style={{
                                backgroundColor: render === 1 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 1 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="trabalho"
                            href="#"
                            onClick={() => setRender((prev) => 1)}
                            active={render === 1 ? true : false}
                        >
                            DADOS DE IDENTIFICAÇÃO
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 8 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 8 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 8)}
                            active={render === 8 ? true : false}
                        >
                            GESTORES
                        </CNavLink>
                    </CNavItem>

                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 7 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 7 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 7)}
                            active={render === 7 ? true : false}
                        >
                            TÉCNICOS
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            style={{
                                backgroundColor: render === 6 ? "rgb(22, 125, 227)" : "#eee",
                                color: render === 6 ? "#fff " : "#1f1f1f",
                                cursor: "pointer"
                            }}
                            data="turismo"
                            onClick={() => setRender((prev) => 6)}
                            active={render === 6 ? true : false}
                        >
                            PROJECTOS
                        </CNavLink>
                    </CNavItem>

                </CNav>

                <CCol className="d-flex align-items-center" style={{ background: "#eee", height: 50 }}>


                </CCol>
                <CTabContent className="rounded-bottom">
                    <CTabPane data="trabalho" className="preview" visible={render === 0 ? true : false}>
                        <Resumo></Resumo>
                    </CTabPane>
                    <CTabPane data="turismo" className="preview" visible={render === 1 ? true : false}>
                        <Box pt={4}></Box>
                        <FormularioVisualizarDadosPessoais cliente={{
                            nomeCompleto: "KIVEMBA SOFT",
                            passaporte: {
                                numeroPassaporte: "34443434343434",
                                entidade: "perak",
                                dataEmissao: new Date(),
                                dataValidade: new Date(),
                            },
                            genero: "Masculino",
                            estadoCivil: "Solteiro",
                            nacionalidade: "Angola",
                            paisNascimento: "Gana",
                            municipio: "estalagem",
                            municipioNascimento: "Catepa",
                            nomePai: "Paulino",
                            nomeMae: "Paulina"

                        }}></FormularioVisualizarDadosPessoais>

                    </CTabPane>

                    <CTabPane className="preview" visible={render === 2 ? true : false}>
                        <Box pt={3}></Box>
                        <FormularioVisualizarDadosProFissionais cliente={{ profissao: "Engenheiro", passaporte: "AB555", funcao: "Inspector" }}></FormularioVisualizarDadosProFissionais>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 3 ? true : false}>
                        <Box pt={2}></Box>
                        <FormularioVisualizarContacto contactos={{ email: "Anton@gmail.com", telefone: "999 999 999" }}></FormularioVisualizarContacto>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 4 ? true : false}>
                        <Box pt={2}></Box>
                        <ListarDocumentos></ListarDocumentos>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 5 ? true : false}>
                        <Box pt={2}></Box>
                        <ListarDocumentos></ListarDocumentos>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 6 ? true : false}>
                        <Box pt={2}></Box>
                        <Tabela></Tabela>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 7 ? true : false}>
                        <Box pt={2}></Box>
                        <Tecnicos></Tecnicos>
                    </CTabPane>
                    <CTabPane className="preview border-1" visible={render === 8 ? true : false}>
                        <Box pt={2}></Box>
                        <Gestores></Gestores>
                    </CTabPane>
                </CTabContent>
            </div>
        </>
    )
}