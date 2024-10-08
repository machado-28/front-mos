import React, { useState } from "react";
import {
  CAlert,
  CAvatar,
  CBadge,
  CCallout,
  CCol,
  CForm,
  CFormInput,

  CInputGroup,

  CListGroup,

  CListGroupItem,

  CRow
} from "@coreui/react";
import { Avatar, Box } from "@mui/material";
import { H3, H5, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import updateProcessoShema from "./shema/updateProcessoShema";
import Processo from "../../util";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import StatCards from "app/views/dashboard/shared/StatCards";
import { Download } from "@mui/icons-material";



export default function FormularioVisualizarDadosPessoais({ processo = {} }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProcessoShema),
    shouldFocusError: true,
    progressive: true
  });

  const { processoId } = useParams();
  const [loading, setLoading] = useState(false)
  const processoClass = new Processo();
  const [documentos, setDocumentos] = useState([])
  async function PostData(dados) {

    try {
      console.log("FORMULARIO ", dados);
      setLoading(true);
      const response = await processoClass.criar(dados).then(async (response) => {
        setLoading(false);
        if (!response?.data?.message)
          return;
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);

    }
  }

  const { processo: processoData } = processo
  const { beneficiario: tecnico, ficheiros } = processoData || {}
  console.group(ficheiros);
  return (
    <>
      <CAlert color={processo?.status?.nome?.toLocaleLowerCase() === "recusado" ? "danger" : "warning"}>Este processo esta na faze  <strong>{processo?.step?.nome} </strong> com o status  <strong>{processo?.status?.nome} </strong>  <br></br> <strong>Nota:</strong> <i>{processo?.descricao || "sem nota"}</i></CAlert>
      <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
        <Box pt={2}></Box>
        <CRow className="mb-0 mt-1">
          <CCol>
            <img id="image" src={tecnico?.avatar?.url} style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

          </CCol>
          <CCol md="3">
            <CFormInput
              type="text"
              size="sm"

              label="ID"
              aria-describedby="exampleFormControlInputHelpInline"
              disabled
              value={processoData?.numero}

            />
          </CCol>
          <CCol  >
            <CFormInput
              type="text"
              size="sm"
              readOnly
              label="Nome do beneficiário"

              value={tecnico?.nome}
              aria-describedby="exampleFormControlInputHelpInline"

            />
          </CCol>
          <CCol md="2">
            <CFormInput
              type="tel"
              size="sm"
              readOnly
              label="Telefone"
              aria-describedby="exampleFormControlInputHelpInline"

              value={tecnico?.telefone}
            >

            </CFormInput>
          </CCol>
          <CCol md="2">
            <CFormInput
              type="email"
              size="sm"
              readOnly
              label="Email"
              aria-describedby="exampleFormControlInputHelpInline"
              value={tecnico?.email}
            >

            </CFormInput>
          </CCol>
        </CRow>
        <Box pt={2}></Box>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              type="text"

              size="sm"
              label="Nº do Passaporte"
              readOnly
              value={processoData?.passaporteNumero}
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.numero && (
                  <div className="text-light bg-danger">{errors.passaporte?.numero.message}</div>
                )
              }
              required
              {...register("passaporte.numero")}
            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              type="text"
              size="sm"
              value={new Date(processoData?.passaporteDataEmissao).toLocaleDateString()}
              label="Data de emissão"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.dataEmissao && (
                  <div className="text-light bg-danger">{errors.passaporte?.dataEmissao.message}</div>
                )
              }
              required
              {...register("passaporte.dataEmissao")}
            >

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              type="text"
              size="sm"
              label="Data de validade"
              aria-describedby="exampleFormControlInputHelpInline"
              value={new Date(processoData?.passaporteDataValidade).toLocaleDateString()}

              text={
                errors.passaporte?.dataValidade && (
                  <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                )
              }
              md={1}
              required
              {...register("passaporte.dataValidade")}
            >
            </CFormInput>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              value={processoData?.consulado}
              label="Consulado" size="sm">
            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.funcao}
              label="Função" size="sm">
            </CFormInput>
          </CCol>
          <CCol md={3}>
            <CFormInput type="text"
              value={new Date(processoData?.mob).toLocaleDateString()}

              label="Data estimada de Chegada" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.projecto?.nome}
              label="Projecto" size="sm">
            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.localProjecto}
              label="Local do projecto" size="sm">

            </CFormInput>
          </CCol>
        </CRow>
        <Box pt={2}></Box>
        <hr></hr>
        <H3>Filiação</H3>
        <Box pt={1}></Box>
        <CRow className="mb-4">
          <CCol>
            <CFormInput

              value={processoData?.nomePai}

              label="Nome Completo do Pai" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.paiNacionalidade}
              label="Nacionalidade do Pai" size="sm">
            </CFormInput>
          </CCol>
          <CCol md={3}>
            <CFormInput type="text"
              value={processoData?.nomeMae}

              label="Nome Completo da Mãe" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.maeNacionalidade}
              label="Nacionalidade da Mãe" size="sm">

            </CFormInput>
          </CCol>
        </CRow>
        <Box pt={2}></Box>
        <hr></hr>
        <Box pt={3}></Box>

        <CRow className="mb-4">
          <CCol>
            <CFormInput

              value={processoData?.tipoVisto?.nome}

              label="Visto" size="sm">

            </CFormInput>
          </CCol>

          <CCol>
            <CFormInput
              value={processoData?.nacionalidade}
              label="Nacionalidade" size="sm">
            </CFormInput>
          </CCol>
          <CCol md={3}>
            <CFormInput type="text"
              value={processoData?.genero}

              label="Genero" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput
              value={processoData?.estadoCivil}
              label="Estado Civil" size="sm">
            </CFormInput>
          </CCol>
        </CRow>
        <H3>Documentos ({ficheiros?.length + 1}) </H3>
        <CAlert color="info">
          [1]  <a target="blank" href={tecnico?.avatar.url}>{tecnico?.avatar?.name}</a>
        </CAlert>
        {

          ficheiros?.map((doc, index) => (
            <CAlert color="info">
              <CListGroup>
                [{index + 2}]  <a target="blank" href={doc?.url}>{doc?.name}</a>
              </CListGroup>{

              }
              <a href={doc?.url} target="blank" download={doc}>  <Download></Download></a>
            </CAlert>
          ))}
      </CForm>
    </>);
}
function Dowload(path) {
  console.log("oi");
  const blob = new Blob([path], { type: "application/image" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("download")
  link.click()
}