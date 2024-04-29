import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from "@coreui/react";
import { Share } from "@mui/icons-material";
import { useEffect } from "react";
import { z } from "zod";

export default () => {
  const hoje = new Date();
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(hoje.getMonth() - 3);

  const schemaVisto = z.object({
    dataEmissao: z.coerce
      .date()
      .min(tresMesesAtras, "Data não pode ser mais do que 3 meses no passado")
      .max(hoje, "Data não pode estar no futuro"),
    numeroPassaporte: z
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
  const [entidades, setEntidade] = useState([]);
  const [status, setStatus] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const [processoId, setProcesoId] = useState(0);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInBytes = file.size;
      // Convertendo bytes para kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      if (fileSizeInKB > 2048) {
        // 2MB em KB
        setError("O arquivo não pode ter mais de 2MB.");
      } else {
        setFileSize(fileSizeInKB);
        setError("");
      }
    }
  };

  return (
    <>
      <CModal
        backdrop="static"
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            REGISTO DE VISTO PROCESSO Nº {processoId}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(registarVisto)}>
            <div className="mb-3">
              <label for="recipient-numero" className="col-form-label">
                Nº
              </label>
              <input
                {...register("numeroPassaporte")}
                type="text"
                className="form-control"
                id="recipient-numerro"
              />
            </div>
            {errors?.numeroPassaporte && (
              <div className="text-light bg-danger">{errors?.numeroPassaporte.message}</div>
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
              <CButton type="submit" color="success">
                Registar
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>
    </>
  );
};
