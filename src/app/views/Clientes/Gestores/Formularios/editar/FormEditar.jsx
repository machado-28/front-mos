import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Password, Phone, Title } from "@mui/icons-material";

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
import { useEffect } from "react";

export default function FormEditar() {
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
    consulado: z
      .string()
      .regex(validatePersonNames, "incorrecto")
      .refine(
        (name) => {
          return capitalize(name);
        },
        { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
      ),
    nacionalidade: z.coerce.string(),
    estadoCivil: z.coerce.string().min(5, { message: "Este campo é obrigatorio" }),
    genero: z.string(),
    dataNascimento: z.coerce.date().refine(
      (date) => {
        return calcularIdade(date) >= 18;
      },
      { message: "ainda eh menor de idade" }
    ),
    filiacao: z.object({
      mae: z.object({
        nome: z
          .string()
          .regex(validatePersonNames, "nome incorrecto")
          .refine(
            (name) => {
              return capitalize(name);
            },
            { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
          ),
        nacionalidade: z.string()
      }),

      pai: z.object({
        nome: z
          .string()
          .regex(validatePersonNames, "nome incorrecto")
          .refine(
            (name) => {
              return capitalize(name);
            },
            { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
          ),
        nacionalidade: z.string()
      }),
    }),
    passaporte: z.object({
      numero: z.string().regex(validatePassporte, "Passaporte invalido!").max(9),
      localEmissao: z.string(),
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
      email: z.string().email("insira um email válido!").min(1, { message: "Este campo é obrigatorio!" })
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
      cidade: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      comuna: z
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
    profissionalismo: z.object({
      profissao: z.string().min(5),
      funcao: z.string().min(5),
      nomeEmpresa: z.string().min(5),
      emailEmpresa: z.string().email("insira um email válido").min(5),
      telefoneEmpresa: z.string().min(5),
      enderecoEmpresa: z.string().min(5),
    }).required(),
    senha: z
      .string().min(6, "a Senha deve ser no mínimo 6 caracteres")

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
    defaultValues: {
      nome: "Machado"
    }
  });

  if (errors) console.log("ERRO", errors);
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

  async function PostFile({
    file,
    numeroPassaporte,
    emissora,
    requerenteId,
    passaporte,
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
            `upload?emissora=${emissora}&dataValidade=${dataValidade}&dataEmissao=${dataEmissao}&requerenteId=${requerenteId}&passaporte=${passaporte}&tipoId=${file.tipoId}&numero=${numeroPassaporte}`,
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
            `upload?requerenteId=${requerenteId}&passaporte=${passaporte}&tipoId=${file.tipoId}`,
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
  const { passaporte } = useParams();

  const buscarCliente = async () => {
    await api.listQuery(`clientes/${passaporte}`).then((res) => {
      setCliente(res?.data?.cliente)
    }).catch(error => {
      console.log(error);
      NotifyError("Erro ao buscar o Cliente")
    });
  }

  useEffect(() => {
    buscarCliente()
  }, [passaporte])

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.edit(`clientes/${passaporte}`, dados).then(async (response) => {

        const { data } = response
        console.log("RESPOSTA SUCESSO", response);
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

  const styleInput = {};
  return (
    <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
      <Box pt={4}></Box>
      <LoadingButton
        className="text-white px-4 w-100"
        color="success"
        type="submit"
        loading={loading}
        variant="contained"

      >
        Salvar
      </LoadingButton>
      <SimpleCard

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
              label="  consulado"
              aria-label=" "
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.consulado && (
                  <div className="text-light bg-danger">{errors.consulado.message}</div>
                )
              }
              {...register("  consulado")}
            />
          </CCol>
        </CRow>
        <CRow>
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
                errors?.filiacao?.pai?.nome && (
                  <div className="text-light bg-danger">{errors?.filiacao?.pai?.nome?.message}</div>
                )
              }
              {...register("filiacao.pai.nome")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              id="pai"
              aria-label=" fd"
              label="Nacionalidade (pai)"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors?.filiacao?.pai?.nacionalidade && (
                  <div className="text-light bg-danger">{errors?.filiacao?.pai?.nacionalidade?.message}</div>
                )
              }
              {...register("filiacao.pai.nacionalidade")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              aria-label="fds"
              label="Nome Da Mãe"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.filiacao?.mae?.nome && (
                  <div className="text-light bg-danger">{errors.filiacao?.mae?.nome?.message}</div>
                )
              }
              {...register("filiacao.mae.nome")}
            />
            <CFormInput
              type="text"
              aria-label="fds"
              label="Nacionalidade (Mãe)"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.filiacao?.mae?.nacionalidade && (
                  <div className="text-light bg-danger">{errors.filiacao?.mae?.nacionalidade?.message}</div>
                )
              }
              {...register("filiacao.mae.nacionalidade")}
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
            <CFormInput
              type="text"
              label="Local  de Emissão"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.passaporte?.localEmissao && (
                  <div className="text-light bg-danger">{errors.passaporte?.localEmissao?.message}</div>
                )
              }
              required
              {...register("passaporte.localEmissao")}
            />

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

      <SimpleCard className="mt-4">
        <H3 className="mb-4"> DADOS PROFISSIONAIS</H3>
        <CRow>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"profissao"}
              id="profissao"
              aria-label="profissao"
              label="Profisão"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.profissao && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.profissao.message}
                  </div>
                )
              }
              {...register("profissionalismo.profissao")}
            />
          </CCol>

          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"funcao"}
              id="funcao"
              aria-label="funcao"
              label="Função"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.funcao && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.funcao.message}
                  </div>
                )
              }
              {...register("profissionalismo.funcao")}
            />
          </CCol>

        </CRow>
        <CRow>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"nomeEmpresa"}
              id="nomeEmpresa"
              aria-label="nomeEmpresa"
              label="Empresa"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.nomeEmpresa && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.nomeEmpresa?.message}
                  </div>
                )
              }
              {...register("profissionalismo.nomeEmpresa")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"emailEmpresa"}
              id="emailEmpresa"
              aria-label="emailEmpresa"
              label="email da empresa"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.emailEmpresa && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.emailEmpresa?.message}
                  </div>
                )
              }
              {...register("profissionalismo.emailEmpresa")}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"telefoneEmpresa"}
              id="telefoneEmpresa"
              aria-label="telefoneEmpresa"
              label="Telefone da Empresa"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.telefoneEmpresa && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.telefoneEmpresa?.message}
                  </div>
                )
              }
              {...register("profissionalismo.telefoneEmpresa")}
            />
          </CCol>
          <CCol className="mb-4">
            <CFormInput
              type="text"
              ref={"enderecoEmpresa"}
              id="enderecoEmpresa"
              aria-label="enderecoEmpresa"
              label="Endereço da Empresa"
              placeholder="Angola,Luanda,av 1 ed A, andar 23"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.profissionalismo?.enderecoEmpresa && (
                  <div className="text-light bg-danger">
                    {errors.profissionalismo?.enderecoEmpresa?.message}
                  </div>
                )
              }
              {...register("profissionalismo.enderecoEmpresa")}
            />
          </CCol>
        </CRow>
      </SimpleCard>
      <SimpleCard className="mt-4">
        <H3 className="mb-4"> HOSPEDAGEM EM ANGOLA</H3>
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
              label="Comuna"
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.enderecoAngola?.comuna && (
                  <div className="text-light bg-danger">
                    {errors.enderecoAngola?.comuna?.message}
                  </div>
                )
              }
              {...register("enderecoAngola.comuna")}
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
        <CRow>
          <CCol className="mb-4">
            <CInputGroup className="mb-6 position-relative">
              <CInputGroupText id="senha">
                <Password></Password>
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Senha"
                aria-label="Senha"
                aria-describedby="senha"
                {...register("senha")}
              />
            </CInputGroup>
            {errors?.senha && (
              <div className="text-light bg-danger">{errors?.senha?.message}</div>
            )}
          </CCol>
        </CRow>
      </SimpleCard>
    </CForm>
  );
}
