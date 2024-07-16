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
  CFormTextarea,
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

export default function FormAdd() {
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
    descricao: z
      .string(),

    tempoResposta: z
      .string(),
    validade: z.number()

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
  const [loading, setLoading] = useState(false);
  const { tipoId = 1 } = useParams()

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.add("clientes", dados).then(async (response) => {
        const { data } = response
        console.log("RESPOSTA SUCESSO", response);
        setLoading(false);
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);

    }


  };

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

      <Box pt={3}></Box>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
            disabled
            label="ID"
            value={tipoId}
            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
            }
            {...register("nome")}
          />
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            label="Nome do Tipo"

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
          <CFormInput
            label="Validade (mes)"
            type="number"
            min={15}
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nacionalidade && (
                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
              )
            }
            required
            {...register("nacionalidade")}
          >

          </CFormInput>
          {errors.nacionalidade && (
            <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
          )}
        </CCol>
        <CCol>
          <CFormInput
            label="tempo estimado para conclusão(dia)"
            type="number"
            min={15}
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nacionalidade && (
                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
              )
            }
            required
            {...register("nacionalidade")}
          >

          </CFormInput>
        </CCol>

      </CRow>

      <CRow>
        <CCol>
          <CFormTextarea
            type="text"
            label="descricao"

            aria-label="Antonio Machado"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
            }
            {...register("nome")}
          />
        </CCol>
      </CRow>
    </CForm>
  );
}
