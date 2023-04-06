import { io } from "socket.io-client";
const socket = io.connect("http://172.20.10.5:5001");
export default socket;