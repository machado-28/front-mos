import React from "react";
import {
  CCol,
  CFormInput,

  CRow
} from "@coreui/react";
import { Avatar } from "@mui/material";

export default function FormularioVisualizarDadosPessoais({ cliente }) {
  return (
    <>
     
      <CRow>

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
        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Número de Passaporte"
            readOnly
            defaultValue={cliente?.passaporte?.numeroPassaporte}
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
            size="sm"
            label="Local de emissão"
            readOnly
            defaultValue={cliente?.passaporte?.entidade}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Data de emissão"
            readOnly
            defaultValue={cliente?.passaporte?.dataEmissao}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            size="sm"
            label="Data de validade"
            readOnly
            defaultValue={cliente?.passaporte?.dataValidade}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
      <CRow className="mb-4">
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
        <CCol>
          <CFormInput
            id="estadoCivil"
            size="sm"
            defaultValue={cliente?.estadoCivil}
            readOnly
            label="Estado Civil"
            aria-describedby="exampleFormControlInputHelpInline"
          >
          </CFormInput>
        </CCol>
        <CCol>
          <CFormInput
            defaultValue={cliente?.nacionalidade}
            label="Nacionalidade"
            size="sm"
            aria-describedby="exampleFormControlInputHelpInline"
            readOnly
          >
          </CFormInput>
        </CCol>
      </CRow>

      <CRow>
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
        <CCol sm={3}>
          <CFormInput
            defaultValue={cliente?.municipioNascimento}
            type="text"
            size="sm"
            label="Natural de ..."
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="text"
            size="sm"
            label="Província de ..."
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            readOnly
            type="text"
            size="sm"
            defaultValue={new Date(cliente?.dataNascimento || new Date()).toDateString()}
            label="Data de Nascimento"
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
            id="pai"
            aria-label=" fd"
            label="Nome do Pai"
            aria-describedby="exampleFormControlInputHelpInline"
            defaultValue={cliente?.nomePai}

          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            size="sm"
            id="mae"
            defaultValue={cliente?.nomeMae}
            aria-label="fds"
            label="Nome Da Mãe"
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
      </CRow>
    </>

  );
}
