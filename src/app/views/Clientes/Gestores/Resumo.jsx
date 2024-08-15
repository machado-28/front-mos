import { CCard, CRow } from "@coreui/react";
import { AttachMoney, FileOpenSharp, FilePresent, Folder, Group, PeopleAlt, SendAndArchive } from "@mui/icons-material";
import useAuth from "app/hooks/useAuth";
import RowCards from "app/views/dashboard/shared/RowCards";
import StatCards from "app/views/dashboard/shared/StatCards";
import StatCardsLine from "app/views/dashboard/shared/StatCardsLine";
import UpgradeCard from "app/views/dashboard/shared/UpgradeCard";

export default function Resumo({ data = [
    {
        name: "Projectos",
        amount: 6,
        Icon: Folder,
        path: "vistos/list",
        bgColor: "warning"
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
        name: "Processos Cancelados",
        amount: "76",
        Icon: FilePresent,
        bgColor: "danger"
    },



] }) {
    const { user } = useAuth();

    return (

        <CRow className="mt-4">
            <StatCards cardList={data} ></StatCards>
        </CRow>

    )
}