import axios from "axios";
import { Notify, NotifyError } from "app/utils/toastyNotification";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:4000/v1/"
});

// Adiciona um interceptador de solicitação
api.interceptors.request.use(
  (config) => {
    console.log("CONFIG", config);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("PREDINDO TOKEN", user?.token);

    // Verifica se a rota atual é a rota de login
    // if (window.location.pathname === "/session/signin") {
    //   return config;
    // }

    // Se houver um token no localStorage, adiciona ao cabeçalho Authorization
    if (user) {
      console.log("TOKEN recebido", user?.token);
      config.headers.Authorization = `Bearer ${user?.token}`;
    } else {
      console.log("TOKEN NAO recebido", user?.token);
      // Redireciona para a rota de login se não houver token
    }
    return config;
  },
  (error) => {
    console.log("USEAPI", error);
    return Promise.reject(error);
  }
);

export const useApi = () => ({
  logar: async (email, senha) => {
    try {
      const resp = await api.post("/sessao", { email, senha });
      if (resp?.status == 400) {
        NotifyError(resp?.data?.message);
      }
      if (resp?.status == 200) {
        const { user } = resp?.data;

        localStorage.setItem("user", JSON.stringify(user));
        console.log("logou mesmo", resp);
        return resp;
      }

      console.log("SEJA UTIL", resp);
      return resp;
    } catch (error) {
      console.log("erro=>", error);
      return error?.response;
    }
  },
  listQuery: async (path) => {
    const response = await api
      .get(`/${path}`)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  sair: async () => {
    try {
      const response = await api.post("/sair");
      return response.data;
    } catch (error) {
      NotifyError("Erro ao sair");
      throw error;
    }
  },
  add: async (path, data) => {
    const response = await api
      .post(`/${path}`, data)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  documento: async (path, title = "MAPA DE CONTROLO") => {
    const response = await api.get(path, {
      responseType: "blob" // Indica que esperamos uma resposta de arquivo binário (blob)
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("target", "blank");
    document.body.appendChild(link);
    link.click();
    link.title = title
    link.remove();
  },
  edit: async (path, data) => {
    const response = await api
      .put(`/${path}/`, data)
      .then((response) => response || response)
      .catch(({ response }) => response);
    if (response.status === 403 || response.status === 400 || response.status === 401 || response.status === 402) {
      NotifyError(response?.message);
      return
    }

    return response;
  },
  editOne: async (path, data) => {
    const response = await api
      .patch(`/${path}/`, data)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  editQuery: async (path, data) => {
    const response = await api
      .put(`/${path}`, data)
      .then((response) => response || response)
      .catch(({ response }) => response);

    if (response.status === 403 || response.status === 400 || response.status === 401 || response.status === 402) {
      NotifyError(response?.message);
      return
    }
    return response;
  },
  delete: async (path, id) => {
    console.log("outro", id);
    const response = await api
      .delete(`/${path}/${id}`)
      .then((response) => response || response)
      .catch(({ response }) => response);

    if (response.status === 403 || response.status === 400 || response.status === 401 || response.status === 402) {
      NotifyError(response?.message);
      return
    }
    return response;
  }, // Outros métodos aqui...
  list: async (path, page = 1) => {
    const response = await api
      .get(`/${path}/?page=${page}`)
      .then((response) => response || response)
      .catch(({ response }) => response);

    if (response.status === 403 || response.status === 400 || response.status === 401 || response.status === 402) {
      NotifyError(response?.message);
      return
    }
    return response;
  },

  add: async (path, data) => {
    try {
      const response = await api.post(`/${path}`, data);
      console.log("API resp", response);
      if (response.status === 403 || response.status === 400 || response.status === 401 || response.status === 402) {
        NotifyError(response?.message);
        return
      }

      return response;
    } catch (error) {
      console.log("%cERRO", "color: red; font-size:xx-large", error?.response?.data?.message);

      NotifyError(error?.response?.data?.message)
    }
  }

  // Outros métodos aqui...
});
