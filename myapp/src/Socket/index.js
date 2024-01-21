//create a SOCKET.IO client instance that can connect to a SOCKET.IO server socketInit function initializes a Socket.IO 
//client with specific options and connects it to a Socket.IO server running at 'http://localhost:5500'. 
import {io} from 'socket.io-client';
//This func initializes and configures a SOCKET.IO client
export const socketInit = () => {
    const options = {
        'force new connection': true, //forces socket to establish new connection instead of reusing an existing one
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
//URL of SOCKET.IO server to which the client will connect
    return io('https://couch-critic-deployment.vercel.app/', options);
}

