import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

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
}
const reducer = (state, action) => {
  console.log("USER LOGGED 1", action);
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      const saveLogin = new ManageCurrentAuth().storeAuthToLocalStorage;
      console.log("LOCAL STORAGES");
      saveLogin({ data: action.payload.user });

      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      console.log("USER LOGGED", action);
      return { ...state, isAuthenticated: false, user: null };
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
  login: () => {},
  logout: () => {},
  register: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const login = async (email, senha) => {
    const api = useApi();
    NotifyError("STORAGE ");

    const response = await api.post("/sessao", { email, senha });
    const { user } = response.data;
    console.log("USUARIO CAOME", user);
    if (response.status === 400) {
      NotifyError(response.data?.message);
    }
    dispatch({ type: "LOGIN", payload: { user } });
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
        const data = await api?.listQuery(`auth/perfil`).then((response) => response?.data);
        console.log("PERFIL ENCONTRADO", data);
        dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data?.user } });
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
