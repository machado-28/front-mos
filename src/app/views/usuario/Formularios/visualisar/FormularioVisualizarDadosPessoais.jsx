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
      <CCol className="d-flex align-items-center" style={{ background: "#eee",  height: 140 }}>
        <Avatar src={cliente?.avatarUrl} style={{ margin:4, maxHeight: 200, minHeight: 100, maxWidth: 200, minWidth: 100, borderRadius: "50%" }} ></Avatar>
       
      </CCol>
      <CRow>

        <CCol>
          <CFormInput
            type="text"
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
            label="Local de emissão"
            readOnly
            defaultValue={cliente?.passaporte?.entidade}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            label="Data de emissão"
            readOnly
            defaultValue={cliente?.passaporte?.dataEmissao}
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
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
            label="Natural de ..."
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="text"
            label="Província de ..."
            aria-describedby="exampleFormControlInputHelpInline"

          />
        </CCol>
        <CCol>
          <CFormInput
            readOnly
            type="text"
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
