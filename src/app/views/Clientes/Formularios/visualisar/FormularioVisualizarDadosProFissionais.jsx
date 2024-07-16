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
            defaultValue={cliente?.profissao}
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            label="Função"
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
            defaultValue={cliente?.passaporte?.entidade}
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
