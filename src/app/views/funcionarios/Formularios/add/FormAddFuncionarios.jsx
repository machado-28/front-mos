import { Box, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React, { useEffect } from "react";
import { H1, H2, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
// import Select from "react-select"
import { Crop, Email, Folder, Password, Person, Phone, Title } from "@mui/icons-material";

import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Projecto } from "../../util";
import { Cliente } from "app/views/Clientes/util";
import { generateBreadcrumbs } from "app/utils/generateBreadcrumbs";
import { sendMessage } from "app/hooks/socket";
import useNotification from "app/hooks/useNotification";
import "./style.css"
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { useTheme } from "@emotion/react";
export default function FormAddFuncionarios({ setVisible, visible, loading, setLoading }) {
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

    // const vars = {
    //     '--my-css-var': 10,
    //     '--my-another-css-var': "red",
    //     " --cui-accordion-active-color":,
    //     "--cui-accordion-active-bg: #{$accordion-button-active-bg}"
    // }
    const styleInput = {};
    return (
        <AppButtonRoot>
            <div className="example">
                <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>

                    <SimpleCard color="">
                        <div className="w-100 d-flex  justify-content-between">
                            <H2>   <Person></Person></H2>
                            <section className="d-flex">
                                <StyledButton onClick={() => setVisible(prev => false)} className="d-flex align-content-center" size="sm" variant="contained" color="inherit">
                                    Cancelar
                                </StyledButton>
                                <StyledButton onClick={() => setVisible(prev => true)} className="d-flex align-content-center" size="sm" variant="contained" color="success">
                                    Salvar
                                </StyledButton>
                            </section>

                        </div>
                    </SimpleCard>
                    <Box pt={3}></Box>
                    <CRow>

                        <CCol md={9}>
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
                                        <CFormInput
                                            size="sm"
                                            type="text"
                                            label="Nº do documento de identificação"
                                            placeholder="NIF/BI Nº"
                                            aria-label="Antonio Machado"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.nif && <div className="text-light bg-danger">{errors.nif.message}</div>
                                            }
                                            {...register("nif")}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-4">
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="date"
                                            label="data de Nascimento"

                                            aria-label=" "
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.dataNascimento && <div className="text-light bg-danger">{errors.dataNascimento.message}</div>
                                            }
                                            {...register("dataNascimento")}
                                        />
                                    </CCol>

                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="date"
                                            label="data de Admissão"

                                            aria-label=" "
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.dataAdmissao && <div className="text-light bg-danger">{errors.dataAdmissao.message}</div>
                                            }
                                            {...register("dataAdmissao")}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className="mb-4">
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="text"
                                            label="Endereço"
                                            aria-label="Antonio Machado"
                                            placeholder="Ex.: Luanda,Maianga, edifi.23, apt nº 23"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.endereco && <div className="text-light bg-danger">{errors.endereco.message}</div>
                                            }
                                            {...register("endereco")}
                                        />
                                    </CCol>
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="number"
                                            label="telefone 1"

                                            placeholder="Ex.: 999 999 999"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.telefone1 && <div className="text-light bg-danger">{errors.telefone1.message}</div>
                                            }
                                            {...register("telefone1")}
                                        />
                                    </CCol>
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="number"
                                            label="telefone 2"

                                            placeholder="Ex.: 999 999 999"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.telefone2 && <div className="text-light bg-danger">{errors.telefone2.message}</div>
                                            }
                                            {...register("telefone2")}
                                        />
                                    </CCol>
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="email"
                                            label="Email"
                                            placeholder="meunome.completo@mos.com"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.email && <div className="text-light bg-danger">{errors.email.message}</div>
                                            }
                                            {...register("email")}
                                        />
                                    </CCol>
                                </CRow>
                            </SimpleCard>
                            <Box pt={2}></Box>
                            <SimpleCard title={"Dados financeiros"}>
                                <CRow>

                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="iban"
                                            label="iban"
                                            placeholder="AO06 0000 0000 0000 0000 0"
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.iban && <div className="text-light bg-danger">{errors.iban.message}</div>
                                            }
                                            {...register("iban")}
                                        />
                                    </CCol>
                                    <CCol>
                                        <CFormInput
                                            size="sm"
                                            type="number"
                                            label="Salário bruto"
                                            aria-label=""
                                            aria-describedby="exampleFormControlInputHelpInline"
                                            text={
                                                errors.nome && <div className="text-light bg-danger">{errors.nome.message}</div>
                                            }
                                            {...register("nome")}
                                        />
                                    </CCol>
                                </CRow>
                            </SimpleCard>
                            <Box pt={2}></Box>
                            <SimpleCard title={"Dados Profisionais"}>
                                <CRow>
                                    <CCol>
                                        <CFormSelect
                                            label="Departamento"
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
                                </CRow>
                            </SimpleCard>
                        </CCol>
                        <CCol>
                            <CRow>
                                <SimpleCard>
                                    <CAccordion alwaysOpen activeItemKey={2}>
                                        <CAccordionItem itemKey={1}>
                                            <CAccordionHeader>Adicionar Novo Departamento</CAccordionHeader>
                                            <CAccordionBody>

                                                <CCard>
                                                    <CCardHeader>

                                                    </CCardHeader>

                                                </CCard>

                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>


                                </SimpleCard>
                                <Box pt={4}></Box>
                            </CRow>

                        </CCol>

                    </CRow>
                </CForm >

            </div>
        </AppButtonRoot >
    );
}
