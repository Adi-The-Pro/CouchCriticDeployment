//Attaching the dotenv file for privacy reasons
require('dotenv').config();

//Database Connection
require('./db/index');

const ACTIONS = require('./actions');

//Creating express server and attaching it to app and also attaching server for sockte.io operations
const express = require('express');
const app = express();
app.get('/',(req,res) => {
    return res.send('Hello From Express Js');
});

//Creating a HTTP server ans pass it to Socket.io to handle real time communication 
const server = require('https').createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin:['https://couchcritic.vercel.app' , 'http://couchcritic.vercel.app'],
        methods : ['GET','POST'],
    },
});

//To allow cookie transfer between frontend and backend
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//To allow frontend to send request to backend
const cors = require('cors');
var corsOptions = {
    credentials: true, //to allow cookies transfer
    origin: ['https://couchcritic.vercel.app'],
}
app.use(cors(corsOptions));

//To accept json files and limit to allow the size limit of the request
app.use(express.json({limit:'8mb'}));
app.use('/storage',express.static('storage'));

//Connecting app to routes so that all the requests are routed there
const router = require('./routes');
app.use(router);

//Socket Connection
const socketUserMap = {};
//This is executed whenever a new client connects to the SOCKET.IO server
io.on('connection',(socket) =>{
    //listens for JOIN event from the client which is emitted when a user wants to join a specific room
    socket.on(ACTIONS.JOIN,({roomId,user})=>{
        //updates the socketUserMap associating the user info with a unique socket.id
        socketUserMap[socket.id] = user;
        //It retrives the list of clients present in the specified room
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []) ;
        //For each client in the room, the server emits an ADD_PEER event to both existing clients and the newly connected client 
        clients.forEach((clientId) => {
            //Asks the existing client to connect with us 
            io.to(clientId).emit(ACTIONS.ADD_PEER,{
                peerId:socket.id,
                createOffer:false,
                user
            });
            //Connects with the existing client
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMap[clientId],
            });
        });
        //Finally the newly connected client joins the room
        socket.join(roomId);
    }); 

    //Handle Relay Ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });

    //Handle Relay SDP(Session Description)
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });

    //Handle Mute , UnMute
    socket.on(ACTIONS.MUTE, ({roomId,userId}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id, //Meri Id
                userId,
            });
        });
    });
    socket.on(ACTIONS.UNMUTE, ({roomId,userId}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id, //Meri Id
                userId,
            });
        });
    });
    //Leaving the room
    const leaveRoom = () => {
        const { rooms } = socket;
        // console.log('socketUserMap', socketUserMap);
        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMap[socket.id]?.id,
                });
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMap[clientId]?.id, 
                });
                socket.leave(roomId);
            });
        });
        delete socketUserMap[socket.id];
    };

    socket.on(ACTIONS.LEAVE, leaveRoom);
    //In case user directly closes the browser instead of leaving the room
    socket.on('disconnecting', leaveRoom);
});

//Creating the PORT on which the server will listen
const PORT = process.env.PORT || 5500;
server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});