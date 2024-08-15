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

export default function FormularioVisualizarDadosMigratorio({ visto={

} }) {

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
            label="Data da última entrada"
            defaultValue={new Date(visto?.ultData || new Date()).toDateString()}
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            defaultValue={visto?.numero}
            id="numero"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly
            label="Número do visto"
          >
          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            defaultValue={visto?.numero}
            id="numero"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly
            label="Número do visto"
          >
          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            defaultValue={visto?.tipo}
            label="Tipo de visto"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly

          >
          </CFormInput>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CFormInput
            defaultValue={visto?.validade}
            id="validade"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly
            label="Data de Validade"
          >
          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            defaultValue={visto?.validade}
            id="entidade"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly
            label="Posto de fronteira utilizado"
          >
          </CFormInput>
        </CCol>

      </CRow>


    </>

  );
}
