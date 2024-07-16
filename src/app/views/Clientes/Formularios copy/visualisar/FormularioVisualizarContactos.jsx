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

export default function FormularioVisualizarContacto({ contactos }) {
  return (
    <>

      <CRow className="mt-4 mb-4">
        <CCol>

          <CFormInput
            size="sm"
            label={"Telefone :"}
            type="text"
            readOnly

            defaultValue={contactos?.telefone}
            aria-label="telefone"
            placeholder="Telefone"
            de
            aria-describedby="n3ome"

          />


        </CCol>
        <CCol className="mb-4">
          <CFormInput
            label={"Email :"}
            size="sm"
            id="formFileSm"
            type="text"
            readOnly
            defaultValue={contactos?.email}
            aria-label="email"
            aria-describedby="n3ome"

          />

        </CCol>
      </CRow>


    </>

  );
}
