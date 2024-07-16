const { styled, Box, Button } = require("@mui/material");
const { default: PdfViewer } = require("app/components/PdfViewer");
import { Breadcrumb, SimpleCard } from "app/components";
import pdfFile from "./test.pdf";
import { H3 } from "app/components/Typography";
import { Link, useParams } from "react-router-dom";
import { useApi } from "app/hooks/useApi";
import { useState } from "react";
import { useEffect } from "react";
import { CButton } from "@coreui/react";
import { StyledButton } from "app/views/material-kit/buttons/AppButton";
import { Download } from "@mui/icons-material";

const AppButtonRoot = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  },
  "& .button": { margin: theme.spacing(1) },
  "& .input": { display: "none" }
}));
function getSteps() {
  return ["Select master blaster campaign settings", "Create an ad group", "Create an ad"];
}

export default function ListarDocumentos({
  data = [
    {
      url: pdfFile,
      ext: ".pdf",
      tipo: {
        nome: "Bilhte de identidade",
        id: 1
      }
    },
    {
      url: pdfFile,
      ext: ".pdf",
      tipo: {
        nome: "Passaporte",
        id: 2
      }
    }
  ]
}) {
  const { id } = useParams();
  const api = useApi();
  const [documentos, setDocumentos] = useState([]);

  async function buscarDocumentos() {
    console.log(id);
    await api.listQuery(`documentos?pedidoId=${id}`).then((resp) => {
      console.log(resp);
      setDocumentos((prev) => resp?.data?.documentos);
    });
  }

  useEffect(() => {
    buscarDocumentos();
  }, []);

  return (
    <frameElement>
      <AppButtonRoot>
        <Box py="12px" />
        <SimpleCard title="">
          <div className="d-flex align-items-center justify-content-between">
            <H3>DOCUMENTOS</H3>
            <div>
              <Link to={"/pedidos/add"}>
                <StyledButton variant="contained" color="success">
                  Adicionar Arquivo
                </StyledButton>
              </Link>
              <Link to={"/pedidos/add"}>
                <StyledButton variant="contained" color="info">
                  Gerar Relatorio PDF <Download></Download>
                </StyledButton>
              </Link>
            </div>
          </div>
        </SimpleCard>
        <Box py="12px" />
        {documentos?.map((documento, index) => {
          console.log("TIPO", documento?.anexo?.name?.split(".")[1]);
          return (
            <>
              {documento?.anexo?.name?.split(".")[1] != "pdf" ? (
                <SimpleCard title={documento?.tipo?.nome}>
                  <div className="d'flex justify'content'between">
                    {index == 0 ? (
                      <p>
                        <strong>data de Emissao:</strong>
                        {documento?.dataEmissao}
                        <br></br>
                        <strong>data de Validade:</strong>
                        {documento?.dataValidade}
                        <br></br>
                        <strong>Emissora: </strong>
                        {documento?.emissora}
                      </p>
                    ) : (
                      <></>
                    )}
                    <a href={documento?.anexo?.url} download={documento?.anexo?.nome}>
                      <StyledButton variant="contained" color="primary">
                        Descarregar
                      </StyledButton>
                    </a>
                    <input
                      id={documento?.anexoId}
                      onChange={(e) => hanfleFile(e)}
                      type="file"
                      name="file"
                    ></input>
                    <label htmlFor="file">
                      <StyledButton variant="contained">actualizar</StyledButton>
                    </label>
                  </div>
                  <img style={{ backgroundSize: "cover" }} src={documento?.anexo?.url}></img>
                </SimpleCard>
              ) : (
                <SimpleCard title={documento?.tipo?.nome}>
                  <>
                    {" "}
                    <a href={documento?.anexo?.url} download={documento?.anexo?.nome}>
                      <StyledButton variant="contained" color="primary">
                        Descarregar
                      </StyledButton>
                    </a>
                    <input
                      id={documento?.anexoId}
                      onChange={(e) => hanfleFile(e)}
                      type="file"
                      name="file"
                    ></input>
                    <label htmlFor="file">
                      <StyledButton variant="contained">actualizar</StyledButton>
                    </label>
                  </>
                  <PdfViewer fileUrl={documento?.anexo?.url}></PdfViewer>
                </SimpleCard>
              )}
            </>
          );
        })}
      </AppButtonRoot>
    </frameElement>
  );
}
