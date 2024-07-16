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
  CSpinner,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { toast } from "react-toastify";

export default function AddCargo() {

  const addDepartamentoShema = z.object({
    nome: z.string().min(1, { message: 'Este campo é obrigatorio' }),
    horaEntrada: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)

  })

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addDepartamentoShema), shouldFocusError: true,
    progressive: true,
  });


  if (errors) console.log("ERRO", errors);
  const api = useApi();

  const [loading, setLoading] = useState(false)

  const redirectTo = useNavigate();



  async function PostData(data) {
    setLoading(prev => true);
    const response = await api
      .add('departamentos', data).then((response) => {
        setLoading(prev => false);
        if (response.status === 201) {
          const { data } = response
          alert(data?.message)
          toast.success(data?.message);
          console.log("DATA", data);


        }

        if (response?.status !== 201) {
          alert(response.data?.message);
        }

        return response?.data?.message
      }).catch((error) => {
        if (error?.status === 400) {
          console.log(error);
          return toast.error(data?.message);
        }
        redirectTo("/500")
      }
      )


  }

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
        <H3> REGISTO DE DEPARTAMENTO</H3>
      </SimpleCard>
      <Box py="12px" />
      <CForm onSubmit={handleSubmit(PostData)}>
        <SimpleCard item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <CRow className="mb-4">
            <CCol>
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="nif">
                  departamento
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
            <CCol>
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="nif">
                  Hora de Entrada
                </CInputGroupText>
                <CFormInput
                  type="time"


                  aria-describedby="nome"
                  {...register('horaEntrada')}
                />
              </CInputGroup>
              {errors.horaEntrada && <div className="text-light bg-danger">{errors.horaEntrada.message}</div>}
            </CCol>
          </CRow>
        </SimpleCard>
        <SimpleCard title="">
          {loading ? <CSpinner></CSpinner> : <CButton type="submit" color="success">Submeter</CButton>}
        </SimpleCard>
      </CForm>
    </AppButtonRoot>
  );
}

