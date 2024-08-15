import { Box, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React, { useEffect } from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
// import Select from "react-select"
import { Email, Folder, Password, Phone, Title } from "@mui/icons-material";

import {
    CAlert,
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Gestores } from "app/views/Clientes/Gestores/util";
import { Projecto } from "../util";
import { Cliente } from "app/views/Clientes/util";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import { sendMessage } from "app/hooks/socket";
import useNotification from "app/hooks/useNotification";
import "./style.css"
export default function FormAdd() {
    const validadeDate = new ValidateData().byInterval;
    const seisMesesNoFuturo = validadeDate({ date: new Date(), interval: 6 });
    const addProcessoShema = z.object({
        nome: z
            .string()
            .min(1, { message: "Este campo é obrigatorio" })

            .refine(
                (name) => {
                    return capitalize(name);
                },
                { message: "O nome de começar com maiúcula e o restante deve ser minuscula" }
            ),
        gestoresInternoIds: z.array(z.coerce.number()).min(2, 'Selecione pelo menos dois gestores'),
        gestoresExternoIds: z.array(z.coerce.number()).min(2, 'Selecione pelo menos dois gestores'),
        clienteId: z.string().min(1),


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
        progressive: true,
        defaultValues: {}
    });

    if (errors) console.log("ERRO", errors);
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()
    const { clienteId } = useParams()
    const [gestorInterno, setgestorInterno] = useState([]);
    const [gestorExterno, setgestorExterno] = useState([]);
    console.log('PARAMS', clienteId);
    const Gestor = new Gestores();

    async function buscarGestores(params) {
        const externo = await Gestor.buscarTodos({ clienteId: clienteIdSelected, painelId: 5 });
        setgestorExterno(prev => externo);

    }

    async function buscarGestorInterno(params) {
        const interno = await Gestor.buscarTodos({ painelId: 6 });
        console.log("INTERNOS", interno);
        setgestorInterno(prev => interno)


    }

    function handleChangeCliente(event) {
        setClienteId(prev => event?.target?.value);
        console.log("CHANGE CLIENTE", clienteIdSelected);
    }

    const cliente = new Cliente();
    const [clientes, setClientes] = useState([]);
    const [clienteIdSelected, setClienteId] = useState(1);

    async function buscarClientes(params) {
        const res = await cliente.buscarClientes();
        setClientes(prev => res)
    }
    const { createNotification } = useNotification({

    })

    const [selectedGestoresInterno, setSelectedGestoresInterno] = useState([]);
    const handleCheckboxChangeGestoresInterno = (event) => {
        console.log("ESCOLHDOS i", selectedGestoresInterno);
        const personId = parseInt(event.target.value, 10);
        setSelectedGestoresInterno((prevSelected) =>
            prevSelected.includes(personId)
                ? prevSelected.filter((id) => id !== personId)
                : [...prevSelected, personId]
        );
    };

    const [selectedGestoresExterno, setSelectedGestoresExterno] = useState([]);
    const handleCheckboxChangeGestoresExterno = (event) => {
        try {

            console.log("ESCOLHDOS i", selectedGestoresInterno);
            const personId = parseInt(event.target.value, 10);
            setSelectedGestoresExterno((prevSelected) =>
                prevSelected.includes(personId)
                    ? prevSelected.filter((id) => id !== personId)
                    : [...prevSelected, personId]
            );
        } catch (error) {
            console.log(error);
        }
    };

    const projecto = new Projecto
    console.log("ID", clienteIdSelected);

    async function PostData(dados) {
        try {
            console.log("FORMULARIO ", dados);
            setLoading(true);
            const response = await projecto.criar(dados).then(async (response) => {
                if (!response?.data?.message)
                    return;
                if (response?.data?.message) {
                    Notify(response?.data?.message);
                    createNotification({
                        heading: "Novo Projeto",
                        title: `Projeto ${dados.nome} criado com sucesso`,
                        timestamp: Date.now(),
                        path: "/path-to-project",
                    });
                    Notify(response?.data?.message);
                }
                setLoading(false);
                reset()
                console.log("LOGINFFFFFFFF", response?.data?.message);
                reset()
                setSelectedGestoresExterno([])
                selectedGestoresInterno([])

            });
            reset()
        } catch (error) {
            NotifyError(error?.TypeError);
            console.log("LOG ERRO", error);
            setLoading(false);

        }
        finally {
            reset({})
            setSelectedGestoresExterno([])
            setSelectedGestoresInterno([])
            setLoading(false);

        }
    }
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);

    const handleGestoresChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedGestores(value);
    };

    useEffect(() => {
        if (gestorInterno) {
            buscarGestorInterno();
        }

        if (gestorExterno) {
            buscarGestores();
        }
        sendMessage("register", "CRIANDO PROJECTO")
    }, [clienteIdSelected]);
    useEffect(() => {

        buscarClientes();
        if (clienteIdSelected) {
            setSelectedGestoresExterno([])
        }


    }, [clienteIdSelected]);

    const styleInput = {};
    return (
        <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={routeSegments}
                />
            </Box>
            <CAlert color="secondary">
                <div className="w-100 d-flex  justify-content-between">
                    <H2>Cadastro de Projecto   <Folder></Folder> </H2>
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
            </CAlert>
            <Box pt={3}></Box>
            <SimpleCard>
                <CRow className="mb-4">
                    <CCol>
                        <CFormInput
                            size="sm"
                            type="text"
                            label="Nome do projecto"

                            aria-label="Antonio Machado"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
                            }
                            {...register("nome")}
                        />
                    </CCol>
                    <CCol>
                        <CFormSelect
                            label="Cliente"
                            size="sm"

                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.clienteId && (
                                    <div className="text-light bg-danger">{errors.clienteId.message}</div>
                                )
                            }   {...register("clienteId")}
                            // disabled={user?.painel?.nome === "CLIENTE" && true}
                            onChange={handleChangeCliente}

                        > <option disabled>selecione o cliente</option>

                            {clientes?.map((clien) => (
                                <option value={clien?.id} key={clien?.id}>
                                    {clien?.nome}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
            </SimpleCard>
            <CRow className="mb-4 mt-4 w-100 d-flex" style={{ overflow: "auto" }}>
                <CCol md={6}  >

                    <SimpleCard className=" custom-scrollbar">
                        <Typography variant="h6">Selecione Os gestores externos(Cliente)</Typography>
                        {errors.gestoresExternoIds && (
                            <div className="text-light bg-danger">{errors.gestoresExternoIds.message}</div>
                        )}
                        <FormGroup>
                            {gestorExterno?.map((gestor) => (
                                <FormControlLabel
                                    key={gestor?.id}

                                    control={
                                        <Checkbox

                                            value={gestor?.id}
                                            checked={selectedGestoresExterno.includes(gestor?.id)}
                                            {...register("gestoresExternoIds")}
                                            onChange={handleCheckboxChangeGestoresExterno}

                                        />
                                    }
                                    label={gestor?.nome}
                                />
                            ))}
                        </FormGroup>


                    </SimpleCard>

                </CCol>
                <CCol md={6} >

                    <SimpleCard className=" custom-scrollbar">
                        <Typography variant="h6">Selecione Os gestores Internos(Metalica)</Typography>
                        {errors.gestoresInternoIds && (
                            <div className="text-light bg-danger">{errors.gestoresInternoIds.message}</div>
                        )}
                        <FormGroup>
                            {gestorInterno?.map((gestor) => (
                                <FormControlLabel
                                    key={gestor?.id}
                                    control={
                                        <Checkbox
                                            text={
                                                errors.gestoresInternoIds && (
                                                    <div className="text-light bg-danger">{errors.gestoresInternoIds.message}</div>
                                                )
                                            }   {...register("gestoresInternoIds")}
                                            value={gestor?.id}
                                            checked={selectedGestoresInterno.includes(gestor?.id)}
                                            {...register('gestoresInternoIds')}
                                            onChange={handleCheckboxChangeGestoresInterno}

                                        />
                                    }
                                    label={gestor?.nome}
                                />
                            ))}
                        </FormGroup>

                    </SimpleCard>

                </CCol>

            </CRow>
        </CForm >
    );
}
