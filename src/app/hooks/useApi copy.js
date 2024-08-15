import axios from "axios";
import { NotifyError } from "app/utils/toastyNotification";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});

// Adiciona um interceptador de solicitação
api.interceptors.request.use(
  (config) => {
    s
    const { token } = localStorage.getItem("user");
    console.log(token);
    // Se houver um token no localStorage, adiciona ao cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Se não houver token, redireciona para a página de login
      const navigate = useNavigate();
      navigate("/session/signin");
    }
    return config;
  },
  (error) => {
    // Caso ocorra um erro durante a configuração da solicitação, exibe uma notificação de erro
    NotifyError("Erro ao processar a solicitação");
    return Promise.reject(error);
  }
);

export const useApi = () => ({
  logar: async (email, senha) => {
    const res = await api
      .post("/sessao", { email, senha })
      .then((response) => response)
      .catch(({ response }) => {
        if (response?.status !== 200) {
          NotifyError(response?.data?.message);
          console.log(response);
        }
      });

    return res?.data;
  },

  sair: async () => {
    return true;
    const response = await api.post("/sair");

    return response.data;
  },
  add: async (path, data) => {

    const response = await api
      .post(`/${path}`, data)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  list: async (path, page = 1) => {
    const response = await api
      .get(`/${path}/?page=${page}`)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  listQuery: async (path) => {
    const response = await api
      .get(`/${path}`)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  },
  documento: async (path, data) => {
    const response = await api.post(path, data, {
      responseType: "blob" // Indica que esperamos uma resposta de arquivo binário (blob)
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "documento.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  edit: async (path, data) => {
    const response = await api
      .put(`/${path}/`, data)
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
    console.log("RESPONSE", response);

    return response;
  },
  delete: async (path, id) => {
    console.log("outro", id);
    const response = await api
      .delete(`/${path}/${id}`)
      .then((response) => response || response)
      .catch(({ response }) => response);
    console.log("RESPONSE", response);

    return response;
  }  // Outros métodos aqui...
});
