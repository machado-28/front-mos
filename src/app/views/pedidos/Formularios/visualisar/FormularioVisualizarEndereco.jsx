import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Phone, Title } from "@mui/icons-material";

import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { listaPais } from "app/utils/paises";
import { useEffect } from "react";

export default function FormularioVisualizarEndereco({ endereco }) {
  const { provincia, municipio, aldeia, rua } = endereco
  return (
    <>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            readOnly
            size="sm"
            defaultValue={provincia}
            id="we3"
            aria-label=" fd"
            label="Província/Estado"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            size="sm"
            readOnly
            defaultValue={municipio}
            id="23"
            aria-label="fds"
            label="Municipio"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>

      </CRow>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            size="sm"
            readOnly
            defaultValue={aldeia}
            id="23"
            aria-label="fds"
            label="Aldeia"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            readOnly
            size="sm"
            defaultValue={rua}
            id="23"
            aria-label="fds"
            label="Aldeia"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
    </>

  );
}
