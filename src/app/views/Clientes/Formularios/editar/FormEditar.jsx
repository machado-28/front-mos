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
import { useEffect } from "react";

export default function FormEditar() {
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
    sindicato: z
      .string()
      .regex(validatePersonNames, "incorrecto")
      .refine(
        (name) => {
          return capitalize(name);
        },
        { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
      ),
    nacionalidade: z.coerce.string(),
    estadoCivil: z.coerce.string().min(5, { message: "Este campo é obrigatorio" }),
    genero: z.string(),
    dataNascimento: z.coerce.date().refine(
      (date) => {
        return calcularIdade(date) >= 18;
      },
      { message: "ainda eh menor de idade" }
    ),
    filiacao: z.object({
      mae: z.object({
        nome: z
          .string()
          .regex(validatePersonNames, "nome incorrecto")
          .refine(
            (name) => {
              return capitalize(name);
            },
            { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
          ),
        nacionalidade: z.string()
      }),

      pai: z.object({
        nome: z
          .string()
          .regex(validatePersonNames, "nome incorrecto")
          .refine(
            (name) => {
              return capitalize(name);
            },
            { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
          ),
        nacionalidade: z.string()
      }),
    }),
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
    contacto: z.object({
      telefone: z.coerce
        .number({ message: "Telefone Incorrecto" })
        .min(9, { message: "Este campo é obrigatorio" }),
      email: z.string().email("insira um email válido!").min(1, { message: "Este campo é obrigatorio!" })
    }),

    enderecoAngola: z.object({
      provincia: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      cidade: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
      comuna: z
        .string()
        .min(5, { message: "Este campo é obrigatorio" })
        .regex(validatePersonNames, "incorrecto")
        .refine(
          (name) => {
            return capitalize(name);
          },
          { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        )
    }),
    profissionalismo: z.object({
      profissao: z.string().min(5),
      funcao: z.string().min(5),
      nomeEmpresa: z.string().min(5),
      emailEmpresa: z.string().email("insira um email válido").min(5),
      telefoneEmpresa: z.string().min(5),
      enderecoEmpresa: z.string().min(5),
    }).required(),
    senha: z
      .string().min(6, "a Senha deve ser no mínimo 6 caracteres")

  });

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
      nome: "Machado"
    }
  });

  if (errors) console.log("ERRO", errors);
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

  async function PostFile({
    file,
    numeroPassaporte,
    emissora,
    requerenteId,
    passaporte,
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
            `upload?emissora=${emissora}&dataValidade=${dataValidade}&dataEmissao=${dataEmissao}&requerenteId=${requerenteId}&passaporte=${passaporte}&tipoId=${file.tipoId}&numero=${numeroPassaporte}`,
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
            `upload?requerenteId=${requerenteId}&passaporte=${passaporte}&tipoId=${file.tipoId}`,
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
  const { passaporte } = useParams();

  const buscarCliente = async () => {
    await api.listQuery(`clientes/${passaporte}`).then((res) => {
      setCliente(res?.data?.cliente)
    }).catch(error => {
      console.log(error);
      NotifyError("Erro ao buscar o Cliente")
    });
  }

  useEffect(() => {
    buscarCliente()
  }, [passaporte])

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.edit(`clientes/${passaporte}`, dados).then(async (response) => {

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
  }

  const styleInput = {};
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
      
 <CRow className="mb-4">
 <CCol>
   <CFormInput
     id="Nome"
     aria-describedby="exampleFormControlInputHelpInline"

     size="sm"
     label="Nome"
     required

   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="DataNascimento"
     type="date"
     aria-describedby="exampleFormControlInputHelpInline"

     size="sm"
     label="Data de Nascimento"
     required

   >
   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="DataNascimento"
     type="dateF"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Gênero"
     required
    
   >

   </CFormInput>
 </CCol>

</CRow>
<CRow className="mb-4">
 <CCol>
   <CFormInput
     id="Passaporte"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Passaporte"
     required
    
   >

   </CFormInput>
 </CCol>
</CRow>
<CRow className="mb-4">

 <CCol>
   <CFormInput
     id="Telefone"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Telefone"
     required
    
   >

   </CFormInput>
 </CCol>

 <CCol>
   <CFormInput
     id="Email"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Email"
     required
    
   >

   </CFormInput>
 </CCol>

</CRow>
<Box pt={4}></Box>

<h5>Dados Da Empresa</h5>
<hr></hr>
<CRow className="mb-4">
 <CCol>
   <CFormInput
     id="Nome"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Nome da Empresa"
     required
    
   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="nif"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="NIF"
     required
    
   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="Website"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Web site"
     required
    
   >

   </CFormInput>
 </CCol>
</CRow>
<CRow className="mb-4">
 <CCol>

   <CFormInput
     id="Email"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Área de actuação"
     required
    
   >

   </CFormInput>

 </CCol>
 <CCol>
   <CFormInput
     id="Website"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Telefone"
     required
    
   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="Email"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Email"
     required
    
   >

   </CFormInput>
 </CCol>
</CRow>
<CRow>
 <h6>Localização</h6>
 <CCol>
   <CFormInput
     id="Nome"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="Provincia"
     required
    
   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="Website"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="municipio"
     required
    
   >

   </CFormInput>
 </CCol>
 <CCol>
   <CFormInput
     id="Comuna"
     aria-describedby="exampleFormControlInputHelpInline"
     
     size="sm"
     label="municipio"
     required
    
   >

   </CFormInput>
 </CCol>
</CRow>
</CForm>
  );
}
