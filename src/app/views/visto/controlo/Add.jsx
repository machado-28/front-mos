import { Avatar, Box, TextField, styled } from "@mui/material";
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
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import VisuaizarBasico from "./Formularios/ver/VisualizarBasico";
import FormAdd from "./Formularios/FormAdd";

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

export default function Add() {
    const [render, setRender] = useState(0);
    const handleClick = (e) => {
        setPassaporte(e?.target?.value)
    }

    console.log(render);
    return (
        <AppButtonRoot>
            <div className="example">

                <div className="w-100 d-flex  justify-content-between">
                    <Title>REGISTO DE EMISSÃO VISTO</Title>
                    <div></div>
                </div>


                <Box pt={5}>{/* <Campaigns /> */}</Box>


                <div className=" w-100 d-flex justify-content-between align-items-center">

                    <VisuaizarBasico></VisuaizarBasico>
                    {/* <div className="w-55 d-flex justify-content-center align-items-center">
                            <Avatar style={{height:'300px', width:'300px'}}></Avatar>
                        </div> */}
                </div>
                <FormAdd></FormAdd>
            </div>
        </AppButtonRoot>
    );
}

const filter = createFilterOptions();
