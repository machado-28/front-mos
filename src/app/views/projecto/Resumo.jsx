import { CCard, CRow } from "@coreui/react";
import { AttachMoney, Folder, Group } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";

export default function Resumo() {
    const cardList = [
        {
            name: "Processos",
            amount: 6,
            Icon: Group,
            path: "vistos/list"
        },
        {
            name: "Processos finalizados",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos no Mirex",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos no MIREMPET",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos no SME",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos Recusados",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos entregues(visto enviado para o cliente)",
            amount: "76",
            Icon: Folder
        },

    ];
    return (

        <CRow>
            <StatCards cardList={cardList} ></StatCards>
        </CRow>

    )
}