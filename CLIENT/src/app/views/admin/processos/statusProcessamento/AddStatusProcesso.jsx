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
import { toast } from "react-toastify";
import { Notify, NotifyError } from "app/utils/toastyNotification";

export default function AddStatusProcesso() {

  const addProcessoStatusShema = z.object({
    nome: z.string().min(1, { message: 'Este campo é obrigatorio' }),
  })

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addProcessoStatusShema), shouldFocusError: true,
    progressive: true,
  });


  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [statusProcesso, setStatusProcesso] = useState([]);
  const redirectTo = useNavigate();

  // async function buscarStatus() {

  //   await api.list("statusProcesso").then((response) => {
  //     if (response.status === 200) {
  //       setStatusProcesso((prev) => response.data);
  //     }
  //   }).catch((erro) => {
  //     redirectTo("/500")
  //   });

  // }
  async function PostData(data) {
    await PostFile();
    const response = await api
      .add('statusProcesso', data).then((response) => {
        if (response.status === 201) {
          const { data } = response
          Notify(response.data?.message);
        }

        if (response.status !== 201)
          NotifyError(response?.data?.message);

      }).catch(() => {
        redirectTo("/500");
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
        <H3> REGISTO DE STATUS DE PROCESSO</H3>
      </SimpleCard>
      <Box py="12px" />
      <CForm onSubmit={handleSubmit(PostData)}>
        <SimpleCard item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
          <CRow className="mb-4">
            <CCol>
              <CInputGroup className="mb-6 position-relative">
                <CInputGroupText id="nif">
                  Status
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
          <CButton type="submit" color="success">Submeter</CButton>
        </SimpleCard>
      </CForm>

    </AppButtonRoot>
  );
}
 