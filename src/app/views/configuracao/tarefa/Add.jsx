import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, FolderCopySharp, Phone } from "@mui/icons-material";

import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { Link, useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import FormAdd from "./Formularios/FormAdd";

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

export default function Add() {
    const [render, setRender] = useState(0);

    console.log(render);
    return (
        <AppButtonRoot>
            <div className="example">



                <Box pt={1}>{/* <Campaigns /> */} </Box>

                <FormAdd></FormAdd>
            </div>
        </AppButtonRoot>
    );
}

const filter = createFilterOptions();
