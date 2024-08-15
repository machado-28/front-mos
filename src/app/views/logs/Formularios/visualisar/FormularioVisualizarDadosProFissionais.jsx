import React from "react";
import {
  CCol,
  CFormInput,

  CRow
} from "@coreui/react";
import { Avatar } from "@mui/material";

export default function FormularioVisualizarDadosProFissionais({ cliente }) {
  return (
    <>
      <CRow>
        <CCol>
          <CFormInput
            type="text"
            label="Profissão"
            readOnly
            size="sm"
            defaultValue={cliente?.profissao}
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            label="Função"
            size="sm"
            readOnly
            defaultValue={cliente?.funcao}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
      <CRow className="mb-4">
      </CRow>
      <CRow>
        <CCol>
          <CFormInput
            type="text"
            label="Projecto"
            readOnly
            size="sm"
            defaultValue={cliente?.passaporte?.entidade}
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>

      </CRow>
    </>

  );
}
