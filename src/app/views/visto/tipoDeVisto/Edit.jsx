import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import React from "react";
import { H1, H3, Paragraph } from "app/components/Typography";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useApi } from "app/hooks/useApi";
import { AppButtonRoot } from "app/components/AppBuutonRoot";
import { Link, useNavigate } from "react-router-dom";
import { functions, values } from "lodash";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import FormEditar from "./Formularios/editar/FormEditar";
import { EditAttributesOutlined } from "@mui/icons-material";

const Title = styled("span")(() => ({
  fontSize: "1.4rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

export default function Edit() {
  const [render, setRender] = useState(0);

  console.log(render);
  return (
    <AppButtonRoot>
      <div className="example">

        <div className="w-100 d-flex  justify-content-between">
          <Title className="text-color-primary" color="info">EDITAR TIPO DE VISTO<EditAttributesOutlined></EditAttributesOutlined>  </Title>
          <div></div>
        </div>

        <Box pt={1}>{/* <Campaigns /> */}</Box>
        <FormEditar></FormEditar>
      </div>
    </AppButtonRoot>
  );
}

const filter = createFilterOptions();
