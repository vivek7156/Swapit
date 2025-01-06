// frontend/src/socket.js

import { io } from "socket.io-client";

const SOCKET_URL = 'https://swapit-vhlk.onrender.com/'; 

const socket = io(SOCKET_URL, {
    withCredentials: true, // Important for cookies/session if used
});

export default socket;
