import React, { useState } from "react";
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
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
import { H1, H3, H5, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import updateProcessoShema from "./shema/updateProcessoShema";
import Processo from "../../util";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import StatCards from "app/views/dashboard/shared/StatCards";
import { Download, FileOpen, FileUpload, Folder, FolderOpen } from "@mui/icons-material";
import { SimpleCard } from "app/components";



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
  console.log("DADOS DE PROCESSO", processo)
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

  const { beneficiario: tecnico, ficheiros } = processo || {}
  console.group(ficheiros);
  return (
    <>
      <SimpleCard>
        <CAlert color={processo?.status?.nome?.toLocaleLowerCase() === "recusado" ? "danger" : "warning"}>Este processo encontra-se  com o status  <strong>{processo?.status?.nome} </strong>  <br></br> <strong>Nota:</strong> <i>{processo?.descricao || "sem nota"}</i></CAlert >

        <CRow>
          <CCol>
            <CCallout color="info">PROJECTO: <strong>{processo?.projecto?.nome}</strong> </CCallout>
          </CCol>

          <CCol>
            <CCallout color="dark">STATUS: <strong>{processo?.fase?.nome}</strong>
            </CCallout>

          </CCol>
          <CCol>
            <CCallout color="success">
              Tipo de visto: <strong>{processo?.tipoVisto?.nome}</strong>
            </CCallout>
          </CCol>
        </CRow>
      </SimpleCard>
      <Box pt={3}></Box>
      <CRow>

        <CCol>
          <SimpleCard>
            <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>

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
                    value={processo?.numero}

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
                    value={processo?.passaporteNumero}
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
                    value={new Date(processo?.passaporteDataEmissao).toLocaleDateString()}
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
                    value={new Date(processo?.passaporteDataValidade).toLocaleDateString()}

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
                    value={processo?.consulado}
                    label="Consulado" size="sm">
                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.funcao}
                    label="Função" size="sm">
                  </CFormInput>
                </CCol>
                <CCol md={3}>
                  <CFormInput type="text"
                    value={new Date(processo?.mob).toLocaleDateString()}

                    label="Data estimada de Chegada" size="sm">

                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.projecto?.nome}
                    label="Projecto" size="sm">
                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.localProjecto}
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

                    value={processo?.nomePai}

                    label="Nome Completo do Pai" size="sm">

                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.paiNacionalidade}
                    label="Nacionalidade do Pai" size="sm">
                  </CFormInput>
                </CCol>
                <CCol md={3}>
                  <CFormInput type="text"
                    value={processo?.nomeMae}

                    label="Nome Completo da Mãe" size="sm">

                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.maeNacionalidade}
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

                    value={processo?.tipoVisto?.nome}
                    readOnly
                    label="Visto" size="sm">

                  </CFormInput>
                </CCol>

                <CCol>
                  <CFormInput
                    value={processo?.nacionalidade}
                    label="Nacionalidade" size="sm">
                  </CFormInput>
                </CCol>
                <CCol md={3}>
                  <CFormInput type="text"
                    value={processo?.genero}

                    label="Genero" size="sm">

                  </CFormInput>
                </CCol>
                <CCol>
                  <CFormInput
                    value={processo?.estadoCivil}
                    label="Estado Civil" size="sm">
                  </CFormInput>
                </CCol>
              </CRow>



            </CForm>
          </SimpleCard>
        </CCol>
        <CCol md={3}>
          <CAccordion color="info" activeItemKey={2}>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader><H3>Documentos ({ficheiros?.length + 1}) </H3> <FolderOpen></FolderOpen></CAccordionHeader>
              <CAccordionBody>
                < CListGroup >
                  <CListGroupItem>
                    [1]  <a target="blank" href={tecnico?.avatar?.url}><Folder color={"info"}></Folder></a>
                  </CListGroupItem>
                </CListGroup >
                {

                  ficheiros?.map((doc, index) => (
                    <>
                      < CListGroup >
                        <CListGroupItem>                        [{index + 2}]  <a target="blank" href={doc?.url}><Folder color={index % 2 == 0 ? "warning" : "info"}></Folder></a>
                        </CListGroupItem>
                      </CListGroup>{

                      }

                    </ >
                  ))}
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCol >

      </CRow >
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