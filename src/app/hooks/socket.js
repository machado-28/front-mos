import { Notify } from "app/utils/toastyNotification";
import io from 'socket.io-client';
import useNotification from "./useNotification";
// https://api.mos.ao/v1/
const SERVER_URL = "ws://api.mos.ao";

let socket = io(SERVER_URL);
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
    console.log("SOCKET EVENTO", msg);
    socket.emit(msg, data);
}

export const listenMessage = ({ event }) => {
    connect();
    socket.on(event, (data => {
        datas = data
        console.log("NOFIFICACAO VEIO", datas);
    }));
    socket.off(event);
    return datas
}