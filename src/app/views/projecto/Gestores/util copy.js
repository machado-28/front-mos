const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Solicitacao {
    async gerarPDFIndidual(projecto) {
        const api = useApi()
        await api.documento("solicitacoes/pdf/individual", projecto).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(solicitacoes) {
        const api = useApi()
        await api.documento("solicitacoes/pdf/geral", solicitacoes).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async buscarProjectoPorTipo({ tipoId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/tipoId/${tipoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }
    async buscarProjectoPorVisto({ vistoId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/vistoTipoId/${vistoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }
    async buscarProjectoPorStatus({ statusId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/statusId/${statusId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async actualizarStatus({ pedidoId, statusId, descricao, }) {

        const api = useApi()
        await api.editOne(`pedidos/${pedidoId}`, { descricao, statusId }).then((resp) => {
            console.log("ACTUALIA", resp);
            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
}
export { Solicitacao}