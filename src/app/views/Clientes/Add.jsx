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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import FormAdd from "./Formularios/FormAdd";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

export default function Add() {
    const [render, setRender] = useState(0);
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);

    console.log(render);
    return (
        <AppButtonRoot>
            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={routeSegments}
                />
            </Box>
            <div className="example">
                <FormAdd></FormAdd>
            </div>
        </AppButtonRoot>
    );
}

const filter = createFilterOptions();
