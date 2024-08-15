import { useEffect, useContext } from "react";
import { NotificationContext } from "path-to-notification-context"; // Ajuste o caminho conforme sua estrutura de pastas
import io from "socket.io-client";

const useNotification = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);
    const socket = io("http://localhost:3000"); // Ajuste a URL conforme necessário

    useEffect(() => {
        socket.on("notification", (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });

        return () => {
            socket.off("notification");
        };
    }, [socket, setNotifications]);

    return { notifications };
};

export default useNotification;
