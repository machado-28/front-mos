import { Edit, Print, Title } from "@mui/icons-material";
import { Box, Button, Card } from "@mui/material";
import { H1 } from "app/components/Typography";
import { Link } from "react-router-dom";

const { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CImage, CAvatar, CCard, CCardBody, CRow, CCol, CDropdownToggle, CDropdown, CDropdownItem, CDropdownMenu, CDropdownDivider } = require("@coreui/react");
const { SimpleCard } = require("app/components");
const { useState } = require("react");
export default function Detalhar() {
    const [render, setRender] = useState(0);
    return (
        <>

            <CCard >
                <CCardBody className=" d-flex align-items-start justify-content-start">
                    <SimpleCard title={"Informações do Beneficiário "}>
                        <Box pt={4} ></Box>
                        <CRow >
                            <CCol  >
                                <CAvatar src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png" style={{ maxWidth: 100, minWidth: 100 }}>

                                </CAvatar>
                            </CCol>

                        </CRow>
                        <Box pt={4} ></Box>
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

                                </div>
                            </CCol>
                        </CRow>

                    </SimpleCard>


                    <SimpleCard>
                        <div className="w-30 d-flex align-items-center justify-content-between">
                            <H1>
                                Proocesso Nº
                            </H1>
                            <div>
                                <Link>
                                    <Button>   <Edit></Edit></Button>
                                </Link>
                                <Link>
                                    <Button>   <Print></Print></Button>
                                </Link>
                                <>
                                    {['Faze',].map((color, index) => (
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
                                    ))}
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
                                        backgroundColor: render === 0 ? "rgb(22, 125, 227)" : "#eee",
                                        color: render === 0 ? "#fff " : "#1f1f1f",
                                        cursor: "pointer"
                                    }}
                                    data="trabalho"
                                    href="#"
                                    onClick={() => setRender((prev) => 0)}
                                    active={render === 0 ? true : false}
                                >
                                    Dados De Identificacao do Beneficiário
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    style={{
                                        backgroundColor: render === 1 ? "rgb(22, 125, 227)" : "#eee",
                                        color: render === 1 ? "#fff " : "#1f1f1f",
                                        cursor: "pointer"
                                    }}
                                    data="turismo"
                                    onClick={() => setRender((prev) => 1)}
                                    active={render === 1 ? true : false}
                                >
                                    Dados de  Endereço
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    style={{
                                        backgroundColor: render === 2 ? "rgb(22, 125, 227)" : "#eee",
                                        color: render === 2 ? "#fff " : "#1f1f1f",
                                        cursor: "pointer"
                                    }}
                                    data="turismo"
                                    onClick={() => setRender((prev) => 2)}
                                    active={render === 2 ? true : false}
                                >
                                    Dados Profissional
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    style={{
                                        backgroundColor: render === 3 ? "rgb(22, 125, 227)" : "#eee",
                                        color: render === 3 ? "#fff " : "#1f1f1f",
                                        cursor: "pointer"
                                    }}
                                    data="turismo"
                                    onClick={() => setRender((prev) => 3)}
                                    active={render === 3 ? true : false}
                                >
                                    Informação de Contacto
                                </CNavLink>
                            </CNavItem>
                        </CNav>


                        <CTabContent className="rounded-bottom">
                            <CTabPane data="trabalho" className="preview" visible={render === 0 ? true : false}>
                                one
                            </CTabPane>
                            <CTabPane data="turismo" className="preview" visible={render === 1 ? true : false}>
                                2
                            </CTabPane>

                            <CTabPane className="preview" visible={render === 2 ? true : false}>
                                3
                            </CTabPane>
                            <CTabPane className="preview" visible={render === 3 ? true : false}>
                                4
                            </CTabPane>
                        </CTabContent>
                    </SimpleCard>
                </CCardBody>
            </CCard>
        </>
    )
}