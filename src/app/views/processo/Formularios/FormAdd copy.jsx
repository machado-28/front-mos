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
import useAuth from "app/hooks/useAuth";
import { Tecnico } from "../../tecnico/util";
import { useEffect } from "react";
import vistoShema from "./schemas/vistoShema";
import { formatFileSize } from "app/utils/file";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";

export default function FormAdd() {
    const {
        register,
        reset,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(vistoShema),
        shouldFocusError: true,
        progressive: true
    });

    const fileSchema = z.object({
        name: z.string(),
        size: z.number().max(2048 * 1024, { message: 'O arquivo não pode ter mais de 2MB.' }),
        type: z.string().refine(type => ['image/jpeg', 'application/pdf', 'video/mp4'].includes(type), { message: 'Tipo de arquivo inválido.' })
    });

    const [files, setFiles] = useState([]);
    const [fileSize, setFileSize] = useState([]);
    const [error, setError] = useState("");
    const [erroFile, setErroFile] = useState("");
    let { clienteId, gestorId } = useParams();
    const { user } = useAuth();

    const handleFileChange = (event, inputId) => {
        const file = event.target.files[0];
        if (file) {
            const validation = fileSchema.safeParse(file);
            if (!validation.success) {
                setError((prev) => ({ ...prev, [inputId]: validation.error.errors[0].message }));
                return;
            } else {
                setFiles((prev) => ({ ...prev, [inputId]: file }));
                setError((prev) => ({ ...prev, [inputId]: '' }));
            }
        }
    };

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


    const [loading, setLoading] = useState(false)

    const [tipoVistoId, setTipoVistoId] = useState("1");
    ///FORMULARIOS 
    const FormularioCurtaduracao = () => (
        <>
            <div className="w-100 d-flex  justify-content-between">
                <H3 color={"info"}> Curta Duração  </H3>
                <div className="d-flex">
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

            <CCallout>
                <div>
                    <img src={tecnicoSelected?.avatar?.url || imagePreview} id="image" style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

                    <CRow className="mt-4">

                        <CCol>
                            <CFormSelect
                                label="Beneficiário"
                                aria-describedby="exampleFormControlInputHelpInline"
                                text={
                                    errors.beneficiarioId && (
                                        <div className="text-light bg-danger">{errors.beneficiarioId.message}</div>
                                    )
                                }
                                required
                                {...register("beneficiarioId")}
                                onChange={handleTecnico}
                            >
                                <option selected aria-readonly>selecione o benediciário</option>
                                {tecnicos?.map((tec, index) => (
                                    <option value={tec?.id} key={index}>
                                        {tec.nome}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol>
                            <CFormSelect
                                label="Categoria"
                                aria-describedby="exampleFormControlInputHelpInline"
                                text={
                                    errors.tipoId && (
                                        <div className="text-light bg-danger">{errors.tipoId.message}</div>
                                    )
                                }
                                required
                                {...register("tipoId")}
                            >
                                <option selected aria-readonly>selecione a categoria</option>
                                {[{ name: "1 vez", value: 1 }, { value: 2, name: "prorrogação" }]?.map((tipo) => (
                                    <option value={tipo.value} key={tipo.name}>
                                        {tipo.name}
                                    </option>
                                ))}
                            </CFormSelect>
                            {errors.tipoId && (
                                <div className="text-light bg-danger">{errors.tipoId.message}</div>
                            )}
                        </CCol>
                    </CRow>
                </div>
            </CCallout>
            <Box pt={4}></Box>
            <CRow className="mb-4 mt-4">
                <CCol md="1">
                    <CFormInput
                        type="text"
                        size="sm"
                        label="ID"
                        aria-describedby="exampleFormControlInputHelpInline"
                        disabled
                        value={tecnicoSelected?.id}
                    />
                </CCol>
                <CCol  >
                    <CFormInput
                        type="text"
                        size="sm"
                        readOnly
                        label="Nome do beneficiário"

                        value={tecnicoSelected?.nome}
                        aria-describedby="exampleFormControlInputHelpInline"

                    />
                </CCol>
                <CCol md="2">
                    <CFormInput
                        type="tel"
                        size="sm"
                        readOnly
                        label="Telefone"
                        aria-describedby="exampleFormControlInputHelpInline"

                        value={tecnicoSelected?.telefone}
                    >

                    </CFormInput>
                </CCol>
                <CCol md="2">
                    <CFormInput
                        type="email"
                        size="sm"
                        readOnly
                        label="Email"
                        aria-describedby="exampleFormControlInputHelpInline"
                        value={tecnicoSelected?.email}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <Box pt={2}></Box>

            <CRow className="mb-4">
                <CCol>
                    <CFormInput
                        type="text"

                        size="sm"
                        label="Nº do Passaporte"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.numero && (
                                <div className="text-light bg-danger">{errors.passaporte?.numero.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.numero")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="date"
                        size="sm"
                        label="Data de emissão"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.dataEmissao && (
                                <div className="text-light bg-danger">{errors.passaporte?.dataEmissao.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.dataEmissao")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="date"
                        size="sm"

                        label="Data de validade"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.dataValidade && (
                                <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.dataValidade")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CFormInput text={
                        errors.consulado && (
                            <div className="text-light bg-danger">{errors.consulado.message}</div>
                        )
                    }
                        required
                        {...register("consulado")} label="Consulado" size="sm">

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput text={
                        errors.funcao && (
                            <div className="text-light bg-danger">{errors.funcao.message}</div>
                        )
                    }
                        required
                        {...register("funcao")} label="Função" size="sm">

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput type="date" text={

                        errors.mob && (
                            <div className="text-light bg-danger">{errors.mob.message}</div>
                        )
                    }
                        required
                        {...register("mob")} label="Data estimada de Chegada" size="sm">

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput text={
                        errors.localProjecto && (
                            <div className="text-light bg-danger">{errors.localProjecto.message}</div>
                        )
                    }
                        required
                        {...register("localProjecto")} label="Local do projecto" size="sm">

                    </CFormInput>
                </CCol>
            </CRow>
            <Box pt={2}></Box>


            {/* <H3>Documentos necessários</H3>
            <CAlert color="info">
                {
                    [" Cópia do Passaporte (Formato PDF ou JPEG) *"].map((doc, index) => (
                        <CListGroup>

                            <CListGroupItem key={index + 1} className="d-flex justify-content-between align-items-center">
                                {doc}
                                <CBadge color="primary" shape="rounded-pill">
                                    obrigatorio
                                </CBadge>

                            </CListGroupItem>
                        </CListGroup>
                    ))}

            </CAlert> */}
            {/* <H5 className="mb-2"> UPLOD DOS DOCUMENTOS</H5>
            <Paragraph className="mb-4 text-info">
                Tamanho máximo: 5MB | Formato : PDF, JPEG
            </Paragraph>
            <hr className="mb-8"></hr>
            <Box pt={1}></Box>

            <CCol>
                <CInputGroup className="mb-6 position-relative">
                    <CFormInput
                        formEncType="multipart/form-data"
                        text=""
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf"
                        type="file"
                        required

                    />
                </CInputGroup>
            </CCol> */}

        </>
    )


    const FormularioFronteira = () => (
        <>
            <div className="w-100 d-flex  justify-content-between">
                <H3 color={"info"}> FRONTEIRA </H3>
                <div className="d-flex">
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
            <CCallout>
                <div>
                    <img src={tecnicoSelected?.avatar?.url || imagePreview} id="image" style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

                    <CRow className="mt-4">

                        <CCol>
                            <CFormSelect
                                label="Beneficiário"
                                aria-describedby="exampleFormControlInputHelpInline"
                                text={
                                    errors.beneficiarioId && (
                                        <div className="text-light bg-danger">{errors.beneficiarioId.message}</div>
                                    )
                                }
                                required
                                {...register("beneficiarioId")}
                                onChange={handleTecnico}
                            >
                                <option selected aria-readonly>selecione o benediciário</option>
                                {tecnicos?.map((tec, index) => (
                                    <option value={tec?.id} key={index}>
                                        {tec.nome}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol>
                            <CFormSelect
                                label="Categoria"
                                aria-describedby="exampleFormControlInputHelpInline"
                                text={
                                    errors.tipoId && (
                                        <div className="text-light bg-danger">{errors.tipoId.message}</div>
                                    )
                                }
                                required
                                {...register("tipoId")}
                            >
                                <option selected aria-readonly>selecione a categoria</option>
                                {[{ name: "1 vez", value: 1 }, { value: 2, name: "prorrogação" }]?.map((tipo) => (
                                    <option value={tipo.value} key={tipo.name}>
                                        {tipo.name}
                                    </option>
                                ))}
                            </CFormSelect>
                            {errors.tipoId && (
                                <div className="text-light bg-danger">{errors.tipoId.message}</div>
                            )}
                        </CCol>

                    </CRow>

                </div>
            </CCallout>
            <Box pt={4}></Box>
            <CRow className="mb-4 mt-4">
                <CCol md="1">
                    <CFormInput
                        type="text"
                        size="sm"
                        label="ID"
                        aria-describedby="exampleFormControlInputHelpInline"
                        disabled
                        value={tecnicoSelected?.id}

                    />
                </CCol>
                <CCol  >
                    <CFormInput
                        type="text"
                        size="sm"
                        readOnly
                        label="Nome do beneficiário"

                        value={tecnicoSelected?.nome}
                        aria-describedby="exampleFormControlInputHelpInline"

                    />
                </CCol>
                <CCol md="2">
                    <CFormInput
                        type="tel"
                        size="sm"
                        readOnly
                        label="Telefone"
                        aria-describedby="exampleFormControlInputHelpInline"

                        value={tecnicoSelected?.telefone}
                    >

                    </CFormInput>
                </CCol>
                <CCol md="2">
                    <CFormInput
                        type="email"
                        size="sm"
                        readOnly
                        label="Email"
                        aria-describedby="exampleFormControlInputHelpInline"
                        value={tecnicoSelected?.email}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <Box pt={2}></Box>

            <CRow className="mb-4">
                <CCol>
                    <CFormInput
                        type="text"

                        size="sm"
                        label="Nº do Passaporte"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.numero && (
                                <div className="text-light bg-danger">{errors.passaporte?.numero.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.numero")}
                    >
                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="date"
                        size="sm"

                        label="Data de emissão"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.dataEmissao && (
                                <div className="text-light bg-danger">{errors.passaporte?.dataEmissao.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.dataEmissao")}
                    >

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput
                        type="date"
                        size="sm"

                        label="Data de validade"
                        aria-describedby="exampleFormControlInputHelpInline"
                        text={
                            errors.passaporte?.dataValidade && (
                                <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                            )
                        }
                        required
                        {...register("passaporte.dataValidade")}
                    >

                    </CFormInput>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CFormInput text={
                        errors.consulado && (
                            <div className="text-light bg-danger">{errors.consulado.message}</div>
                        )
                    }
                        required
                        {...register("consulado")} label="ConsuladoF" size="sm">

                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput text={
                        errors.funcao && (
                            <div className="text-light bg-danger">{errors.funcao.message}</div>
                        )
                    }
                        required
                        {...register("funcao")} label="Função" size="sm">
                    </CFormInput>
                </CCol>
                <CCol>
                    <CFormInput type="date" text={
                        errors.mob && (
                            <div className="text-light bg-danger">{errors.mob.message}</div>
                        )
                    }
                        required
                        {...register("mob")} label="Data estimada de Chegada" size="sm">
                    </CFormInput>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol>
                    <CFormInput text={
                        errors.filiacao?.nomeMae && (
                            <div className="text-light bg-danger">{errors.filiacao?.nomeMae.message}</div>
                        )
                    }
                        required
                        {...register("filiacao.nomeMae")} label="Nome da Mãe" size="sm">

                    </CFormInput>
                </CCol>
            </CRow>
            <Box pt={2}></Box>


            <H3>Documentos necessários</H3>
            <CAlert color="info">
                {
                    [" Cópia do Passaporte (Formato PDF ou JPEG) *"].map((doc, index) => (
                        <CListGroup>

                            <CListGroupItem key={index + 1} className="d-flex justify-content-between align-items-center">
                                {doc}
                                <CBadge color="primary" shape="rounded-pill">
                                    obrigatorio
                                </CBadge>

                            </CListGroupItem>
                        </CListGroup>
                    ))}

            </CAlert>
            <H5 className="mb-2"> UPLOD DOS DOCUMENTOS</H5>
            <Paragraph className="mb-4 text-info">
                Tamanho máximo: 5MB | Formato : PDF, JPEG
            </Paragraph>
            <hr className="mb-8"></hr>
            <Box pt={1}></Box>

            <CCol>
                <CInputGroup className="mb-6 position-relative">
                    <CFormInput
                        formEncType="multipart/form-data"
                        text=""
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf"
                        type="file"
                        required

                    />
                </CInputGroup>
            </CCol>
        </>
    )

    const FormularioTrabalho = () => (<>
        <div className="w-100 d-flex  justify-content-between">
            <H3 color={"info"}> TRABALHO  </H3>

            <div className="d-flex">

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
        <CCallout>
            <div>
                <img src={tecnicoSelected?.avatar?.url || imagePreview} id="image" style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

                <CRow className="mt-4">

                    <CCol>
                        <CFormSelect
                            label="Beneficiário"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.beneficiarioId && (
                                    <div className="text-light bg-danger">{errors.beneficiarioId.message}</div>
                                )
                            }
                            required
                            {...register("beneficiarioId")}
                            onChange={handleTecnico}
                        >
                            <option selected aria-readonly>selecione o benediciário</option>
                            {tecnicos?.map((tec, index) => (
                                <option value={tec?.id} key={index}>
                                    {tec.nome}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol>
                        <CFormSelect
                            label="Categoria"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.tipoId && (
                                    <div className="text-light bg-danger">{errors.tipoId.message}</div>
                                )
                            }
                            required
                            {...register("tipoId")}
                        >
                            <option selected aria-readonly>selecione a categoria</option>
                            {[{ name: "1 vez", value: 1 }, { value: 2, name: "prorrogação" }]?.map((tipo) => (
                                <option value={tipo.value} key={tipo.name}>
                                    {tipo.name}
                                </option>
                            ))}
                        </CFormSelect>
                        {errors.tipoId && (
                            <div className="text-light bg-danger">{errors.tipoId.message}</div>
                        )}
                    </CCol>

                </CRow>

            </div>
        </CCallout>
        <Box pt={4}></Box>


        <CRow className="mb-4 mt-4">
            <CCol md="1">
                <CFormInput
                    type="text"
                    size="sm"

                    label="ID"
                    aria-describedby="exampleFormControlInputHelpInline"
                    disabled
                    value={tecnicoSelected?.id}

                />
            </CCol>
            <CCol  >
                <CFormInput
                    type="text"
                    size="sm"
                    readOnly
                    label="Nome do beneficiário"

                    value={tecnicoSelected?.nome}
                    aria-describedby="exampleFormControlInputHelpInline"

                />
            </CCol>
            <CCol md="2">
                <CFormInput
                    type="tel"
                    size="sm"
                    readOnly
                    label="Telefone"
                    aria-describedby="exampleFormControlInputHelpInline"

                    value={tecnicoSelected?.telefone}
                >

                </CFormInput>
            </CCol>
            <CCol md="2">
                <CFormInput
                    type="email"
                    size="sm"
                    readOnly
                    label="Email"
                    aria-describedby="exampleFormControlInputHelpInline"
                    value={tecnicoSelected?.email}
                >

                </CFormInput>
            </CCol>
        </CRow>
        <Box pt={2}></Box>

        <CRow className="mb-4">
            <CCol>
                <CFormInput
                    type="text"

                    size="sm"
                    label="Nº do Passaporte"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.numero && (
                            <div className="text-light bg-danger">{errors.passaporte?.numero.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.numero")}
                >

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput
                    type="date"
                    size="sm"

                    label="Data de emissão"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.dataEmissao && (
                            <div className="text-light bg-danger">{errors.passaporte?.dataEmissao.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.dataEmissao")}
                >

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput
                    type="date"
                    size="sm"

                    label="Data de validade"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.dataValidade && (
                            <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.dataValidade")}
                >

                </CFormInput>
            </CCol>
        </CRow>
        <CRow className="mb-4">
            <CCol>
                <CFormInput text={
                    errors.consulado && (
                        <div className="text-light bg-danger">{errors.consulado.message}</div>
                    )
                }
                    required
                    {...register("consulado")} label="ConsuladoF" size="sm">

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput text={
                    errors.funcao && (
                        <div className="text-light bg-danger">{errors.funcao.message}</div>
                    )
                }
                    required
                    {...register("funcao")} label="Função" size="sm">

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput type="date" text={

                    errors.mob && (
                        <div className="text-light bg-danger">{errors.mob.message}</div>
                    )
                }
                    required
                    {...register("mob")} label="Data estimada de Chegada" size="sm">

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput text={
                    errors.localProjecto && (
                        <div className="text-light bg-danger">{errors.localProjecto.message}</div>
                    )
                }
                    required
                    {...register("localProjecto")} label="Local do projecto" size="sm">

                </CFormInput>
            </CCol>
        </CRow>
        <Box pt={2}></Box>


        <H3>Documentos necessários</H3>
        <Paragraph className="mb-4 text-info">
            {erroFile ? (
                <CAlert color="danger">  <i>{erroFile}</i> </CAlert>

            ) : <CAlert color="success">  <i>Tamanho máximo para cada arquivo: 2MB</i> </CAlert>}
        </Paragraph>
        <CAlert color="secondary">
            <CRow>
                <input accept="image/*" className="input" id="icon-button-file" type="file" />
                <label htmlFor="icon-button-file">
                    <IconButton
                        color="primary"
                        component="span"
                        className="button"
                        aria-label="Upload picture"
                    >
                        <Icon>photo_camera</Icon>
                    </IconButton>
                </label>
                <CCol className="" >
                    <CFormInput
                        formEncType="multipart/form-data"
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf,video/mp4"
                        type="file"

                        label={documentosTrabalho[0]}
                        // text={
                        //     fileSize && (
                        //         <div className="text-back">{formatFileSize(fileSize?.[index + 1])}</div>
                        //     )}
                        onChange={(event) => handleFileChange(event, { setError: setErroFile, setFiles: setFiles })}

                    />
                </CCol>
                <CCol className="mb-4" >
                    <input accept="image/*" className="input" id="contained-button-file" multiple type="file" />
                    <label htmlFor={documentosTrabalho[1]}>
                        <StyledButton variant="contained" component="span">
                            Upload
                        </StyledButton>
                    </label>
                    <input accept="image/*" className="input" id="contained-button-file" multiple type="file" />
                    <label htmlFor="contained-button-file">
                        <StyledButton variant="contained" component="span">
                            Upload
                        </StyledButton>
                    </label>
                    <CFormInput
                        className="d-none"
                        id={documentosTrabalho[1]}
                        formEncType="multipart/form-data"
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf,video/mp4"
                        type="file"

                        label={files?.filename || documentosTrabalho[1]}
                        // text={
                        //     fileSize && (
                        //         <div className="text-back">{formatFileSize(fileSize?.[index + 1])}</div>
                        //     )}
                        onChange={handleFileChange}
                        required
                    />
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol className="" >
                    <CFormInput
                        formEncType="multipart/form-data"
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf,video/mp4"
                        type="file"

                        label={documentosTrabalho[2]}
                        // text={
                        //     fileSize && (
                        //         <div className="text-back">{formatFileSize(fileSize?.[index + 1])}</div>
                        //     )}
                        onChange={(event) => handleFileChange(event, setErroFile, setFileSize, setFiles)}

                    />
                </CCol>
                <CCol className="" >
                    <CFormInput
                        formEncType="multipart/form-data"
                        aria-describedby="exampleFormControlInputHelpInline"
                        accept="image/jpeg, application/pdf,video/mp4"
                        type="file"

                        label={documentosTrabalho[3]}
                        // text={
                        //     fileSize && (
                        //         <div className="text-back">{formatFileSize(fileSize?.[index + 1])}</div>
                        //     )}
                        onChange={(event) => handleFileChange(event, setErroFile, setFileSize, setFiles)}
                        required
                    />
                </CCol>
            </CRow>

        </CAlert>
    </>)
    //////////////////////////////////////////////////////////////////////////////
    const FormularioTurismo = () => (<>
        <div className="w-100 d-flex  justify-content-between">
            <H3 color={"info"}>TURISMO  </H3>

            <div className="d-flex">

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
        <CCallout>
            <div>
                <img src={tecnicoSelected?.avatar?.url || imagePreview} id="image" style={{ border: "1px solid #ccc", height: 100, width: 100 }}></img>

                <CRow className="mt-4 mb-4">

                    <CCol>
                        <CFormSelect
                            label="Beneficiário"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.beneficiarioId && (
                                    <div className="text-light bg-danger">{errors.beneficiarioId.message}</div>
                                )
                            }
                            required
                            {...register("beneficiarioId")}
                            onChange={handleTecnico}
                        >
                            <option selected aria-readonly>selecione o benediciário</option>
                            {tecnicos?.map((tec, index) => (
                                <option value={tec?.id} key={index}>
                                    {tec.nome}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol>
                        <CFormSelect
                            label="Categoria"
                            aria-describedby="exampleFormControlInputHelpInline"
                            text={
                                errors.tipoId && (
                                    <div className="text-light bg-danger">{errors.tipoId.message}</div>
                                )
                            }
                            required
                            {...register("tipoId")}
                        >
                            <option selected aria-readonly>selecione a categoria</option>
                            {[{ name: "1 vez", value: 1 }, { value: 2, name: "prorrogação" }]?.map((tipo) => (
                                <option value={tipo.value} key={tipo.name}>
                                    {tipo.name}
                                </option>
                            ))}
                        </CFormSelect>
                        {errors.tipoId && (
                            <div className="text-light bg-danger">{errors.tipoId.message}</div>
                        )}
                    </CCol>

                </CRow>

            </div>
        </CCallout>
        <Box pt={4}></Box>


        <CRow className="mb-4 mt-4">
            <CCol md="1">
                <CFormInput
                    type="text"
                    size="sm"

                    label="ID"
                    aria-describedby="exampleFormControlInputHelpInline"
                    disabled
                    value={tecnicoSelected?.id}

                />
            </CCol>
            <CCol  >
                <CFormInput
                    type="text"
                    size="sm"
                    readOnly
                    label="Nome do beneficiário"

                    value={tecnicoSelected?.nome}
                    aria-describedby="exampleFormControlInputHelpInline"

                />
            </CCol>
            <CCol md="2">
                <CFormInput
                    type="tel"
                    size="sm"
                    readOnly
                    label="Telefone"
                    aria-describedby="exampleFormControlInputHelpInline"

                    value={tecnicoSelected?.telefone}
                >

                </CFormInput>
            </CCol>
            <CCol md="2">
                <CFormInput
                    type="email"
                    size="sm"
                    readOnly
                    label="Email"
                    aria-describedby="exampleFormControlInputHelpInline"
                    value={tecnicoSelected?.email}
                >

                </CFormInput>
            </CCol>
        </CRow>
        <Box pt={2}></Box>

        <CRow className="mb-4">
            <CCol>
                <CFormInput
                    type="text"

                    size="sm"
                    label="Nº do Passaporte"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.numero && (
                            <div className="text-light bg-danger">{errors.passaporte?.numero.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.numero")}
                >

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput
                    type="date"
                    size="sm"

                    label="Data de emissão"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.dataEmissao && (
                            <div className="text-light bg-danger">{errors.passaporte?.dataEmissao.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.dataEmissao")}
                >

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput
                    type="date"
                    size="sm"

                    label="Data de validade"
                    aria-describedby="exampleFormControlInputHelpInline"
                    text={
                        errors.passaporte?.dataValidade && (
                            <div className="text-light bg-danger">{errors.passaporte?.dataValidade.message}</div>
                        )
                    }
                    required
                    {...register("passaporte.dataValidade")}
                >

                </CFormInput>
            </CCol>
        </CRow>
        <CRow className="mb-4">

            <CCol>
                <CFormInput type="date" text={

                    errors.mob && (
                        <div className="text-light bg-danger">{errors.mob.message}</div>
                    )
                }
                    required
                    {...register("mob")} label="Data estimada de Chegada" size="sm">

                </CFormInput>
            </CCol>
            <CCol>
                <CFormInput text={
                    errors.localProjecto && (
                        <div className="text-light bg-danger">{errors.localProjecto.message}</div>
                    )
                }
                    required
                    {...register("localProjecto")} label="Local do projecto" size="sm">

                </CFormInput>
            </CCol>
        </CRow>
        <Box pt={2}></Box>
        <H3>Documentos necessários</H3>
        <CAlert color="info">
            {
                [" Cópia do Passaporte (Formato PDF ou JPEG) *",].map((doc, index) => (
                    <CListGroup>

                        <CListGroupItem key={index + 1} className="d-flex justify-content-between align-items-center">
                            {doc}
                            <CBadge color="primary" shape="rounded-pill">
                                obrigatorio
                            </CBadge>

                        </CListGroupItem>
                    </CListGroup>
                ))}

        </CAlert>
        <H5 className="mb-2"> UPLOD DOS DOCUMENTOS</H5>
        <Paragraph className="mb-4 text-info">
            Tamanho máximo: 5MB | Formato : PDF, JPEG
        </Paragraph>
        <hr className="mb-8"></hr>
        <Box pt={1}></Box>

        <CCol>
            <CInputGroup className="mb-6 position-relative">
                <CFormInput
                    formEncType="multipart/form-data"
                    text=""
                    aria-describedby="exampleFormControlInputHelpInline"
                    accept="image/jpeg, application/pdf"
                    type="file"
                    required

                />
            </CInputGroup>
        </CCol>

    </>)
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
    const documentosTrabalho =
        [" Cópia do Passaporte (Formato PDF ou JPEG) *",
            " CV(Formato JPEG) *",
            " •	Certificado de Habilitações, Formação, ou Trabalho (Formato PDF ou JPEG) *",
            "Atestado Médico (Formato PDF ou JPEG)",
            "Registro Criminal (Formato PDF ou JPEG)",
            "•	Carta de Operadora (PDF ou JPEG)",
            "•Certificado de Febre Amarela (PDF ou JPEG)"]
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
                        {[{ name: "Turismo", }, { name: "Trabalho", }, { name: "Curta Duração", }, { name: "Fronteira" }]?.map((visto, index) => (
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