import { CCard, CRow } from "@coreui/react";
import { AttachMoney, FileOpenSharp, FilePresent, Folder, Group, PeopleAlt, SendAndArchive } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";

export default function Resumo({ data = [
    {
        name: "Projectos",
        amount: 6,
        Icon: Folder,
        path: "vistos/list",
        bgColor: "primary"
    },
    {
        name: "Processos Submetidos",
        amount: "76",
        color: "black",
        Icon: SendAndArchive,
        bgColor: "info"
    },
    {
        name: "Processos Finalizados",
        amount: "76",
        Icon: FilePresent,
        bgColor: "success"
    },
    {
        name: "Gestores",
        amount: "76",
        Icon: PeopleAlt,
        bgColor: "secondary"
    },

] }) {
    return (

        <CRow className="mt-4">
            <StatCards cardList={data} ></StatCards>
        </CRow>

    )
}