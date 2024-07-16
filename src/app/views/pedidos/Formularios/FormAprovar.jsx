import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  TextField as MuiTextField,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { CForm, CSpinner } from "@coreui/react";
import { useState } from "react";
import { useApi } from "app/hooks/useApi";
import { useForm } from "react-hook-form";
import { Notify, NotifyError } from "app/utils/toastyNotification";

const addAprovarShema = z.object({
  descricao: z.string().min(1, { message: "Este campo é obrigatorio" })
});
export default function FormAprovar({ handleClose, processoId }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addAprovarShema),
    shouldFocusError: true,
    progressive: true
  });

  const [loading, setLoading] = useState(false);

  const api = useApi();
  async function PostData(dados) {
    try {
      setLoading(true);
      const response = await api
        .edit(`processo/${processoId}?statusId=5`, dados)
        .then(async (response) => {
          const { data } = response;
          const { pedido } = data;
          console.log("RESPOSTA SUCESSO", response);

          // if (response?.status !== 201) {
          //   console.log("DATAERRO", response);

          //   setLoading(false);
           
          // }

          setLoading(false);
          Notify(response?.data?.message);
          window.location.reload();
        });
    } catch (error) {
      NotifyError("Älgo deu Errado");
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <CForm onSubmit={handleSubmit(PostData)} style={{ borderRadius: "none" }}>
      <DialogTitle id="form-dialog-title">Aprovação de processo</DialogTitle>
      <DialogContent>
        <DialogContentText>Descreva aqui a razão da reprovação deste pedido.</DialogContentText>
        <MuiTextField
          fullWidth
          {...register("descricao")}
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
        {loading ? (
          <CSpinner></CSpinner>
        ) : (
          <Button type="submit" color="primary">
            Enviar
          </Button>
        )}
      </DialogActions>
    </CForm>
  );
}
