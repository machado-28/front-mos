import { Box, } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H3, H4, Paragraph } from "app/components/Typography";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Phone, } from "@mui/icons-material";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";
import { useEffect } from "react";
import { sub } from "date-fns";

export default function AddFuncionio() {
  // maxDate(new Date(sub(new Date(), { years: 9 })))
  const addFuncionarioShema = z.object({
    nome: z.string().min(1, { message: "este campo é obrigatorio" }),
    dataNascimento: z.coerce.date(),
    nif: z.string().min(1, { message: "este campo é obrigatorio" }),
    genero: z.string().min(1, { message: "este campo é obrigatorio" }),
    estadoCivil: z.string().min(1, { message: "este campo é obrigatorio" }),
    datavalidadeNif: z.coerce.date({ message: "Formato da data inválido!" }),
    nacionalidade: z.string().min(1, { message: "este campo é obrigatorio" }),
    endereco: z.object({
      municipio: z.string().min(1, { message: "este campo é obrigatorio" }),
      bairro: z.string().min(1, { message: "este campo é obrigatorio" }),
      // numCasa: z.string().min(1, { message: "este campo é obrigatorio" }),
    }),
    contacto: z.object({
      telefone: z.string().min(1, { message: "este campo é obrigatorio" }),
      email: z.string().email().min(1, { message: "este campo é obrigatorio" }),
    }),
    financa: z.object({
      iban: z.string().min(1, { message: "este campo é obrigatorio" }),
      salarioBruto: z.string().min(1, { message: "este campo é obrigatorio" }),
      salarioPorDia: z.string().min(1, { message: "este campo é obrigatorio" }),
    }),
    contrato: z.object({
      dataInicio: z.coerce.date(),
      dataSaida: z.coerce.date(),
      cargoId: z.string().min(1, { message: "este campo é obrigatorio" }),
    }),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addFuncionarioShema), shouldFocusError: true,
    progressive: true,
  });

  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [anexos, setAnexos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [erroFile, setErroFile] = useState("");
  const redirectTo = useNavigate();

  const handleFileChange = (event, index) => {
    const fileSize = event.target.files[0].size; // Tamanho do arquivo em bytes
    const maxSize = 2 * 1024 * 1024;
    console.log("SIZE", fileSize, maxSize);
    if (fileSize < maxSize) {
      setErroFile("O tamanho deve ser menor que", maxSize);
      console.log("SIZE", fileSize);
      return
    }
    setAnexos((prev) => [...prev, event.target.files[0]])
  }
  console.log("FILLLLES", anexos);

  async function PostFile() {
    const formData = new FormData();
    console.log("RECE", anexos[0]);
    formData.append("anexo", anexos);

    const newFile = await api.add("upload/dono/1/tipo/1/processo/2", formData).then((response) => {
      console.log("FILES", response)
      setAnexos(response.data);
      if (response.status !== 201) {
        NotifyError(response.data?.message)
      }
      if (response.status === 201) {
        Notify(response.data?.message)
      }
    }
    ).catch((erro) =>
      NotifyError("algo deu errado no servidor"))
  }

  async function buscarCargos() {
    await api.list("cargos").then((response) => {
      console.log("cargoss", response);
      if (response.status === 200) {
        setCargos(prev => response.data?.cargos);
      }
      if (response?.status !== 200) {
        NotifyError(response?.data?.message)
      }
    }).catch(({ error }) => {
      NotifyError("Ocorreu um erro temporário ao listar os cargos!")
      console.log(error);

    })
  }


  async function PostData(data) {

    await PostFile();
    const response = await api
      .add('funcionarios', data).then((response) => {

        if (response.status !== 201) {
          const { data } = response
          console.log("DATA", data);
          NotifyError(response?.data?.message)
        }
        if (response.status === 201) {
          Notify(response?.data?.message)
        }
      }).catch(() => {
        NotifyError("Erro temporario no servidor")
      }
      )
  }

  useEffect(() => {
    buscarCargos()
  }, [])
  return (
    <AppButtonRoot>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Material", path: "/material" },
            { name: "Buttons" },
          ]}
        />
      </Box>
      <SimpleCard   >
        <div className="w-100 d-flex  flex-end">
          <H3> REGISTO DE FUNCIONÁRIO</H3>

          {/* <CButton  className="py-8">Salvar</CButton> */}
        </div>
      </SimpleCard>
      <Box py="2px" />
      <CForm onSubmit={handleSubmit(PostData)}>
        <SimpleCard item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Nome Completo"
                aria-label="Antonio Machado"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>}
                {...register('nome')}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="date"
                label="Data de Nascimento"
                aria-label="data"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.dataNascimento && <div className="text-light bg-danger">{errors.dataNascimento.message}</div>}
                {...register('dataNascimento')}
              />
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol >
              <CFormInput
                type="text"
                {...register('nif')}
                label="NIF"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.nif && <div className="text-light bg-danger">{errors.nif.message}</div>}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="date"
                label="Data de Validade"
                aria-label="data"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.datavalidadeNif && <div className="text-light bg-danger">{errors.datavalidadeNif.message}</div>}
                {...register('datavalidadeNif')}
              />
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol >
              <CFormSelect
                label="Nacionalidade"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.nacionalidade && <div className="text-light bg-danger">{errors.nacionalidade.message}</div>}
                required
                {...register("nacionalidade")}

              >
                <option disabled>Nacionalidade</option>
                {listaPais?.map((pais) =>
                  <option value={pais.name} key={pais.name}>{pais.name}</option>
                )}
              </CFormSelect>

            </CCol>
            <CCol >
              <CFormSelect
                id="estadoCivil"
                required
                {...register("estadoCivil")}
                label="Estado Civil"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.estadoCivil && <div className="text-light bg-danger">{errors.estadoCivil.message}</div>}


              >
                <option disabled>Selecione</option>
                {[{ name: "Soltero(a)" }, { name: "Casado(a)" }].map((estado) =>
                  <option value={estado.name} key={estado.name}>{estado.name}</option>
                )}
              </CFormSelect>
            </CCol>
            <CCol >
              <CFormSelect
                id="genero"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.genero && <div className="text-light bg-danger">{errors.genero.message}</div>}
                label="Genero"
                required
                {...register("genero")}
              >
                <option disabled>Genero</option>
                {[{ name: "Masculino" }, { name: "Femenino" }].map((estado) =>
                  <option key={estado.name}>{estado.name}</option>
                )}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol className="mb-4">
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="n3come">Telefone</CInputGroupText>
                <CFormInput
                  type="number"
                  aria-label="telefone"
                  aria-describedby="n3ome"
                  {...register('contacto.telefone')}
                />
              </CInputGroup>
              {errors.contacto?.telefone && <div className="text-light bg-danger">{errors.contacto?.telefone.message}</div>}
            </CCol>
            <CCol className="mb-4">
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="n3come">@</CInputGroupText>

                <CFormInput
                  type="email"
                  aria-label="email"
                  aria-describedby="n3ome"
                  {...register('contacto.email')}
                />
              </CInputGroup>
              {errors.contacto?.email && <div className="text-light bg-danger">{errors.contacto?.email.message}</div>}
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>
        <SimpleCard className="mt-2">
          <H4 className="mb-3"> ENDEREÇO DE LOCALIZAÇÃO</H4>
          <CRow>
            <CCol className="mb-4">

              <CFormInput
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.endereco?.municipio && <div className="text-light bg-danger">{errors.endereco?.municipio.message}</div>}
                label="Provincia/ Estado"
                {...register('endereco.municipio')}
              />


            </CCol>

            <CCol className="mb-4">
              <CFormInput
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.endereco?.bairro && <div className="text-light bg-danger">{errors.endereco?.bairro.message}</div>}
                label="cidade/Estado"
                {...register('endereco.bairro')}
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.endereco?.numCasa && <div className="text-light bg-danger">{errors.endereco?.numCasa.message}</div>}
                label="Casa/aparatamto"
                {...register('endereco.numCasa')}
              />
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>
        <SimpleCard className="mt-2">
          <H4 className="mb-3"> DADOS FINANCEIRO</H4>
          <CRow>
            <CCol className="mb-4">
              <CFormInput
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.financa?.iban && <div className="text-light bg-danger">{errors.financa?.iban.message}</div>}
                label="IBAN"
                {...register('financa.iban')}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol className="mb-4">
              <CFormInput
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.financa?.salarioBruto && <div className="text-light bg-danger">{errors.financa?.salarioBruto?.message}</div>}
                label="Salario Bruto"
                {...register('financa.salarioBruto')}
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.financa?.salarioPorDia && <div className="text-light bg-danger">{errors.financa?.salarioPorDia?.message}</div>}
                label="Salario Bruto"
                {...register('financa.salarioPorDia')}
              />
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>

        <Box pt={1}></Box>
        <SimpleCard className="mt-4">
          <H3 className="mb-3"> DADOS DO CONTRATO</H3>
          <CRow>

            <CCol className="mb-4">
              <CFormInput
                type="date"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.contrato?.dataInicio && <div className="text-light bg-danger">{errors.contrato?.dataInicio.message}</div>}
                label="Data de Inicio"
                {...register('contrato.dataInicio')}
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                type="date"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.contrato?.dataSaida && <div className="text-light bg-danger">{errors.contrato?.dataSaida.message}</div>}
                label="Data de Término (concessão)"
                {...register('contrato.dataSaida')}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol >
              <CFormSelect
                aria-describedby="exampleFormControlInputHelpInline"
                text={errors.contrato?.cargoId && <div className="text-light bg-danger">{errors.contrato?.cargoId?.message}</div>}
                label="Cargo/Função"
                required
                {...register("contrato.cargoId")}
              >
                <option disabled>Selecione</option>
                {cargos.map((cargo) =>
                  <option value={cargo?.id} key={cargo.nome}>{cargo.nome}</option>
                )}
              </CFormSelect>
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>
        <SimpleCard className="mt-4">
          <H3 className="mb-3"> UPLOD DOS DOCUMENTOS</H3>
          <CRow>
            {[{ nome: "Bilhete de identidade" }, { nome: "Passa Porte" }].map((doc, index) => {
              return (<>
                <CCol className="mb-4">
                  <span>{doc?.nome}</span>
                  <CInputGroup className="mb-6 position-relative">
                    <CFormInput
                      formEncType="multipart/form-data"

                      itemRef={index}
                      id={"file" + index}
                      key={doc.nome}
                      accept="image/png, image/jpeg, application/pdf"
                      type="file"
                      required
                      aria-label={doc?.nome}
                      onChange={handleFileChange}

                    />
                  </CInputGroup>
                  {errors.anexo?.[index] && <div className="text-light bg-danger">{errors.anexo?.[index].message}</div>}
                </CCol>
              </>)
            })}


          </CRow>
        </SimpleCard>
        <SimpleCard title="">
          <CButton type="submit" color="success">Submeter</CButton>
        </SimpleCard>
      </CForm>

    </AppButtonRoot >
  );
}
const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" },
];
const filter = createFilterOptions();
