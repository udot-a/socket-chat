import io from "socket.io-client";
const socket = io();
//process.env.NODE_ENV === "production" ? "http://dron-short-links.ru/" : "http://localhost:5000/"
export default socket;
