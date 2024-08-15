const { useApi } = require("app/hooks/useApi");
import io from 'socket.io-client';
const { NotifyError, Notify } = require("app/utils/toastyNotification");


// https://api.mos.ao/v1/
const SERVER_URL = "http://localhost:4000/v1/";

let socket = io(SERVER_URL);
export function connect(user) {
    socket.connect()
    socket.emit("connetion", { message: "CRISTO VOLTA JAAAAAAAAAAA" });
}
connect()
class Projecto {
    async gerarPDFIndidual(projecto) {
        const api = useApi()
        await api.documento("projectos/pdf/individual", projecto).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(projectos) {
        const api = useApi()
        await api.documento("projectos/pdf/geral", projectos).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async buscarProjectoPorTipo({ tipoId }) {
        const api = useApi()
        await api.listQuery(`projectos/tipoId/${tipoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }
    async buscar({ tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {
        const api = useApi()
        const projectos = await api.listQuery(`projectos?order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprojectos", "font-size:xx-large;color:blue", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos")
        })
        return projectos
    }
    async contar({ tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {

        const api = useApi()
        const total = await api.listQuery(`projectos/count?order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cprojectos total", "font-size:xx-large;color:blue", resp.data?.total);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos")
        })
        return total

    }
    async editar({ id, data }) {
        const api = useApi()
        await api.edit(`projectos/${id}`, data).then((resp) => {
            console.log("projectos", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao editar Projecto")
        })

    }

    async apagar({ id }) {
        const api = useApi()
        await api.delete(`projectos`, id).then((resp) => {
            console.log("projectos", resp);

            return resp?.data?.message
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao apagar Projecto")
        })

    }
    async criar(data) {
        const api = useApi()
        await api.add(`projectos`, data).then((resp) => {
            console.log("projectos", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao criar Projecto")
        })

    }
    async buscarProjectoPorStatus({ statusId }) {
        const api = useApi()
        await api.listQuery(`projectos/statusId/${statusId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
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
export { Projecto }