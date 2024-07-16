import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
    // import 'react-vis/dist/style.css';
import "@coreui/coreui/dist/css/coreui.min.css";

import { MatxTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import "../fake-db";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CButton } from "@coreui/react";

export default function App() {
  const content = useRoutes(routes);

  

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
      {/* Same as */}
      <ToastContainer />
      <AuthProvider>
     
        <MatxTheme>
       
          <CssBaseline />

          {content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  );
}
