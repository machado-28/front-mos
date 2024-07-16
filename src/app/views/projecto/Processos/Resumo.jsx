import { CCard, CRow } from "@coreui/react";
import { AttachMoney, Folder, Group } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";

export default function Resumo() {
    const cardList = [
        {
            name: "Projectos",
            amount: 6,
            Icon: Group,
            path: "vistos/list"
        },
        {
            name: "Processos",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos Cancelados",
            amount: "76",
            Icon: Folder
        },
        {
            name: "Processos Finalizados",
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