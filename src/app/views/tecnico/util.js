const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Tecnico {
    async gerarPDFIndidual(projecto) {
        const api = useApi()
        await api.documento("tecnicos/pdf/individual", projecto).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(tecnicos) {
        const api = useApi()
        await api.documento("gesot/pdf/geral", tecnicos).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    

    async buscarTodos({ id, tipoId, orderBy, order, date, clienteId, painelId }) {
        const api = useApi()
        const tecnicos = await api.listQuery(`tecnicos?id=${id}&orderBy=${orderBy}&order=${order}&date=${date}&clienteId=${clienteId}&painelId=${painelId}`).then((resp) => {
            console.table("%ctecnicos", "font-size:xx-large; color: blue", resp?.data?.tecnicos);

            return resp?.data?.tecnicos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF");
        })
        return tecnicos
    }
    async criar({ data }) {
        const api = useApi()
        const message = await api.add(`tecnicos`, data).then((resp) => {
            console.table("%ctecnicos", "font-size:xx-large; color: blue", resp?.data?.tecnicos);

            return resp?.data?.message
        }).catch((error) => {
            console.log(error);
            NotifyError("erro insperdo ");
        })
        return message
    }

}
export { Tecnico }