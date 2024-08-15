import NotificationContext from "app/contexts/NotificationContext";
import { useEffect, useContext } from "react";
import shortid from "shortid";
; // Ajuste o caminho conforme sua estrutura de pastas
import io from "socket.io-client";
import { listenMessage, sendMessage } from "./socket";
const list = [
    {
        id: shortid.generate(),
        heading: "Message",
        icon: { name: "chat", color: "primary" },
        timestamp: 1570702802573,
        title: "New message from Devid",
        subtitle: "Hello, Any progress...",
        path: "chat"
    },
    {
        id: shortid.generate(),
        heading: "Alert",
        icon: { name: "notifications", color: "error" },
        timestamp: 1570702702573,
        title: "Server overloaded",
        subtitle: "Traffice reached 2M",
        path: "page-layouts/user-profile"
    },
    {
        id: shortid.generate(),
        heading: "Message",
        icon: { name: "chat", color: "primary" },
        timestamp: 1570502502573,
        title: "New message from Goustove",
        subtitle: "Hello, send me details",
        path: "chat"
    }
]


const useNotification = () => {
    const { notifications, createNotification } = useContext(NotificationContext);
    const socket = io("http://localhost:4000"); // Ajuste a URL conforme necessário

    useEffect(() => {
        // socket.on("CREATE_PROJECT", (notification, data) => {
        //     console.log("ENFIM CHEGOU=>", notification);
        //     createNotification(notification)
        // });

        const data = listenMessage({ event: "CREATE_PROJECT" })
        createNotification(data)
        return () => {
            socket.off("CREATE_PROJECT");
        };
    }, [socket, createNotification]);

    return { notifications };
};

export default useNotification;
