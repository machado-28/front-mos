import { Edit, FileDownloadDone, Print, Title } from "@mui/icons-material";
import { Avatar, Box, Button, Card } from "@mui/material";
import { H1 } from "app/components/Typography";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Processo from "./util";
import Resumo from "./Resumo";
// import Step from "./components/StepProgress";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider, CModal, CModalHeader, CModalTitle, CForm, CFormSelect, CButton, CModalFooter, CSpinner, CModalBody, CFormInput, CFormTextarea } = require("@coreui/react");
const { SimpleCard } = require("app/components");
const { useState } = require("react");
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
        const c_pedido = new Processo();
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
                            <CFormTextarea placeholder="descreva uma nota">

                            </CFormTextarea>



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
            <CCard >
                <CCardBody className=" d-flex align-items-start justify-content-between">
                    <SimpleCard className=" d-flex w-40 align-items-start justify-content-start" title={"Informações do Beneficiário "}>
                        <Box pt={8} ></Box>
                        <CRow className=" d-flex  align-items-center justify-content-center" >
                            <CCol  >
                                <CAvatar src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png" style={{ maxWidth: 300, minWidth: 200 }}>

                                </CAvatar>
                            </CCol>

                        </CRow>
                        <Box pt={8} ></Box>
                        <CRow className="mt-4">
                            <CCol>
                                <div className="d-flex row">
                                    <span>
                                        Nome:
                                        <strong>
                                            Antonio Machado
                                        </strong>
                                    </span>


                                    <span>
                                        Email:
                                        <strong>
                                            antonio@gmail.om
                                        </strong>
                                    </span>

                                    <span>
                                        Faze Actual:
                                        <strong>
                                            Legalização
                                        </strong>
                                    </span>

                                </div>
                            </CCol>
                        </CRow>

                    </SimpleCard>


                    <div className="p-4 w-100">
                        <div className="w-100 d-flex align-items-start justify-content-between">
                            <H1>
                                Processo Nº
                            </H1>
                            <div>
                                <Link>
                                    <Button>   <Edit></Edit></Button>
                                </Link>
                                <Link>
                                    <Button>   <Print></Print></Button>
                                </Link>
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
                                <>
                                    <Button className="bg-success text-white" onClick={() => {
                                        setVisibleMapa((prev) => true
                                        )
                                    }}>
                                        Editar status <Edit></Edit>
                                    </Button>
                                </>
                            </div>
                        </div>
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
                                    Resumo
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
                                    Identificacao
                                </CNavLink>
                            </CNavItem>


                            <CNavItem>
                                <CNavLink
                                    style={{
                                        backgroundColor: render === 5 ? "rgb(22, 125, 227)" : "#eee",
                                        color: render === 5 ? "#fff " : "#1f1f1f",
                                        cursor: "pointer"
                                    }}
                                    data="turismo"
                                    onClick={() => setRender((prev) => 5)}
                                    active={render === 5 ? true : false}
                                >
                                    Documentos
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

                            <CTabPane className="preview border-1" visible={render === 4 ? true : false}>
                                <Box pt={2}></Box>
                                <ListarDocumentos></ListarDocumentos>
                            </CTabPane>
                        </CTabContent>
                    </div>
                </CCardBody>
            </CCard>
        </>
    )
}