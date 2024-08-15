import { CCard, CRow } from "@coreui/react";
import { AttachMoney, FileOpenSharp, FilePresent, Folder, Group, PeopleAlt, SendAndArchive } from "@mui/icons-material";
import StatCards from "app/views/dashboard/shared/StatCards";
import { useState } from "react";
import { Projecto } from "../projecto/util";
import { Usuario } from "../usuario/util";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Processo from "../processo/util";

export default function Resumo({ data }) {
    return (

        <CRow className="mt-4">
            <StatCards cardList={data} ></StatCards>
        </CRow>

    )
}