import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Phone, Title } from "@mui/icons-material";

import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { listaPais } from "app/utils/paises";
import { useEffect } from "react";

export default function FormularioEditPedido({ processoId }) {
  const updateProcessoShema = z.object({
    nome: z.string(),
    passaporte: z.string(),
    contacto: z.object({
      telefone: z.coerce.number({ message: "Telefone Incorrecto" }),

      email: z.string()
    }),
    enderecoAngola: z.object({
      provincia: z.string(),
      cidade: z.string()
    }),
    nacionalidade: z.string(),
    estadoCivil: z.coerce.string(),
    genero: z.string(),

    dataNascimento: z.coerce.date(),

    enderecoOrigem: z.object({
      provincia: z.string(),
      cidade: z.string()
    }),
    paisNascimento: z.string()
  });

  const [processo, setProcesso] = useState({});
  const redirectTo = useNavigate();
  const api = useApi();
  const { id, numero } = useParams();

  const [documentos, setDocumentos] = useState([
    { nome: "Bilhete de identidade" },
    { nome: "Passa Porte" },
    { nome: "Curriculumn Profissional" }
  ]);
  const goto = useNavigate();

  async function BuscarProcesso() {
    const processosEntrados = await api
      .listQuery(`pedido?numero=${numero}`)
      .then((response) => {
        console.log("PEDIDO INDENTIFICADO", response.data);
        setProcesso((prev) => response.data);
        if (response?.data?.status === 200) {
          setProcesso((prev) => response?.data);
        }
        if (response?.data?.status === 404) {
          console.log(response);
          return NotifyError("Erro na conexão a internet");
        }
        if (response?.data?.status === 500) {
          console.log(response);
          redirectTo("/500");
          return NotifyError("erro no servidor ||");
        }
      })
      .catch((err) => {
        console.log(err);
        NotifyError("Erra na conexão a internet");
      });
  }

  useEffect(() => {
    BuscarProcesso();
  }, [processoId]);

  const [initialData, setInitialData] = useState({});

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateProcessoShema),
    shouldFocusError: true,
    progressive: true,
    defaultValues: {}
  });

  if (errors) console.log("ERRO", errors);

  async function buscarTipoDocumento() {
    await api
      .list("tipodocumentos")
      .then((response) => {
        if (response.status === 200) {
          setAnexos((prev) => response.data);
        }
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

  async function PostData(data) {
    const response = await api
      .edit(`processos/${numero}`, data)
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

  return (
    <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
      <Box pt={2}></Box>
      <SimpleCard
        title={`FORMULARIO DE ACTUALIZAÇÃO DO PROCESSO Nº ${numero}`}
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
          <CCol sm={2}>
            <CFormInput
              type="text"
              disabled
              label="CODIGO"
              defaultValue={processo?.numero}
              aria-describedby="exampleFormControlInputHelpInline"
            />
          </CCol>
          <CCol>
            <CFormInput
              type="text"
              label="Nome Completo"
              defaultValue={processo?.requerente?.nome}
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
              defaultValue={processo?.requerente?.genero}
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
              defaultValue={processo?.requerente?.estadoCivil}
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
              defaultValue={processo?.requerente?.nacionalidade}
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

        <CRow>
          <CCol>
            <CFormSelect
              id="paisNascimento"
              label="País de Nascimento"
              aria-describedby="exampleFormControlInputHelpInline"
              defaultValue={processo?.requerente?.paisNascimento}
              text={
                errors.paisNascimento && (
                  <div className="text-light bg-danger">{errors.paisNascimento.message}</div>
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
              defaultValue={processo?.requerente?.municipioNascimento}
              type="text"
              {...register("municipioNascimento")}
              label="Natural de ..."
              aria-describedby="exampleFormControlInputHelpInline"
              text={
                errors.municipioNascimento && (
                  <div className="text-light bg-danger">{errors.municipioNascimento.message}</div>
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
                  <div className="text-light bg-danger">{errors.provinciaNascimento.message}</div>
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
              ref={"pai"}
              id="pai"
              aria-label=" fd"
              label="Nome do Pai"
              aria-describedby="exampleFormControlInputHelpInline"
              defaultValue={processo?.requerente?.nomePai}
              text={
                errors?.pai && <div className="text-light bg-danger">{errors?.pai.message}</div>
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
              text={errors.mae && <div className="text-light bg-danger">{errors.mae?.message}</div>}
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
                  <div className="text-light bg-danger">{errors.passaporte.message}</div>
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
              <div className="text-light bg-danger">{errors.localEmissaoPassaporte.message}</div>
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
                  <div className="text-light bg-danger">{errors.dataEmissaoPassaporte.message}</div>
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
      <SimpleCard title="">
        <CButton type="submit" className="text-white px-4 w-100" color="success">
          Salvar
        </CButton>
      </SimpleCard>
    </CForm>
  );
}
