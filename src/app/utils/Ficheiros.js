import { useApi } from "app/hooks/useApi"

class Ficheiros {

    async contar() {
        const api = useApi()

        const { total } = await api.list("ficheiros/count").then(resp => resp.data)
        console.log("DOCUMENTOS TOTAL", total);
        return total
    }
}

export default new Ficheiros()