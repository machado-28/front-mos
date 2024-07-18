import { CCard, CRow } from "@coreui/react";
import { AttachMoney, FileOpenSharp, FilePresent, Folder, Group, PeopleAlt, SendAndArchive } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";
import { useState } from "react";
import { Projecto } from "../projecto/util";
import { Usuario } from "../usuario/util";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Processo from "../processo/util";

export default function Resumo() {
    const { clienteId } = useParams()


    const projecto = new Projecto()
    const [totalProjecto, setTotalProjecto] = useState()
    async function contarProjecto() {
        const res = await projecto.contar();
        setTotalProjecto(prev => res)
    }

    const processo = new Processo();
    const [totalProcesso, setTotalProcesso] = useState()
    async function contarProcesso() {
        const res = await processo.contar({ clienteId });
        setTotalProcesso(prev => res)
    }

    const usuario = new Usuario()
    const [totalgestores, setTotalgestores] = useState();
    async function contarUsuario() {
        const res = await usuario?.contar({ clienteId, painelId: 5 });

        setTotalgestores(prev => res)
    }

    const data =
        [
            {
                name: "Projectos",
                amount: totalProjecto,
                Icon: Folder,
                path: "vistos/list",
                bgColor: "primary"
            },
            {
                name: "Processos Submetidos",
                amount: totalProcesso || 0,
                color: "black",
                Icon: SendAndArchive,
                bgColor: "info"
            },
            {
                name: "Processos Cancelados",
                amount: totalProcesso || 0,
                color: "black",
                Icon: SendAndArchive,
                bgColor: "danger"
            },

            {
                name: "Processos Finalizados",
                amount: totalProcesso || 0,
                Icon: FilePresent,
                bgColor: "success"
            },
            {
                name: "Gestores",
                amount: totalgestores,
                Icon: PeopleAlt,
                color: "black",
                bgColor: "warning"
            },

        ]

    useEffect(() => {
        contarProjecto();
        contarUsuario();
        contarProcesso();


    }, [])
    return (

        <CRow className="mt-4">
            <StatCards cardList={data} ></StatCards>
        </CRow>

    )
}