// app.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "@coreui/coreui/dist/css/coreui.min.css";
import { MatxTheme } from "./components";
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
import routes from "./routes";
import "../fake-db";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./auth/privateRoutes";

export default function App() {
  return (
    <SettingsProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ToastContainer />
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {routes.map((route, index) => (
                <PrivateRoute
                  key={index}
                  path={route.path}
                  element={route.children?.[index]?.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/session/404" />} />
            </Routes>
          </BrowserRouter>
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
}
