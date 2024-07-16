import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
// CUSTOM COMPONENT
import { MatxLoading } from "app/components";
import { useApi } from "app/hooks/useApi";
import { NotifyError } from "app/utils/toastyNotification";


const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};
class ManageCurrentAuth {
  async storeAuthToLocalStorage({ key, datas }) {
    const data = localStorage.setItem(key, JSON.stringify(datas));
  }
  async removeAuthToLocalStorage({ key }) {
    localStorage.removeItem(key)
  }
}
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {

      const { isAuthenticated, user } = action.payload;
      console.log("DESC", isAuthenticated, user);
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      const { user, token } = action.payload; // Supondo que o token está incluído no payload
      const userData = { user, token };
      console.log("SALVANDO", userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      window.location.reload();
      console.log("USER LOGGED", action);
      new ManageCurrentAuth().removeAuthToLocalStorage({ key: "user" })
      
      return { ...state, isAuthenticated: false, user: null }
    }

    case "REGISTER": {
      const { user } = action.payload;
      console.log("USER LOGGED", action);
      return { ...state, isAuthenticated: false, user };
    }

    default:
      console.log("USER LOGGED", action);
      return state;
  }
  console.log("USER LOGGED", action);
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => { },
  logout: () => { },
  register: () => { }
});

export const AuthProvider = ({ children }) => {

  const { pathname } = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, senha) => {
    const api = useApi();

    const response = await api.logar(email, senha).then(res => {
      const { user } = res.data;
      NotifyError("STORAGE ", user);
      console.log("USUARIO DATA", res.data)
      alert("user " + res.data)
      if (res.status == 200)
        return dispatch({ type: "LOGIN", payload: { user } });
      if (res?.status == 400)
        return NotifyError(res?.data?.message)
    });


  };

  const register = async (email, username, senha) => {
    const response = await axios.post("/", { email, username, senha });
    const { user } = response.data;

    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const api = useApi();
  useEffect(() => {
    (async () => {

      try {
        const data = await api?.listQuery(`auth/perfil`).then((response) => {
          if (response?.status == 401) {
            console.log(" AUTORIZACAO", response);

            dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
          }
          if (response?.status == 200) {
            console.log(" AUTORIZACAO SUCESSO", response);
            dispatch({ type: "INIT", payload: { isAuthenticated: true, user: response?.data?.user } });
          }

          console.log(response);
          return response?.data
        }).catch(err => {
          console.log(err);
        });
        // if (data?.status == 401) {
        //   return dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
        // }

      } catch (err) {
        console.error(err);
        dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
