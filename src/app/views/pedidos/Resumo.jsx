import { CCard, CRow } from "@coreui/react";
import { AttachMoney, Folder, Group } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";

export default function Resumo() {
    const cardList = [
        {
            name: "Tempo em atraso (dias)",
            amount: "4 dias",
            Icon: Group,
            path: "vistos/list"
        },
        {
            name: "Data para a finalizacao",
            amount: "28-10-2024",
            Icon: Folder
        },
        {
            name: "Faze actual",
            amount: "MIREMX",
            Icon: Folder
        },
        {
            name: "status da faze",
            amount: "pendente",
            Icon: Folder
        },
        

    ];
    return (

        <CRow>
            <StatCards cardList={cardList} ></StatCards>
        </CRow>

    )
}