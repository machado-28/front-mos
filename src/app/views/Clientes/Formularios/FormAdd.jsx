import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Archive, Email, FileCopySharp, FileUploadSharp, Image, LogoDevSharp, Password, Person, Phone, Share, Title } from "@mui/icons-material";

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
import { StyledButton } from "app/views/material-kit/buttons/AppButton";

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
        nomeEmpresa: z.coerce
            .string({ message: "Telefone Incorrecto" })
            .min(2, { message: "Este campo é obrigatorio" }),
        nif: z.coerce
            .string({ message: "Telefone Incorrecto" })
            .min(9, { message: "Este campo é obrigatorio" }),
        site: z.coerce
            .string({ message: "Telefone Incorrecto" }).url("endereço do site inválido!"),


        telefone1: z.coerce
            .string()
            .min(1, { message: "Este campo é obrigatorio" }),
        telefone2: z.coerce
            .string({ message: "Telefone Incorrecto" })
            .min(9, { message: "Este campo é obrigatorio" }),
        email: z.string().email("insira um email válido!").min(1, { message: "Este campo é obrigatorio!" })
        ,
        endereco: z.object({
            provincia: z
                .string()
                .min(1, { message: "Este campo é obrigatorio" })
                .regex(validatePersonNames, "incorrecto")
                .refine(
                    (name) => {
                        return capitalize(name);
                    },
                    { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
                ),
            cidade: z
                .string()
                .min(1, { message: "Este campo é obrigatorio" })
                .regex(validatePersonNames, "incorrecto")
                .refine(
                    (name) => {
                        return capitalize(name);
                    },
                    { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
                ),
            comuna: z
                .string()
                .min(1, { message: "Este campo é obrigatorio" })
                .regex(validatePersonNames, "incorrecto")
                .refine(
                    (name) => {
                        return capitalize(name);
                    },
                    { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
                )
        }),
        ramo: z.string().min(4, { message: "campo obrigatorio" }).regex(validatePersonNames, "incorrecto").refine(
            (name) => {
                return capitalize(name);
            },
            { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
        ),
        usuario: z.string().min(4, { message: "campo obrigatorio" }),
        senha: z.string().min(6, " A senha deve conter no minimo 6 caracteres")
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
    const [error, setError] = useState("");


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
            
            console.log(error);
            setLoading(false);

        }
    }


    return (

        <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
            <div className="w-100 d-flex  justify-content-between">
                <H2>Cadastro de Cliente       <Person></Person> </H2>
                <div>

                    <LoadingButton
                        className="text-white px-4"
                        color="success"
                        type="submit"
                        loading={loading}
                        variant="contained"

                    >
                        Salvar
                    </LoadingButton>
                </div>

            </div>
            <Box pt={4}></Box>

            <SimpleCard

                subtitle={"DADOS DE IDENTIFICAÇÃO DO REPRESENTANTE DA EMPRESA"}
                item
                lg={6}
                md={6}
                sm={12}
                xs={12}
                sx={{ mt: 2 }}
            >

                <CRow className="mb-4">
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Nome"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.nome && (
                                    <div className="text-light bg-danger">{errors?.nome.message}</div>
                                )
                            }
                            label="nome Completo(Representante)"
                            required
                            {...register("nome")}
                        >

                        </CFormInput>
                    </CCol>
                </CRow>

                <CRow className="mb-4">

                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Telefone 1"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.telefone1 && (
                                    <div className="text-light bg-danger">{errors?.telefone1.message}</div>
                                )
                            }
                            label="Telefone 1"
                            required
                            {...register("telefone1")}
                        >

                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Telefone 2"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.telefone2 && (
                                    <div className="text-light bg-danger">{errors?.telefone2.message}</div>
                                )
                            }
                            label="Telefone 2"
                            required
                            {...register("telefone2")}
                        >

                        </CFormInput>
                    </CCol>

                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Email"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.email && (
                                    <div className="text-light bg-danger">{errors?.email.message}</div>
                                )
                            }
                            label="Email"
                            required
                            {...register("email")}
                        >

                        </CFormInput>
                    </CCol>

                </CRow>
                <Box pt={4}></Box>
                <h5>Dados De Acesso</h5>
                <hr></hr>
                <CRow className="mb-4">
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="usuario"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.usuario && (
                                    <div className="text-light bg-danger">{errors?.usuario?.message}</div>
                                )
                            }
                            label="Nome de Usuario"
                            required
                            {...register("usuario")}
                        >

                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="senha"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.senha && (
                                    <div className="text-light bg-danger">{errors.senha?.message}</div>
                                )
                            }
                            label="Senha"
                            required
                            {...register("senha")}
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
                            size="sm"
                            id="Nome"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors?.nomeEmpresa && (
                                    <div className="text-light bg-danger">{errors.nomeEmpresa?.message}</div>
                                )
                            }
                            label="Nome da Empresa"
                            required
                            {...register("nomeEmpresa")}
                        >

                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="nif"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.nif && (
                                    <div className="text-light bg-danger">{errors.nif.message}</div>
                                )
                            }
                            label="NIF"
                            required
                            {...register("nif")}
                        >

                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Website"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.site && (
                                    <div className="text-light bg-danger">{errors.site.message}</div>
                                )
                            }
                            label="Web site"
                            required
                            {...register("site")}
                        >

                        </CFormInput>
                    </CCol>
                </CRow>
                <CRow className="mb-4">
                    <CCol>

                        <CFormInput
                            size="sm"
                            id="ramo"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.ramo && (
                                    <div className="text-light bg-danger">{errors.ramo.message}</div>
                                )
                            }
                            label="Área de actuação"
                            required
                            {...register("ramo")}
                        >

                        </CFormInput>

                    </CCol>
                </CRow>
                <CRow className="mb-4">
                    <h6>Endereço</h6>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Nome"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.endereco?.provincia && (
                                    <div className="text-light bg-danger">{errors.endereco?.provincia.message}</div>
                                )
                            }
                            label="Provincia"
                            required
                            {...register("endereco.provincia")}
                        >
                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="d"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.endereco?.cidade && (
                                    <div className="text-light bg-danger">{errors.endereco?.cidade.message}</div>
                                )
                            }
                            label="cidade"
                            required
                            {...register("endereco.cidade")}
                        >

                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput
                            size="sm"
                            id="Comuna"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.endereco?.comuna && (
                                    <div className="text-light bg-danger">{errors.endereco?.comuna.message}</div>
                                )
                            }
                            label="comuna"
                            required
                            {...register("endereco.comuna")}
                        >

                        </CFormInput>
                    </CCol>
                </CRow>

            </SimpleCard>
        </CForm>
    );
}
