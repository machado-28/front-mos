import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField as MuiTextField,
  Typography,
  Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Breadcrumb, SimpleCard } from "app/components";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Link, useLocation, useParams } from "react-router-dom";
import { H1, H3, H4 } from "app/components/Typography";
import { z } from "zod";
import {
  CBadge,
  CButton,
  CCard,
  CCardImage,
  CCardTitle,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner
} from "@coreui/react";
import { useApi } from "app/hooks/useApi";
import { Notify, NotifyError, NotifyInfo } from "app/utils/toastyNotification";
import { FileDownload, FormatIndentDecreaseOutlined, Image, Share } from "@mui/icons-material";
import EmitirVisto from "app/components/Modal/EmitirVisto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adicionarMeses } from "app/utils/validate";

const TextField = styled(TextValidator)(({ theme }) => ({
  width: "100%",
  marginBottom: "16px"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));
export default function DetalhVisto() {
  const api = useApi();
  const [visto, setVisto] = useState({})
  const [loadingDocumento, setLoadingDocumento] = useState(false);
  const { numero } = useParams()

  async function ListarVisto() {
    try {

      await api
        .list(`vistos/${numero}`)
        .then((res) => {
          console.log("ACTIVS", res);
          if (res?.status == 200) {
            setVisto((prev) => res?.data?.visto);
          }
        })

    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }

  }

  async function gerarPDF() {
    setLoadingDocumento((prev) => !prev);
    await api.documento("gerarPDF", processo).finally(() => {
      setLoadingDocumento((prev) => !prev);
    });
  }


  useEffect(() => {
    ListarVisto()
  }, [numero])
  return (
    <Box sx={{ margin: "30px" }}>
      <SimpleCard title="">
        <Box py="12px" />
        <div>
          <p>
            {" "}
            <H1>
              {" "}
              INFORMAÇÕES DE VISTO{" "}
              {visto?.processo?.tipoVisto?.nome?.toString().toLocaleLowerCase()}
            </H1>
            <div
              className="btn-group d-flex justify-content-between"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <div>
                <Link >
                  <StyledButton variant="contained" color="success">
                    EDITAR
                  </StyledButton>
                </Link>


                {loadingDocumento ? (
                  <CSpinner></CSpinner>
                ) : (
                  <StyledButton
                    onClick={async () => await gerarPDF()}
                    variant="contained"
                    color="info"
                  >
                    GERAR PDF <FileDownload></FileDownload>
                  </StyledButton>
                )}

                {/* <Link to={`/vistos/${numero}/documentos`}>
                  <StyledButton variant="contained" color="warning">
                    VER ANEXOS <Share></Share>
                  </StyledButton>
                </Link> */}
              </div>
            </div>
            <hr></hr>

          </p>
          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Visto Nº"
                aria-label="V"
                aria-describedby="exampleFormControlInputHelpInline"
                value={visto?.numero}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Processo Nº"
                aria-label="V"
                aria-describedby="exampleFormControlInputHelpInline"
                value={visto?.processo?.numero}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Nome Completo"
                aria-label="Antonio Machado"
                aria-describedby="exampleFormControlInputHelpInline"
                value={visto?.processo?.requerente?.nome}
              />
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol>
              <CFormInput
                type="text"
                label="Visto"
                aria-label="V2"
                aria-describedby="exampleFormControlInputHelpInline"
                value={visto?.processo?.tipoVisto?.nome}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Emitido Em"
                aria-label="V"
                aria-describedby="exampleFormControlInputHelpInline"
                value={new Date(visto?.dataEmissao).toLocaleDateString()}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                label="Expira em"
                aria-label="V"
                aria-describedby="exampleFormControlInputHelpInline"
                value={new Date(adicionarMeses(visto?.dataEmissao, visto?.processo?.tipoVisto?.duracao)).toLocaleDateString()}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCard>
              <CCardTitle>Anexo</CCardTitle>
              <StyledButton ><a href={visto?.anexo?.url}>Descarregar</a></StyledButton>
              <CCardImage src={visto?.anexo?.url}></CCardImage>

            </CCard>
          </CRow>
          <hr></hr>
        </div>
      </SimpleCard>
    </Box >
  );
}
