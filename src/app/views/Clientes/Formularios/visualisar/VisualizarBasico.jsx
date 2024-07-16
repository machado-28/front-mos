import { Box, TextField } from "@mui/material";
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
  CRow,
  CSpinner,
  CTabContent,
  CTabPane
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

export default function VisuaizarBasico() {
  const navigate = useNavigate();
  const location = useLocation();
  const updateQueryParams = (newParams) => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] !== undefined) {
        searchParams.set(key, newParams[key]);
      } else {
        searchParams.delete(key);
      }
    });

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // substitua 'paramName' pelo nome do seu parâmetro

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

    genero: z.string(),
    dataNascimento: z.coerce.date().refine(
      (date) => {
        return calcularIdade(date) >= 18;
      },
      { message: "ainda eh menor de idade" }
    ),

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


    profissionalismo: z.object({
      profissao: z.string().min(5),
      funcao: z.string().min(5),
    }).required(),

  });
  const [loading, setLoading] = useState(false);
  const [passaporte_, setPassaporte] = useState(false);
  const [cliente, setCliente] = useState({});
  // const C_cliente = new Cliente();
  // const api = useApi();



  // const buscarCliente = async () => {
  //   setLoading(prev => !prev)
  //   const cliente_ = await C_cliente.buscarUm({ passaporte: passaporte_ })
  //   setLoading(prev => !prev)
  //   console.log("CLIENTESSSS", cliente_);
  //   setCliente(prev => cliente_)
  //   updateQueryParams({ cliente: cliente_?.id })

  // }
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


  // useEffect(() => {
  //   buscarCliente()
  // }, [passaporte_]);
  const [searchTerm, setSearchTerm] = useState("");

  const styleInput = {};
  return (

    <CForm className="w-75" style={{ borderRadius: "none" }}>
      <Box pt={4}>
        {loading === true ? <CSpinner></CSpinner> : <CSpinner style={{ color: "#fff" }}></CSpinner>}
      </Box>
      <Box pt={3}></Box>
      <TextField
        style={{ marginLeft: "-16%", fontSize: "0.54rem", scale: "0.67", borderRadius: 0 }}
        label="Passaporte"
        placeholder="Insira o passaporte"
        variant="outlined"
        onChange={(event) => setPassaporte(prev => event.target.value)}
        fullWidth

      />
      <Box pt={3}></Box>

      <CRow className="mb-4">
        <CCol>
          <CFormInput
            readOnly
            disabled
            type="text"
            defaultValue={cliente?.passaporte}
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
        <CCol>
          <CFormInput
            readOnly
            disabled
            type="text"
            label="Nome Completo"
            aria-label="Antonio Machado"
            defaultValue={cliente?.nome}
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
            }
            {...register("nome")}
          />
        </CCol>
      </CRow>
      <Box pt={1}></Box>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            readOnly
            disabled
            type="text"
            ref={"profissao"}
            id="profissao"
            aria-label="profissao"
            defaultValue={cliente?.profissao}
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
            readOnly
            disabled
            type="text"
            ref={"funcao"}
            defaultValue={cliente?.funcao}
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

    </CForm>
  );
}
