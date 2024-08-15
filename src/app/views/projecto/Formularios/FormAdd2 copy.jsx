import { Box } from "@mui/material";
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
        gestorInternoId: z.string(),


        gestorExternoId: z.string(),
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
        const interno = await Gestor.buscarTodos({ clienteId, painelId: 6 });
        const externo = await Gestor.buscarTodos({ clienteId: clienteIdSelectedt, painelId: 5 });
        setgestorExterno(prev => externo);
        setgestorInterno(prev => user?.painel?.nome === "CLIENTE" ? [] : interno)
    }

    function handleChangeCliente(event) {
        setClienteId(prev => event?.target?.value);
        console.log("CHANGE CLIENTE", clienteIdSelectedt);
    }

    const cliente = new Cliente();
    const [clientes, setClientes] = useState([]);
    const [clienteIdSelectedt, setClienteId] = useState();

    async function buscarClientes(params) {
        const res = await cliente.buscarClientes();
        setClientes(prev => res)
    }
    const { createNotification } = useNotification({

    })
    useEffect(() => {
        buscarClientes();
        sendMessage("register", "CRIANDO PROJECTO")
    }, []);
    useEffect(() => {
        if (clienteIdSelectedt) {
            buscarGestores();
        }

    }, [clienteIdSelectedt]);

    const [selectedGestoresInterno, setSelectedGestoresInterno] = useState([]);
    const handleCheckboxChangeGestoresInterno = (event) => {
        const personId = parseInt(event.target.value, 10);
        setSelectedGestoresInterno((prevSelected) =>
            prevSelected.includes(personId)
                ? prevSelected.filter((id) => id !== personId)
                : [...prevSelected, personId]
        );
    };
    const projecto = new Projecto
    console.log("ID", clienteIdSelectedt);
    async function PostData(dados) {

        try {

            console.log("FORMULARIO ", dados);
            setLoading(true);
            const response = await projecto.criar(dados).then(async (response) => {
                setLoading(false);
                reset()
                console.log("LOGINFFFFFFFF", response?.data?.message);

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

                reset()
            });
            reset()
        } catch (error) {
            NotifyError(error?.TypeError);
            console.log("LOG ERRO", error);
            setLoading(false);

        }
    }
    const location = useLocation();
    const routeSegments = generateBreadcrumbs(location);

    const handleGestoresChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedGestores(value);
    };
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
            <CRow className="mb-4">
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
            <CRow className="mb-4">
                <CCol>
                    <CFormSelect
                        label="Gestor Interno"
                        size="sm"
                        value={selectedGestores}
                        // multiple={true}
                        min={2}
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.gestorInternoId && (
                                <div className="text-light bg-danger">{errors.gestorInternoId.message}</div>
                            )
                        }
                        // disabled={user?.painel?.nome === "CLIENTE" && true}
                        readOnly={user?.painel?.nome === "CLIENTE" && true}
                        defaultValue={undefined}
                        onChange={handleGestoresChange}
                        {...register("gestorInternoId")}
                    > <option value={""} selected>selecione o gestor 1</option>

                        {gestorInterno?.map((client) => (
                            <option value={client?.id} key={client?.id + "12"}>
                                {client?.nome}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol>

                    <CFormSelect
                        label="Gestor Externo"
                        // multiple={true}
                        min={2}
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.gestorExternoId && (
                                <div className="text-light bg-danger">{errors.gestorExternoId.message}</div>
                            )
                        }
                        size="sm"
                        required
                        {...register("gestorExternoId")}
                    >
                        <option value={null}>selecione o gestor 2</option>
                        {gestorExterno?.map((gest) => (
                            <option value={gest?.id} key={gest?.nome}>
                                {gest?.nome}
                            </option>
                        ))}
                    </CFormSelect>

                </CCol>
                <CCol>
                    {/* <div>
                        <label>Managers:</label>
                        <Select
                            isMulti
                            options={gestorExterno}
                            value={selectedGestores}
                            onChange={handleGestoresChange}
                            styles={{ menu: (provided) => ({ ...provided, maxHeight: 200, overflowY: 'auto' }) }}
                        />
                    </div> */}
                </CCol>
            </CRow>
        </CForm >
    );
}
