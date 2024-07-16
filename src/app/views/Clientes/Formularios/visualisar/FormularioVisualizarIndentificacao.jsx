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
  CRow
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { listaPais } from "app/utils/paises";
import { useEffect } from "react";
import { Cliente } from "../../util";

export default function FormularioVisualizarIdentificacao({ usuario }) {
  const clienteClass = new Cliente()
  const [cliente, setCliente] = useState()
  const { id } = useParams()

  // async function buscarCliente() {
  //   const data = await clienteClass.buscarUmClienteComTodosDados({ id });
  //   console.log("CLIENTE DATA", data);
  //   setCliente(data)
  // }

  // useEffect(() => {
  //   buscarCliente()
  // }, [id])
  return (
    <>

      <CRow className="mt-4 mb-4">
        <CCol>

          <CFormInput
            size="sm"
            label={"Nome :"}
            type="text"
            readOnly

            defaultValue={usuario?.nome}
            value={usuario?.nome}
            aria-label="Nome"
            placeholder="Nome"
            de
            aria-describedby="n3ome"

          />


        </CCol>
        <CCol className="mb-4">
          <CFormInput
            label={"Email :"}
            size="sm"
            id="formFileSm"
            type="text"
            readOnly
            defaultValue={usuario?.dataNascimento}
            aria-label="email"
            aria-describedby="n3ome"

          />

        </CCol>
        <CCol className="mb-4">
          <CFormInput
            label={"Gênero:"}
            size="sm"

            type="text"
            readOnly
            defaultValue={usuario?.genero}
            aria-label="genero"
            aria-describedby="n3ome"

          />

        </CCol>
      </CRow>


    </>

  );
}
