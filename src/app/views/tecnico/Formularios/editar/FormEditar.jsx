import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
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
import { Tecnico } from "../../util";
import { useEffect } from "react";

export default function FormAdd() {
  const validadeDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });
  const addProcessoShema = z.object({
    nome: z
      .string()

      .regex(validatePersonNames, "nome incorrecto")
      .refine(
        (name) => {
          return capitalize(name);
        },
        { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
      ),

    telefone: z.coerce
      .number({ message: "Telefone Incorrecto" }),

    email: z.string().email("insira um email válido!"),
    image: z
      .instanceof(FileList)
      .refine(files => files.length === 1, 'Imagen es requerida')
      .transform(files => files[0]),

  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addProcessoShema),
    shouldFocusError: true,
    progressive: true
  });
  const { clienteId } = useParams()
  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [fileStram, sestFileStream] = useState();

  const tecnicoClass = new Tecnico();
  const { tecnicoId } = useParams();
  const [tecnico, setTecnico] = useState({})

  const buscarTecnico = async () => {
    let res = await tecnicoClass.buscarTodos({ id: tecnicoId });
    setTecnico(prev => res[0])

  }

  const [imagePreview, setImagePreview] = useState(tecnico?.avatar?.url);
  const [imageId, setImageId] = useState('');
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
        sestFileStream((prev) => file);
        setError("");
      }
    }
    setImagePreview(URL.createObjectURL(file));
  };
  const [fileId, setFileId] = useState();

  async function PostFile({
    file,
  }) {
    const formData = new FormData();
    console.log("ANEXOS", formData);
    formData.append("anexo", file);

    try {

      const response = await api
        .add(
          `upload`,
          formData
        )
        .catch(({ error }) => {
          NotifyError("Erro ao enviar o arquivo:", error);

        });
      console.log("receved", response);
      return response
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }


  useEffect(() => {
    buscarTecnico()
  }, [])

  async function PostData(dados) {
    try {
      setLoading(true);
      const res = await PostFile({ file: fileStram });
      console.log("%cAVATAR", "font-size:xx-large; color:blue", res);
      dados.avatarId = res?.data?.documento?.id || tecnico?.avatarId;
      dados.clienteId = clienteId
      const response = await api.edit("tecnicos", dados).then(async (response) => {

        const { data } = response
        console.log("RESPOSTA SUCESSO", response);
        setLoading(false);
        Notify(response?.data?.message);

      });
      window.location.reload()
    } catch (error) {
      NotifyError("Erro insperado");
      console.log(error);
      setLoading(false);

    }
  }
  const renderInputGroups = () => {
    const groups = [];
    // Loop para criar os grupos de dois documentos
    for (let i = 0; i < documents.length; i += 2) {
      const group = (
        <CRow key={i} className="mb-4">
          {/* Input para o primeiro documento */}
          <CCol>
            {documents[i].name}
            <CInputGroup className="mb-6 position-relative">
              <CFormInput
                formEncType="multipart/form-data"
                text=""
                aria-describedby="exampleFormControlInputHelpInline"
                itemRef={`document-${documents[i].id}`}
                id={documents[i].id}
                key={`document-${documents[i].id}`}
                htmlFor={`document-${documents[i].id}`}
                accept="image/png, image/jpeg, application/pdf"
                type="file"
                required
                onChange={handleFileChange}
              />
            </CInputGroup>
          </CCol>
          {/* Verifica se existe um segundo documento no grupo */}
          {i + 1 < documents.length && (
            <>
              {/* Input para o segundo documento */}
              <CCol className="mb-4">
                {documents[i + 1].name}
                <CInputGroup className="mb-6 position-relative">
                  <CFormInput
                    formEncType="multipart/form-data"
                    text=""
                    aria-describedby="exampleFormControlInputHelpInline"
                    id={documents[i + 1].id}
                    key={`document-${documents[i + 1].id}`}
                    htmlFor={`document-${documents[i + 1].id}`}
                    accept="image/png, image/jpeg, application/pdf"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
                </CInputGroup>
              </CCol>
            </>
          )}
        </CRow>
      );

      groups.push(group);
    }
    return groups;
  };
  const styleInput = {};
  return (
    <AppButtonRoot>
      <Box overflow="auto">
        <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
          <Box pt={4}></Box>


          <div className="w-100 d-flex  justify-content-between">
            <H2>EDITAR <Folder></Folder> </H2>
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
          <img src={tecnico?.avatar?.url || imagePreview} loading="lazy" id="image" style={{ height: 100, width: 100 }}></img>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                size="sm"
                label="Nome do beneficiário"
                defaultValue={tecnico?.nome}
                aria-describedby="exampleFormControlInputHelpInline"
                text={
                  errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
                }
                {...register("nome")}
              />
            </CCol>
            <CCol>
              <CFormInput
                formEncType="multipart/form-data"
                text=""

                htmlFor="image"
                label="Foto Passe"
                
                aria-describedby="exampleFormControlInputHelpInline"
                accept="image/png, image/jpeg,"
                type="file"
                
                onChange={handleFileChange}
              />

            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                size="sm"
                label="Email"
                defaultValue={tecnico?.email}
                aria-describedby="exampleFormControlInputHelpInline"
                text={
                  errors.email && <div className="text-light bg-danger">{errors.email.message}</div>
                }
                {...register("email")}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                size="sm"
                label="telefone"
                defaultValue={tecnico?.telefone}
                aria-describedby="exampleFormControlInputHelpInline"
                text={
                  errors.telefone && <div className="text-light bg-danger">{errors.telefone.message}</div>
                }
                {...register("telefone")}
              />
            </CCol>
          </CRow>

        </CForm>
      </Box>
    </AppButtonRoot>
  );
}
