const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");
import NotificationContext from "app/contexts/NotificationContext";
import { listenMessage } from "app/hooks/socket";

class Processo {
    async gerarPDFIndidual(processo) {
        const api = useApi()
        await api.documento("solicitacoes/pdf/individual", processo).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);

        })
    }
    async gerarMapa({ data = {}, projectoId }) {
        const { year, month, tipoVistoId } = data
        const api = useApi()
        await api.documento(`processos/mapa?projectoId=${projectoId}&year=${year}&month=${month}&tipoVistoId=${tipoVistoId}`).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);

        })
    }
    async gerarFicha({ data = {}, processoId }) {
        const { year, month, tipoVistoId } = data
        const api = useApi()
        await api.documento(`processos/ficha?processoId=${processoId}&year=${year}&month=${month}&tipoVistoId=${tipoVistoId}`).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);

        })
    }
    async contar({ tipoVistoId, statusId, clienteId, responsavelId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`processos/count?responsavelId=${responsavelId}&statusId=${statusId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);

        })
        return total

    }

    async contarDelegados({ tipoVistoId, statusId, clienteId, responsavelId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`processos/delegados/count?responsavelId=${responsavelId}&statusId=${statusId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos delegados total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);

        })
        return total

    }

    async progresso({ statusId, projectoId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`processos/progresso?statusId=${statusId}&projectoId=${projectoId}&stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data
        }).catch((error) => {
            console.log(error);

        })
        return total

    }
    async buscar({ processoId, projectoId, gestorId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const data = await api.listQuery(`processos?gestorId=${gestorId}&projectoId=${projectoId}&stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {

            return resp?.data
        }).catch((error) => {
            console.log(error);
        })
        return data

    }
    async buscarDelegados({ projectoId, processoId, responsavelId, statusId, stepId, tipoVistoId, clienteId, gestorId, gestorExternoId, date, order, orderBy, id } = {}) {
        console.log("PROJECTO ", projectoId);
        const api = useApi()
        const data = await api.listQuery(`processos/delegados?responsavelId=${responsavelId}&projectoId=${projectoId}&statusId=${statusId}&processoId=${processoId}&stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorId=${gestorId}&gestorId=${gestorExternoId}`).then((resp) => {
            console.log("%cprocessos busca", "font-size:xx-large;color:blue", resp.data);

            return resp?.data
        }).catch((error) => {
            console.log(error);

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

        })

    }
    async buscarProcessoPorVisto({ vistoId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/vistoTipoId/${vistoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);

        })

    }
    async criar({ data }) {
        const api = useApi()

        const response = await api.add(`processos`, data).then((resp) => {
            if (resp.status !== 201) {
                NotifyError(resp?.data?.message)
            }

            return resp?.data
        }).catch((error) => {
            console.log(error);

        })
        return response
    }
    async delegar({ data, id }) {
        const api = useApi();
        try {
            const response = await api.add(`processos/${id}/delegar`, data);
            if (response?.status !== 200) {
                NotifyError(response?.data?.message);
                console.log("errro", response?.data?.message);

            }
            console.log("errro", response?.data);
            return response?.data;
        } catch (error) {
            console.log(error);

        }
    }
    async concluir({ data, id }) {
        const api = useApi();
        try {
            const response = await api.editOne(`processos/${id}/concluir`, data);
            if (response?.status !== 200) {
                NotifyError(response?.data?.message);
                console.log("errro", response?.data?.message);

            }
            Notify(response?.message)
            return response?.data;
        } catch (error) {
            console.log(error);

        }
    }

    async buscarProcessoPorStatus({ statusId }) {
        const api = useApi()
        await api.listQuery(`solicitacoes/statusId/${statusId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);

        })
    }
    async actualizarStatus({ processoId, stepId, statusId, descricao, }) {
        const api = useApi()
        await api.editOne(`processos/${processoId}`, { stepId, statusId, descricao }).then((resp) => {
            console.log("ACTUALIA", resp);
            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);

        })
    }

    async iniciar({ processoId, statusId, descricao, }) {
        const api = useApi()
        await api.editOne(`processos/iniciar/${processoId}`, { statusId, descricao }).then((resp) => {

            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);

        })
    }
}
export default Processo

export class Fase {
    async buscar() {
        try {
            const api = useApi()
            const res = await api.list(`fases`)
            console.log("fazes DE VISTO", res);

            return res?.data?.fases

        } catch (error) {
            console.log(error);
            return error
        }
    }
}

