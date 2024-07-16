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
        <CCol sm={3}>
          <CFormInput
            type="text"
            size="sm"
            label="ID"
            readOnly
            disabled
            defaultValue={1}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Nome Completo"
            readOnly
            defaultValue={cliente?.nomeCompleto}
            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>

      </CRow>

      <CRow className="mb-4"  >

        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Data de Nascimento"
            readOnly
            defaultValue={new Date(cliente?.passaporte?.dataEmissao).toLocaleDateString()}
            aria-describedby="exampleFormControlInputHelpInline"

          />

        </CCol>
        <CCol>
          <CFormInput
            size="sm"
            defaultValue={cliente?.genero}
            id="genero"
            aria-describedby="exampleFormControlInputHelpInline"
            label="Genero"
            readOnly
          >
          </CFormInput>
        </CCol>
      </CRow>


      <CRow className="mb-4">
        <CCol>
          <CFormInput
            id="paisNascimento"
            size="sm"
            label="País de Nascimento"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={cliente?.paisNascimento}
            readOnly
          >

          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            defaultValue={cliente?.municipioNascimento}
            type="text"
            size="sm"
            label="Natural de ..."
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
