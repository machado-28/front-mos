import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, H4, H5, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Folder, FolderCopySharp, Password, Phone, Title } from "@mui/icons-material";

import {
  CAlert,
  CBadge,
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,

  CInputGroup,
  CListGroup,
  CListGroupItem,
  CRow,

} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate, useParams } from "react-router-dom";
import { functions, min, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";
import {
  ValidateData,
  calcularIdade,
  capitalize,
  validatePassporte,
  validatePersonNames
} from "app/utils/validate";
import { LoadingButton } from "@mui/lab";
import FormularioCurtaduracao from "./FormularioCurtaDuracao";
import FormularioTrabalho from "./FormularioTrabalho";
import FormularioFronteira from "./FormularioFronteira";
import FormularioTurismo from "./FormularioTurismo";
import useAuth from "app/hooks/useAuth";
import { Tecnico } from "../../tecnico/util";
import { useEffect } from "react";
import curtaDuracaoShema from "./schemas/curtaDuracaoShema";

export default function FormAdd() {


  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(curtaDuracaoShema),
    shouldFocusError: true,
    progressive: true
  });
  const api = useApi();
  const [anexos, setAnexos] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [erroFile, setErroFile] = useState("");

  const formatFileSize = (sizeInBytes) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      // Convertendo bytes para kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > 2048) {
        // 2MB em KB
        setError("O arquivo não pode ter mais de 2MB.");
      } else {
        setFileSize(fileSizeInKB);
        (event.target.files[0].tipoId = Number(event.target.id)),
          (event.target.files[0].tipoId = Number(event.target.id)),
          setAnexos((prev) => [...prev, event.target.files[0]]);
        setError("");
      }
    }
  };
  let { clienteId, gestorId } = useParams();
  const { user } = useAuth();

  let gestorInternoId = undefined;
  let gestorExternoId = undefined;

  if (user.clienteId) {
    clienteId = user?.clienteId
    gestorExternoId = gestorId;

  }
  else {
    gestorInternoId = gestorId;
    gestorExternoId = gestorId;
  }
  const tecnicoClass = new Tecnico()
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSelected, setTecnicoSelected] = useState({});
  const [imagePreview, setImagePreview] = useState("https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Free-PNG-Clip-Art.png")

  async function buscarTecnicos() {
    let tecni = await tecnicoClass.buscarTodos({ clienteId });
    setTecnicos(prev => tecni);
  }

  useEffect(() => {
    buscarTecnicos();
  }, [

  ]);

  function handleTecnico(e) {
    setTecnicoSelected(prev => tecnicos.filter((tec) => tec?.id == e?.target?.value)[0]);
  }

  async function PostFile({
    file,
    numeroPassaporte,
    emissora,
    requerenteId,
    clienteId,
    dataValidade,
    dataEmissao
  }) {
    const formData = new FormData();
    console.log("ANEXOS", file);
    formData.append("anexo", file);


    try {
      console.log("FICHEIROS ID", file.tipoId);
      if (file.tipoId === 1) {
        const response = await api
          .add(
            `upload?emissora
                        =${emissora}
                        &dataValidade=
                        ${dataValidade}
                        &dataEmissao=
                        ${dataEmissao}
                        &requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}
                        &numero=${numeroPassaporte}`,
            formData
          )
          .catch(({ error }) => {
            NotifyError("Erro ao enviar o arquivo:", error);

          });
        console.log("Resposta do servidor:", response.data);
      }
      else {
        const response = await api
          .add(
            `upload?requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}`,
            formData
          )
          .catch(({ error }) => {
            NotifyError("Erro ao enviar o arquivo:", error);
          });
        console.log("Upoad message:", response.data);
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }

  async function sendFile({ anexos, cliente, data }) {
    for (let i = 0; i < anexos?.length; i++) {
      console.log("FICHEIROS", anexos[i]);
      await PostFile({
        file: anexos[i],
        clienteId: cliente?.id,
        requerenteId: cliente?.id,
        numeroPassaporte: data?.passaporte?.numero,
        dataEmissao: data?.passaporte?.dataEmissao,
        dataValidade: data?.passaporte?.dataValidade,
        emissora: data?.passaporte?.emissora
      });
    }
  }

  const FormTecnico = () => {
    return (
      <>

      </>
    )
  }

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.add("clientes", dados).then(async (response) => {

        const { data } = response
        console.log("RESPOSTA SUCESSO", response);
        setLoading(false);
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);

    }
  }
  const [tipoVistoId, setTipoVistoId] = useState("1");
  const renderForm = () => {
    console.log("ID", tipoVistoId);
    switch (tipoVistoId) {
      case "1":
        return (
          <FormularioCurtaduracao>

          </FormularioCurtaduracao>
        )
        break;

      case "2":
        return (
          <FormularioTrabalho></FormularioTrabalho>
        )
        break;
      case "3":
        return (
          <FormularioFronteira></FormularioFronteira>
        )
        break;
      case "4":
        return (
          <FormularioTurismo></FormularioTurismo>
        )
        break;

      default:
        break;
    }
  }

  const styleInput = {};
  return (
    <CCallout>
      <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
        <div className="w-100 d-flex  justify-content-between">
          <H3 color={"info"}> Curta Duração  </H3>

          <div className="d-flex">

            <LoadingButton
              className="text-white px-4 "
              color="success"
              type="submit"
              loading={loading}
              variant="contained"

            >
              Salvar
            </LoadingButton>
          </div>

        </div><Box pt={4}></Box>
        <CCallout>
          <div>
            <img src={tecnicoSelected?.avatar?.url || imagePreview} id="image" style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

            <CRow className="mt-4">

              <CCol>
                <CFormSelect
                  label="Beneficiário"
                  aria-describedby="exampleFormControlInputHelpInline"
                  text={
                    errors.beneficiarioId && (
                      <div className="text-light bg-danger">{errors.beneficiarioId.message}</div>
                    )
                  }
                  required
                  {...register("beneficiarioId")}
                  onChange={handleTecnico}
                >
                  <option selected aria-readonly>selecione o benediciário</option>
                  {tecnicos?.map((tec, index) => (
                    <option value={tec?.id} key={index}>
                      {tec.nome}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  label="Categoria"
                  aria-describedby="exampleFormControlInputHelpInline"
                  text={
                    errors.tipoId && (
                      <div className="text-light bg-danger">{errors.tipoId.message}</div>
                    )
                  }
                  required
                  {...register("tipoId")}
                >
                  <option selected aria-readonly>selecione a categoria</option>
                  {[{ name: "1 vez", value: 1 }, { value: 2, name: "prorrogação" }]?.map((tipo) => (
                    <option value={tipo.value} key={tipo.name}>
                      {tipo.name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.tipoId && (
                  <div className="text-light bg-danger">{errors.tipoId.message}</div>
                )}
              </CCol>

            </CRow>

          </div>
        </CCallout>
        <Box pt={4}></Box>


        <CRow className="mb-4 mt-4">
          <CCol md="1">
            <CFormInput
              type="text"
              size="sm"

              label="ID"
              aria-describedby="exampleFormControlInputHelpInline"
              disabled
              value={tecnicoSelected?.id}

            />
          </CCol>
          <CCol  >
            <CFormInput
              type="text"
              size="sm"
              readOnly
              label="Nome do beneficiário"

              value={tecnicoSelected?.nome}
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

              value={tecnicoSelected?.telefone}
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
              value={tecnicoSelected?.email}
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
              type="date"
              size="sm"

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
              type="date"
              size="sm"

              label="Data de validade"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.dataValidade && (
                  <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                )
              }
              required
              {...register("passaporte.dataValidade")}
            >

            </CFormInput>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CFormInput text={
              errors.consulado && (
                <div className="text-light bg-danger">{errors.consulado.message}</div>
              )
            }
              required
              {...register("consulado")} label="ConsuladoF" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput text={
              errors.funcao && (
                <div className="text-light bg-danger">{errors.funcao.message}</div>
              )
            }
              required
              {...register("funcao")} label="Função" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput type="date" text={

              errors.mob && (
                <div className="text-light bg-danger">{errors.mob.message}</div>
              )
            }
              required
              {...register("mob")} label="Data estimada de Chegada" size="sm">

            </CFormInput>
          </CCol>
          <CCol>
            <CFormInput text={
              errors.localProjecto && (
                <div className="text-light bg-danger">{errors.localProjecto.message}</div>
              )
            }
              required
              {...register("localProjecto")} label="Local do projecto" size="sm">

            </CFormInput>
          </CCol>
        </CRow>
        <Box pt={2}></Box>


        <H3>Documentos necessários</H3>
        <CAlert color="info">
          {
            [" Cópia do Passaporte (Formato PDF ou JPEG) *"].map((doc, index) => (
              <CListGroup>

                <CListGroupItem key={index + 1} className="d-flex justify-content-between align-items-center">
                  {doc}
                  <CBadge color="primary" shape="rounded-pill">
                    obrigatorio
                  </CBadge>

                </CListGroupItem>
              </CListGroup>
            ))}

        </CAlert>
        <H5 className="mb-2"> UPLOD DOS DOCUMENTOS</H5>
        <Paragraph className="mb-4 text-info">
          Tamanho máximo: 5MB | Formato : PDF, JPEG
        </Paragraph>
        <hr className="mb-8"></hr>
        <Box pt={1}></Box>

        <CCol>
          <CInputGroup className="mb-6 position-relative">
            <CFormInput
              formEncType="multipart/form-data"
              text=""
              aria-describedby="exampleFormControlInputHelpInline"
              accept="image/jpeg, application/pdf"
              type="file"
              required

            />
          </CInputGroup>
        </CCol>

      </CForm>
    </CCallout>
  );
}