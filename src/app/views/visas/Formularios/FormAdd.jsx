import { Box, Icon, IconButton } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H2, H3, H4, H5, Paragraph } from "app/components/Typography";
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
    CModalBody,
    CModalFooter,
    CRow,
    CSpinner,

} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { useNavigate, useParams } from "react-router-dom";
import { functions, min, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { listaPais } from "app/utils/paises";
import { Notify, NotifyError, NotifyInfo } from "app/utils/toastyNotification";
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
import { Tecnico } from "../../tecnico/util";
import { useEffect } from "react";
import vistoShema from "./schemas/vistoShema";
import { formatFileSize } from "app/utils/file";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import Processo from "../util";
import AddvistoShema from "./schemas/AddvistoShema";

export default function FormAdd({ loading, submitVisto, processoId, clienteId, ProjectoId, beneficiarioId }) {
    const {
        register,
        reset,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(AddvistoShema),
        shouldFocusError: true,
        progressive: true
    });

    const fileSchema = z.object({
        name: z.string(),
        size: z.number().max(2048 * 1024, { message: 'O arquivo não pode ter mais de 2MB.' }),
        type: z.string().refine(type => ['image/jpeg', 'application/pdf', 'video/mp4'].includes(type), { message: 'Tipo de arquivo inválido.' })
    });

    const [files, setFiles] = useState([]);
    const [fileSize, setFileSize] = useState(null);
    const [error, setError] = useState("");
    const [erroFile, setErroFile] = useState("");

    const { user } = useAuth();
    const api = useApi()

    return (
        <CForm onSubmit={handleSubmit(submitVisto)}>
            <CModalBody>
                <CAlert color="secondary">

                </CAlert>
                <CRow className="mb-4">
                    <CCol>
                        <CFormInput size="sm" placeholder="ex.984P3A" label="Nº do Visto" >
                        </CFormInput>
                    </CCol>

                </CRow >
                <CRow className="mb-4">
                    <CCol>
                        <CFormInput type="date" size="sm" label="Data de Emissão" >
                        </CFormInput>
                    </CCol>
                    <CCol>
                        <CFormInput type="date" size="sm" label="Data de Entrega" >
                        </CFormInput>
                    </CCol>
                </CRow>
                <CRow className="mb-4">
                    <CCol>
                        <CFormInput label={"Anexo(pdf/jpeg)"} type="file" size="sm"></CFormInput>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <CFormTextarea size="sm" label="Descrição" placeholder="Escreva aqui.." >

                        </CFormTextarea>
                    </CCol>
                </CRow>
            </CModalBody>


            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisibleRegistarVisto(false)}>
                    Cancelar
                </CButton>
                {loading ? (
                    <CSpinner></CSpinner>
                ) : (
                    <CButton type="submit" color="primary">
                        Enviar
                    </CButton>
                )}
            </CModalFooter>
        </CForm>

    );
}