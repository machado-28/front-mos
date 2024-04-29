import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Phone } from "@mui/icons-material";

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CHeaderDivider,
  CInputGroup,
  CInputGroupText,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { Link, useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";
import FormularioTrabalho from "./Formularios/FormularioTrabalho";
import FormularioTurismo from "./Formularios/FormularioTurismo";
import FormularioCurtaDuracao from "./Formularios/FormularioCurtaDuracao";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";

const Title = styled("span")(() => ({
  fontSize: "1.4rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

export default function SubmterProcesso() {
  const [render, setRender] = useState(0);

  console.log(render);
  return (
    <AppButtonRoot>
      <div className="example">
        <SimpleCard>
          <div className="w-100 d-flex  justify-content-between">
            <Title>CADASTRAMENTO DE PEDIDO DE VISTO - SECRETARIA-LOCAL</Title>
            <div></div>
          </div>
        </SimpleCard>
        <Box pt={1}>{/* <Campaigns /> */}</Box>
        <SimpleCard>
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
                Visto de Trabalho
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
                Visto De Turismo
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
                Visto De Curta Duração
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
                Visto De Fronteira
              </CNavLink>
            </CNavItem>
          </CNav>
        </SimpleCard>

        <CTabContent className="rounded-bottom">
          <CTabPane data="trabalho" className="preview" visible={render === 0 ? true : false}>
            <FormularioTrabalho></FormularioTrabalho>
          </CTabPane>
          <CTabPane data="turismo" className="preview" visible={render === 1 ? true : false}>
            <FormularioTurismo></FormularioTurismo>
          </CTabPane>

          <CTabPane className="preview" visible={render === 2 ? true : false}>
            <FormularioCurtaDuracao></FormularioCurtaDuracao>
          </CTabPane>
          <CTabPane className="preview" visible={render === 3 ? true : false}>
            <FormularioCurtaDuracao></FormularioCurtaDuracao>
          </CTabPane>
        </CTabContent>
      </div>
    </AppButtonRoot>
  );
}

const filter = createFilterOptions();
