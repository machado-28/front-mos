import React from "react";
import {
  CCol,
  CFormInput,

  CRow
} from "@coreui/react";
import { Avatar } from "@mui/material";

export default function FormularioVisualizarDadosIdentificacao({ usuario }) {
  return (
    <>

      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Nome "
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={usuario?.nome}
          />
        </CCol>

      </CRow>
      <CRow className="mb-4">


        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Usuário"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={usuario?.nome}
          >

          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            type="tel"
            size="sm"
            label="Senha"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={usuario?.usuario}
          >

          </CFormInput>
        </CCol>
      </CRow>

      <CRow className="mb-4">

        <CCol>
          <CFormInput
            type="tel"
            size="sm"
            label="Telefone"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={usuario?.telefone}
          >

          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            type="tel"
            size="sm"
            label="Email"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={usuario?.email}
          >

          </CFormInput>
        </CCol>
      </CRow>
    </>

  );
}
