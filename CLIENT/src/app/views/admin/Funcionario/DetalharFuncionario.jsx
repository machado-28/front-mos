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
  CFormInput
  ,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { Link, useNavigate } from "react-router-dom";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";
import { useEffect } from "react";
import { sub } from "date-fns";

export default function DetalahrFuncionio() {
  // maxDate(new Date(sub(new Date(), { years: 9 })))


  const api = useApi();
  const [funcionario, setFuncionario] = useState({});
  const [cargos, setCargos] = useState([]);
  const [erroFile, setErroFile] = useState("");
  const redirectTo = useNavigate();

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


  async function buscarFuncionario() {
    const response = await api
      .list('funcionarios').then((response) => {

        if (response.status !== 200) {
          const { data } = response
          console.log("DATA", data);
          NotifyError(response?.data?.message)
        }
        if (response.status === 200) {
          const { data } = response
          console.log("DATA", data);
          setFuncionario(prev => response.data?.funcionario)
          Notify(response?.data?.message)
        }
      }).catch(() => {
        NotifyError("Erro temporario no servidor")
      }
      )
  }

  useEffect(() => {
    buscarFuncionario()
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
          <H3>DADOS DO FUNCIONÁRIO: {funcionario?.codigo} FR-323-024</H3>

          {/* <CButton  className="py-8">Salvar</CButton> */}
        </div>
      </SimpleCard>
      <Box py="2px" />
      <CForm  >
        <SimpleCard item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                disabled
                type="text"
                label="Nome Completo"
                value="António Machado"

                aria-label="Antonio Machado"
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                disabled

                type="date"
                label="Data de Nascimento"
                aria-label="data"
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol >
              <CFormInput
                disabled
                type="text"
                label="NIF"
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                disabled
                type="date"
                label="Data de Validade"
                aria-label="data"
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol >
              <CFormSelect
                disabled
                label="Nacionalidade"
                aria-describedby="exampleFormControlInputHelpInline"
                required
              >
                <option disabled>Nacionalidade</option>
                {listaPais?.map((pais) =>
                  <option value={pais.name} key={pais.name}>{pais.name}</option>
                )}
              </CFormSelect>
            </CCol>
            <CCol >
              <CFormSelect
                disabled
                id="estadoCivil"
                required
                label="Estado Civil"
                aria-describedby="exampleFormControlInputHelpInline"
              >
                <option disabled>Selecione</option>
                {[{ name: "Soltero(a)" }, { name: "Casado(a)" }].map((estado) =>
                  <option value={estado.name} key={estado.name}>{estado.name}</option>
                )}
              </CFormSelect>
            </CCol>
            <CCol >
              <CFormSelect
                disabled
                id="genero"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Genero"
                required

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
                  disabled
                  type="number"
                  aria-label="telefone"
                  aria-describedby="n3ome"
                />
              </CInputGroup>
            </CCol>
            <CCol className="mb-4">
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="n3come">@</CInputGroupText>
                <CFormInput
                  disabled
                  type="email"
                  aria-label="email"
                  aria-describedby="n3ome"
                />
              </CInputGroup>
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>
        <SimpleCard className="mt-2">
          <H4 className="mb-3"> ENDEREÇO DE LOCALIZAÇÃO</H4>
          <CRow>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Provincia/ Estado"
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="cidade/Estado"
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="text"
                id="rtr"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Casa/aparatamto"
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
                disabled
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="IBAN"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Salario Bruto"
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="text"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Salario Bruto"
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
                disabled
                type="date"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Data de Inicio"
              />
            </CCol>
            <CCol className="mb-4">
              <CFormInput
                disabled
                type="date"
                aria-label=" fd"
                aria-describedby="exampleFormControlInputHelpInline"
                label="Data de Término (concessão)"
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol >
              <CFormSelect
                disabled
                aria-describedby="exampleFormControlInputHelpInline"
                label="Cargo/Função"
                required
                readOnly
              >
                <option disabled>Selecione</option>
                {cargos?.map((cargo) =>
                  <option value={cargo?.id} key={cargo.nome}>{cargo.nome}</option>
                )}
              </CFormSelect>
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>

        <SimpleCard title="" className="w-100">
          <Link to={"documentos/1"}>
            <CButton className="w-100 text-white" color="success">Ver Documentos</CButton>
          </Link>
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
