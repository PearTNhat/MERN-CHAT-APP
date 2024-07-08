import { io } from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';
let socket;
function connectSocket() {
    socket = io(ENDPOINT);
}
export { socket, connectSocket };
