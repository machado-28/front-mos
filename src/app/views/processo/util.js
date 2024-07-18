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
    async gerarMapa({ data={}, projectoId }) {
        const { year, month, tipoVistoId } = data
        const api = useApi()
        await api.documento(`processos/mapa?projectoId=${projectoId}&year=${year}&month=${month}&tipoVistoId=${tipoVistoId}`).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarFicha({ data={}, processoId }) {
        const { year, month, tipoVistoId } = data
        const api = useApi()
        await api.documento(`processos/ficha?processoId=${processoId}&year=${year}&month=${month}&tipoVistoId=${tipoVistoId}`).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async contar({ tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`processos/count?order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos")
        })
        return total

    }

    async progresso({statusId, projectoId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`processos/progresso?statusId=${statusId}&projectoId=${projectoId}&stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos")
        })
        return total

    }
    async buscar({ processoId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const data = await api.listQuery(`processos/progresso?processoId=${processoId}stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos busca", "font-size:xx-large;color:blue", resp.data);

            return resp?.data
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos")
        })
        return data

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
    async actualizarStatus({ processoId, stepId, statusId, descricao, }) {

        const api = useApi()
        await api.editOne(`processos/${processoId}`, { stepId, statusId, descricao }).then((resp) => {
            console.log("ACTUALIA", resp);
            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
}
export default Processo