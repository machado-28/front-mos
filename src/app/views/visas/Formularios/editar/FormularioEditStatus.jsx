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
  CRow,
  CSpinner
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { listaPais } from "app/utils/paises";
import { useEffect } from "react";
import {
  ValidateData,
  calcularIdade,
  capitalize,
  validatePassporte,
  validatePersonNames
} from "app/utils/validate";
import Visto from "../../util";
export default function FormularioEditStatus({ statusId }) {

  const validateDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validateDate({ date: new Date(), interval: 6 });

  const updateStatusShema = z.object({
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
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateStatusShema),
    shouldFocusError: true,
    progressive: true,

  });

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({});
  console.log("ID RECEBIDO DAS PROPS 11111111", statusId)
  const api = useApi();
  const statusClasss = new Visto();
  const buscarStatus = async (data) => {
    setLoading(prev => true)

    const res = await statusClasss.buscarStatus({ id: statusId })
    setStatus(prev => res?.status[0])
    setLoading(prev => false)
    console.log("ID RECEBIDO DAS PROPS", statusId);
  }

  useEffect(() => {
    buscarStatus();
  }, [statusId]);

  if (errors) console.log("ERRO", errors);

  async function PostData(data) {
    console.log("ID enviado", statusId);
    setLoading(p => true)
    const response = await statusClasss.editarStatus({ id: statusId, data })
    setLoading(p => false)

    window.location.reload()
  }

  return (
    <CForm className="p-4" onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>

      <CRow className="mb-4">
        <CCol  >
          <CFormInput
            {...register("nome")}
            type="text"

            label="Nome"
            defaultValue={status?.nome}
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>
      </CRow>
      {loading ? <CSpinner></CSpinner> :
        <CButton type="submit" className="text-white px-4 w-100" color="success">
          Salvar
        </CButton>}

    </CForm >
  );
}
