const { useApi } = require("app/hooks/useApi");
const { NotifyError, Notify } = require("app/utils/toastyNotification");

class Visto {
    async gerarPDFIndidual({ id }) {
        try {
            const api = useApi()
            await api.documento(`vistos/pdf?${id}`).then((resp) => {
                console.log("PDF GERADO", resp);
            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {

        }
    }

    async gerarMapa({ data = {}, projectoId }) {
        try {
            const { year, month, tipoVistoId } = data
            const api = useApi()
            await api.documento(`vistos/mapa?projectoId=${projectoId}&year=${year}&month=${month}&tipoVistoId=${tipoVistoId}`).then((resp) => {
                console.log("PDF GERADO", resp);
            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {

        }
    }

    async gerarFicha({ data = {}, vistoId }) {
        try {
            const { year, month, tipoVistoId } = data
            const api = useApi()
            await api.documento(`vistos/ficha?id=${vistoId}`).then((resp) => {
                console.log("PDF GERADO", resp);
            }).catch((error) => {
                console.log(error);

            })
        } catch (error) {

        }
    }

    async contar({ activo, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {
        try {
            const api = useApi()
            const total = await api.listQuery(`vistos/count?order=${order}&activo=${activo}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
                console.log("%cvistos total", "font-size:xx-large;color:blue", resp.data?.totals);

                return resp?.data?.total
            }).catch((error) => {
                console.log(error);

            })
            return total
        } catch (error) {

        }
    }

    async progresso({ statusId, projectoId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {
        const api = useApi()
        const total = await api.listQuery(`vistos?statusId=${statusId}&projectoId=${projectoId}&stepId=${stepId}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cvistos total", "font-size:xx-large;color:blue", resp.data?.total);
            return resp?.data
        }).catch((error) => {
            console.log(error);

        })
        return total
    }

    async buscar({ activo, vistoId, stepId, tipoVistoId, clienteId, gestorInternoId, gestorExternoId, date, order, orderBy, id } = {}) {
        console.log("date", date);
        const api = useApi()
        const data = await api.listQuery(`vistos?activo=${activo}&order=${order}&date=${date}&id=${id}&orderBy=${orderBy}&tipoVistoId=${tipoVistoId}&clienteId=${clienteId}&gestorInternoId=${gestorInternoId}&gestorExternoId=${gestorExternoId}`).then((resp) => {
            console.log("%cvistos busca", "font-size:xx-large;color:blue", resp.data);

            return resp?.data
        }).catch((error) => {
            console.log(error);
        })
        return data
    }

    async buscarTipos({ id } = {}) {
        const api = useApi()
        const data = await api.listQuery(`vistos/tipos?id=${id}`).then((resp) => {


            return resp?.data
        }).catch((error) => {
            console.log(error);
        })
        return data || []
    }

    async buscarStatus({ id } = {}) {
        const api = useApi()
        const data = await api.listQuery(`statusdeprocessos?id=${id}`).then((resp) => {


            return resp?.data

        }).catch((error) => {
            console.log(error);
        })
        return data || []
    }
    async criarStatus({ data }) {
        const api = useApi()
        const response = await api.add(`statusdeprocessos`, data).then((resp) => {
            if (resp.status !== 201) {
                NotifyError(resp?.data?.message)
            }
            return resp?.data
        }).catch((error) => {
            console.log(error);
        })
        return response
    }
    async editarStatus({ data, id }) {
        console.log("ID RECEBIDO", id);
        const api = useApi()
        const response = await api.edit(`statusdeprocessos/${id}`, data).then((resp) => {
            if (resp.status !== 200) {
                NotifyError(resp?.data?.message)
            }

        }).catch((error) => {
            console.log(error);
        })
        return response
    }

    async criar({ data }) {
        const api = useApi()
        const response = await api.add(`vistos`, data).then((resp) => {
            if (resp.status !== 201) {
                NotifyError(resp?.data?.message)
            }
            return resp?.data
        }).catch((error) => {
            console.log(error);
        })
        return response
    }

    async actualizarStatus({ vistoId, stepId, statusId, descricao, }) {

        const api = useApi()
        await api.editOne(`vistos/${vistoId}`, { stepId, statusId, descricao }).then((resp) => {
            console.log("ACTUALIA", resp);
            Notify(resp?.data?.message)

        }).catch((error) => {
            console.log(error);
        })
    }

    async actualizarTipo({ data, id }) {
        const api = useApi()
        await api.edit(`vistos/tipos/${id}`, data)
        return
    }
}
export default Visto