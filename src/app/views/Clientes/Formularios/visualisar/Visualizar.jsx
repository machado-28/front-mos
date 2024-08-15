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
  CSpinner,
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
import { Cliente } from "../../util";

export default function Visuaizar({ passaporte }) {

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

  const [cliente, setCliente] = useState({});
  const C_cliente = new Cliente();
  const api = useApi();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buscarCliente = async () => {
    setLoading(prev => !prev)
    await C_cliente.buscarUm({ passaporte }).then((clien) => {
      setCliente(clien)
    });
    setLoading(prev => !prev)
  }
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
      nome: cliente?.nome,
      passaporte: {
        numero: cliente?.passaporte,
        dataEmissao: cliente?.passaporteDataEmissao,
        dataValidade: cliente?.passaporteDataValidade,
        passaporteLocalEmissao: cliente?.localEmissao,
      },
      genero: cliente?.genero,
      estadoCivil: cliente?.estadoCvil,
      profissionalismo: {
        profissao: cliente?.profissao,
        funcao: cliente?.funcao,
        empresa: cliente?.empresaNome
      }
    }
  });

  if (errors) console.log("ERRO", errors);


  useEffect(() => {
    buscarCliente()
  }, [passaporte]);

  const styleInput = {};
  return (
    <CForm style={{ borderRadius: "none" }}>
      <Box pt={4}>
        {loading && <CSpinner></CSpinner>}
      </Box>

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
