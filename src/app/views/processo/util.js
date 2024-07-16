const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Processo {
    async gerarPDFIndidual(processo) {
        const api = useApi()
        await api.documento("solicitacoes/pdf/individual", processo).then((resp) => {
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
    async buscarProcessoPorTipo({ tipoId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/tipoId/${tipoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }
    async buscarProcessoPorVisto({ vistoId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/vistoTipoId/${vistoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }
    async criar({ data }) {
        const api = useApi()
        const response = await api.add(`processos`, data).then((resp) => {
            if (resp.status !== 201) {
                NotifyError(resp?.data?.message)
            }
            return resp?.data?.processos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro Inesperado!")
        })
        return response
    }

    async buscarProcessoPorStatus({ statusId }) {
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
export default Processo