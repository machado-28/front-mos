import React from "react";
import {
  CCol,
  CFormInput,

  CFormSelect,

  CFormTextarea,

  CRow
} from "@coreui/react";
import { Avatar } from "@mui/material";

export default function FormularioVisualizarDadosIdentificacao({ cliente }) {
  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
            label="Nome do projecto"
            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
      <CRow className="mb-4">

        <CCol>

        </CCol>
        <CCol>
          <CFormInput label="Responsavel interno">

          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput label="Responsavel externo">

          </CFormInput>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CFormTextarea
            type="text"
            label="descricao"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
    </>

  );
}
