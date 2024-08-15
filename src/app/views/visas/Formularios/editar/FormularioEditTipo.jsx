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
export default function FormularioEdiTipo({ tipoId }) {

  const validateDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validateDate({ date: new Date(), interval: 6 });

  const updateTipoShema = z.object({
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
    duracao: z
      .coerce.number().min(7)
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateTipoShema),
    shouldFocusError: true,
    progressive: true,
    defaultValues: {}
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tipo, setTipo] = useState({});
  console.log("ID RECEBIDO DAS PROPS 11111111", tipoId)
  const api = useApi();
  const tipoClasss = new Visto();
  const buscarTipo = async (data) => {
    setLoading(prev => true)
    const res = await tipoClasss.buscarTipos({ id: tipoId })
    setTipo(prev => res?.tipos[0])
    setLoading(p => false)
    console.log("ID RECEBIDO DAS PROPS", tipoId);

  }

  useEffect(() => {
    buscarTipo();
  }, [tipoId]);

  if (errors) console.log("ERRO", errors);

  async function PostData(data) {
    console.log("ID enviado", tipoId);
    const response = await tipoClasss.actualizarTipo({ id: tipoId, data })
    reset()
    window.location.reload()
  }

  return (
    <CForm className="p-4" onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>

      <CRow className="mb-4">
        <CCol  >
          <CFormInput
            {...register("nome")}
            type="text"
            defaultValue={tipo?.nome}
            label="Nome"
            text={
              errors.nome && (
                <div className="text-light bg-danger">{errors.nome.message}</div>
              )
            }
            aria-describedby="exampleFormControlInputHelpInline"
          />
        </CCol>
        <CCol  >
          <CFormInput
            {...register("duracao")}
            type="number"
            defaultValue={tipo?.duracao}
            text={
              errors.duracao && (
                <div className="text-light bg-danger">{errors.duracao.message}</div>
              )
            }
            label="Duração"

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
