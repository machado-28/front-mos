import { Box } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, H4, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, Folder, FolderCopySharp, Password, Phone, Title } from "@mui/icons-material";

import {
    CAlert,
    CBadge,
    CButton,
    CCallout,
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
    CListGroup,
    CListGroupItem,
    CRow,

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
import FormularioCurtaduracao from "./FormularioCurtaDuracao";
import FormularioTrabalho from "./FormularioTrabalho";
import FormularioFronteira from "./FormularioFronteira";
import FormularioTurismo from "./FormularioTurismo";
import useAuth from "app/hooks/useAuth";
import { Tecnico } from "../../tecnico/util";
import { useEffect } from "react";

export default function FormAdd() {

    let { clienteId, gestorId } = useParams();
    const { user } = useAuth();

    let gestorInternoId = undefined;
    let gestorExternoId = undefined;

    if (user.clienteId) {
        clienteId = user?.clienteId
        gestorExternoId = gestorId;

    }
    else {
        gestorInternoId = gestorId;
        gestorExternoId = gestorId;
    }
    const tecnicoClass = new Tecnico()
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoSelected, setTecnicoSelected] = useState({});
    const [imagePreview, setImagePreview] = useState("https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Free-PNG-Clip-Art.png")

    async function buscarTecnicos() {
        let tecni = await tecnicoClass.buscarTodos({ clienteId });
        setTecnicos(prev => tecni);
    }

    useEffect(() => {
        buscarTecnicos();
    }, [

    ]);

    function handleTecnico(e) {
        setTecnicoSelected(prev => tecnicos.filter((tec) => tec?.id == e?.target?.value)[0]);
    }

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
                        `upload?emissora
                        =${emissora}
                        &dataValidade=
                        ${dataValidade}
                        &dataEmissao=
                        ${dataEmissao}
                        &requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}
                        &numero=${numeroPassaporte}`,
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
                        `upload?requerenteId=
                        ${requerenteId}
                        &clienteId=${clienteId}
                        &tipoId=${file.tipoId}`,
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

    const [tipoVistoId, setTipoVistoId] = useState("1");
    const renderForm = () => {
        console.log("ID", tipoVistoId);
        switch (tipoVistoId) {
            case "1":
                return (
                    <FormularioCurtaduracao>

                    </FormularioCurtaduracao>
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
                <CCol md="2">
                    <CFormSelect
                        label="Tipo de Visto"
                        aria-describedby="exampleFormControlInputHelpInline"

                        required

                        onChange={(e) => {
                            setTipoVistoId(e.target.value)
                        }}
                    >
                        <option selected aria-readonly>selecione o visto</option>
                        {[{ name: "Turismo", }, { name: "Trabalho", }, { name: "Curta duração", }, { name: "fronteira" }]?.map((visto, index) => (
                            <option value={index + 1} key={visto.name}>
                                {visto.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>


            </div><Box pt={4}></Box>
            {
                renderForm()
            }

            <hr></hr>
        </CForm>
    );
}