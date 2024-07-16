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
import { useState } from "react";
import FormEditar from "./Formularios/editar/FormEditar";

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

export default function Editar() {
    const [render, setRender] = useState(0);

    console.log(render);
    return (
        <AppButtonRoot>
            <div className="example">

                <div className="w-100 d-flex  justify-content-between">
                    <Title>ACTUALIZAÇÃO DO GESTOR</Title>
                    <div></div>
                </div>

                <Box pt={1}>{/* <Campaigns /> */}</Box>
                <FormEditar></FormEditar>
            </div>
        </AppButtonRoot>
    );
}

const filter = createFilterOptions();
