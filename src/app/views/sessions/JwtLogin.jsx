import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Card, Checkbox, Grid, TextField, Box, styled, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";

import useAuth from "app/hooks/useAuth";
import { H1, Paragraph } from "app/components/Typography";
import { useApi } from "app/hooks/useApi";
import { NotifyError } from "app/utils/toastyNotification";
import { useEffect } from "react";
import { Opacity } from "@mui/icons-material";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex"
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)"
}));

const StyledRoot = styled("div")(() => ({

  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: "url('https://th.bing.com/th/id/OIP.Ia4i7e6waXOE-Zf_GWiArQHaEK?rs=1&pid=ImgDetMain')",
  minHeight: "100vh", /* Define uma altura mínima para cobrir toda a tela */
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  // backgroundSize: "cover",
  // backgroundPosition: "center",

  Opacity: 0.5,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0, 0, 0, .90)"


  },
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,

    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
    filter: "brightness(50%)",
  },

  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  },

  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
    // Fundo branco com opacidade para o card
    zIndex: 1,

  },

}));

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required!"),
  email: Yup.string().required("Email is required!")
});

export default function JwtLogin() {
  const theme = useTheme();
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const { logar } = useApi();

  const handleFormSubmit = async (values) => {
    console.log(values);
    setLoading(true);

    try {
      const data = await logar(values.email, values.password).then((res) => {
        console.log("DADOS LOGANDO", res);
        if (res?.status == 400) {
          NotifyError(res?.data?.message)
        }
        if (res?.status == 200) {
          console.log("200");
          Navigate("/")
          window.location.reload()
          return <Navigate replace to="/dashboard/default" state={{ from: pathname }} />
          return res

        }
      })
      console.log("DATA FORA", data);
      setLoading(false);
    } catch (e) {
      if (e?.response?.status == 400) {
        NotifyError(e?.response?.data?.message)
      }
      setLoading(false);
    }
  };

  return (
    <StyledRoot className="d-flex  ">


      <Card className="card">

        <h1 className="p-4">Login</h1>
        {/* Adicionando o título aqui */}
        <Grid container>

          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              <img className="  m-4" style={{ width: 300, height: 100 }} src="http://localhost:4000/public/metalica.png"></img>
            </div>
          </Grid>

          <Grid item sm={6} xs={12}>

            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="Usuario"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Lembrar</Paragraph>
                      </FlexBox>


                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Entrar
                    </LoadingButton>


                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>

    </StyledRoot>
  );
}
