const { useApi } = require("app/hooks/useApi")
const { Notify, NotifyError } = require("app/utils/toastyNotification")

class Cliente {
    async toggleStatus({ passaporte, status }) {
        const api = useApi()
        await api.edit(`clientes/passaporte/${passaporte}/status/${!status}`).then((resp) => {
            Notify(status === true ? "Cliente Desativado com sucesso" : "Cliente Activado com sucesso")
        }).catch((error) => {
            console.log(error);
            NotifyError(status === true ? "Erro ao Desactivar o Cliente" : "Erro ao Activar o Cliente")
        })
    }
    async delete({ passaporte }) {
        const api = useApi()
        await api.edit(`clientes/id/${id}/status/${!status}`).then((resp) => {

        }).catch((error) => {
            console.log(error);

        })
    }
    async buscarUm({ passaporte }) {
        console.log("Passaporte", passaporte);
        const api = useApi()
        const cliente = await api.list(`clientes/passaporte/${passaporte}`).then((resp) => resp?.data?.cliente).catch((error) => {
            NotifyError("Erro ao Encontrar o cliente")
            console.log(error);

        })
        console.log("devolve", cliente);
        return cliente
    }
}

export { Cliente }