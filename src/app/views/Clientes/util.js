const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Cliente {
    async gerarPDFIndidual(cliente) {
        const api = useApi()
        await api.documento("clientes/pdf", cliente).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async gerarPDFGeral(solicitacoes) {
        const api = useApi()
        await api.documento("clientes/pdf/:id", solicitacoes).then((resp) => {
            console.log("PDF GERADO", resp);
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Emitir PDF")
        })
    }
    async addProcessos({ projectoId, clienteId, tecnicoId }) {
        const api = useApi()
        await api.add(`processo/`, {
            projectoId,
            tecnicoId,
            clienteId
        }).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }

    async buscarClientes() {

        const api = useApi()
        const data = await api.listQuery(`clientes/`).then((resp) => {
            console.log("Clientes listy", resp);

            return resp?.data?.clientes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Listar Clientes")
        })

        return data
    }
    async contar() {

        const api = useApi()
        const data = await api.listQuery(`clientes/count`).then((resp) => {
            console.log("Clientes listy", resp);

            return resp?.data?.total
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Listar Clientes")
        })

        return data
    }
    async buscarUmClienteComTodosDados({ id }) {
        const api = useApi()
        const data = await api.listQuery(`clientes/${id}`,).then((resp) => {
            console.log("Cliente Detal ", resp);

            return resp?.data?.cliente
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao Listar os detalhes do Cliente")
        })

        return data
    }
    async buscarProjectosDeUmCliente({ id }) {
        const api = useApi()
        await api.listQuery(`clientes/${id}/projectos`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }
    async buscarGestoresDeUmCliente({ id }) {
        const api = useApi()
        await api.listQuery(`clientes/${id}/projectos`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }
    async buscarTecnicosDeUmCliente({ id }) {
        const api = useApi()
        await api.listQuery(`clientes/${id}/projectos`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }
    async buscarProcessosDeUmCliente({ id }) {
        const api = useApi()
        await api.listQuery(`clientes/${id}/projectos`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }
    async buscarProcessosDeUmProjecto({ id }) {
        const api = useApi()
        await api.listQuery(`clientes/${id}/projectos`).then((resp) => {
            console.log("SOLI", resp);

            return resp?.data?.projectos
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar projectos de um cliente")
        })

    }
    async buscarClientesPorStatus({ activo }) {
        const api = useApi()
        await api.listQuery(`clientes?activo=${activo}`).then((resp) => {
            console.log("Clientes Activos", resp);

            return resp?.data?.solicitacoes
        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao buscar Clientes por status")
        })
    }
    async actualizarStatusDeUmCliente({ clienteId, activo }) {

        const api = useApi()
        await api.editOne(`clientes/${clienteId}`, { activo }).then((resp) => {
            console.log("ACTUALIzar Cliente", resp);
            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);
            NotifyError("Erro ao actualizar o status do cliente")
        })
    }
}

class Solicitacao extends Cliente { }

export { Cliente, Solicitacao }