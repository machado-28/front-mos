const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class AccessLogs {
    async buscar() {
        try {
            const api = useApi()
            const logs = await api.listQuery(`logs`).then((resp) => {
                return resp?.data
            }).catch((error) => {
                console.log(error);
                NotifyError("Erro ao buscar projectos")
            })
            return logs
        } catch (error) {
            NotifyError("Erro inesperado", error)
        }
    }

}
export default AccessLogs