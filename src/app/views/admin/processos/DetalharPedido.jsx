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
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
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
import { FileDownload, FormatIndentDecreaseOutlined, Share } from "@mui/icons-material";
import EmitirVisto from "app/components/Modal/EmitirVisto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TextField = styled(TextValidator)(({ theme }) => ({
  width: "100%",
  marginBottom: "16px"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));
export default function DetalharPedido() {
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [state, setState] = useState({ date: new Date() });
  const { id } = useParams();
  const handleClickOpen = () => setOpen(true);
  const handleClickOpenEliminar = () => setOpenEliminar(true);
  const handleClose = () => setOpen(false);
  const handleCloseEliminar = () => setOpenEliminar(false);

  const [confirmar, setConfirmar] = useState(null);
  const [processo, setProcesso] = useState();
  const [listStatus, setListStatus] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const { id: processoId } = useParams();
  const [tipoId, setTipoId] = useState(null);
  const [tipoVistoId, setTipoVistoId] = useState(null);
  const [fazeId, setFazeId] = useState(null);
  const [pedidoId, setPedidoId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fazes, setFazes] = useState([]);
  const [tituloEntidade, setTituloEntidade] = useState("Alterar a Faze");
  const [tituloStatus, setTituloStatus] = useState("Status");
  const [entidades, setEntidade] = useState([]);
  const [statusPedidos, setStatusDePedidos] = useState([]);
  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleReset = () => setActiveStep(0);

  function getSteps() {
    return ["Dados Pessoais", "Informações de Viagem"];
  }

  const api = useApi();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hadleQuery = () => {
    // Obtenha o valor de um parâmetro de consulta específico
    const _fazeId = queryParams.get("_fazeId");
    const _statusId = queryParams.get("_statusId");
    console.log("Parâmetros de consulta:", queryParams.toString());
    setFazeId(_fazeId);
    setStatusId(_statusId);
  };
  function setQueryFaze(id) {
    queryParams.set("_fazeId", id);
    const newQueryString = queryParams.toString();
    // Atualiza a URL com os novos parâmetros de consulta
    history.pushState(null, "", "?" + newQueryString);
  }

  function setQueryStatus(id) {
    queryParams.set("_statusId", id);
    const newQueryString = queryParams.toString();
    // Atualiza a URL com os novos parâmetros de consulta
    history.pushState(null, "", "?" + newQueryString);
  }

  useEffect(() => {
    hadleQuery();
  }, [location.search, statusId, fazeId]); //

  const styleDropdown = {};
  async function BuscarProcesso() {
    const processosEntrados = await api.listQuery(`pedido?id=${id}`).then((response) => {
      console.log("PEDIDO INDENTIFICADO", response);
      setProcesso((prev) => response.data);
    });
  }

  async function actualizarPedido({ _fazeId, _statusId }) {
    try {
      if (_fazeId !== undefined && _statusId === undefined) {
        console.log("ACRUAL 1");
        setLoading((prev) => true);
        await api
          .editQuery(`processo/${processoId}?fazeId=${_fazeId}`)
          .then((resp) => {
            console.log("STATUS DE DAS FAZES", resp);
            const status = resp?.data?.[0]?.status || [];
            if (resp?.status == 200) {
              console.log("mensasgem 1", resp?.data?.message);
              return Notify(resp?.data?.message);
            }
            if (resp?.status == 404) {
              return NotifyError("Operacao cancelada!");
            }
            if (resp?.status == 500) {
              return NotifyError("Operacao cancelada!");
            }
            console.log("mensasgem 1", resp?.data?.message);
          })
          .finally(() => {
            setLoading((prev) => false);
          });
      }
      if (_statusId !== undefined && _fazeId === undefined) {
        console.log("ACRUAL 2");
        await api
          .editQuery(`processo/${processoId}?statusId=${_statusId}`)
          .then((resp) => {
            console.log("STATUS DE DAS FAZES", resp);
            const status = resp?.data?.[0]?.status || [];
            if (resp?.status == 200) {
              console.log("mensasgem 2", resp?.data?.message);
              return Notify(resp?.data?.message);
            }
            if (resp?.status == 404) {
              return NotifyError("Operacao cancelada!");
            }
            if (resp?.status == 500) {
              return NotifyError("Operacao cancelada!");
            }
          })
          .finally(() => {
            setLoading((prev) => false);
          });
      }
      if (_fazeId !== undefined && _statusId !== undefined) {
        await api
          .editQuery(`processo/${processoId}?fazeId=${_fazeId}&statusId=${_statusId}`)
          .then((resp) => {
            console.log(resp);
            const status = resp?.data?.[0]?.status || [];
            setStatusDePedidos(status);
            if (resp?.status == 200) {
              console.log("MENSAGEM 3", resp?.data?.message);
              return Notify(resp?.data?.message);
            }
            if (resp?.status == 404) {
              return NotifyError("Operacao cancelada pela api");
            }
            if (resp?.status == 500) {
              return NotifyError("Operacao cancelada pela api!");
            }
          });
      }
    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }

  useEffect(() => {
    BuscarProcesso();
  }, [processoId, fazeId, statusId]);

  async function updateStatus(e) {
    e.preventDefault();

    await api
      .editQuery("processos", { processoId, statusId })
      .then((response) => {
        if (response?.status == 201) {
          Notify(response?.data?.message + "| status:" + response.status);
        }
        if (response?.status !== 201) {
          NotifyError(response?.data?.message + "| status:" + response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function buscarStatus() {
    try {
      if (fazeId !== null) {
        await api.listQuery(`status-de-pedido/${fazeId}`).then((resp) => {
          console.log("STATUS DE DAS FAZES", resp);
          const status = resp?.data?.[0]?.status || [];
          setStatusDePedidos(status);
        });
      }
      await api.listQuery(`status-de-pedido/1`).then((resp) => {
        console.log(resp);
        const status = resp?.data?.[0]?.status || [];
        setStatusDePedidos(status);
      });
    } catch (error) {
      NotifyError("algo deu errado:" + error);
    }
  }
  useEffect(() => {
    buscarStatus();
  }, [statusId, fazeId, tipoId]);

  async function buscarEntidade() {
    try {
      await api
        .listQuery(`fazes`)
        .then((resp) => {
          if (resp.status !== 200) {
            return NotifyError("algo deu errado:" + resp.status);
          }
          const entidades = resp?.data?.fazes || [];
          console.log("Entidades", resp);
          setEntidade(entidades);
        })
        .catch((err) => {
          return NotifyError("algo deu errado:" + err);
        });
    } catch (error) {
      return NotifyError("algo deu errado:" + error);
    }
  }

  async function hadleEliminar({ id }) {
    handleClickOpenEliminar();
    console.log("confi", confirmar);
  }

  if (confirmar == true) {
    console.log("confi cc", confirmar);
    async () => await eliminar(id);
    NotifyInfo("Ainda nao funcional");
  }
  async function eliminar({ id }) {
    console.log("Apagando");
    setLoading(!prev);
    await api
      .delete("pedido", id)
      .then((resp) => {
        if (resp?.status !== 200) {
          setLoading(!prev);
          NotifyError("Impossivel realizar esta operacao");
          console.log(resp);
        } else {
          Notify(resp?.message);
        }
      })
      .finally(() => {
        console.log("Apagando parou");
        setLoading((prev) => false);
        window.location.reload();
      });
  }
  useEffect(() => {
    buscarEntidade();
  }, [statusId, fazeId, tipoVistoId, tipoId]);

  useEffect(() => {
    buscarStatus();
  }, []);

  const hoje = new Date();
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(hoje.getMonth() - 3);

  const schemaVisto = z.object({

    dataEmissao: z.coerce
      .date()
      .min(tresMesesAtras, "Data não pode ser mais do que 3 meses no passado")
      .max(hoje, "Data não pode estar no futuro"),
    numero: z
      .string()
      .regex(/^([a-zA-Z]{2}\d{7})$/, "Número do passaporte inválido")
      .max(9)
  });

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schemaVisto),
    shouldFocusError: true,
    progressive: true
  });
  const [tipoDeVisto, setTipoDeVisto] = useState([]);
  const [status, setStatus] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [loadingVisto, setLoadingVisto] = useState(false)
  const [anexoId, setAnexoId] = useState(null)

  async function registarVisto(data) {
    data.processoId = processoId;
    data.tipoVistoId = tipoVistoId;
    data.anexoId = anexoId;
    setLoadingVisto(prev => !prev)
    await api.add("visto", data).then((res) => {
      if (res.status == 201) {
        return Notify(res?.data?.message)
      }
      return Notify(resp?.data?.message)
    }).catch(() => {
      NotifyError("Operação cancelada pelo sistema")
    }).finally(() => {
      setLoadingVisto(prev => !prev)

    })
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

  const [loadingDocumento, setLoadingDocumento] = useState(false);
  async function gerarPDF() {
    setLoadingDocumento((prev) => !prev);
    await api.documento("gerarPDF", processo).finally(() => {
      setLoadingDocumento((prev) => !prev);
    });
  }
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      // Convertendo bytes para kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > 2048) {
        // 2MB em KB
        setError("O arquivo não pode ter mais de 2MB.");
      } else {
        const formData = new FormData();
        console.log("ANEXO", file);
        formData.append("anexo", file);
        setFileSize(fileSizeInKB);
        setError("");
        const response = await api
          .add(
            `upload/one`,
            formData
          ).then((resp) => {

            if (resp?.status == 201) {
              setAnexoId(prev => resp?.data?.id)
              console.log("FICHE", resp);
            }
          })
          .catch(({ error }) => {

            NotifyError("Erro ao enviar o arquivo:", error);
          });


      }


    }
  };

  function handleClick(id) {
    console.log("PROCESSO RECEBIDOP", id);
    setProcesoId((prev) => id);
    setVisible(!visible);
  }

  return (
    <Box sx={{ margin: "30px" }}>
      <CModal
        backdrop="static"
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            REGISTO DE VISTO PROCESSO Nº <br></br>
            <i> {processo?.numero}</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(registarVisto)}>
            <div className="mb-3">
              <label for="recipient-numero" className="col-form-label">
                Nº do visto
              </label>
              <input
                {...register("numero")}
                type="text"
                className="form-control"
                id="recipient-numerro"
              />
            </div>
            {errors?.numero && (
              <div className="text-light bg-danger">{errors?.numero.message}</div>
            )}
            <div className="mb-3">
              <label for="recipient-dataEmissao" className="col-form-label">
                Data de Emissão
              </label>
              <input
                {...register("dataEmissao")}
                type="date"
                className="form-control"
                id="recipient-dataEmissao"
              />
              {errors?.dataEmissao && (
                <div className="text-light bg-danger">{errors?.dataEmissao.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label for="recipient-dataValidade" className="col-form-label">
                Data de validade
              </label>
              <input type="date" disabled className="form-control" id="recipient-dataValidade" />
            </div>
            <div className="mb-3">
              <label for="recipient-file" className="col-form-label">
                Anexar ficheiros <Share></Share>
              </label>
              <input
                onChange={handleFileChange}
                type="file"
                className="form-control d-none"
                id="recipient-file"
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {fileSize > 0 && <div>Tamanho do arquivo: {formatFileSize(fileSize)}</div>}
            <div className="mb-3">
              <label for="message-text" className="col-form-label">
                Observação
              </label>
              <textarea className="form-control" id="message-text"></textarea>
            </div>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Cancelar
              </CButton>
              {
                loadingVisto ? <CSpinner></CSpinner> : <CButton type="submit" color="success">
                  Registar
                </CButton>
              }
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Motivo Da Recusa do Pedio</DialogTitle>
        <DialogContent>
          <DialogContentText>Descreva aqui a razão da reprovação deste pedido.</DialogContentText>
          <MuiTextField
            fullWidth
            autoFocus
            id="motivo"
            type="text"
            margin="dense"
            label="Motivo da recusa"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEliminar} onClose={handleCloseEliminar} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Tem a certeza que desejas eliminiar este processso permantemente ?
        </DialogTitle>

        {loading ? (
          <CSpinner></CSpinner>
        ) : (
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={handleCloseEliminar}>
              Não
            </Button>
            <Button onClick={() => setConfirmar((prev) => true)} color="error">
              Sim
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <SimpleCard title="">
        <Box py="12px" />
        <div>
          <p>
            {" "}
            <H1>
              {" "}
              Pedido de emissão de visto de{" "}
              {processo?.tipoVisto?.nome?.toString().toLocaleLowerCase()}
            </H1>
            <div
              className="btn-group d-flex justify-content-between"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <div>
                <Link to={`/processo/${processo?.numero}/edit/`}>
                  <StyledButton variant="contained" color="success">
                    EDITAR
                  </StyledButton>
                </Link>
                <Link to={`#`}>
                  <StyledButton
                    onClick={() => hadleEliminar({ id })}
                    variant="contained"
                    color="error"
                  >
                    APAGAR
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

                <Link to={`/processos/${id}/documentos`}>
                  <StyledButton variant="contained" color="warning">
                    VER ANEXOS <Share></Share>
                  </StyledButton>
                </Link>
              </div>
              <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                {statusId == 2 && fazeId == 1 ? (
                  <StyledButton
                    onClick={() => setVisible((prev) => true)}
                    variant="contained"
                    color="warning"
                  >
                    EMITIR VISTO
                  </StyledButton>
                ) : (
                  <>
                    <CDropdown>
                      <CDropdownToggle> {tituloEntidade}</CDropdownToggle>
                      <CDropdownMenu style={styleDropdown} container="body">
                        <CDropdownItem href="#">Alterar a faze</CDropdownItem>
                        {entidades?.map((entidade) => (
                          <CDropdownItem
                            onClick={() => {
                              setFazeId(entidade?.id);
                              setTituloEntidade((prev) => entidade?.nome);
                              setQueryFaze(entidade?.id);
                              actualizarPedido({ _fazeId: entidade?.id });
                            }}
                            href="#"
                          >
                            {entidade?.nome}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                    <CDropdown style={styleDropdown}>
                      <CDropdownToggle style={styleDropdown}>{tituloStatus}</CDropdownToggle>
                      <CDropdownMenu style={styleDropdown}>
                        <CDropdownItem href="#">Alterar status</CDropdownItem>
                        {statusPedidos?.map((status) => (
                          <CDropdownItem
                            onClick={() => {
                              setStatusId(status?.id);
                              setTituloStatus((prev) => status?.nome);
                              setQueryStatus(status?.id);
                              actualizarPedido({ _statusId: status?.id });
                            }}
                            href="#"
                          >
                            {status?.nome}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                  </>
                )}
              </div>
            </div>
            <hr></hr>
            <div>
              <div className=" d-flex justify-content-between">
                <p>
                  <H3> PROCESSO Nº:</H3>
                  <strong className="text-primary">{processo?.numero}</strong>
                </p>
                <article style={{ height: "12vh", width: "6vw" }}>
                  <Avatar className="h-100 w-100" src={processo?.documentos?.[4]?.anexo?.url} ></Avatar>
                </article>
              </div>
            </div>
          </p>
          <hr></hr>
          <p>
            <strong>Faze/Entidade:</strong>
            {processo?.fazeActual?.nome} <br></br>
            <strong>Status:</strong> {processo?.statusActual?.nome} <br></br>{" "}
            <strong>Data de </strong>
            <i>{processo?.statusActual?.nome} :</i>
            {new Date(processo?.statusActual?.createdAt).toLocaleDateString()}
            <br></br>
            <strong>Data de entrada:</strong> {new Date(processo?.createdAt).toLocaleDateString()}{" "}
            <br></br>
            <strong>Descrição:</strong>
            <i>
              {processo?.fazeActual?.descricao}
            </i>{" "}
            <br></br>
          </p>
          <Box py="12px" />
          <p>
            <h6>Dados Pessoais</h6>
            <hr></hr>
            <strong>Nome Completo:</strong> {processo?.requerente?.nome}
            <br></br>
            <strong>Data de Nascimento:</strong>
            {new Date(processo?.requerente?.dataNascimento).toLocaleDateString()}
            <br></br>
            <strong>Filhação:</strong> {processo?.requerente?.nomePai} e de{" "}
            {processo?.requerente?.nomeMae}
            <br></br>
            <strong>Nacionalidade:</strong>
            {processo?.requerente?.nacionalidade}
            <br></br>
            <strong>País de Nascimento:</strong> {processo?.requerente?.paisNascimento}
            <br></br>
            <strong>Natual de :</strong> {processo?.requerente?.bairroNascimento}
            <br></br>
            <strong>Cidade de :</strong> {processo?.requerente?.cidadeNascimento}
            <strong>Provincia de :</strong> {processo?.requerente?.provinciaNascimento}
            <strong>Comuna de :</strong> {processo?.requerente?.municipioNascimento}
            <br></br>
            <strong>Estado Civil:</strong>
            {processo?.requerente?.estadoCivil}
            <br></br>
            <strong>Genero:</strong>
            {processo?.requerente?.genero}
            <br></br>
            <strong>Sindicato: </strong>
            {processo?.requerente?.sindicato}
            <br></br>
            <strong>PassaPorte numero:</strong> {processo?.documentos?.[0]?.numero} |{" "}
            <strong>Data de Emissao:</strong> {processo?.documentos?.[0]?.dataEmissao} |{" "}
            <strong>Data de Validade:</strong>
            {processo?.documentos?.[0]?.dataValidade}
            <strong>Emissora:</strong>
            {processo?.documentos?.[0]?.emissora}
            <br></br>
          </p>

          <Box py="12px" />
          <p>
            <h6>Dados da Viagem</h6>
            <hr></hr>
            <strong>Projecto:</strong>
            {processo?.requerente?.projecto}
            <br></br>
            <strong>Tipo de Visto:</strong>
            {processo?.tipoVisto?.nome}
            <br></br>
            <strong>Telefone:</strong>
            {processo?.requerente?.telefone} <br></br>
            <strong>Email:</strong>
            {processo?.requerente?.email} <br></br>
          </p>
        </div>
      </SimpleCard>
    </Box>
  );
}
