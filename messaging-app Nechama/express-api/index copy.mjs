import express, { json } from 'express'
import morgan from 'morgan'
import log from '@ajar/marker'
import cors from 'cors'

import user_router from './modules/user/user.router.mjs';
import login_router from './modules/login/login.router.mjs';
import {error_handler,not_found} from './middleware/errors.handler.mjs'
import {connect_db} from './db/mongoose.connection.mjs';
//import { Server } from "socket.io";
//import * as http from 'http'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { PORT,HOST,DB_URI,SOCKET_PORT} = process.env;

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const getActiveRooms = (io) => {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const res = filtered.map(i => i[0]);
    return res;
}
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const GET_ALL_ROOMS = "getAllRooms";
const SEND_ALL_ROOMS = "sendAllRooms";
const DELETE_ROOM = "deleteRoom";

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
    // Join a conversation
    const { roomId } = socket.handshake.query;
    if (roomId) {
        socket.join(roomId);
    }

    socket.on(GET_ALL_ROOMS, function(){
    //const rooms = io.sockets.adapter.rooms;
    const rooms = getActiveRooms(io);
    console.log("hiiii",rooms)
    socket.emit(SEND_ALL_ROOMS, [...rooms])
  })


  socket.on(DELETE_ROOM, (data) => { 
      console.log("data", data);
      console.log("delete1", data)
      //console.log("deleteL roomID",roomId)
    socket.leave(data);
    //io.sockets.adapter.remove(data.roomId)
  })

    // Listen for new messages
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
      });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`Listening on port ${SOCKET_PORT}`);
});

const app = express();
// apply middleware
app.use(cors());
app.use(morgan('dev'))

// routing
app.use('/api/users', user_router);
app.use('/api/login', login_router);

// central error handling
app.use(error_handler);

//when no routes were matched...
app.use('*', not_found);


// //when no routes were matched...
// app.use('*', (req,res)=> {
//     res.status(404).json({status:`path ${req.url} is not found`})
// });

//start the express api server
(async ()=> { 
  //connect to mongo db
  await connect_db(DB_URI);  
  await app.listen(PORT,HOST);
  log.magenta(`api is live on`,` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);  
})().catch(log.error)