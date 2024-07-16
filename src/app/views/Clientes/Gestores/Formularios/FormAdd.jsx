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
import useAuth from "app/hooks/useAuth";
import { Gestores } from "../util";

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

        senha: z
            .string().min(6, "a Senha deve ser no mínimo 6 caracteres"),
        usuario:
            z.string().min(1, "obrigatorio"),
        email:
            z.string().min(1, "obrigatorio").email(),
        telefone:
            z.string().min(9, "obrigatorio")

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

    let { clienteId } = useParams()


    const gestor = new Gestores()
    async function PostData(dados) {
        try {
            setLoading(true);
            dados.clienteId = clienteId;
            dados.painelId = 5;
            const response = await gestor.criar({ data: dados });
            setLoading(false);
            Notify(response?.data?.message);
            if (response) window.location.reload()

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


            <div className="w-100 d-flex  justify-content-between">
                <H2>Cadastro de  Gestor(responsável) de Projecto <Folder></Folder> </H2>
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
                        label="Nome "
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
                    <CFormInput
                        type="text"
                        size="sm"
                        label="Usuário"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.usuario && (
                                <div className="text-light bg-danger">{errors?.usuario?.message}</div>
                            )
                        }
                        required
                        {...register("usuario")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="tel"
                        size="sm"
                        label="Senha"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.senha && (
                                <div className="text-light bg-danger">{errors.senha.message}</div>
                            )
                        }
                        required
                        {...register("senha")}
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
                            errors.telefone && (
                                <div className="text-light bg-danger">{errors.telefone.message}</div>
                            )
                        }
                        required
                        {...register("telefone")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="tel"
                        size="sm"
                        label="Email"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.email && (
                                <div className="text-light bg-danger">{errors.email.message}</div>
                            )
                        }
                        required
                        {...register("email")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>

        </CForm>
    );
}
