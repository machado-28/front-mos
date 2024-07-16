import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Phone, Title } from "@mui/icons-material";

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
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
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

export default function FormularioCurtaduracao({ clienteId }) {
  const validadeDate = new ValidateData().byInterval;
  const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });

  const addProcessoShema = z.object({
    projecto: z.string().refine(
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
    resolver: zodResolver(addProcessoShema),
    shouldFocusError: true,
    progressive: true
  });

  if (errors) console.log("ERRO", errors);
  const api = useApi();
  const [processo, setProcesso] = useState({});
  const [tipoDocumento, setTipoDocumento] = useState({});
  const [anexos, setAnexos] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [erroFile, setErroFile] = useState("");
  const redirectTo = useNavigate();

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
    pedidoId,
    clienteId,
  }) {
    const formData = new FormData();
    console.log("ANEXOS", file);
    formData.append("anexo", file);

    try {
      console.log("FICHEIROS ID", file.tipoId);

      const response = await api
        .add(
          `upload?clienteId=${clienteId}&pedidoId=${pedidoId}`,
          formData
        )
        .catch(({ error }) => {
          NotifyError("Erro ao enviar o arquivo:", error);
        });
      console.log("Resposta do servidor:", response.data);

    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  }
  async function buscarTipoDocumento() {
    await api.list("tipodocumentos/vistoId/3").then((response) => {
      if (response.status === 200) {
        setAnexos((prev) => response.data);
      }
    });
  }
  async function sendFile({ anexos, pedido, data }) {
    for (let i = 0; i < anexos?.length; i++) {
      console.log("FICHEIROS", anexos[i]);
      await PostFile({
        file: anexos[i],
        pedidoId: pedido?.id,
        clienteId
      });
    }
  }

  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api.add("pedido-visto/tipoId/3", dados).then(async (response) => {
        const { data } = response
        const { pedido } = data;
        console.log("RESPOSTA SUCESSO", response);

        if (response?.status !== 201) {

          console.log("DATAERRO", response);

          setLoading(false);
          NotifyError("não foi possível concluir com o pedido!");

        }
        if (response?.status === 201) {
          for (let i = 0; i < anexos?.length; i++) {
            console.log("FICHEIROS", anexos[i]);
            await PostFile({
              file: anexos[i],
              pedidoId: pedido?.id,
              clienteId: clienteId,
            });
          }
        }
        setLoading(false);
        Notify(response?.data?.message);
        window.location.reload();
      });
    } catch (error) {
      NotifyError("não foi possível concluir com o pedido!");
      console.log(error);
      setLoading(false);

    }
  }
  const [documents, setDocuments] = useState([
    { id: 1, name: "Passaporte" },
    { id: 2, name: "Fotografia" },
    { id: 3, name: "Bilhete de identidade" },
    { id: 4, name: "Compromisso de honra" },
    { id: 4, name: "Contrato de trabalho" },
    { id: 5, name: "Atestado Médico" },
    { id: 6, name: "Certificado de Habilitação" },
    { id: 7, name: "Contrato de Trabalho" },
    { id: 8, name: "Registo Criminal" },
    { id: 9, name: "Currículumn Vitae" },
    { id: 10, name: "Certificado de Vacinação da Febre Amarela" }

  ]);
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
                    accept="image/jpeg, application/pdf"
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
    <>
      <CRow>
        <CCol>
          <CFormSelect
            id="estadoCivil"
            required
            {...register("estadoCivil")}
            label="Estado Civil"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.estadoCivil && (
                <div className="text-light bg-danger">{errors.estadoCivil.message}</div>
              )
            }
            {...register("dataValidadeDocumentoIdentificacao")}
          >
            <option disabled>Selecione</option>
            {[{ name: "Soltero(a)" }, { name: "Casado(a)" }].map((estado) => (
              <option value={estado.name} key={estado.name}>
                {estado.name}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol>
          <CFormSelect
            label="Nacionalidade"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.nacionalidade && (
                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
              )
            }
            required
            {...register("nacionalidade")}
          >
            <option disabled>Nacionalidade</option>
            {listaPais?.map((pais) => (
              <option value={pais.name} key={pais.name}>
                {pais.name}
              </option>
            ))}
          </CFormSelect>
          {errors.nacionalidade && (
            <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
          )}
        </CCol>
      </CRow >
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
            label="Sindicato"
            aria-label=" "
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.sindicato && (
                <div className="text-light bg-danger">{errors.sindicato.message}</div>
              )
            }
            {...register("sindicato")}
          />
        </CCol>
      </CRow>


      <Box pt={1}></Box>

      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            id="pai"
            aria-label=" fd"
            label="Nome do Pai"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors?.filiacao?.pai?.nome && (
                <div className="text-light bg-danger">{errors?.filiacao?.pai?.nome?.message}</div>
              )
            }
            {...register("filiacao.pai.nome")}
          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            id="pai"
            aria-label=" fd"
            label="Nacionalidade (pai)"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors?.filiacao?.pai?.nacionalidade && (
                <div className="text-light bg-danger">{errors?.filiacao?.pai?.nacionalidade?.message}</div>
              )
            }
            {...register("filiacao.pai.nacionalidade")}
          />
        </CCol>

      </CRow>
      <CRow className="mb-4">
        <CCol >
          <CFormInput
            type="text"
            aria-label="fds"
            label="Nome Da Mãe"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.filiacao?.mae?.nome && (
                <div className="text-light bg-danger">{errors.filiacao?.mae?.nome?.message}</div>
              )
            }
            {...register("filiacao.mae.nome")}
          />

        </CCol>
        <CCol>
          <CFormInput
            type="text"
            aria-label="fds"
            label="Nacionalidade (Mãe)"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.filiacao?.mae?.nacionalidade && (
                <div className="text-light bg-danger">{errors.filiacao?.mae?.nacionalidade?.message}</div>
              )
            }
            {...register("filiacao.mae.nacionalidade")}
          />
        </CCol>
      </CRow>
      <Box pt={1}></Box>

      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="text"
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
        <CCol sm={3}>
          <CFormInput
            type="text"
            label="Local  de Emissão"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.passaporte?.localEmissao && (
                <div className="text-light bg-danger">{errors.passaporte?.localEmissao?.message}</div>
              )
            }
            required
            {...register("passaporte.localEmissao")}
          />

        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol>
          <CFormInput
            type="date"
            aria-label="dataEmissaoPassaporte"
            label="Data de Emissão"
            id="dataEmissaoPassaporte"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.passaporte?.dataEmissao && (
                <div className="text-light bg-danger">
                  {errors.passaporte?.dataEmissao?.message}
                </div>
              )
            }
            {...register("passaporte.dataEmissao")}
          />
        </CCol>
        <CCol>
          <CFormInput
            type="date"
            aria-label="dataValidadePassaporte"
            label="Data de validade"
            id="dataValidadePassaporte"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.passaporte?.dataValidade && (
                <div className="text-light bg-danger">
                  {errors.passaporte?.dataValidade?.message}
                </div>
              )
            }
            {...register("passaporte.dataValidade")}
          />
        </CCol>
      </CRow>

      <Box pt={1}></Box>


      <H3 className="mb-4"> DADOS PROFISSIONAIS</H3>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"profissao"}
            id="profissao"
            aria-label="profissao"
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
            type="text"
            ref={"funcao"}
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
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"nomeEmpresa"}
            id="nomeEmpresa"
            aria-label="nomeEmpresa"
            label="Empresa"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.profissionalismo?.nomeEmpresa && (
                <div className="text-light bg-danger">
                  {errors.profissionalismo?.nomeEmpresa?.message}
                </div>
              )
            }
            {...register("profissionalismo.nomeEmpresa")}
          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"emailEmpresa"}
            id="emailEmpresa"
            aria-label="emailEmpresa"
            label="email da empresa"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.profissionalismo?.emailEmpresa && (
                <div className="text-light bg-danger">
                  {errors.profissionalismo?.emailEmpresa?.message}
                </div>
              )
            }
            {...register("profissionalismo.emailEmpresa")}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"telefoneEmpresa"}
            id="telefoneEmpresa"
            aria-label="telefoneEmpresa"
            label="Telefone da Empresa"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.profissionalismo?.telefoneEmpresa && (
                <div className="text-light bg-danger">
                  {errors.profissionalismo?.telefoneEmpresa?.message}
                </div>
              )
            }
            {...register("profissionalismo.telefoneEmpresa")}
          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"enderecoEmpresa"}
            id="enderecoEmpresa"
            aria-label="enderecoEmpresa"
            label="Endereço da Empresa"
            placeholder="Angola,Luanda,av 1 ed A, andar 23"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.profissionalismo?.enderecoEmpresa && (
                <div className="text-light bg-danger">
                  {errors.profissionalismo?.enderecoEmpresa?.message}
                </div>
              )
            }
            {...register("profissionalismo.enderecoEmpresa")}
          />
        </CCol>
      </CRow>


      <H3 className="mb-4"> HOSPEDAGEM EM ANGOLA</H3>
      <CRow>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            ref={"opro"}
            id="we3"
            aria-label=" fd"
            label="Província/Estado"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.enderecoAngola?.provincia && (
                <div className="text-light bg-danger">
                  {errors.enderecoAngola?.provincia.message}
                </div>
              )
            }
            {...register("enderecoAngola.provincia")}
          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            id="23"
            ref={"ocity"}
            aria-label="fds"
            label="Província/Estado"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.enderecoAngola?.cidade && (
                <div className="text-light bg-danger">
                  {errors.enderecoAngola?.cidade?.message}
                </div>
              )
            }
            {...register("enderecoAngola.cidade")}
          />
        </CCol>
        <CCol className="mb-4">
          <CFormInput
            type="text"
            id="2dd3"
            ref={"ocity"}
            aria-label="fdsd"
            label="Comuna"
            aria-describedby="exampleFormControlInputHelpInline"
            text={
              errors.enderecoAngola?.comuna && (
                <div className="text-light bg-danger">
                  {errors.enderecoAngola?.comuna?.message}
                </div>
              )
            }
            {...register("enderecoAngola.comuna")}
          />
        </CCol>
      </CRow>

      <Box pt={2}></Box>

      <H3 className="mb-2"> UPLOD DOS DOCUMENTOS</H3>
      <Paragraph className="mb-4 text-warning">
        Tamanho máximo: 5MB | Formato : PDF , PNG, TTF, JPEG
      </Paragraph>
      <hr className="mb-8"></hr>
      {renderInputGroups()}

      <Box pt={1}></Box>

      <LoadingButton
        className="text-white px-4 w-100"
        color="success"
        type="submit"
        loading={loading}
        variant="contained"
        sx={{ my: 2 }}
      >
        Salvar
      </LoadingButton>

    </>
  );
}
