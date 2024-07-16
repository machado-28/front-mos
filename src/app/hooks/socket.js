import { Notify } from "app/utils/toastyNotification";
import socketIOClient, { io } from "socket.io-client"
import useNotification from "./useNotification";

const SERVER_URL = "http://localhost:4000";
let socket = socketIOClient(SERVER_URL, { autoConnect: true });
let datas


export function connect(user) {
    socket.connect()
    socket.emit("register", user);
}


export function disconnect() {
    if (socket.connected)
        socket.disconnect()
}
export const sendMessage = (msg, data = connetcions) => {
    connect({ user: {} });
    socket.emit(msg, data);
}

export const listenMessage = ({ event }) => {
    
    connect();

    socket.on(event, (data => {
        datas = data
        console.log("NOFIFICACAO VEIO", datas);
    }));

    return datas
}