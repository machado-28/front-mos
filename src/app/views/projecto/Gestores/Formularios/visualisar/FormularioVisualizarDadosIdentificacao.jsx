import React from "react";
import {
  CCol,
  CFormInput,

  CRow
} from "@coreui/react";
import { Avatar } from "@mui/material";

export default function FormularioVisualizarDadosIdentificacao({ cliente }) {
  return (
    <>

      <CRow className="mb-4">
        <CCol>
          <CFormInput
            size="sm"
            type="text"
            label="Nome do gestor"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            
           
          />
        </CCol>

      </CRow>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            size="sm"
            type="text"
            label="Email"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            
           
          />
        </CCol>
        <CCol>
          <CFormInput
            size="sm"
            type="text"
            label="Telefone"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            
           
          />
        </CCol>

      </CRow>

      <CRow>
        <CCol>
          <CFormInput
            size="sm"
            type="text"
            label="usuario"
            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            
           
          />
        </CCol>
        <CCol>
          <CFormInput
            size="sm"
            type="password"
            label="Senha"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            
           
          />
        </CCol>
      </CRow>
      <CCol>
          <CFormInput
            id="Comuna"
            aria-describedby="exampleFormControlInputHelpInline"

            label="Registrado por:"
            required
            defaultValue={"Alcino Bita"}
            disabled
          >

          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            id="Comuna"
            aria-describedby="exampleFormControlInputHelpInline"
            label="Em:"
            required
            defaultValue={new Date().toLocaleDateString()}
            disabled
          >

          </CFormInput>
        </CCol>

    </>

  );
}
