import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React, { useEffect } from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Folder, Password, Phone, Title } from "@mui/icons-material";

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
import useAuth from "app/hooks/useAuth";
import { Gestores } from "app/views/Clientes/Gestores/util";
import { Projecto } from "./../../util";

export default function FormAdd() {
  const validadeDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });
  const addProcessoShema = z.object({
    nome: z
      .string(),
    gestorInternoId: z.string(),


    gestorExternoId: z.string(),


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
  const { user } = useAuth()
  const { projectoId, clienteId } = useParams()
  const [gestorInterno, setgestorInterno] = useState([]);
  const [gestorExterno, setgestorExterno] = useState([]);

  const Gestor = new Gestores();
  async function buscarGestores(params) {
    const interno = await Gestor.buscarTodos({ painelId: 6 });
    const externo = await Gestor.buscarTodos({ clienteId, painelId: 5 });
    setgestorExterno(prev => externo);
    setgestorInterno(prev => user?.painel?.nome === "CLIENTE" ? [] : interno)
  }
  useEffect(() => {
    buscarGestores()
  }, []);

  const [projecto, setProjecto] = useState({});
  const [order, setOrder] = useState("DESC");
  const [orderBy, setOrderBy] = useState("nome");
  const [date, setDate] = useState();


  const projectoClass = new Projecto()
  async function buscarProjecto() {
    let proj = await projectoClass.buscar({ id: projectoId, });
    setProjecto(prev => proj[0])
  }
  console.log(projecto);
  async function PostData(dados) {

    try {
      console.log("FORMULARIO ", dados);
      setLoading(true);
      const response = await projectoClass.editar({ id: projectoId, data: dados }).then(async (response) => {
        setLoading(false);
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);

    }
  }

  useEffect(() => {
    buscarGestores()
    buscarProjecto()
  }, [])
  const styleInput = {};
  return (
    <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
      <Box pt={4}></Box>
      <div className="w-100 d-flex  justify-content-between">
        <H2>Editar<Folder></Folder> </H2>
        <div>

          <LoadingButton
            className="text-white px-4 "
            color="success"
            type="submit"
            loading={loading}
            variant="contained"

          >
            Salvar
          </LoadingButton>
        </div>

      </div>

      <Box pt={3}></Box>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            size="sm"
            type="text"
            label="Nome do projecto"
            defaultValue={projecto?.nome}
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
            label="Gestor 1s"
            size="sm"
            defaultValue={projecto?.gestorInterno?.id}
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.gestorInternoId && (
                <div className="text-light bg-danger">{errors.gestorInternoId.message}</div>
              )
            }
            // disabled={user?.painel?.nome === "CLIENTE" && true}
            readOnly={user?.painel?.nome === "CLIENTE" && true}


            {...register("gestorInternoId")}
          > <option defaultValue={projecto?.gestorInterno?.id} value={projecto?.gestorInterno?.id}>{projecto?.gestorInterno?.nome}</option>

            {gestorInterno?.map((gest) => (
              <option value={gest?.id} key={gest?.nome}>
                {gest?.nome}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol>

          <CFormSelect
            label="Gestor 2"

            defaultValue={projecto?.gestorExterno?.id}
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.gestorExternoId && (
                <div className="text-light bg-danger">{errors.gestorExternoId.message}</div>
              )
            }
            size="sm"

            {...register("gestorExternoId")}
          >
            <option disabled defaultValue={projecto?.gestorExterno?.id} value={projecto?.gestorExterno?.id}>{projecto?.gestorExterno?.nome}</option>
            {gestorExterno?.map((gest) => (
              <option value={gest?.id} key={gest?.nome}>
                {gest?.nome}
              </option>
            ))}
          </CFormSelect>

        </CCol>
      </CRow>
    </CForm >
  );
}
