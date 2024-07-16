import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React, { useEffect } from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Password, Person, Phone, Title } from "@mui/icons-material";

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
import { Usuario } from "../util";

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
        usuario: z
            .string()
            .min(1, { message: "Este campo é obrigatorio" })
        ,
        painelId: z
            .string()
            .min(1, { message: "Este campo é obrigatorio" })
        ,
        telefone: z
            .string()
            .min(9, { message: "Este campo é obrigatorio" })
        ,
        email: z
            .string().email
            ()
            .min(1, { message: "Este campo é obrigatorio" })
        ,

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


    if (errors) console.log("ERRO", errors);
    const api = useApi();
    const [fileStram, sestFileStream] = useState();

    const [imagePreview, setImagePreview] = useState("https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Free-PNG-Clip-Art.png");
    const [imageId, setImageId] = useState('');
    const [anexos, setAnexos] = useState([]);
    const [fileSize, setFileSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [erroFile, setErroFile] = useState("");

    const [painels, setPainel] = useState([])
    const painel = new Usuario()
    const usuario = new Usuario()
    async function buscarPainel() {
        const res = await painel.painels()

        setPainel(prev => res)
    }
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

    async function PostData(dados) {
        try {
            setLoading(true);
            const res = await PostFile({ file: fileStram });
            console.log("%cAVATAR", "font-size:xx-large; color:blue", res);
            dados.avatarId = res?.data?.documento?.id;
            const response = await api.add("usuarios", dados).then(async (response) => {

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


    useEffect(() => {
        buscarPainel()
    }, [])
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
                                size="sm"
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
                <H2>Cadastro de  Usuário  <Person></Person> </H2>
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
            <img src={imagePreview} loading="lazy" id="image" style={{ height: 100, width: 100 }}></img>
            <CCol>
                <CFormInput
                    formEncType="multipart/form-data"
                    text=""
                    size="sm"
                    htmlFor="image"
                    label="Foto Passe"
                    {...register("image")}
                    aria-describedby="exampleFormControlInputHelpInline"
                    accept="image/png, image/jpeg,"
                    type="file"
                    required
                    onChange={handleFileChange}
                />

            </CCol>
            <CRow className="mb-4 mt-4">
                <CCol>
                    <CFormInput
                        size="sm"
                        type="text"
                        label="Nome Completo"
                        aria-label="Antonio Machado"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
                        }
                        {...register("nome")}
                    />
                </CCol>
                <CCol>
                    <CFormInput
                        size="sm"
                        type="text"
                        label="Usuario"
                        aria-label="Ant "
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.usuario && <div className="text-light bg-danger">{errors.usuario.message}</div>
                        }
                        {...register("usuario")}
                    />
                </CCol>

                <CCol>
                    <CFormSelect
                        size="sm"
                        id="perfil"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.painelId && (
                                <div className="text-light bg-danger">{errors.painelId.message}</div>
                            )
                        }
                        label="Peril"
                        required
                        {...register("painelId")}
                    >
                        <option disabled>selecione o perfil</option>
                        {painels?.map((perfil) => (
                            <option value={perfil?.id} key={perfil?.nome}>{perfil.nome}</option>
                        ))}
                    </CFormSelect>
                </CCol>
            </CRow>


            <Box pt={1}></Box>
            <CRow className="mb-4">
                <CCol>
                    <CInputGroup size="sm" className="mb-6 position-relative">
                        <CInputGroupText size="sm" id="n3come">
                            <Phone></Phone>
                        </CInputGroupText>

                        <CFormInput
                            size="sm"
                            type="number"
                            aria-label="telefone"
                            placeholder="Telefone"
                            aria-describedby="n3ome"
                            {...register("telefone")}
                        />
                    </CInputGroup>
                    {errors.telefone && (
                        <div className="text-light bg-danger">{errors.telefone.message}</div>
                    )}
                </CCol>
                <CCol className="mb-4">
                    <CInputGroup size="sm" className="mb-6 position-relative">
                        <CInputGroupText id="n3come">
                            <Email></Email>
                        </CInputGroupText>
                        <CFormInput
                            type="email"
                            placeholder="Email"
                            size="sm"
                            aria-label="email"
                            aria-describedby="n3ome"
                            {...register("email")}
                        />
                    </CInputGroup>
                    {errors.email && (
                        <div className="text-light bg-danger">{errors.email.message}</div>
                    )}
                </CCol>
                <CCol className="mb-4">
                    <CInputGroup size="sm" className="mb-6 position-relative">
                        <CInputGroupText size="sm" id="senha">
                            <Password></Password>
                        </CInputGroupText>
                        <CFormInput
                            size="sm"
                            type="password"
                            placeholder="Senha"
                            aria-label="Senha"
                            aria-describedby="senha"
                            {...register("senha")}
                        />
                    </CInputGroup>
                    {errors?.senha && (
                        <div className="text-light bg-danger">{errors?.senha?.message}</div>
                    )}
                </CCol>
            </CRow>

        </CForm >
    );
}
