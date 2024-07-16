const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Usuario {
    async gerarPDFIndidual(usuario) {
        const api = useApi()
        await api.documento("usuarios/pdf/individual", usuario).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(usuario) {
        const api = useApi()
        await api.documento("gesot/pdf/geral", usuario).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async buscarusuarioPorTipo({ tipoId }) {
        const api = useApi()
        await api.listQuery(`usuarios/tipoId/${tipoId}`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.usuarios
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })

    }

    async buscarTodos({ id, tipoId, orderBy, order, date, clienteId, painelId }) {
        const api = useApi()
        const usuarios = await api.listQuery(`usuarios?id=${id}&orderBy=${orderBy}&order=${order}&date=${date}&clienteId=${clienteId}&painelId=${painelId}`).then((resp) => {
            console.table("%cUsuarios", "font-size:xx-large; color: blue", resp?.data?.usuarios);

            return resp?.data?.usuarios
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF");
        })
        return usuarios
    }
    async criar({ data }) {
        const api = useApi()
        const message = await api.add(`usuarios`, data).then((resp) => {
            console.table("%cusuarios", "font-size:xx-large; color: blue", resp?.data);
            Notify(resp?.data?.message)

            return resp?.data?.message
        }).catch((error) => {
            console.log(error);
            NotifyError("erro insperdo ");
        })
        Notify(response?.data?.message);
        window.location.reload()
        return message

    }

    async painels() {
        const api = useApi()
        const painels = await api.listQuery(`painels`).then((resp) => {
            console.table("%cPainel", "font-size:xx-large; color: blue", resp?.data?.painels);

            return resp?.data?.painels
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF");
        })
        return painels
    }
    async contar({ id, date, clienteId, painelId }) {
        const api = useApi()
        const usuarios = await api.listQuery(`usuarios/count?id=${id}&clienteId=${clienteId}&painelId=${painelId}`).then((resp) => {
            console.table("%cUsuarios", "font-size:xx-large; color: blue", resp?.data?.usuarios);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF");
        })
        return usuarios
    }
}
export { Usuario }