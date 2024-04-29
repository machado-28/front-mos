import { styled } from "@mui/material";

export const AppButtonRoot = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
    "& .button": { margin: theme.spacing(1) },
    "& .input": { display: "none" },
  }));