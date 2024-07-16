import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Folder, FolderCopySharp, Password, Phone, Title } from "@mui/icons-material";

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

    CInputGroup,
    CRow,

} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate } from "react-router-dom";
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

export default function FormAdd() {




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

    const [tipoVistoId, setTipoVistoId] = useState("1");
    const renderForm = () => {
        s
        console.log("ID", tipoVistoId);
        switch (tipoVistoId) {
            case "1":
                return (
                    <FormularioCurtaduracao clienteId={clienteId} on1    ></FormularioCurtaduracao>
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
        <CForm style={{ borderRadius: "none" }}>
            <div className="w-100 d-flex  justify-content-between">
                <H2>Pedido de Visto <Folder></Folder> </H2>
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

            </div><Box pt={4}></Box>

            <Box pt={3}></Box>
            <CRow className="mb-4">
                <CCol>
                    <CFormSelect
                        label="Categoria"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("categoria")}
                    >
                        <option selected aria-readonly>selecione a categoria</option>
                        {[{ name: "1 vez" }, { name: "prorrogação" }]?.map((pais) => (
                            <option value={pais.name} key={pais.name}>
                                {pais.name}
                            </option>
                        ))}
                    </CFormSelect>
                    {errors.nacionalidade && (
                        <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                    )}
                </CCol>
                <CCol>
                    <CFormSelect
                        label="Tipo de Visto"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("nacionalidade")}
                        onChange={(e) => {
                            setTipoVistoId(e.target.value)
                        }}
                    >
                        <option selected aria-readonly>selecione o visto</option>
                        {[{ name: "turismo", }, { name: "Trabalho", }, { name: "Curta duração", }, { name: "fronteira" }]?.map((pais, index) => (
                            <option value={index + 1} key={pais.name}>
                                {pais.name}
                            </option>
                        ))}
                    </CFormSelect>
                    {errors.nacionalidade && (
                        <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                    )}
                </CCol>

            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CFormInput
                        type="text"
                        size="sm"
                        label="insira o ID do beneficiário para preenchimento automático"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
                        }
                        {...register("nome")}
                    />
                </CCol>
                <CCol>
                    <CFormInput
                        type="text"
                        size="sm"
                        readOnly
                        label="Nome do beneficiário"
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
                        size="sm"
                        label="Gênero"
                        readOnly
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("nacionalidade")}
                    >

                        <option aria-readonly>M</option>
                        <option aria-readonly>F</option>


                    </CFormSelect>
                    {errors.nacionalidade && (
                        <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                    )}
                </CCol>
                <CCol>
                    <CFormInput
                        type="date"
                        readOnly
                        size="sm"
                        label="Data de Nascimento"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("nacionalidade")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>

            <CRow className="mb-4">
                <CCol>
                    <CFormInput
                        type="tel"
                        size="sm"
                        readOnly
                        label="Telefone"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("telefone")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="email"
                        size="sm"
                        readOnly
                        label="Email"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("email")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CFormInput
                        type="text"
                        readOnly
                        size="sm"
                        label="País de Nascimento"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("email")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="text"
                        size="sm"
                        readOnly
                        label="Comuna de"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nacionalidade && (
                                <div className="text-light bg-danger">{errors.nacionalidade.message}</div>
                            )
                        }
                        required
                        {...register("email")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <Box pt={2}></Box>
            <FormTecnico></FormTecnico>
            <Box pt={2}></Box>
            {
                renderForm()
            }

            <hr></hr>
        </CForm>
    );
}