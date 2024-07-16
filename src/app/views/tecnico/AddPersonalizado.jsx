import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Email, FolderCopySharp, People, Phone } from "@mui/icons-material";
import { useApi } from "app/hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import FormAdd2 from "./Formularios/FormAdd2";
import { useState } from "react";
import { AppButtonRoot } from "app/components/AppBuutonRoot";

const Title = styled("span")(() => ({
    fontSize: "1.4rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

export default function AddPersonalizado() {



    return (
        <AppButtonRoot>
            <div className="example">
                <Box pt={1}>{/* <Campaigns /> */}</Box>
                <FormAdd2></FormAdd2>
            </div>
        </AppButtonRoot>
    );
}

const filter = createFilterOptions();
