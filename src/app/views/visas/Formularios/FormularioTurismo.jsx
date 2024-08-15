import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, H4, H5, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Folder, FolderCopySharp, Password, Phone, Title } from "@mui/icons-material";

import {
  CAlert,
  CBadge,
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,

  CInputGroup,
  CListGroup,
  CListGroupItem,
  CRow,

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
import FormularioCurtaduracao from "./FormularioCurtaDuracao";
import FormularioTrabalho from "./FormularioTrabalho";
import FormularioFronteira from "./FormularioFronteira";
import FormularioTurismo from "./FormularioTurismo";
import useAuth from "app/hooks/useAuth";
import { Tecnico } from "../../tecnico/util";
import { useEffect } from "react";
import curtaDuracaoShema from "./schemas/vistoShema";

export default function FormAdd() {


  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(curtaDuracaoShema),
    shouldFocusError: true,
    progressive: true
  });
  const api = useApi();
  const [anexos, setAnexos] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [erroFile, setErroFile] = useState("");

  const formatFileSize = (sizeInBytes) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      // Convertendo bytes para kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > 2048) {
        // 2MB em KB
        setError("O arquivo não pode ter mais de 2MB.");
      } else {
        setFileSize(fileSizeInKB);
        (event.target.files[0].tipoId = Number(event.target.id)),
          (event.target.files[0].tipoId = Number(event.target.id)),
          setAnexos((prev) => [...prev, event.target.files[0]]);
        setError("");
      }
    }
  };
  let { clienteId, gestorId } = useParams();
  const { user } = useAuth();

  let gestorInternoId = undefined;
  let gestorExternoId = undefined;

  if (user.clienteId) {
    clienteId = user?.clienteId
    gestorExternoId = gestorId;

  }
  else {
    gestorInternoId = gestorId;
    gestorExternoId = gestorId;
  }
  const tecnicoClass = new Tecnico()
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSelected, setTecnicoSelected] = useState({});
  const [imagePreview, setImagePreview] = useState("https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Free-PNG-Clip-Art.png")

  async function buscarTecnicos() {
    let tecni = await tecnicoClass.buscarTodos({ clienteId });
    setTecnicos(prev => tecni);
  }

  useEffect(() => {
    buscarTecnicos();
  }, [

  ]);

  function handleTecnico(e) {
    setTecnicoSelected(prev => tecnicos.filter((tec) => tec?.id == e?.target?.value)[0]);
  }

  async function PostFile({
    file,
    numeroPassaporte,
    emissora,
    requerenteId,
    clienteId,
    dataValidade,
    dataEmissao
  }) {
    const formData = new FormData();
    console.log("ANEXOS", file);
    formData.append("anexo", file);


    try {
      console.log("FICHEIROS ID", file.tipoId);
      if (file.tipoId === 1) {
        const response = await api
          .add(
            `upload?emissora
                        =${emissora}
                        &dataValidade=
                        ${dataValidade}
                        &dataEmissao=
                        ${dataEmissao}
                        &requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}
                        &numero=${numeroPassaporte}`,
            formData
          )
          .catch(({ error }) => {
            NotifyError("Erro ao enviar o arquivo:", error);

          });
        console.log("Resposta do servidor:", response.data);
      }
      else {
        const response = await api
          .add(
            `upload?requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}`,
            formData
          )
          .catch(({ error }) => {
            NotifyError("Erro ao enviar o arquivo:", error);
          });
        console.log("Upoad message:", response.data);
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }

  async function sendFile({ anexos, cliente, data }) {
    for (let i = 0; i < anexos?.length; i++) {
      console.log("FICHEIROS", anexos[i]);
      await PostFile({
        file: anexos[i],
        clienteId: cliente?.id,
        requerenteId: cliente?.id,
        numeroPassaporte: data?.passaporte?.numero,
        dataEmissao: data?.passaporte?.dataEmissao,
        dataValidade: data?.passaporte?.dataValidade,
        emissora: data?.passaporte?.emissora
      });
    }
  }

  const FormTecnico = () => {
    return (
      <>

      </>
    )
  }

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.add("clientes", dados).then(async (response) => {

        const { data } = response
        console.log("RESPOSTA SUCESSO", response);
        setLoading(false);
        if (!response?.data?.message)
          return;
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);

    }
  }
  const [tipoVistoId, setTipoVistoId] = useState("1");
  const renderForm = () => {
    console.log("ID", tipoVistoId);
    switch (tipoVistoId) {
      case "1":
        return (
          <FormularioCurtaduracao>

          </FormularioCurtaduracao>
        )
        break;

      case "2":
        return (
          <FormularioTrabalho></FormularioTrabalho>
        )
        break;
      case "3":
        return (
          <FormularioFronteira></FormularioFronteira>
        )
        break;
      case "4":
        return (
          <FormularioTurismo></FormularioTurismo>
        )
        break;

      default:
        break;
    }
  }

  const styleInput = {};
  return (
    <CCallout>
      <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>

      </CForm>
    </CCallout>
  );
}