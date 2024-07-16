const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Gestores {
    async gerarPDFIndidual(projecto) {
        const api = useApi()
        await api.documento("gestores/pdf/individual", projecto).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(gestores) {
        const api = useApi()
        await api.documento("gesot/pdf/geral", gestores).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async buscarProjectoPorTipo({ tipoId }) {
        const api = useApi()
        await api.listQuery(`gestores/tipoId/${tipoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.gestores
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }

    async buscarTodos({ id, tipoId, orderBy, order, date, clienteId, painelId }) {
        const api = useApi()
        const gestores = await api.listQuery(`gestores?id=${id}&orderBy=${orderBy}&order=${order}&date=${date}&clienteId=${clienteId}&painelId=${painelId}`).then((resp) => {
            console.table("%cGestores", "font-size:xx-large; color: blue", resp?.data?.gestores);

            return resp?.data?.gestores
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF");
        })
        return gestores
    }
    async criar({ data }) {
        const api = useApi()
        const message = await api.add(`gestores`, data).then((resp) => {
            console.table("%cGestores", "font-size:xx-large; color: blue", resp?.data?.gestores);

            return resp?.data?.message
        }).catch((error) => {
            console.log(error);
            NotifyError("erro insperdo ");
        })
        return message
    }

}
export { Gestores }