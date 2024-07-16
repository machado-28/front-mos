import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import NonAuth from "./auth/NonAuth";
import routers from "./views/routes/"
import { element } from "prop-types";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...routers
    ],
  },

  { path: "/session/404", element: <NotFound /> },
  {
    path: "/session/signin",
    element: (
      <NonAuth>
        <JwtLogin />
      </NonAuth>
    )
  },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/", element: <Navigate to="/dashboard/default/" /> },
  { path: "*", element: <NotFound /> },
]



export default routes;
