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
  CTabPane
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
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

export default function FormularioTrabalho() {
  const validadeDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });

  const addProcessoShema = z.object({
    nome: z
      .string()
      .min(1, { message: "Este campo é obrigatorio" })
      .regex(validatePersonNames, "nome incorrecto")
      .refine(
        (name) => {
          return capitalize(name);
        },
        { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
      ),
    sindicato: z
      .string()
      .regex(validatePersonNames, "incorrecto")
      .refine(
        (name) => {
          return capitalize(name);
        },
        { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
      ),
    projecto: z.string().refine(
      (name) => {
        return capitalize(name);
      },
      { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
    ),
    nacionalidade: z.string().min(5, { message: "Este campo é obrigatorio" }),
    estadoCivil: z.coerce.string().min(5, { message: "Este campo é obrigatorio" }),
    genero: z.string().min(5, { message: "Este campo é obrigatorio" }),
    dataNascimento: z.coerce.date().refine(
      (date) => {
        return calcularIdade(date) >= 18;
      },
      { message: "ainda eh menor de idade" }
    ),

    passaporte: z.object({
      numero: z.string().regex(validatePassporte, "Passaporte invalido!").max(9),
      emissora: z.string(),
      dataEmissao: z.coerce
        .date()
        .max(validadeDate({ date: new Date() }), "data de emissão invalida!"),
      dataValidade: z.coerce.date().refine(
        (date) => {
          return date >= seisMesesNoFuturo;
        },
        { message: "o passaporte de ter pelo meno 6 meses de validade!" }
      )
    }),
    contacto: z.object({
      telefone: z.coerce
        .number({ message: "Telefone Incorrecto" })
        .min(9, { message: "Este campo é obrigatorio" }),
      email: z.string().min(1, { message: "Este campo é obrigatorio!" })
    }),

    enderecoAngola: z.object({
      provincia: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      municipio: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      cidade: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        )
    }),
    nascimento: z.object({
      pais: z
        .string()
        .min(1, "campo obrigatorio")
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      provincia: z
        .string()
        .min(1, "campo obrigatorio")
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      municipio: z
        .string()
        .min(1, "campo obrigatorio")
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      bairro: z
        .string()
        .min(1, "campo obrigatorio")
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        )
    }),
    filiacao: z.object({
      mae: z
        .string()
        .regex(validatePersonNames, "nome incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      pai: z
        .string()
        .regex(validatePersonNames, "nome incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        )
    })
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addProcessoShema),
    shouldFocusError: true,
    progressive: true
  });

  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [processo, setProcesso] = useState({});
  const [tipoDocumento, setTipoDocumento] = useState({});
  const [anexos, setAnexos] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [erroFile, setErroFile] = useState("");
  const redirectTo = useNavigate();

  const [documentos, setDocumentos] = useState([
    { nome: "Bilhete de identidade" },
    { nome: "Passa Porte" },
    { nome: "Curriculumn Profissional" }
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
        (event.target.files[0].tipoId = 1),
          (event.target.files[0].tipoId = 1),
          setAnexos((prev) => [...prev, event.target.files[0]]);
        setError("");
      }
    }
  };

  async function PostFile({
    file,
    numeroPassaporte,
    emissora,
    requerenteId,
    pedidoId,
    dataValidade,
    dataEmissao
  }) {
    const formData = new FormData();
    console.log("ANEXOS", file);
    formData.append("anexo", file);

    console.log("Form DATa", file.tipoId);
    try {
      // Envia a requisição POST para a URL com o arquivo e o tipoId
      if (file.tipoId === 1) {
        const response = await api
          .add(
            `upload?emissora=${emissora}&dataValidade=${dataValidade}&dataEmissao=${dataEmissao}&requerenteId=${requerenteId}&pedidoId=${pedidoId}&tipoId=${file.tipoId}&numero=${numeroPassaporte}` +
              file.tipoId,
            formData
          )
          .catch(({ error }) => {
            NotifyError("Erro ao enviar o arquivo:", error);
          });
        console.log("Resposta do servidor:", response.data);
      }
      const response = await api
        .add(
          `upload?requerenteId=${requerenteId}&pedidoId=${pedidoId}&tipoId=${file.tipoId}&tipoId=${file.tipoId}` +
            file.tipoId,
          formData
        )
        .catch(({ error }) => {
          NotifyError("Erro ao enviar o arquivo:", error);
        });
      console.log("Upoad message:", response.data);
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }
  async function buscarTipoDocumento() {
    await api.list("tipodocumentos").then((response) => {
      if (response.status === 200) {
        setAnexos((prev) => response.data);
      }
    });
  }
  async function sendFile({ anexos, pedido, data }) {
    for (let i = 0; i < anexos?.length; i++) {
      console.log("FICHEIROS", anexos[i]);
      await PostFile({
        file: anexos[i],
        pedidoId: pedido?.id,
        requerenteId: pedido?.id,
        numeroPassaporte: data?.passaporte?.numero,
        dataEmissao: data?.passaporte?.dataEmissao,
        dataValidade: data?.passaporte?.dataValidade,
        emissora: data?.passaporte?.emissora
      });
    }
  }

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.add("pedido-emissao/2", dados).then(async (response) => {
        setLoading(false);
        const { data } = response;
        const { pedido } = data;
        if (response.status !== 201) {
          const { data } = response;
          console.log("DATA", data);

          setLoading(false);
          NotifyError(response?.data?.message);
        }
        if (response.status === 201) {
          for (let i = 0; i < anexos?.length; i++) {
            console.log("FICHEIROS", anexos[i]);
            await PostFile({
              file: anexos[i],
              pedidoId: pedido?.id,
              requerenteId: pedido?.id,
              numeroPassaporte: data?.passaporte?.numero,
              dataEmissao: data?.passaporte?.dataEmissao,
              dataValidade: data?.passaporte?.dataValidade,
              emissora: data?.passaporte?.emissora
            });
          }
          setLoading(false);
          Notify(response?.data?.message);
        }
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);
    }
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
    { id: 10, name: "Certificado de Vacinação da Febre Amarela" }
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
        title={" FORMULARIO DE PEDIDO DE VISTO  DE TRABALHO"}
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
                errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
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
                  <div className="text-light bg-danger">{errors.generos.message}</div>
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
                  <div className="text-light bg-danger">{errors.estadoCivil.message}</div>
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
                  <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
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
              <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
            )}
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol>
            <CFormInput
              type="text"
              label="Projecto"
              aria-label=" "
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.projecto && (
                  <div className="text-light bg-danger">{errors.projecto.message}</div>
                )
              }
              {...register("projecto")}
            />
          </CCol>
          <CCol>
            <CFormInput
              type="text"
              label="Sindicato"
              aria-label=" "
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.sindicato && (
                  <div className="text-light bg-danger">{errors.sindicato.message}</div>
                )
              }
              {...register("sindicato")}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CFormSelect
              id="nascimento.pais"
              label="País de Nascimento"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nascimento?.pais && (
                  <div className="text-light bg-danger">{errors.nascimento?.pais?.message}</div>
                )
              }
              required
              {...register("nascimento.pais")}
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
              {...register("nascimento.municipio")}
              label="Natural de ..."
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nascimento?.municipio && (
                  <div className="text-light bg-danger">
                    {errors.nascimento?.municipio?.message}
                  </div>
                )
              }
            />
          </CCol>
          <CCol sm={3}>
            <CFormInput
              type="text"
              id="nascimento.provincia"
              {...register("nascimento.provincia")}
              label="Proviincia de ..."
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nascimento?.provincia && (
                  <div className="text-light bg-danger">{errors.nascimento?.provincia.message}</div>
                )
              }
            />
          </CCol>
          <CCol sm={3}>
            <CFormInput
              type="text"
              id="nascimento.bairro"
              {...register("nascimento.bairro")}
              label="Bairro"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.nascimento?.bairro && (
                  <div className="text-light bg-danger">{errors.nascimento?.bairro.message}</div>
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
                  <div className="text-light bg-danger">{errors.dataNascimento.message}</div>
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
              id="pai"
              aria-label=" fd"
              label="Nome do Pai"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors?.filiacao?.pai && (
                  <div className="text-light bg-danger">{errors?.filiacao?.pai.message}</div>
                )
              }
              {...register("filiacao.pai")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              aria-label="fds"
              label="Nome Da Mãe"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.filiacao?.mae && (
                  <div className="text-light bg-danger">{errors.filiacao?.mae?.message}</div>
                )
              }
              {...register("filiacao.mae")}
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
              {...register("passaporte.numero")}
              label="Passaporte Nº"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors?.passaporte?.numero && (
                  <div className="text-light bg-danger">{errors.passaporte?.numero?.message}</div>
                )
              }
            />
          </CCol>
          <CCol sm={3}>
            <CFormSelect
              label="Local  de Emissão"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.emissora && (
                  <div className="text-light bg-danger">{errors.passaporte?.emissora.message}</div>
                )
              }
              required
              {...register("passaporte.emissora")}
            >
              <option disabled></option>
              {listaPais?.map((pais) => (
                <option value={pais.name} key={pais.name}>
                  {pais.name}
                </option>
              ))}
            </CFormSelect>
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
                errors.passaporte?.dataEmissao && (
                  <div className="text-light bg-danger">
                    {errors.passaporte?.dataEmissao?.message}
                  </div>
                )
              }
              {...register("passaporte.dataEmissao")}
            />
          </CCol>
          <CCol>
            <CFormInput
              type="date"
              aria-label="dataValidadePassaporte"
              label="Data de validade"
              id="dataValidadePassaporte"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.dataValidade && (
                  <div className="text-light bg-danger">
                    {errors.passaporte?.dataValidade?.message}
                  </div>
                )
              }
              {...register("passaporte.dataValidade")}
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
          <CCol className="mb-4">
            <CFormInput
              type="text"
              id="2dd3"
              ref={"ocity"}
              aria-label="fdsd"
              label="Municipio"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.enderecoAngola?.municipio && (
                  <div className="text-light bg-danger">
                    {errors.enderecoAngola?.municipio?.message}
                  </div>
                )
              }
              {...register("enderecoAngola.municipio")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              id="23"
              ref={"ocity"}
              aria-label="fds"
              label="Bairro"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.enderecoAngola?.bairro && (
                  <div className="text-light bg-danger">
                    {errors.enderecoAngola?.bairro?.message}
                  </div>
                )
              }
              {...register("enderecoAngola.bairro")}
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
              <div className="text-light bg-danger">{errors.contacto?.telefone.message}</div>
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
              <div className="text-light bg-danger">{errors.contacto?.email.message}</div>
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
        <LoadingButton
          className="text-white px-4 w-100"
          color="success"
          type="submit"
          loading={loading}
          variant="contained"
          sx={{ my: 2 }}
        >
          Salvar
        </LoadingButton>
      </SimpleCard>
    </CForm>
  );
}
