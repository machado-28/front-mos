import React from "react";
import {
  CButton,
  CCol,
  CFormInput,

  CRow
} from "@coreui/react";
import { Avatar, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SimpleCard } from "app/components";
import { Edit } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";


export default function FormularioVisualizarDadosPessoais({ cliente }) {
  const { id } = useParams()

  return (
    <>

      <SimpleCard

        subtitle={"DADOS DE IDENTIFICAÇÃO DO REPRESENTANTE DA EMPRESA"}
        item
        lg={6}
        md={6}
        sm={12}
        xs={12}
        sx={{ mt: 1 }}
      >
        <div className="w-100 d-flex justify-content-end align-items-center">
          <Link to={`/clientes/${id}/editar`}><StyledButton color="success" variant="contained">Editar <Edit></Edit></StyledButton></Link>
        </div>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              size="sm"
              id="Nome"
              aria-describedby="exampleFormControlInputHelpInline"
              label="nome Completo(Representante)"
              required
              disabled
              defaultValue={cliente?.nome}
            >

            </CFormInput>
          </CCol>
        </CRow>

        <CRow className="mb-4">

          <CCol>
            <CFormInput
              size="sm"
              id="Telefone 1"
              aria-describedby="exampleFormControlInputHelpInline"
              label="Telefone 1"

              disabled
              value={cliente?.telefone1}
              defaultValue={cliente?.telefone1}
            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              size="sm"
              id="Telefone 2"
              aria-describedby="exampleFormControlInputHelpInline"
              label="Telefone 2"
              required
              disabled
              defaultValue={cliente?.telefone2}
            >

            </CFormInput>
          </CCol>

          <CCol>
            <CFormInput
              size="sm"
              id="Email"
              aria-describedby="exampleFormControlInputHelpInline"
              label="Email"
              required
              disabled
              defaultValue={cliente?.email}
            >

            </CFormInput>
          </CCol>

        </CRow>
        <Box pt={4}></Box>

        <h5>Dados Da Empresa</h5>
        <hr></hr>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              size="sm"
              id="Nome"
              aria-describedby="exampleFormControlInputHelpInline"

              label="Nome da Empresa"
              required
              disabled
              defaultValue={cliente?.nomeEmpresa}
            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              size="sm"
              id="nif"
              aria-describedby="exampleFormControlInputHelpInline"
              disabled
              defaultValue={cliente?.nif}
              label="NIF"
              required

            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              size="sm"
              id="Website"
              aria-describedby="exampleFormControlInputHelpInline"

              label="Web site"
              required
              disabled
              defaultValue={cliente?.site}
            >

            </CFormInput>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>

            <CFormInput
              size="sm"
              id="Email"
              aria-describedby="exampleFormControlInputHelpInline"

              label="Área de actuação"
              required
              disabled
              defaultValue={cliente?.ramo}
            >

            </CFormInput>

          </CCol>

          <CCol>
            <CFormInput
              size="sm"
              id="d"
              aria-describedby="exampleFormControlInputHelpInline"
              label="município"
              required
              disabled
              defaultValue={cliente?.municipio}
            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              size="sm"
              id="Comuna"
              aria-describedby="exampleFormControlInputHelpInline"
              label="comuna"
              required

              disabled
              defaultValue={cliente?.comuna}
            >
            </CFormInput>
          </CCol>
        </CRow>

      </SimpleCard>
      <div className="m-4">
        <span>Registado por:</span> <strong>{cliente?.atendente?.nome || "anonimo"}</strong><br></br>
        <span>Perfil:</span><strong>{cliente?.atendente?.painel?.nome || "secretaria"}</strong><br></br>
        <span>em:</span> <strong>  {new Date(cliente?.createdAt).toLocaleDateString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</strong>
      </div>

    </>


  );
}
