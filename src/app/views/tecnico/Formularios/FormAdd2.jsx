import { Box, TextField } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, createFilterOptions } from "@mui/material";
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

export default function FormAdd() {
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
        formState: { errors }
    } = useForm({
        resolver: zodResolver(addProcessoShema),
        shouldFocusError: true,
        progressive: true
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
                        `upload?emissora=${emissora}&dataValidade=${dataValidade}&dataEmissao=${dataEmissao}&requerenteId=${requerenteId}&clienteId=${clienteId}&tipoId=${file.tipoId}&numero=${numeroPassaporte}`,
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
                        `upload?requerenteId=${requerenteId}&clienteId=${clienteId}&tipoId=${file.tipoId}`,
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

    async function PostData(dados) {
        try {
            setLoading(true);
            const response = await api.add("clientes", dados).then(async (response) => {

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
        <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
            <Box pt={4}></Box>

            <div className="w-100 d-flex  justify-content-between">
                <H2>Cadastro de Técnico   <Folder></Folder> </H2>
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
                        type="text"
                        size="sm"
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
            <CRow>
                <CCol>

                    <Autocomplete
                        options={[{ label: "Antonio Minguito " }]}
                        size="sm"

                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Cliente/Empresa" size="sm" variant="outlined" fullWidth />
                        )}
                    />
                </CCol>
            </CRow>
        </CForm>
    );
}
