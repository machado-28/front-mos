import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Phone } from "@mui/icons-material";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CHeaderDivider,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useState } from "react";
import { useEffect } from "react";

export default function DetalheVisto({ vistoId = 0 }) {
  // Lista de documentos

  const [documents, setDocuments] = useState([
    { id: 1, name: "CARTA DE OPERADORA" },
    { id: 2, name: "PASSAPORTE" },
    { id: 3, name: "FOTOGRAFIA" },
    { id: 4, name: "CONTRATO DE TRABALHO" },
    { id: 5, name: "COMPROMISSO DE HONRA" },
    { id: 6, name: "REGISTO CRIMINAL" },
    { id: 7, name: "ATESTADO MEDICO" },
    { id: 8, name: "CURRÍCULO VITAE" },
    { id: 9, name: "CERTIFICADO DE HABILITAÇÕES" },
    { id: 10, name: "CERTIFICADO DE VACINAÇÃO DE FEBRE AMARELA" },
  ]);

  async function PostData(data) {
    await PostFile();
    const response = await api
      .add("processos", data)
      .then((response) => {
        if (response.status !== 201) {
          const { data } = response;
          console.log("DATA", data);
          NotifyError(response?.data?.message);
        }
        if (response.status === 201) {
          Notify(response?.data?.message);
        }
      })
      .catch(() => {
        NotifyError("Älgo deu Errado");
      });
  }

  const renderInputGroups = () => {
    const groups = [];
    // Loop para criar os grupos de dois documentos
    for (let i = 0; i < documents.length; i += 2) {
      const group = (
        <div key={i} className="input-group">
          {/* Input para o primeiro documento */}
          <input type="file" id={`document-${documents[i].id}`} />
          <label htmlFor={`document-${documents[i].id}`}>
            {documents[i].name}
          </label>
          <CCol className="mb-4">
            {documents[i].name}
            <CInputGroup className="mb-6 position-relative">
              <CFormInput
                formEncType="multipart/form-data"
                text={
                  errors.anexo?.[index] && (
                    <div className="text-light bg-danger">
                      {errors.anexo?.[index].message}
                    </div>
                  )
                }
                aria-describedby="exampleFormControlInputHelpInline"
                itemRef={`document-${documents[i].id}`}
                id={`document-${documents[i + 1].id}`}
                key={`document-${documents[i].id}`}
                htmlFor={`document-${documents[i].id}`}
                accept="image/png, image/jpeg, application/pdf"
                type="file"
                required
                aria-label={doc?.nome}
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
                    text={
                      errors.anexo?.[index] && (
                        <div className="text-light bg-danger">
                          {errors.anexo?.[index].message}
                        </div>
                      )
                    }
                    aria-describedby="exampleFormControlInputHelpInline"
                    itemRef={index}
                    id={`document-${documents[i + 1].id}`}
                    key={`document-${documents[i + 1].id}`}
                    htmlFor={`document-${documents[i + 1].id}`}
                    accept="image/png, image/jpeg, application/pdf"
                    type="file"
                    required
                    aria-label={doc?.nome}
                    onChange={handleFileChange}
                  />
                </CInputGroup>
              </CCol>
            </>
          )}
        </div>
      );
      groups.push(group);
    }
    return groups;
  };

  const api = useApi();
  const [visto, setVisto] = useState({
    dataEmissao: "",
    dataValidade: "",
    numero: "123123",
    cidadao: {
      nome: "XXXXXXXXX",
      numeroPassaporte: "xxxxxxxxxxxxx",
      dataNascimento: "xxxxxxxx",
      nacionalidade: "xxxxxxx",
      consulado: "xxxxxxxxxxx",
      enderecoNascimento: {
        pais: "xxxxxxx",
        municipio: "xxxxxxx",
        municipio: "xxxxxxx",
        provincia: "",
      },
      filiacao: {
        pai: "xxxxxxx",
        mae: "xxxxxxxx",
      },
    },
  });
  const goTo = useNavigate();

  async function buscarVisto() {
    await api
      .list(`vistos/${vistoId}`)
      .then((response) => {
        console.log(response);
        if (response?.status === 200) {
          setVisto((prev) => {
            dataEmissao: "";
            dataValidade: "";
            numero: "123123";
            cidadao: {
              nome: "XXXXXXXXX";
              numeroPassaporte: "xxxxxxxxxxxxx";
              dataNascimento: "xxxxxxxx";
              nacionalidade: "xxxxxxx";
              consulado: "xxxxxxxxxxx";
              enderecoNascimento: {
                pais: "xxxxxxx";
                municipio: "xxxxxxx";
                municipio: "xxxxxxx";
                provincia: "";
              }
              filiacao: {
                pai: "xxxxxxx";
                mae: "xxxxxxxx";
              }
            }
          });
        }
      })
      .catch((error) => {
        goTo("/500");
      });
  }

  useEffect(() => {
    buscarVisto();
  }, []);

  return (
    <SimpleCard title="">
      <H3> INFORMAÇÕES VISTO DE TRABALHO</H3>

      <CForm>
        <SimpleCard title={"Dados do  Visto"}>
          <Box pt={1}></Box>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Codigo "
                disabled
                value={visto?.numero}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Tipo de Visto"
                disabled
                value={visto?.tipo?.nome}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Data de Emissão"
                disabled
                value={visto?.dataEmissao}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Data de Emissão"
                disabled
                value={visto?.dataValidade}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Duração"
                disabled
                value={visto?.duracao}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
          </CRow>
        </SimpleCard>
        <Box pt={1}></Box>
        <SimpleCard title={"Dados Pessoais"}>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Nome Completo"
                aria-label="Antonio Machado"
                disabled
                value={visto?.cidadao?.nome}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Data de Nascimento"
                disabled
                value={visto?.cidadao?.dataNascimento}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Genero"
                disabled
                value={visto?.cidadao?.genero}
                aria-describedby="exampleFormControlInputHelpInline"
              />
            </CCol>
          </CRow>
        </SimpleCard>

        <SimpleCard title="">
          <div>
            <CButton
              type="submit"
              className="text-white px-4 m-2  "
              color="secondary"
            >
              EDITAR
            </CButton>
            <CButton
              type="submit"
              className="text-white px-4 m-2"
              color="success"
            >
              GERAR PDF
            </CButton>
            <CButton
              style={{ background: "red" }}
              type="submit"
              className="text-white px-4 m-2 "
            >
              SAIR
            </CButton>
          </div>
        </SimpleCard>
      </CForm>
    </SimpleCard>
  );
}
const filter = createFilterOptions();
