import { io } from "socket.io-client";
import {url_back}  from "../components/connection_url";

const socket = io.connect(url_back);
export default socket;