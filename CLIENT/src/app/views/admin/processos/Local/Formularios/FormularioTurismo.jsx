import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Phone, Title } from "@mui/icons-material";

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CHeaderDivider,
  CInputGroup,
  CInputGroupText,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";

export default function FormularioTurismo() {
  const addProcessoShema = z.object({
    nome: z.string().min(1, { message: "Este campo é obrigatorio" }),
    passaporte: z.string(),
    contacto: z.object({
      telefone: z.coerce
        .number({ message: "Telefone Incorrecto" })
        .min(9, { message: "Este campo é obrigatorio" }),
      email: z.string().min(1, { message: "Este campo é obrigatorio!" }),
    }),
    enderecoAngola: z.object({
      provincia: z.string().min(5, { message: "Este campo é obrigatorio" }),
      cidade: z.string().min(5, { message: "Este campo é obrigatorio" }),
    }),
    nacionalidade: z.string().min(5, { message: "Este campo é obrigatorio" }),
    estadoCivil: z.coerce
      .string()
      .min(5, { message: "Este campo é obrigatorio" }),
    genero: z.string().min(5, { message: "Este campo é obrigatorio" }),
    codigoPostal: z.string().min(5, { message: "Este campo é obrigatorio" }),
    dataNascimento: z.coerce.date(),

    enderecoOrigem: z.object({
      provincia: z.string().min(5, { message: "Este campo é obrigatorio" }),
      cidade: z.string().min(5, { message: "Este campo é obrigatorio" }),
    }),
    paisNascimento: z.string().min(2, { message: "Este campo é obrigatorio" }),
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addProcessoShema),
    shouldFocusError: true,
    progressive: true,
  });

  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [processo, setProcesso] = useState({});
  const [tipoDocumento, setTipoDocumento] = useState({});
  const [anexos, setAnexos] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [erroFile, setErroFile] = useState("");
  const redirectTo = useNavigate();
  const [documentos, setDocumentos] = useState([
    { nome: "Bilhete de identidade" },
    { nome: "Passa Porte" },
    { nome: "Curriculumn Profissional" },
  ]);

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
        (event.target.files[0].tipoId = 1),
          (event.target.files[0].tipoId = 1),
          setAnexos((prev) => [...prev, event.target.files[0]]);
        setError("");
      }
    }
  };

  //   const handleFileChange = (event, index) => {
  //     const fileSize = event.target.files[0].size; // Tamanho do arquivo em bytes
  //     const maxSize = 2 * 1024 * 1024;
  //     console.log("SIZE", fileSize, maxSize);
  //     if (fileSize < maxSize) {
  //       setErroFile("O tamanho deve ser menor que", maxSize);
  //       console.log("SIZE", fileSize);
  //       return;
  //     }
  //   };

  console.log("FILLLLES", anexos);

  async function PostFile() {
    const formData = new FormData();
    console.log("RECE", anexos[0]);
    formData.append("anexo", anexos);

    const newFile = await api
      .add("upload/dono/1/tipo/1/processo/2", formData)
      .then((response) => {
        console.log("FILES", response);

        setAnexos(response.data);

        if (response.status !== 201) {
          NotifyError(response.data?.message);
        }
        if (response.status === 201) {
          Notify(response.data?.message);
        }
      })
      .catch((erro) => NotifyError("Erro Temporario no servidor!"));
  }

  async function buscarTipoDocumento() {
    await api.list("tipodocumentos").then((response) => {
      if (response.status === 200) {
        setAnexos((prev) => response.data);
      }
    });
  }
  async function PostData(data) {
    await PostFile();
    const response = await api
      .add("processos", data)
      .then((response) => {
        if (response.status !== 201) {
          const { data } = response;
          console.log("DATA", data);
          NotifyError(response?.data?.message);
        }
        if (response.status === 201) {
          Notify(response?.data?.message);
        }
      })
      .catch(() => {
        NotifyError("Älgo deu Errado");
      });
  }
  const [documents, setDocuments] = useState([
    { id: 1, name: "Carta de apresentação" },
    { id: 2, name: "Passaporte" },
    { id: 3, name: "Fotografia" },
    { id: 4, name: "Contrato de trabalho" },
    { id: 5, name: "Compromisso de honra" },
    { id: 6, name: "Registo Criminal" },
    { id: 7, name: "Atestado Médico" },
    { id: 8, name: "Currículumn Vitae" },
    { id: 9, name: "Certificado de Habilitação" },
    { id: 10, name: "Certificado de Vacinação da Febre Amarela" },
  ]);
  const renderInputGroups = () => {
    const groups = [];
    // Loop para criar os grupos de dois documentos
    for (let i = 0; i < documents.length; i += 2) {
      const group = (
        <CRow key={i} className="mb-4">
          {/* Input para o primeiro documento */}
          <CCol>
            {documents[i].name}
            <CInputGroup className="mb-6 position-relative">
              <CFormInput
                formEncType="multipart/form-data"
                text=""
                aria-describedby="exampleFormControlInputHelpInline"
                itemRef={`document-${documents[i].id}`}
                id={`document-${documents[i].id}`}
                key={`document-${documents[i].id}`}
                htmlFor={`document-${documents[i].id}`}
                accept="image/png, image/jpeg, application/pdf"
                type="file"
                required
                onChange={handleFileChange}
              />
            </CInputGroup>
          </CCol>
          {/* Verifica se existe um segundo documento no grupo */}
          {i + 1 < documents.length && (
            <>
              {/* Input para o segundo documento */}
              <CCol className="mb-4">
                {documents[i + 1].name}
                <CInputGroup className="mb-6 position-relative">
                  <CFormInput
                    formEncType="multipart/form-data"
                    text=""
                    aria-describedby="exampleFormControlInputHelpInline"
                    id={`document-${documents[i + 1].id}`}
                    key={`document-${documents[i + 1].id}`}
                    htmlFor={`document-${documents[i + 1].id}`}
                    accept="image/png, image/jpeg, application/pdf"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
                </CInputGroup>
              </CCol>
            </>
          )}
        </CRow>
      );

      groups.push(group);
    }
    return groups;
  };
  const styleInput = {};
  return (
    <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
      <Box pt={2}></Box>
      <SimpleCard
        title={" FORMULARIO DE PEDIDO DE VISTO  DE TURISMO"}
        subtitle={"DADOS PESSOAIS"}
        item
        lg={6}
        md={6}
        sm={12}
        xs={12}
        sx={{ mt: 2 }}
      >
        <Box pt={3}></Box>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              type="text"
              label="Nome Completo"
              aria-label="Antonio Machado"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nome && (
                  <div className="text-light bg-danger">
                    {errors.nome.message}
                  </div>
                )
              }
              {...register("nome")}
            />
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CFormSelect
              id="genero"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.generos && (
                  <div className="text-light bg-danger">
                    {errors.generos.message}
                  </div>
                )
              }
              label="Genero"
              required
              {...register("genero")}
            >
              <option disabled>Genero</option>
              {[{ name: "Masculino" }, { name: "Femenino" }].map((estado) => (
                <option key={estado.name}>{estado.name}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol>
            <CFormSelect
              id="estadoCivil"
              required
              {...register("estadoCivil")}
              label="Estado Civil"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.estadoCivil && (
                  <div className="text-light bg-danger">
                    {errors.estadoCivil.message}
                  </div>
                )
              }
              {...register("dataValidadeDocumentoIdentificacao")}
            >
              <option disabled>Selecione</option>
              {[{ name: "Soltero(a)" }, { name: "Casado(a)" }].map((estado) => (
                <option value={estado.name} key={estado.name}>
                  {estado.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol>
            <CFormSelect
              label="Nacionalidade"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nacionalidade && (
                  <div className="text-light bg-danger">
                    {errors.nacionalidade.message}
                  </div>
                )
              }
              required
              {...register("nacionalidade")}
            >
              <option disabled>Nacionalidade</option>
              {listaPais?.map((pais) => (
                <option value={pais.name} key={pais.name}>
                  {pais.name}
                </option>
              ))}
            </CFormSelect>
            {errors.nacionalidade && (
              <div className="text-light bg-danger">
                {errors.nacionalidade.message}
              </div>
            )}
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <CFormSelect
              id="paisNascimento"
              label="País de Nascimento"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.paisNascimento && (
                  <div className="text-light bg-danger">
                    {errors.paisNascimento.message}
                  </div>
                )
              }
              required
              {...register("paisNascimento")}
            >
              <option disabled>selecione</option>
              {listaPais?.map((pais) => (
                <option value={pais.name} key={pais.name}>
                  {pais.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol sm={3}>
            <CFormInput
              type="text"
              {...register("municipioNascimento")}
              label="Natural de ..."
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.municipioNascimento && (
                  <div className="text-light bg-danger">
                    {errors.municipioNascimento.message}
                  </div>
                )
              }
            />
          </CCol>
          <CCol sm={3}>
            <CFormInput
              type="text"
              {...register("provinciaNascimento")}
              label="Prov]incia de ..."
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.provinciaNascimento && (
                  <div className="text-light bg-danger">
                    {errors.provinciaNascimento.message}
                  </div>
                )
              }
            />
          </CCol>
          <CCol>
            <CFormInput
              type="date"
              label="Data de Nascimento"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.dataNascimento && (
                  <div className="text-light bg-danger">
                    {errors.dataNascimento.message}
                  </div>
                )
              }
              {...register("dataNascimento")}
            />
          </CCol>
        </CRow>
      </SimpleCard>

      <Box pt={1}></Box>
      <SimpleCard title={"FILHAÇÃO"} className="mt-4">
        <CRow>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"pai"}
              id="pai"
              aria-label=" fd"
              label="Nome do Pai"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors?.pai && (
                  <div className="text-light bg-danger">
                    {errors?.pai.message}
                  </div>
                )
              }
              {...register("pai")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              id="mae"
              ref={"mae"}
              aria-label="fds"
              label="Nome Da Mãe"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.mae && (
                  <div className="text-light bg-danger">
                    {errors.mae?.message}
                  </div>
                )
              }
              {...register("enderecoAngola.cidade")}
            />
          </CCol>
        </CRow>
      </SimpleCard>
      <Box pt={1}></Box>
      <SimpleCard title={"DADOS DO PASSAPORTE"}>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              type="text"
              {...register("passaporte")}
              label="Passaporte Nº"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte && (
                  <div className="text-light bg-danger">
                    {errors.passaporte.message}
                  </div>
                )
              }
            />
          </CCol>
          <CCol sm={3}>
            <CFormSelect
              label="Local  de Emissão"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.localEmissaoPassaporte && (
                  <div className="text-light bg-danger">
                    {errors.localEmissaoPassaporte.message}
                  </div>
                )
              }
              required
              {...register("localEmissaoPassaporte")}
            >
              <option disabled></option>
              {listaPais?.map((pais) => (
                <option value={pais.name} key={pais.name}>
                  {pais.name}
                </option>
              ))}
            </CFormSelect>
            {errors.localEmissaoPassaporte && (
              <div className="text-light bg-danger">
                {errors.localEmissaoPassaporte.message}
              </div>
            )}
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              type="date"
              aria-label="dataEmissaoPassaporte"
              label="Data de Emissão"
              id="dataEmissaoPassaporte"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.dataEmissaoPassaporte && (
                  <div className="text-light bg-danger">
                    {errors.dataEmissaoPassaporte.message}
                  </div>
                )
              }
              {...register("dataEmissaoPassaporte")}
            />
          </CCol>
          <CCol>
            <CFormInput
              type="date"
              aria-label="dataValiidadePassaporte"
              label="Data de validade"
              id="dataValiidadePassaporte"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.dataValiidadePassaporte && (
                  <div className="text-light bg-danger">
                    {errors.dataValiidadePassaporte.message}
                  </div>
                )
              }
              {...register("dataValiidadePassaporte")}
            />
          </CCol>
        </CRow>
      </SimpleCard>
      <Box pt={1}></Box>

      <Box pt={1}></Box>
      <SimpleCard className="mt-4">
        <H3 className="mb-4"> ENDEREÇO NO EM ANGOLA</H3>
        <CRow>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"opro"}
              id="we3"
              aria-label=" fd"
              label="Província/Estado"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.enderecoAngola?.provincia && (
                  <div className="text-light bg-danger">
                    {errors.enderecoAngola?.provincia.message}
                  </div>
                )
              }
              {...register("enderecoAngola.provincia")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              id="23"
              ref={"ocity"}
              aria-label="fds"
              label="Província/Estado"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.enderecoAngola?.cidade && (
                  <div className="text-light bg-danger">
                    {errors.enderecoAngola?.cidade?.message}
                  </div>
                )
              }
              {...register("enderecoAngola.cidade")}
            />
          </CCol>
        </CRow>
      </SimpleCard>
      <Box pt={1}></Box>
      <SimpleCard title={"CONTACTOS"}>
        <CRow className="mb-4">
          <CCol>
            <CInputGroup className="mb-6 position-relative">
              <CInputGroupText id="n3come">
                <Phone></Phone>
              </CInputGroupText>

              <CFormInput
                type="number"
                aria-label="telefone"
                placeholder="Telefone"
                aria-describedby="n3ome"
                {...register("contacto.telefone")}
              />
            </CInputGroup>
            {errors.contacto?.telefone && (
              <div className="text-light bg-danger">
                {errors.contacto?.telefone.message}
              </div>
            )}
          </CCol>
          <CCol className="mb-4">
            <CInputGroup className="mb-6 position-relative">
              <CInputGroupText id="n3come">
                <Email></Email>
              </CInputGroupText>
              <CFormInput
                type="email"
                placeholder="Email"
                aria-label="email"
                aria-describedby="n3ome"
                {...register("contacto.email")}
              />
            </CInputGroup>
            {errors.contacto?.email && (
              <div className="text-light bg-danger">
                {errors.contacto?.email.message}
              </div>
            )}
          </CCol>
        </CRow>
      </SimpleCard>
      <Box pt={1}></Box>
      <SimpleCard>
        <H3 className="mb-2"> UPLOD DOS DOCUMENTOS</H3>
        <Paragraph className="mb-4 text-warning">
          Tamanho máximo: 5MB | Formato : PDF , PNG, TTF, JPEG
        </Paragraph>
        <hr className="mb-8"></hr>
        {renderInputGroups()}
      </SimpleCard>
      <Box pt={1}></Box>
      <SimpleCard title="">
        <CButton
          type="submit"
          className="text-white px-4 w-100"
          color="success"
        >
          Salvar
        </CButton>
      </SimpleCard>
    </CForm>
  );
}
