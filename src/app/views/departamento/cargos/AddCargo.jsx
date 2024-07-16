import { Box, Input } from "@mui/material";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { styled } from "@mui/material";
import { H3 } from "app/components/Typography";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Fragment } from "react";
import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, GroupOutlined, Label, Phone } from "@mui/icons-material";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CHeaderDivider,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";

export default function AddCargo() {

  const addCargoShema = z.object({
    nome: z.string().min(1, { message: 'Este campo é obrigatorio' }),
    departamentoId: z.coerce.number().min(1, { message: 'Este campo é obrigatorio' }),
  })

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addCargoShema), shouldFocusError: true,
    progressive: true,
  });


  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [departamentos, setDepartamentos] = useState([]);
  const redirectTo = useNavigate();

  async function ListarDepartamentos() {
    await api.list("departamentos").then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setDepartamentos((prev) => response.data.departamentos)
      }
    })
  }

  async function PostData(data) {
    const response = await api
      .add('cargos', data).then((response) => {
        if (response.status === 201) {
          const { data } = response
          console.log("DATA", data);
          return alert(response?.data?.message)
        }
        return response?.data?.message
      }).catch(() => {
        redirectTo("/500")
      }
      )

  }

  useEffect(() => {
    ListarDepartamentos()
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
      <SimpleCard title="">
        <H3> REGISTO DE CARGO</H3>
      </SimpleCard>
      <Box py="12px" />
      <CForm onSubmit={handleSubmit(PostData)}>
        <SimpleCard item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <CRow className="mb-4">
            <CCol>
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="nif">
                  cargo
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="nome"

                  aria-describedby="nome"
                  {...register('nome')}
                />
              </CInputGroup>
              {errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>}
            </CCol>


          </CRow>
        </SimpleCard>

        <SimpleCard title="">
          <H3>DEPARTAMENTO</H3>
          <CRow className="mb-4">
            <CCol >
              <CFormSelect
                id="validationServer0454"
                label="departamento"
                required
                {...register("departamentoId")}
              >
                <option disabled>departamento</option>
                {departamentos?.map((depart) =>
                  <option value={depart?.id} key={depart?.nome}>{depart?.nome}</option>
                )}
              </CFormSelect>
              {errors.departamentoId && <div className="text-light bg-danger">{errors.departamentoId.message}</div>}
            </CCol>
          </CRow>
        </SimpleCard>
        <SimpleCard title="">
          <CButton type="submit" color="success">Submeter</CButton>
        </SimpleCard>
      </CForm>
    </AppButtonRoot>
  );
}

