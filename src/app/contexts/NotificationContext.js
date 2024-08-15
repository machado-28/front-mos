import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import shortId from "shortid";
import { listenMessage } from "app/hooks/socket";
import { api } from "app/hooks/useApi";
import { io } from "socket.io-client";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_NOTIFICATIONS": {
      return { ...state, notifications: action.payload };
    }

    case "DELETE_NOTIFICATION": {
      return { ...state, notifications: action.payload };
    }

    case "CLEAR_NOTIFICATIONS": {
      return { ...state, notifications: action.payload };
    }

    default:
      return state;
  }
};

const NotificationContext = createContext({
  notifications: [],
  deleteNotification: () => { },
  clearNotifications: () => { },
  getNotifications: () => { },
  createNotification: () => { }
});

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  const deleteNotification = async (notificationID) => {
    try {
      const res = await axios.post("/api/notification/delete", { id: notificationID });
      dispatch({ type: "DELETE_NOTIFICATION", payload: res.data });
    } catch (e) {
      console.error(e);
    }
  };

  const clearNotifications = async () => {
    try {
      const res = await axios.post("/api/notification/delete-all");
      dispatch({ type: "CLEAR_NOTIFICATIONS", payload: res.data });
    } catch (e) {
      console.error(e);
    }
  };

  const getNotifications = async () => {
    try {
      const socket = io("http://localhost:4000"); // Ajuste a URL conforme necessário
      const res = await api.get("/v1/notification");
      const data = listenMessage({ event: "CREATE_PROJECT" })

      dispatch({ type: "LOAD_NOTIFICATIONS", payload: res.data });
    } catch (e) {
      console.error(e);
    }
  };

  const createNotification = async (notification) => {
    try {

      const res = await axios.post("/api/notification/add", { notification });
      console.log("CRIANDO NOTI", res);
      dispatch({ type: "CREATE_NOTIFICATION", payload: res.data });
    } catch (e) {
      console.error("ERRO NOTIFICATION", e);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        getNotifications,
        deleteNotification,
        clearNotifications,
        createNotification,
        notifications: state.notifications
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
